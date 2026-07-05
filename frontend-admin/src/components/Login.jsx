import { useState } from 'react'
import { Shield } from 'lucide-react'
import { api } from '../lib/api.js'
import { Button, Field, Input } from './ui.jsx'

export default function Login({ onSuccess }) {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

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
    <div className="relative grid h-full place-items-center overflow-hidden bg-neutral-primary-soft px-4">
      {/* Ambient glows (updated to Rose theme) */}
      <div className="pointer-events-none absolute -right-36 -top-36 h-[500px] w-[500px] rounded-full bg-brand opacity-[0.03] blur-[140px]" />
      <div className="pointer-events-none absolute -bottom-36 -left-36 h-[500px] w-[500px] rounded-full bg-brand opacity-[0.03] blur-[140px]" />

      <div className="relative z-10 w-full max-w-md rounded-base border border-border/30 bg-neutral-primary-soft p-8 text-center shadow-xl sm:p-12 transition-all duration-300">
        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-border/30 bg-neutral-primary-soft text-brand shadow-sm animate-pulseGlow transition-all duration-200">
          <Shield className="h-7 w-7" />
        </div>
        <h1 className="mb-2 font-heading text-3xl font-bold tracking-tight text-heading">
          Rose<span className="text-brand">Net</span> Admin
        </h1>
        <p className="mb-10 text-sm text-body-subtle">
          Enter password to access control panel
        </p>

        <form onSubmit={submit} className="space-y-6 text-left">
          <Field label="Security Password" htmlFor="password">
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              autoComplete="current-password"
              required
            />
          </Field>
          <Button type="submit" className="w-full mt-2" disabled={loading}>
            {loading ? 'Authenticating…' : 'Authenticate'}
          </Button>
          {error && <p className="text-sm text-danger text-center mt-4 font-semibold">{error}</p>}
        </form>
      </div>
    </div>
  )
}
