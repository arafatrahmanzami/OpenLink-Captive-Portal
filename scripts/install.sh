#!/bin/sh

# Determine the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RELEASE_ROOT="$(dirname "$SCRIPT_DIR")"

# --- Detect archive layout (flat OR nested) ---
if [ -f "$RELEASE_ROOT/opt/voucher/voucher_server" ]; then
    BIN_SRC="$RELEASE_ROOT/opt/voucher/voucher_server"
    WEB_SRC="$RELEASE_ROOT/www/voucher"
elif [ -f "$RELEASE_ROOT/voucher_server" ]; then
    BIN_SRC="$RELEASE_ROOT/voucher_server"
    WEB_SRC="$RELEASE_ROOT/frontend"
else
    echo "ERROR: Cannot locate voucher_server in $RELEASE_ROOT" >&2
    exit 1
fi

# --- Detect package manager (apk on 25.x+, opkg on 24.10 and earlier) ---
if command -v apk >/dev/null 2>&1; then
    PKG_MANAGER="apk"
    PKG_UPDATE="apk update --allow-untrusted"
    PKG_INSTALL="apk add --no-cache --allow-untrusted"
elif command -v opkg >/dev/null 2>&1; then
    PKG_MANAGER="opkg"
    PKG_UPDATE="opkg update"
    PKG_INSTALL="opkg install"
else
    echo "ERROR: Neither apk nor opkg found." >&2
    exit 1
fi
echo "Package manager: $PKG_MANAGER"

echo "=================================================="
echo "      OpenLink Captive Portal Setup Wizard        "
echo "=================================================="

# 1. Interactive Network & Interface Selection
DEFAULT_INTERFACE="$(uci -q get network.lan.device 2>/dev/null || echo "br-lan")"
echo "Available network interfaces on this router:"
ip -o link show | awk -F': ' '{print " - " $2}'
echo ""

read -p "Enter target gateway interface [$DEFAULT_INTERFACE]: " USER_INTERFACE
INTERFACE="${USER_INTERFACE:-$DEFAULT_INTERFACE}"

DEFAULT_IP="$(ip -4 addr show dev "$INTERFACE" 2>/dev/null | grep -oE 'inet [0-9.]+' | awk '{print $2}' | head -n1)"
if [ -z "$DEFAULT_IP" ]; then
    DEFAULT_IP="$(uci -q get network.lan.ipaddr)"
fi
DEFAULT_IP="${DEFAULT_IP%%/*}"

read -p "Enter portal gateway IP address [$DEFAULT_IP]: " USER_IP
LAN_IP="${USER_IP:-$DEFAULT_IP}"

if [ -z "$LAN_IP" ]; then
    echo "Error: Could not determine a valid LAN IP address."
    exit 1
fi

# Auto-detect the logical network name (e.g., br-lan3 -> lan3 or lanb)
NET_NAME=$(uci show network | grep "device='$INTERFACE'" | cut -d. -f2 | cut -d= -f1 | head -n1)
if [ -z "$NET_NAME" ]; then
    NET_NAME=$(uci show network | grep "ifname='$INTERFACE'" | cut -d. -f2 | cut -d= -f1 | head -n1)
fi
if [ -z "$NET_NAME" ]; then
    echo "WARNING: Could not auto-detect the logical network name for $INTERFACE."
    read -p "Please enter the logical network name (e.g., lan3, lanb, hotspot): " NET_NAME
    if [ -z "$NET_NAME" ]; then
        echo "ERROR: Logical network name required. Aborting to prevent damage to your main LAN."
        exit 1
    fi
fi

# 2. Interactive Timeout & Network Settings
echo ""
echo "--- Timeout & Network Settings (Press Enter to use defaults) ---"
read -p "Inactivity timeout in minutes [120]: " USER_IDLE
IDLE_TIMEOUT="${USER_IDLE:-120}"

read -p "Forced session timeout in minutes [1440]: " USER_FORCE
FORCE_TIMEOUT="${USER_FORCE:-1440}"

read -p "Pre-auth idle timeout in minutes [30]: " USER_PREAUTH
PREAUTH_TIMEOUT="${USER_PREAUTH:-30}"

read -p "Nodogsplash check interval in seconds [60]: " USER_CHECK
CHECK_INTERVAL="${USER_CHECK:-60}"

read -p "Max concurrent clients [250]: " USER_MAXCLIENTS
MAXCLIENTS="${USER_MAXCLIENTS:-250}"

read -p "DHCP lease time (e.g. 12h, 24h, 31d, infinite) [12h]: " USER_LEASETIME
LEASETIME="${USER_LEASETIME:-12h}"

read -p "Disable IPv6 on the portal interface? (y/n) [y]: " USER_DISABLE_IPV6
DISABLE_IPV6="${USER_DISABLE_IPV6:-y}"

echo ""
echo "Configuration locked in:"
echo " -> Interface        : $INTERFACE"
echo " -> Portal IP        : $LAN_IP"
echo " -> Idle Timeout     : $IDLE_TIMEOUT mins"
echo " -> Forced Timeout   : $FORCE_TIMEOUT mins"
echo " -> Pre-Auth Timeout : $PREAUTH_TIMEOUT mins"
echo " -> Check Interval   : $CHECK_INTERVAL secs"
echo " -> Max Clients      : $MAXCLIENTS"
echo " -> DHCP Lease Time  : $LEASETIME"
echo " -> Disable IPv6     : $DISABLE_IPV6"
echo "=================================================="
sleep 2

# 3. Create directories
echo "Creating directories..."
mkdir -p /www/voucher
mkdir -p /opt/voucher
mkdir -p /data

