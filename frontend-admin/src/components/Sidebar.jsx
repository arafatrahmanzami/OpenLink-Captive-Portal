import {
  Flower2,
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
  { id: 'vouchers', label: 'Vouchers', icon: CreditCard },
  { id: 'sessions', label: 'Sessions', icon: Users },
  { id: 'zones', label: 'Hotspot Zones', icon: MapPin },
  { id: 'logs', label: 'User Logs', icon: FileText },
  { id: 'reports', label: 'Revenue Reports', icon: BarChart2 },
]

function NavLink({ item, active, onClick }) {
  const Icon = item.icon
  return (
    <button
      onClick={onClick}
      className={`group flex w-full items-center rounded-none px-3 py-2.5 text-sm font-semibold transition-all duration-700 select-none outline-none border-2
        ${active
          ? 'bg-neutral-secondary-strong text-fg-brand-strong border-default shadow-xs translate-x-[2px]'
          : 'bg-transparent text-heading border-transparent hover:bg-neutral-secondary-medium hover:border-default hover:shadow-2xs'
        }`}
    >
      <Icon
        className={`h-5 w-5 mr-3 transition-colors duration-75 ${
          active ? 'text-brand-strong' : 'text-body group-hover:text-heading'
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
          className="fixed inset-0 z-30 bg-black/60 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed inset-y-0 left-0 z-40 flex w-64 flex-col border-r-2 border-default bg-neutral-primary px-4 py-6 transition-transform duration-300 lg:static lg:z-10 lg:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="mb-10 flex items-center justify-between px-1">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center rounded-none border-2 border-default bg-brand p-2.5 text-black shadow-xs hover:shadow-sm hover:-translate-y-[1px] transition-all duration-200">
              <Flower2 className="h-5 w-5" />
            </div>
            <h1 className="font-heading text-xl font-bold tracking-tight text-heading">
              Open<span className="text-brand-strong">Link</span>
            </h1>
          </div>
          <button
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-none border-2 border-default bg-neutral-primary-soft text-body hover:text-heading shadow-xs hover:shadow-sm transition-all duration-200 lg:hidden"
            aria-label="Close menu"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <nav className="flex-1 space-y-2 overflow-y-auto px-1">
          {NAV.map((item) => (
            <NavLink
              key={item.id}
              item={item}
              active={view === item.id}
              onClick={() => onNavigate(item.id)}
            />
          ))}
        </nav>

        <div className="mt-4 border-t-2 border-default pt-6 px-1">
          <div className="mb-6 rounded-none border-2 border-default bg-success-soft p-4 shadow-xs text-left">
            <h4 className="mb-2 text-[10px] font-bold uppercase tracking-wider text-fg-success-strong/80">
              System Status
            </h4>
            <div className="flex items-center gap-2 text-sm font-bold text-fg-success-strong">
              <span className="h-3.5 w-3.5 rounded-full bg-success border-2 border-default" />
              Console Active
            </div>
          </div>
          
          <div className="flex items-center justify-between px-2">
            <button
              onClick={() => onNavigate('settings')}
              className={`flex h-9 w-9 items-center justify-center rounded-none btn-icon-neobrutal bg-neutral-primary-soft transition-all duration-200 ${
                view === 'settings'
                  ? 'text-black bg-brand shadow-2xs border-default'
                  : 'text-body hover:bg-neutral-secondary-medium hover:text-heading'
              }`}
              aria-label="Settings"
            >
              <Settings className="h-5 w-5" />
            </button>
            <button
              onClick={onLogout}
              className="flex h-9 w-9 items-center justify-center rounded-none btn-icon-neobrutal bg-neutral-primary-soft text-body hover:bg-danger-soft hover:text-danger hover:border-danger transition-all duration-200"
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
