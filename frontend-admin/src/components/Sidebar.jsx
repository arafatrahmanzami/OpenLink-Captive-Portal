import {
  Shield,
  LayoutDashboard,
  CreditCard,
  Users,
  MapPin,
  FileText,
  BarChart2,
  Settings,
  LogOut,
  X,
} from 'lucide-react'

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'vouchers', label: 'Voucher Management', icon: CreditCard },
  { id: 'sessions', label: 'Active Sessions', icon: Users },
  { id: 'zones', label: 'Hotspot Zones', icon: MapPin },
  { id: 'logs', label: 'User Logs', icon: FileText },
  { id: 'reports', label: 'Revenue Reports', icon: BarChart2 },
]

function NavLink({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center rounded-base px-3 py-2.5 text-sm font-medium transition-all duration-200 select-none ${
        active
          ? 'shadow-inset text-fg-brand bg-neutral-primary-soft'
          : 'text-body hover:shadow-sm hover:text-heading bg-neutral-primary-soft'
      }`}
    >
      <Icon
        className={`h-5 w-5 mr-3 transition-colors duration-150 ${
          active ? 'text-brand' : 'text-body-subtle group-hover:text-heading'
        }`}
      />
      <span>{item.label}</span>
    </button>
  )
}

export default function Sidebar({ view, onNavigate, onLogout, open, onClose }) {
  return (
    <>
      {/* Mobile backdrop */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-black/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r border-border/30 bg-neutral-primary-soft px-4 py-6 transition-transform duration-300 lg:static lg:z-10 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-full border border-border/30 bg-neutral-primary-soft p-2.5 text-brand shadow-sm hover:shadow-md active:shadow-inset transition-all duration-200">
              <Shield className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-heading">
              Rose<span className="text-brand">Net</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft text-body hover:text-heading shadow-sm hover:shadow-md active:shadow-inset transition-all duration-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-3 px-1">
          {NAV.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={view === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        <div className="mt-4 border-t border-border/20 pt-6 px-1">
          <div className="mb-6 rounded-base border border-border/30 bg-neutral-primary-soft p-4 shadow-inset text-left">
            <h4 className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-body-subtle">
              System Status
            </h4>
            <div className="flex items-center gap-2 text-sm font-bold text-fg-success-strong">
              <span className="h-2.5 w-2.5 animate-pulseGlow rounded-full bg-success shadow-[0_0_8px_var(--success)]" />
              Server Online
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => onNavigate('settings')}
              className={`flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft transition-all duration-200 hover:text-brand ${
                view === 'settings'
                  ? 'text-brand shadow-inset'
                  : 'text-body-subtle shadow-sm hover:shadow-md'
              }`}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-full border border-border/20 bg-neutral-primary-soft text-body-subtle shadow-sm hover:shadow-md hover:text-brand active:shadow-inset transition-all duration-200"
              aria-label="Log out"
            >
              <LogOut className="h-5 w-5" />
            </button>
          </div>
        </div>
      </aside>
    </>
  )
}
