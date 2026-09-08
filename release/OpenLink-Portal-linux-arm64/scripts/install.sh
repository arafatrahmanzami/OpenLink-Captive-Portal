#!/bin/sh

# Determine the directory where this script is located
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
RELEASE_ROOT="$(dirname "$SCRIPT_DIR")"

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

# 2. Copy files (Updated for multi-arch archive layout)
echo "Copying application files..."
cp "$RELEASE_ROOT/opt/voucher/voucher_server" /opt/voucher/
chmod +x /opt/voucher/voucher_server
mkdir -p /www/voucher/admin
mkdir -p /www/voucher/admin
cp -r "$RELEASE_ROOT/www/voucher"/* /www/voucher/admin/

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
    echo "NoDogSplash not found. Installing it via opkg..."
    opkg update
    if ! opkg install nodogsplash; then
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
echo "Restarting NoDogSplash..."
/etc/init.d/nodogsplash restart

echo "Installation complete!"
echo "Your voucher server is running on interface $INTERFACE at IP $LAN_IP."
echo "Admin panel access: http://${LAN_IP}:7891/admin/"
