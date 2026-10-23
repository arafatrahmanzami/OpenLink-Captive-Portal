#!/bin/bash
rm -rf release
mkdir -p release

# Add armv6 to the list
for arch in arm64 arm armv6 mipsle amd64; do
    echo "Building OpenLink for $arch..."
    TARGET_DIR="release/OpenLink-Portal-linux-$arch"
    mkdir -p "$TARGET_DIR/opt/voucher"
    mkdir -p "$TARGET_DIR/www/voucher"
    mkdir -p "$TARGET_DIR/scripts"

    cd backend
    export PATH=$PATH:/usr/local/go/bin
    LDFLAGS="-s -w"
    if [ "$arch" = "arm" ]; then
        GOOS=linux GOARCH=arm GOARM=7 go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    elif [ "$arch" = "armv6" ]; then
        GOOS=linux GOARCH=arm GOARM=6 go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    elif [ "$arch" = "mipsle" ]; then
        GOOS=linux GOARCH=mipsle GOMIPS=softfloat go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    else
        GOOS=linux GOARCH=$arch go build -ldflags="$LDFLAGS" -o "../$TARGET_DIR/opt/voucher/voucher_server" .
    fi
    cd ..

    if command -v upx >/dev/null 2>&1; then
        upx --best --lzma "$TARGET_DIR/opt/voucher/voucher_server"
    else
        echo "UPX not installed – skipping compression"
    fi

    cp -r frontend/* "$TARGET_DIR/www/voucher/"
    cp -r scripts/* "$TARGET_DIR/scripts/"
done

cd release
for dir in OpenLink-Portal-linux-*; do
    zip -r -9 "$dir.zip" "$dir" > /dev/null
    echo "Packaged: $dir.zip"
done
cd ..
echo "All archives ready in release/"
