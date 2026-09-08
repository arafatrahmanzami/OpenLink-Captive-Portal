# OpenLink Captive Portal

**OpenLink** is a rebranded and enhanced fork of [RoseNet-Captive-Portal](https://github.com/nhAsif/RoseNet-Captive-Portal) by [nhAsif](https://github.com/nhAsif).  
It provides a lightweight, voucher‑based captive portal for OpenWrt routers, with a Go backend and a React frontend.

## Key improvements/changes in this fork

- ✅ **Fully rebranded** – all UI elements (sidebar, login, admin panel) now say **OpenLink**.
- ✅ **Interactive installer** – choose your network interface (e.g., `br-lan3`) and gateway IP to avoid lockouts.
- ✅ **Dark mode fix** – the “Unused” badge now has a gray background with white text for readability.
- ✅ **Easy Default Password**: `openlinkadmin`
- ✅ **No more hardcoded dependencies** – the installer works on any OpenWrt version with NoDogSplash.

---



# Installation & Deployment
Detects the router architecture.
Downloads the matching zip from release.
Extracts and runs the installer.


bash
# Install with a single command:
curl -s https://api.github.com/repos/arafatrahmanzami/OpenLink-Captive-Portal/releases/latest | \
grep "browser_download_url" | \
grep "$(uname -m | sed 's/armv7l/arm/; s/aarch64/arm64/; s/x86_64/amd64/; s/mips/mipsle/')" | \
cut -d '"' -f 4 | \
wget -qi - && \
unzip OpenLink-Portal-linux-*.zip && \
cd OpenLink-Portal-linux-* && \
chmod +x scripts/install.sh && \
sh scripts/install.sh


#Recommended single command for OpenWrt / BusyBox (which may not have curl), use wget and grep:

SSH into your OpenWrt router and run:


bash
# Using wget (most OpenWrt builds)
wget -qO- https://api.github.com/repos/arafatrahmanzami/OpenLink-Captive-Portal/releases/latest | \
grep -o "https://.*/OpenLink-Portal-linux-$(uname -m | sed 's/armv7l/arm/; s/aarch64/arm64/; s/x86_64/amd64/; s/mips/mipsle/').zip" | \
head -n1 | \
xargs wget -O OpenLink-Portal.zip && \
unzip OpenLink-Portal.zip && \
cd OpenLink-Portal-linux-* && \
chmod +x scripts/install.sh && \
sh scripts/install.sh








## OpenWrt WiFi Voucher System

OpenLink Captive Portal is a comprehensive, self-contained voucher authentication system designed for Wi-Fi users on OpenWrt routers. It provides a robust and lightweight solution for managing internet access through a captive portal, leveraging a Go backend, a vanilla JavaScript frontend, and seamless integration with NoDogSplash.

## Table of Contents

- [Features](#features)
- [System Architecture](#system-architecture)
- [Components](#components)
- [Installation & Deployment](#installation--deployment)
- [Usage](#usage)
  - [User Portal](#user-portal)
  - [Administrator Panel](#administrator-panel)
- [Configuration](#configuration)
- [API Endpoints](#api-endpoints)
- [Contributing](#contributing)
- [License](#license)

## Features

*   **Lightweight & Efficient**: Optimized for resource-constrained OpenWrt environments.
*   **CGO-Free Go Backend**: Easy cross-compilation and deployment without external C dependencies.
*   **Vanilla JavaScript Frontend**: Fast loading and minimal dependencies for captive portal environments.
*   **Integrated Captive Portal**: Seamlessly works with NoDogSplash for user redirection and authentication.
*   **Voucher Management**: Administrators can generate, manage, and revoke time-limited access vouchers.
*   **Secure Admin Panel**: Dedicated interface for voucher administration with password protection.
*   **Customizable**: The frontend can be easily themed and adapted.

## System Architecture

The OpenLink Access Portal operates entirely on the OpenWrt router, comprising three core components that work in concert to deliver the captive portal experience:

1.  **Go Backend (`voucher_server`)**: Serves as the central logic hub, handling HTTP requests, database interactions, and voucher authentication.
2.  **Frontend**: Provides the user interface for voucher entry and the administrative interface for managing vouchers.
3.  **NoDogSplash**: The captive portal software responsible for intercepting unauthenticated traffic and redirecting users to the OpenLink Access Portal.

## Components

### Go Backend (`voucher_server`)

*   **Language**: Go (Golang)
*   **Database**: JSON-based Persistence (Thread-safe document store)
*   **Database Location (on router)**: `/data/voucher.json` and `/data/settings.json`
*   **Log File (on router)**: `/tmp/voucher.log`

### Frontend

Designed for extreme lightness and performance, crucial for captive portal environments.

*   **`index.html` (User Voucher Page)**: The themed entry page users encounter. Support for multiple visual styles including corporate, modern, and retro-music.
*   **Administrator Panel (`/admin/`)**: A React 18 + Vite single-page application (source in `frontend-admin/`, compiled to `frontend/admin/`) for comprehensive voucher management, system statistics, and theme configuration. The legacy `/admin.html` URL redirects here.

### NoDogSplash Integration

The integration with NoDogSplash is fundamental to the captive portal functionality:

1.  A user connects to the Wi-Fi network.
2.  NoDogSplash intercepts the user's initial HTTP request and redirects them to its `splash.html` page (`/etc/nodogsplash/htdocs/splash.html`).
3.  This `splash.html` contains a meta-refresh that immediately redirects the user to the OpenLink Access Portal's Go-powered voucher page (e.g., `http://<router-lan-ip>:7891`), forwarding essential parameters like `ip`, `mac`, and `token`. The router's LAN IP is detected automatically during installation, so the portal works on any subnet without manual edits.
4.  The user enters a valid voucher code on the portal page.
5.  The frontend JavaScript validates the voucher and stages the session via `/binauth-stage`.
6.  Upon successful validation, the user is redirected to the NoDogSplash authentication URL.
7.  NoDogSplash calls `binauth.sh`, which queries the backend's `/binauth-check` to finalize the connection.
8.  The user is granted internet access for the duration specified by the voucher.

## Installation & Deployment

OpenLink Access Portal can be deployed on your OpenWrt router either by using a pre-compiled binary release (recommended) or by building from source. Everything is installed directly on the router — no separate Go toolchain or local machine staging is required.

### Method 1: Using a Pre-compiled Release (Recommended)

This is the easiest method. You do everything over SSH on the router itself.

1.  **SSH into your router**:

    ```sh
    ssh root@<router-lan-ip>
    ```

2.  **Check your router's architecture**:
    Releases are published per architecture. Identify yours with:

    ```sh
    opkg print-architecture
    # or, alternatively:
    uname -m
    ```

    Map the result to the correct release archive:

    | `uname -m` / arch        | Release archive                    |
    | ------------------------ | ---------------------------------- |
    | `aarch64` / `arm64`      | `OpenLink-Portal-linux-arm64.zip`   |
    | `armv7l`, `armv6l` / arm | `OpenLink-Portal-linux-arm.zip`     |
    | `mips`, `mipsel`         | `OpenLink-Portal-linux-mipsle.zip`  |
    | `x86_64`                 | `OpenLink-Portal-linux-amd64.zip`   |

3.  **Download the latest release** with `wget` (replace the filename with the one for your architecture):

    ```sh
    wget https://github.com/arafatrahmanzami/OpenLink-Captive-Portal/releases/latest/download/OpenLink-Portal-linux-arm64.zip
    ```
or  **Download the specific release** with `wget` (replace the filename with the one for your architecture):

    ```sh
    wget https://github.com/arafatrahmanzami/OpenLink-Captive-Portal/releases/download/v3.9/RoseNet-Portal-linux-arm64.zip
    ```

4.  **Unzip the archive**:
    If `unzip` is not installed, install it first with `opkg update && opkg install unzip`.

    ```sh
    unzip OpenLink-Portal-linux-arm64.zip
    cd OpenLink-Portal-linux-arm64
    ```

5.  **Run the installation script**:

    ```sh
    chmod +x scripts/install.sh
    sh scripts/install.sh
    ```

    The `install.sh` script automates the following:
    *   Installs NoDogSplash automatically via `opkg` if it is not already present.
    *   Detects the router's LAN IP automatically (from `network.lan.ipaddr`, falling back to the `br-lan` interface address). To override detection, run the script with an explicit IP: `LAN_IP=192.168.1.1 sh scripts/install.sh`.
    *   Creates necessary directories (`/opt/voucher`, `/www/voucher`, `/data`) and copies application files to their final destinations.
    *   Sets up an `init.d` service to ensure the voucher server starts on boot.
    *   Configures NoDogSplash with the correct authentication service and rules, and generates the custom `splash.html` redirect page.
    *   Restarts relevant services to apply changes.

### Method 2: Building from Source

For developers who want to build the binary themselves.

1.  **Build the Server Binary**:
    On Windows, run `build.bat`; on Linux/macOS, run `scripts/build.sh`. Adjust `GOARCH` to match your router (`arm64`, `arm`, `mipsle`, `amd64`). This cross-compiles the Go application and produces the `voucher_server` binary in the project root.

    ```sh
    ./scripts/build.sh
    ```

    **Admin UI (required for source builds):** The admin dashboard is a React 18 + Vite app in `frontend-admin/`. Its compiled output (`frontend/admin/`) is **not committed** — you must build it before deploying from source so the panel is included in `frontend/`. Node.js is required on your dev machine only, never on the router. (Pre-compiled releases already include it, built automatically by CI.)

    ```sh
    cd frontend-admin
    npm install
    npm run build      # emits static files into ../frontend/admin
    # dev loop: run the Go backend (cd backend && go run .), then `npm run dev`
    ```

2.  **Copy the project to the router** (including `voucher_server`, `frontend/`, and `scripts/`):

    ```sh
    scp -r OpenLink-Captive-Portal root@<router-lan-ip>:/root/
    ```

3.  **Run the installation script on the router**:

    ```sh
    ssh root@<router-lan-ip>
    cd /root/OpenLink-Captive-Portal
    chmod +x scripts/install.sh
    sh scripts/install.sh
    ```

    This performs the same setup steps as described in Method 1.

## Usage

### User Portal

Users connecting to your Wi-Fi network will be redirected to the voucher entry page. The visual style is determined by the "Portal Theme" setting in the admin panel.

### Administrator Panel

Access the administrator panel at `/admin/` (e.g., `http://<router-lan-ip>:7891/admin/`). The installation script prints the exact URL with your router's detected IP when it finishes. The old `/admin.html` link still works and redirects to `/admin/`.
*   **Default Password**: `openlinkadmin`
*   **Features**:
    *   Secure login and password management.
    *   Real-time dashboard with revenue and user statistics.
    *   Voucher generation with customizable names, durations, and prices.
    *   Theme management (Choose between Default, Modern, Corporate, or Music).
    *   Global settings (Currency symbols, system configuration).

## Configuration

*   **Default Admin Password**: The default administrator password is `rosepinepink`.
*   **Server Port**: The Go backend listens on port `7891` by default.
*   **LAN IP**: Detected automatically at install time and wired into the captive-portal redirects, so no IP is hardcoded. The frontend resolves the router address from the browser's location, and `splash.html` uses the IP detected by `install.sh` (override with `LAN_IP=<ip> ./scripts/install.sh`).
*   **Persistence**: Data is stored in `/data/` as JSON files. This ensures portability and easy backups without needing database drivers.

## API Endpoints

The Go backend exposes the following API endpoints:

*   `GET /`: Serves the themed user voucher entry page.
*   `GET /auth`: Legacy authentication endpoint.
*   `GET /binauth-stage`: Validates a voucher and stages a client MAC for NDS authentication.
*   `GET /binauth-check`: Used by `binauth.sh` to verify if a client is authorized and return the remaining duration.
*   `POST /admin/login`: Authenticates administrator access.
*   `GET /admin/vouchers`: (Protected) Retrieves a list of all vouchers.
*   `POST /admin/add`: (Protected) Adds a new voucher to the system.
*   `POST /admin/delete`: (Protected) Deletes a voucher by its ID.
*   `GET /admin/settings`: (Protected) Retrieves system settings.
*   `POST /admin/update-settings`: (Protected) Updates system settings (e.g., active theme, currency).
*   `GET /admin/stats`: (Protected) Provides dashboard statistics and chart data.

## Contributing

Contributions are welcome! Please feel free to submit issues, feature requests, or pull requests.

## License

This project is licensed under the [GNU General Public License v3](LICENSE).
