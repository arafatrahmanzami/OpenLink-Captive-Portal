# Changelog

## [3.9.1] - 2026-09-08

### Added
- **Interactive installer** – The installation script now prompts you to select the exact network interface (e.g., `br-lan`, `br-lan2`, `br-guest`) and gateway IP, instead of blindly auto-detecting and locking you out of LuCI.
- **Safe fallbacks** – Pressing Enter without typing anything automatically defaults to the system's active bridge and IP configuration, keeping the script fully compatible with automatic setups when desired.
- **No lockouts** – If your management network lives on `br-lan` but your guest Wi-Fi clients are isolated on `br-lan2`, you can explicitly point NoDogSplash and the voucher server to bind only to the guest bridge.
### Fixed
- **Dark mode "Unused" badge visibility** – Replaced the yellow background with gray and black text with white when dark mode is enabled.
### Changed
- **Rebranded** from "RoseNet" to "OpenLink" across the entire UI (sidebar, login screen, and admin panel).
 **Default Password**: `openlinkadmin`
