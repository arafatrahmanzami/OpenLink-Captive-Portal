import { useCallback, useEffect, useState } from 'react'
import { api } from './lib/api.js'
import { CurrencyContext } from './lib/currency.js'
import Login from './components/Login.jsx'
import Sidebar from './components/Sidebar.jsx'
import Topbar from './components/Topbar.jsx'
import Dashboard from './views/Dashboard.jsx'
import Vouchers from './views/Vouchers.jsx'
import Sessions from './views/Sessions.jsx'
import Logs from './views/Logs.jsx'
import Zones from './views/Zones.jsx'
import Reports from './views/Reports.jsx'
import Settings from './views/Settings.jsx'

// Decorative background grid (matches the neobrutalist system).
function Backdrop() {
  return (
    <div
      className="pointer-events-none absolute inset-0 z-0 opacity-5 dark:opacity-[0.02]"
      style={{
        backgroundSize: '32px 32px',
        backgroundImage:
          'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
      }}
    />
  )
}

export default function App() {
  const [authed, setAuthed] = useState(null) // null = still checking
  const [view, setView] = useState('dashboard')
  const [currency, setCurrency] = useState('$')
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [search, setSearch] = useState('')
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('theme') || 'light'
  })

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', theme)
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme((t) => (t === 'light' ? 'dark' : 'light'))
  }, [])

  // Probe an authenticated endpoint to decide login state on first load.
  useEffect(() => {
    let active = true
    ;(async () => {
      try {
        const res = await api.stats()
        if (active) setAuthed(res.ok)
      } catch {
        if (active) setAuthed(false)
      }
    })()
    return () => {
      active = false
    }
  }, [])

  // Load currency once authenticated so all views show the right symbol.
  useEffect(() => {
    if (!authed) return
    ;(async () => {
      try {
        const res = await api.settings()
        if (res.ok) {
          const s = await res.json()
          if (s.currency_symbol) setCurrency(s.currency_symbol)
        }
      } catch {
        /* keep default */
      }
    })()
  }, [authed])

  const handleLogout = useCallback(async () => {
    try {
      await api.logout()
    } finally {
      setAuthed(false)
      setView('dashboard')
    }
  }, [])

  const navigate = useCallback((v) => {
    setView(v)
    setSidebarOpen(false)
  }, [])

  if (authed === null) {
    return (
      <div className="grid h-full place-items-center bg-neutral-secondary-soft text-heading p-4">
        <div className="w-full max-w-xs border-2 border-default bg-neutral-primary p-6 text-center shadow-md">
          <div className="mb-4 font-heading text-lg font-bold">LOADING SYSTEM...</div>
          <div className="h-6 w-full border-2 border-default bg-neutral-secondary p-1">
            <div className="h-full bg-brand border border-default animate-pulse" style={{ width: '60%' }} />
          </div>
        </div>
      </div>
    )
  }

  if (!authed) {
    return (
      <Login
        onSuccess={() => setAuthed(true)}
        theme={theme}
        onToggleTheme={toggleTheme}
      />
    )
  }

  return (
    <CurrencyContext.Provider value={{ currency, setCurrency }}>
      <div className="relative flex h-full overflow-hidden">
        <Backdrop />
        <Sidebar
          view={view}
          onNavigate={navigate}
          onLogout={handleLogout}
          open={sidebarOpen}
          onClose={() => setSidebarOpen(false)}
        />
        <div className="relative z-10 flex min-w-0 flex-1 flex-col">
          <div className="flex flex-1 flex-col overflow-y-auto p-4 sm:p-6">
            <Topbar
              onMenu={() => setSidebarOpen(true)}
              search={search}
              onSearch={setSearch}
              theme={theme}
              onToggleTheme={toggleTheme}
            />
            <main className="flex-1">
              {view === 'dashboard' && (
                <Dashboard onUnauthorized={handleLogout} />
              )}
              {view === 'vouchers' && (
                <Vouchers onUnauthorized={handleLogout} search={search} />
              )}
              {view === 'sessions' && (
                <Sessions onUnauthorized={handleLogout} search={search} />
              )}
              {view === 'logs' && (
                <Logs onUnauthorized={handleLogout} search={search} />
              )}
              {view === 'zones' && (
                <Zones onUnauthorized={handleLogout} search={search} />
              )}
              {view === 'reports' && <Reports onUnauthorized={handleLogout} />}
              {view === 'settings' && <Settings onUnauthorized={handleLogout} />}
            </main>
          </div>
        </div>
      </div>
    </CurrencyContext.Provider>
  )
}
