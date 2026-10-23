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
    PKG_UPDATE="apk update"
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

# 0. Interactive Network & Interface Selection
DEFAULT_INTERFACE="$(uci -q get network.lan.device 2>/dev/null || echo "br-lan")"

echo "Available network interfaces on this router:"
ip -o link show | awk -F': ' '{print " - " $2}'
echo ""

read -p "Enter target gateway interface [$DEFAULT_INTERFACE]: " USER_INTERFACE
INTERFACE="${USER_INTERFACE:-$DEFAULT_INTERFACE}"

# Auto-detect IP for the chosen interface
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

echo ""
echo "Configuration locked in:"
echo " -> Interface : $INTERFACE"
echo " -> Portal IP : $LAN_IP"
echo "=================================================="
sleep 1

# 1. Create directories
echo "Creating directories..."
mkdir -p /www/voucher
mkdir -p /opt/voucher
mkdir -p /data # For the persistent database

# 2. Stop the service before overwriting the binary
echo "Stopping any running voucher server..."
/etc/init.d/voucher stop 2>/dev/null || true
killall voucher_server 2>/dev/null || true

# 3. Copy files (Updated for multi-arch archive layout)
echo "Copying application files..."
# Stop service to prevent Text file busy
/etc/init.d/voucher stop 2>/dev/null || true
killall voucher_server 2>/dev/null || true

cp "$BIN_SRC" /opt/voucher/voucher_server
chmod +x /opt/voucher/voucher_server
cp -r "$WEB_SRC"/* /www/voucher/

# Copy the binauth script and make it executable
cp "$SCRIPT_DIR/binauth.sh" /opt/voucher/
chmod +x /opt/voucher/binauth.sh

# 3. Create the init script to start the server on boot
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

# 4. Make the init script executable and enable it
echo "Enabling and starting the service..."
chmod +x /etc/init.d/voucher
/etc/init.d/voucher enable
/etc/init.d/voucher restart

# 5. Install and configure NoDogSplash
echo "Configuring NoDogSplash..."

if [ ! -f /etc/init.d/nodogsplash ]; then
    echo "NoDogSplash not found. Installing via $PKG_MANAGER..."
    $PKG_UPDATE
    if ! $PKG_INSTALL nodogsplash; then
        echo "Error: failed to install NoDogSplash via opkg."
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
	option maxclients '250'
	option binauth '/opt/voucher/binauth.sh'
	option client_idle_timeout '30'
	list preauthenticated_users 'allow tcp port 7891'
	list preauthenticated_users 'allow tcp port 53'
	list preauthenticated_users 'allow udp port 53'
	list authenticated_users 'allow all'
	option splashpage 'splash.html'
	option preauthidletimeout '3'
	option authidletimeout '1'
	option checkinterval '20'
	list authenticated_users 'allow all'
	list preauthenticated_users 'allow tcp port 53'
	list preauthenticated_users 'allow udp port 53'
	list preauthenticated_users 'allow tcp port 7891'
	list preauthenticated_users 'allow udp port 7891'
	list users_to_router 'allow tcp port 22'
	list users_to_router 'allow tcp port 23'
	list users_to_router 'allow tcp port 53'
	list users_to_router 'allow udp port 53'
	list users_to_router 'allow udp port 67'
	list users_to_router 'allow tcp port 80'
	list users_to_router 'allow tcp port 7891'
EOF

# 6. Create the custom splash page for redirection
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

# 7. Restart NoDogSplash to apply changes
# 8. Configure Firewall for Captive Portal
echo "Configuring firewall for $INTERFACE..."

# Automatically deduce the network name (e.g., br-lan3 -> lan3)
NET_NAME=$(echo "$INTERFACE" | sed 's/br-//')

uci add firewall zone
uci set firewall.@zone[-1].name='openlink'
uci set firewall.@zone[-1].input='ACCEPT'
uci set firewall.@zone[-1].output='ACCEPT'
uci set firewall.@zone[-1].forward='ACCEPT'
uci set firewall.@zone[-1].masq='1'
uci set firewall.@zone[-1].network="$NET_NAME"

uci -q delete firewall.nds_portal
uci set firewall.nds_portal=rule
uci set firewall.nds_portal.name='Allow-OpenLink-Portal'
uci set firewall.nds_portal.src='openlink'
uci set firewall.nds_portal.proto='tcp udp'
uci set firewall.nds_portal.dest_port='53 67 80 443 2050 7891'
uci set firewall.nds_portal.target='ACCEPT'

uci commit firewall
/etc/init.d/firewall restart

echo "Restarting NoDogSplash..."
/etc/init.d/nodogsplash restart

echo "Installation complete!"
echo "Admin panel: http://${LAN_IP}:7891/admin/"
uci commit firewall
/etc/init.d/firewall restart

echo "Restarting NoDogSplash..."
/etc/init.d/nodogsplash restart

echo "Installation complete!"
echo "Admin panel: http://${LAN_IP}:7891/admin/"
