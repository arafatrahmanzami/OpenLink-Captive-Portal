#!/bin/bash
cd backend
echo "Building for ARM64 (aarch64)..."
GOOS=linux GOARCH=arm64 go build -o ../bin/voucher_server_arm64 .

echo "Building for ARM 32-bit (armv7l)..."
GOOS=linux GOARCH=arm GOARM=7 go build -o ../bin/voucher_server_arm .

echo "Building for MIPS Little Endian (mipsle)..."
GOOS=linux GOARCH=mipsle GOMIPS=softfloat go build -o ../bin/voucher_server_mipsle .

echo "Building for AMD64 (x86_64)..."
GOOS=linux GOARCH=amd64 go build -o ../bin/voucher_server_amd64 .
echo "All builds completed in /bin/"
