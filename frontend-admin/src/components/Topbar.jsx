import { Menu, Search, Bell } from 'lucide-react'

export default function Topbar({ onMenu, search, onSearch }) {
  return (
    <header className="sticky top-0 z-20 mb-6 flex items-center gap-3 rounded-base border border-border bg-neutral-primary-soft/80 px-4 py-3 shadow-xs backdrop-blur-lg sm:gap-4 sm:px-6">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-base border border-border-default-medium bg-neutral-secondary-medium text-body transition duration-150 hover:bg-neutral-tertiary-medium hover:text-heading lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search vouchers, users..."
          className="w-full rounded-base border border-border-default-medium bg-neutral-secondary-medium py-2.5 pl-10 pr-3 text-sm text-heading shadow-xs outline-none transition duration-200 placeholder:text-body hover:border-border-default-strong focus:border-brand focus:ring-1 focus:ring-brand"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-base border border-border-default-medium bg-neutral-secondary-medium text-body transition duration-150 hover:bg-neutral-tertiary-medium hover:border-border-default-strong hover:text-heading"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-border-buffer bg-danger" />
        </button>
        <div className="h-9 w-9 rounded-base border border-border-brand bg-brand shadow-xs" />
      </div>
    </header>
  )
}