# 4. Stop the service before overwriting the binary (Text file busy fix)
echo "Stopping any running voucher server..."
/etc/init.d/voucher stop 2>/dev/null || true
killall voucher_server 2>/dev/null || true

# 5. Copy files
echo "Copying application files..."
cp "$BIN_SRC" /opt/voucher/voucher_server
chmod +x /opt/voucher/voucher_server
cp -r "$WEB_SRC"/* /www/voucher/
cp "$SCRIPT_DIR/binauth.sh" /opt/voucher/
chmod +x /opt/voucher/binauth.sh

# 6. Create the init script to start the server on boot
echo "Creating init.d startup script..."
cat << 'EOF' > /etc/init.d/voucher
#!/bin/sh /etc/rc.common
START=99
STOP=10
USE_PROCD=1
PROG=/opt/voucher/voucher_server
LOG_FILE=/tmp/voucher.log

start_service() {
    procd_open_instance
    procd_set_param command $PROG
    procd_set_param stdout 1
    procd_set_param stderr 1 
    procd_set_param user root
    procd_set_param respawn
    procd_close_instance
}
stop_service() {
    echo "Stopping voucher server..."
}
reload_service() {
    stop
    start
}
EOF

chmod +x /etc/init.d/voucher
/etc/init.d/voucher enable
/etc/init.d/voucher restart

# 7. Install and configure NoDogSplash
echo "Configuring NoDogSplash..."
if [ ! -f /etc/init.d/nodogsplash ]; then
    echo "NoDogSplash not found. Installing via $PKG_MANAGER..."
    $PKG_UPDATE
    if ! $PKG_INSTALL nodogsplash; then
        echo "Error: failed to install NoDogSplash."
        exit 1
    fi
fi

if [ -f /etc/config/nodogsplash ]; then
    cp /etc/config/nodogsplash /etc/config/nodogsplash.bak
fi

echo "Creating NoDogSplash configuration file..."
cat << EOF > /etc/config/nodogsplash
config nodogsplash
	option enabled '1'
	option fwhook_enabled '1'
	option gatewayinterface '$INTERFACE'
	option gatewayipaddress '$LAN_IP'
	option maxclients '$MAXCLIENTS'
	option binauth '/opt/voucher/binauth.sh'
	option authidletimeout '$IDLE_TIMEOUT'
	option sessiontimeout '$FORCE_TIMEOUT'
	option preauthidletimeout '$PREAUTH_TIMEOUT'
	option checkinterval '$CHECK_INTERVAL'
	option splashpage 'splash.html'
	list preauthenticated_users 'allow tcp port 7891'
	list preauthenticated_users 'allow tcp port 53'
	list preauthenticated_users 'allow udp port 53'
	list authenticated_users 'allow all'
	list users_to_router 'allow tcp port 22'
	list users_to_router 'allow tcp port 23'
	list users_to_router 'allow tcp port 53'
	list users_to_router 'allow udp port 53'
	list users_to_router 'allow udp port 67'
	list users_to_router 'allow tcp port 80'
	list users_to_router 'allow tcp port 7891'
EOF

# 8. Create the custom splash page for redirection
echo "Creating custom NoDogSplash splash page..."
mkdir -p /etc/nodogsplash/htdocs/
cat << EOF > /etc/nodogsplash/htdocs/splash.html
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8" />
    <title>Connecting...</title>
    <meta http-equiv="refresh" content="0; url=http://${LAN_IP}:7891/?ip=\$clientip&amp;mac=\$clientmac&amp;token=\$tok" />
</head>
<body>
    <p>Please wait, you are being redirected to the login page...</p>
</body>
</html>
EOF

# 9. Disable IPv6 if requested
# Apply DHCP Lease Time
echo "Setting DHCP lease time to $LEASETIME for $NET_NAME..."
uci set dhcp.$NET_NAME.leasetime="$LEASETIME"
uci commit dhcp
/etc/init.d/dnsmasq restart

if [ "$DISABLE_IPV6" = "y" ] || [ "$DISABLE_IPV6" = "Y" ]; then
    echo "Disabling IPv6 on $INTERFACE..."
    uci set network.$NET_NAME.ipv6='0'
    uci set dhcp.$NET_NAME.ra='disabled'
    uci set dhcp.$NET_NAME.dhcpv6='disabled'
    uci set dhcp.$NET_NAME.ndp='disabled'
    uci commit network
    uci commit dhcp
    /etc/init.d/dnsmasq restart
fi

# 10. Configure Firewall for Captive Portal
echo "Configuring firewall for $INTERFACE..."
uci set firewall.openlink=zone
uci set firewall.openlink.name='openlink'
uci set firewall.openlink.input='ACCEPT'
uci set firewall.openlink.output='ACCEPT'
uci set firewall.openlink.forward='ACCEPT'
uci set firewall.openlink.masq='1'
uci set firewall.openlink.network="$NET_NAME"

uci -q delete firewall.nds_portal
uci set firewall.nds_portal=rule
uci set firewall.nds_portal.name='Allow-OpenLink-Portal'
uci set firewall.nds_portal.src='openlink'
uci set firewall.nds_portal.proto='tcp udp'
uci set firewall.nds_portal.dest_port='53 67 80 443 2050 7891'
uci set firewall.nds_portal.target='ACCEPT'

uci commit firewall
/etc/init.d/firewall restart

# 11. Restart NoDogSplash and finish
echo "Restarting NoDogSplash..."
/etc/init.d/nodogsplash restart

echo "=================================================="
echo "Installation complete!"
echo "Your voucher server is running on interface $INTERFACE at IP $LAN_IP."
echo "Admin panel access: http://${LAN_IP}:7891/admin/"
echo "=================================================="
