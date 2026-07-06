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
      {/* Dynamic tech-grid background overlay */}
      <div
        className="pointer-events-none absolute inset-0 z-0 opacity-40 dark:opacity-20"
        style={{
          backgroundSize: '40px 40px',
          backgroundImage:
            'linear-gradient(to right, rgba(20, 71, 230, 0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(20, 71, 230, 0.05) 1px, transparent 1px)',
          maskImage:
            'radial-gradient(circle at center, black 30%, transparent 80%)',
          WebkitMaskImage:
            'radial-gradient(circle at center, black 30%, transparent 80%)',
        }}
      />

      {/* Ambient glows (combination of brand-blue and rose/pink for premium aesthetics) */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-[400px] w-[400px] rounded-full bg-brand opacity-[0.06] blur-[100px] dark:opacity-[0.08]" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-[400px] w-[400px] rounded-full bg-rose-500 opacity-[0.04] blur-[100px] dark:opacity-[0.06]" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 -z-10 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-tr from-brand to-rose-500 opacity-[0.05] blur-[120px] dark:opacity-[0.07]" />

      {/* Theme Switcher Button */}
      {onToggleTheme && (
        <div className="absolute top-6 right-6 z-20">
          <button
            type="button"
            onClick={onToggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-border-default/60 bg-neutral-primary-soft/60 text-body hover:bg-neutral-secondary-medium hover:text-heading hover:scale-105 transition-all shadow-xs backdrop-blur-md dark:border-border-default/20 dark:bg-neutral-primary-soft/30"
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="h-4.5 w-4.5 text-warning" />
            ) : (
              <Moon className="h-4.5 w-4.5 text-brand" />
            )}
          </button>
        </div>
      )}

      {/* Login Card */}
      <div className="relative z-10 w-full max-w-[420px] overflow-hidden rounded-2xl border border-border-default/80 bg-neutral-primary-soft/75 p-8 text-center shadow-2xl backdrop-blur-xl transition-all duration-500 hover:shadow-brand/5 dark:border-border-default/20 dark:bg-neutral-primary-soft/45 dark:hover:shadow-brand/10 sm:p-10 animate-fadeIn">
        {/* Top decorative gradient bar */}
        <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-r from-brand via-rose-500 to-brand" />

        {/* Security badge indicator */}
        <div className="mx-auto mb-4 inline-flex items-center gap-1.5 rounded-full border border-border-default/80 bg-neutral-secondary-medium/60 px-3 py-1 text-[10px] font-bold tracking-wider uppercase text-body-subtle dark:bg-neutral-secondary-medium/40">
          <span className="h-1.5 w-1.5 rounded-full bg-success animate-ping" />
          <span className="opacity-80">Security Gateway</span>
        </div>

        {/* Rotating Brand Logo Icon Container */}
        <div className="relative mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-2xl border border-border-default bg-neutral-primary-soft/50 text-brand shadow-sm backdrop-blur-xs transition-all duration-300 hover:scale-105 dark:border-border-default/20">
          <div className="absolute inset-0 rounded-2xl bg-brand/5 blur-xs animate-pulse" />
          <Flower2 className="h-10 w-10 text-brand dark:text-fg-brand animate-spin-slow" />
        </div>

        {/* Branding header */}
        <h1 className="mb-2 font-heading text-3xl font-extrabold tracking-tight text-heading">
          Rose<span className="bg-gradient-to-r from-brand via-rose-500 to-rose-600 bg-clip-text text-transparent">Net</span> Admin
        </h1>
        <p className="mb-8 text-sm text-body-subtle">
          Enter authorization credentials to access console
        </p>

        {/* Login Form */}
        <form onSubmit={submit} className="space-y-5 text-left">
          <Field label="Security Password" htmlFor="password">
            <div className="relative rounded-base shadow-xs">
              <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-body-subtle/70">
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
                className="w-full rounded-base border border-border-default bg-neutral-secondary-medium/80 pl-10 pr-10 py-3 text-sm text-heading outline-none transition-all duration-200 placeholder:text-body-subtle/30 hover:border-border-default-strong focus:outline-none focus:ring-2 focus:ring-brand/20 focus:border-brand disabled:bg-disabled disabled:text-fg-disabled disabled:cursor-not-allowed dark:border-border-default/60 dark:bg-neutral-secondary-medium/40"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-body-subtle/70 hover:text-heading transition-colors focus:outline-none"
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

          <Button type="submit" size="lg" className="w-full mt-2 font-semibold tracking-wide" disabled={loading}>
            {loading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin text-white" />
                <span>Authorizing...</span>
              </div>
            ) : (
              <span>Authenticate</span>
            )}
          </Button>

          {/* Styled Error Alert */}
          {error && (
            <div className="flex items-center gap-2.5 rounded-base border border-danger-strong/20 bg-danger-soft p-3 text-xs font-semibold text-fg-danger-strong animate-fadeIn">
              <ShieldAlert className="h-4 w-4 shrink-0 text-danger" />
              <span>{error}</span>
            </div>
          )}
        </form>
      </div>

      {/* Footer made with love by nhAsif. powered by openwrt */}
      <footer className="absolute bottom-6 left-0 right-0 z-10 text-center text-xs text-body-subtle/80 flex flex-col items-center justify-center gap-1 select-none">
        <p className="flex items-center gap-1 font-medium">
          made with <Heart className="h-3.5 w-3.5 fill-danger text-danger animate-pulse inline mx-0.5" /> by{' '}
          <a
            href="https://github.com/nhAsif"
            target="_blank"
            rel="noopener noreferrer"
            className="text-heading hover:text-brand transition-colors font-semibold underline decoration-border-default-strong decoration-2 underline-offset-2 hover:decoration-brand dark:decoration-border-default/40 dark:hover:decoration-brand"
          >
            nhAsif
          </a>
        </p>
        <p className="text-[10px] uppercase tracking-wider opacity-60">
          powered by <span className="font-semibold text-brand dark:text-fg-brand">openwrt</span>
        </p>
      </footer>
    </div>
  )
}
