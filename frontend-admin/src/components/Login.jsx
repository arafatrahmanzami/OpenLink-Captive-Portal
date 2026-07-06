import { useState } from 'react'
import { Flower2, Heart, Lock, Eye, EyeOff, Loader2, Sun, Moon, ShieldAlert } from 'lucide-react'
import { api } from '../lib/api.js'
import { Button, Field } from './ui.jsx'

export default function Login({ onSuccess, theme, onToggleTheme }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const res = await api.login(password)
      if (!res.ok) {
        const data = await res.json().catch(() => ({}))
        throw new Error(data.error || 'Login failed')
      }
      onSuccess()
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="relative flex h-full min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-secondary-soft px-4 transition-colors duration-300">
      {/* Bold retro grid background */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-10 dark:opacity-5"
        style={{
          backgroundSize: '32px 32px',
          backgroundImage:
            'linear-gradient(to right, #000000 1px, transparent 1px), linear-gradient(to bottom, #000000 1px, transparent 1px)',
        }}
      />

      {/* Theme Switcher Button */}
      {onToggleTheme && (
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-none border-2 border-default bg-neutral-primary text-body hover:bg-brand hover:text-black transition-all shadow-xs"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-5 w-5 text-brand" />
            ) : (
              <Moon className="h-5 w-5 text-black" />
            )}
          </button>
        </div>
      )}

      {/* Login Card Styled as a Retro Window */}
      <div className="relative z-10 w-full max-w-[420px] border-2 border-default bg-neutral-primary shadow-xl animate-fadeIn">
        {/* Retro Title Bar */}
        <div className="flex items-center justify-between border-b-2 border-default bg-brand px-4 py-3 text-black">
          <div className="flex items-center gap-1.5">
            <span className="h-3 w-3 rounded-full border-2 border-default bg-danger" />
            <span className="h-3 w-3 rounded-full border-2 border-default bg-warning" />
            <span className="h-3 w-3 rounded-full border-2 border-default bg-success" />
          </div>
          <span className="font-heading text-xs font-bold uppercase tracking-widest">GATEWAY AUTHORIZATION</span>
          <div className="w-10" />
        </div>

        <div className="p-8 sm:p-10 text-center">
          {/* Brand Logo Container */}
          <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-none border-2 border-default bg-brand text-black shadow-sm">
            <Flower2 className="h-10 w-10" />
          </div>

          {/* Branding header */}
          <h1 className="mb-2 font-heading text-3xl font-black tracking-tight text-heading">
            Rose<span className="text-brand-strong">Net</span> Admin
          </h1>
          <p className="mb-8 text-sm font-semibold text-body-subtle">
            CONSOLE PASSWORD REQUIRED
          </p>

          {/* Login Form */}
          <form onSubmit={submit} className="space-y-6 text-left">
            <Field label="Console Password" htmlFor="password">
              <div className="relative rounded-none shadow-xs">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-body">
                  <Lock className="h-4 w-4" />
                </div>
                <input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  autoComplete="current-password"
                  required
                  className="w-full rounded-none border-2 border-default bg-neutral-primary-soft pl-10 pr-10 py-3 text-sm text-heading outline-none transition-all duration-150 placeholder:text-body/30 hover:border-border-default-strong focus:border-brand focus:shadow-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-body hover:text-heading transition-colors focus:outline-none"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? (
                    <EyeOff className="h-4.5 w-4.5" />
                  ) : (
                    <Eye className="h-4.5 w-4.5" />
                  )}
                </button>
              </div>
            </Field>

            <Button type="submit" size="lg" className="w-full mt-2 font-bold tracking-wider uppercase" disabled={loading}>
              {loading ? (
                <div className="flex items-center justify-center gap-2">
                  <Loader2 className="h-4 w-4 animate-spin text-black" />
                  <span>AUTHORIZING...</span>
                </div>
              ) : (
                <span>AUTHENTICATE</span>
              )}
            </Button>

            {/* Styled Error Alert */}
            {error && (
              <div className="flex items-center gap-2.5 rounded-none border-2 border-danger bg-danger-soft p-3.5 text-xs font-bold text-fg-danger-strong shadow-2xs animate-fadeIn">
                <ShieldAlert className="h-5 w-5 shrink-0 text-danger" />
                <span>{error}</span>
              </div>
            )}
          </form>
        </div>
      </div>

      {/* Footer */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 text-center text-xs text-body-subtle flex flex-col items-center justify-center gap-1 select-none">
        <p className="flex items-center gap-1 font-bold">
          made with <Heart className="h-3.5 w-3.5 fill-danger text-danger animate-pulse inline mx-0.5" /> by{' '}
          <a
            href="https://github.com/nhAsif"
            target="_blank"
            rel="noopener noreferrer"
            className="text-heading hover:text-brand-strong transition-colors font-bold underline decoration-default decoration-2 underline-offset-2 hover:decoration-brand"
          >
            nhAsif
          </a>
        </p>
        <p className="text-[10px] uppercase tracking-widest font-black opacity-60">
          powered by <span className="text-black bg-brand px-1 border border-default">openwrt</span>
        </p>
      </footer>
    </div>
  )
}
