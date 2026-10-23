# Changelog


# Changelog

## [3.9.5] - 2026-10-23

### Added
- **OpenWrt 25.x+ / `apk` Package Manager Support** – The installation script now dynamically detects and utilizes `apk` (Alpine Package Keeper) for modern OpenWrt snapshots, while retaining full backward compatibility with `opkg` for 24.10 and earlier.
- **ARMv6 Architecture Support** – Added specific build targets and installation support for legacy ARMv6 devices (e.g., Raspberry Pi 1, Pi Zero).
- **Softfloat MIPS Compilation** – MIPS binaries are now compiled with `GOMIPS=softfloat`, ensuring compatibility with legacy routers lacking a hardware Floating Point Unit (FPU), such as the MediaTek MT7620A.

### Fixed
- **CI Pipeline Architecture Bug** – Fixed a critical GitHub Actions bug where `GOOS` and `GOARCH` variables were not exported, causing the CI to incorrectly build x86-64 binaries for *all* architecture releases.
- **MIPS `mipsleel` One-liner Bug** – Fixed an unanchored regex (`s/mips/mipsle/`) in the README installation command that caused devices reporting `mipsel` to look for a non-existent `mipsleel` release file.
- **Archive Layout Mismatch** – Resolved an issue where CI-generated release archives used a flat directory structure, causing the installer to fail with `cp: can't stat`. CI now outputs the correct nested `opt/voucher/` and `www/voucher/` structure.
- **ARMv6 UPX Crash** – Disabled UPX compression specifically for ARMv6 builds to bypass a known UPX 4.2.4 ELF alignment incompatibility, ensuring the ARMv6 build completes successfully.
- **Dark mode "Unused" badge visibility** – Replaced the yellow background with gray and black text with white when dark mode is enabled.

### Changed
- **Rebranded** from "RoseNet" to "OpenLink" across the entire UI (sidebar, login screen, and admin panel).
- **Interactive installer** – The installation script prompts you to select the exact network interface (e.g., `br-lan`, `br-lan2`, `br-guest`) and gateway IP, instead of blindly auto-detecting and locking you out of LuCI.
- **Safe fallbacks** – Pressing Enter without typing anything automatically defaults to the system's active bridge and IP configuration.
- **No lockouts** – If your management network lives on `br-lan` but your guest Wi-Fi clients are isolated on `br-lan2`, you can explicitly point NoDogSplash and the voucher server to bind only to the guest bridge.

---
**Default Admin Password**: `openlinkadmin`


## [3.9.0] - 2026-09-08

### Added
- **Interactive installer** – The installation script now prompts you to select the exact network interface (e.g., `br-lan`, `br-lan2`, `br-guest`) and gateway IP, instead of blindly auto-detecting and locking you out of LuCI.
- **Safe fallbacks** – Pressing Enter without typing anything automatically defaults to the system's active bridge and IP configuration, keeping the script fully compatible with automatic setups when desired.
- **No lockouts** – If your management network lives on `br-lan` but your guest Wi-Fi clients are isolated on `br-lan2`, you can explicitly point NoDogSplash and the voucher server to bind only to the guest bridge.
### Fixed
- **Dark mode "Unused" badge visibility** – Replaced the yellow background with gray and black text with white when dark mode is enabled.
### Changed
- **Rebranded** from "RoseNet" to "OpenLink" across the entire UI (sidebar, login screen, and admin panel).
 **Default Password**: `openlinkadmin`
