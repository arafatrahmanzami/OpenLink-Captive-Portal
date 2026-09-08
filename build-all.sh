#!/bin/bash
rm -rf release
mkdir -p release

for arch in arm64 arm mipsle amd64; do
    echo "Building OpenLink for $arch..."
    TARGET_DIR="release/OpenLink-Portal-linux-$arch"
    mkdir -p "$TARGET_DIR/opt/voucher"
    mkdir -p "$TARGET_DIR/www/voucher"
    mkdir -p "$TARGET_DIR/scripts"

    # Cross‑compile backend (with stripping)
    cd backend
    export PATH=$PATH:/usr/local/go/bin
    LDFLAGS="-s -w"  # strip debug info
    if [ "$arch" = "arm" ]; then
        GOOS=linux GOARCH=arm GOARM=7 go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    elif [ "$arch" = "mipsle" ]; then
        GOOS=linux GOARCH=mipsle GOMIPS=softfloat go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    else
        GOOS=linux GOARCH=$arch go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    fi
    cd ..

    # Compress the binary with UPX (if installed)
    if command -v upx >/dev/null 2>&1; then
        upx --best --lzma "$TARGET_DIR/opt/voucher/voucher_server"
    else
        echo "UPX not installed – skipping compression"
    fi

    # Copy frontend and scripts
    cp -r frontend/admin/* "$TARGET_DIR/www/voucher/"
    cp -r scripts/* "$TARGET_DIR/scripts/"
done

# Zip each directory with maximum compression
cd release
for dir in OpenLink-Portal-linux-*; do
    zip -r -9 "$dir.zip" "$dir" > /dev/null
    echo "Packaged: $dir.zip"
done
cd ..
echo "All archives ready in release/"
