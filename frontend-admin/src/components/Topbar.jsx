import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'

export default function Topbar({ onMenu, search, onSearch, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 mb-6 flex items-center gap-3 rounded-none border-2 border-default bg-neutral-primary px-4 py-3.5 shadow-sm sm:gap-4 sm:px-6">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-none btn-icon-neobrutal bg-neutral-primary-soft text-body hover:bg-neutral-secondary-medium hover:text-heading lg:hidden"
        aria-label="Open menu"
      >
        <Menu className="h-5 w-5" />
      </button>

      <div className="relative flex-1 sm:max-w-xs">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-body-subtle" />
        <input
          type="text"
          value={search}
          onChange={(e) => onSearch?.(e.target.value)}
          placeholder="Search vouchers, users..."
          className="w-full rounded-none border-2 border-default bg-neutral-primary-soft py-2 pl-9 pr-3 text-sm text-heading shadow-xs outline-none transition-all duration-150 placeholder:text-body-subtle/50 hover:border-border-default-strong focus:border-brand focus:shadow-sm"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-none btn-icon-neobrutal bg-neutral-primary-soft text-body hover:bg-neutral-secondary-medium hover:text-heading"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px] text-brand" /> : <Moon className="h-[18px] w-[18px] text-black" />}
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-none btn-icon-neobrutal bg-neutral-primary-soft text-body hover:bg-neutral-secondary-medium hover:text-heading"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -top-1 -right-1 h-3 w-3 rounded-full border-2 border-default bg-danger animate-pulse" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-default bg-brand text-black font-heading font-bold text-sm shadow-xs hover:bg-brand-strong hover:-translate-y-[1px] transition-all duration-100 cursor-pointer">
          A
        </div>
      </div>
    </header>
  )
}
