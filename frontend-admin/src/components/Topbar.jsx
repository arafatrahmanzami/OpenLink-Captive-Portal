import { Menu, Search, Bell, Sun, Moon } from 'lucide-react'

export default function Topbar({ onMenu, search, onSearch, theme, onToggleTheme }) {
  return (
    <header className="sticky top-0 z-20 mb-6 flex items-center gap-3 rounded-base border border-border/30 bg-neutral-primary-soft px-4 py-3 shadow-md backdrop-blur-lg sm:gap-4 sm:px-6">
      <button
        onClick={onMenu}
        className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft text-body-subtle shadow-sm hover:shadow-md hover:text-heading active:shadow-inset transition-all duration-200 lg:hidden"
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
          className="w-full rounded-base border border-border/30 bg-neutral-primary-soft py-2 pl-10 pr-3 text-sm text-heading shadow-inset outline-none transition-all duration-200 placeholder:text-body-subtle/50 hover:border-border-default-strong focus:border-brand focus:ring-1 focus:ring-brand/40"
        />
      </div>

      <div className="ml-auto flex items-center gap-3 sm:gap-4">
        <button
          onClick={onToggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft text-body-subtle shadow-sm hover:shadow-md hover:text-heading active:shadow-inset transition-all duration-200"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? <Sun className="h-[18px] w-[18px]" /> : <Moon className="h-[18px] w-[18px]" />}
        </button>
        <button
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft text-body-subtle shadow-sm hover:shadow-md hover:text-heading active:shadow-inset transition-all duration-200"
          aria-label="Notifications"
        >
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute -right-0.5 -top-0.5 h-2.5 w-2.5 rounded-full border-2 border-neutral-primary-soft bg-danger" />
        </button>
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border/30 bg-neutral-primary-soft text-brand font-heading font-bold text-sm shadow-sm hover:shadow-md active:shadow-inset transition-all duration-200 cursor-pointer">
          R
        </div>
      </div>
    </header>
  )
}
