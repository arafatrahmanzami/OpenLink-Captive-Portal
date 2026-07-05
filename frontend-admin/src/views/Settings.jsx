import { useEffect, useState } from 'react'
import { Sliders, KeyRound } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { useCurrency } from '../lib/currency.js'
import { Card, CardTitle, Button, Input, Select, Field } from '../components/ui.jsx'

const CURRENCIES = [
  { value: '$', label: 'USD — Dollar ($)' },
  { value: '€', label: 'EUR — Euro (€)' },
  { value: '£', label: 'GBP — Pound (£)' },
  { value: '₨', label: 'PKR — Rupee (₨)' },
  { value: '৳', label: 'BDT — Taka (৳)' },
  { value: '₹', label: 'INR — Rupee (₹)' },
  { value: '¥', label: 'JPY — Yen (¥)' },
  { value: '₦', label: 'NGN — Naira (₦)' },
  { value: 'R', label: 'ZAR — Rand (R)' },
]

const THEMES = [
  { value: 'default', label: 'RoseNet (Matrix Pink)' },
  { value: 'modern', label: 'QuickConnect (Clean Modern)' },
  { value: 'corporate', label: 'GlobalNet (ISP Corporate)' },
  { value: 'music', label: 'AsifNET (Retro Music)' },
]

function Message({ message }) {
  if (!message?.text) return null
  return (
    <div
      className={`mt-4 rounded-base border p-3.5 text-sm shadow-2xs ${
        message.ok
          ? 'border-border-success-subtle bg-success-soft text-fg-success-strong'
          : 'border-border-danger-subtle bg-danger-soft text-fg-danger-strong'
      }`}
    >
      {message.text}
    </div>
  )
}

export default function Settings({ onUnauthorized }) {
  const { currency, setCurrency } = useCurrency()
  const [symbol, setSymbol] = useState(currency)
  const [theme, setTheme] = useState('music')
  const [brand, setBrand] = useState('RoseNet')
  const [generalMsg, setGeneralMsg] = useState(null)

  const [pw, setPw] = useState({ old: '', next: '', confirm: '' })
  const [pwMsg, setPwMsg] = useState(null)

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.settings()
        if (res.status === 401) return onUnauthorized()
        const s = await asJson(res, 'Failed to load settings')
        if (s.currency_symbol) setSymbol(s.currency_symbol)
        if (s.active_theme) setTheme(s.active_theme)
        if (s.brand_name) setBrand(s.brand_name)
      } catch {
        /* keep defaults */
      }
    })()
  }, [onUnauthorized])

  const saveGeneral = async (e) => {
    e.preventDefault()
    setGeneralMsg(null)
    try {
      const res = await api.updateSettings({
        currency_symbol: symbol.trim(),
        active_theme: theme,
        brand_name: brand.trim() || 'RoseNet',
      })
      if (res.status === 401) return onUnauthorized()
      await asJson(res, 'Failed to update settings')
      setCurrency(symbol.trim())
      setGeneralMsg({ ok: true, text: 'Settings saved successfully!' })
    } catch (err) {
      setGeneralMsg({ ok: false, text: err.message })
    }
  }

  const changePassword = async (e) => {
    e.preventDefault()
    setPwMsg(null)
    if (pw.next !== pw.confirm) {
      setPwMsg({ ok: false, text: 'New passwords do not match.' })
      return
    }
    try {
      const res = await api.changePassword(pw.old, pw.next)
      if (res.status === 401) return onUnauthorized()
      await asJson(res, 'Failed to change password')
      setPw({ old: '', next: '', confirm: '' })
      setPwMsg({ ok: true, text: 'Password changed successfully!' })
    } catch (err) {
      setPwMsg({ ok: false, text: err.message })
    }
  }

  return (
    <div className="space-y-6">
      <div className="animate-fadeIn animate-stagger-1">
        <Card>
          <CardTitle icon={Sliders}>General Settings</CardTitle>
          <form onSubmit={saveGeneral} className="max-w-md space-y-6">
            <Field label="Brand Name">
              <Input
                value={brand}
                onChange={(e) => setBrand(e.target.value)}
                placeholder="RoseNet"
                maxLength={40}
                required
              />
            </Field>
            <Field label="Currency">
              <Select value={symbol} onChange={(e) => setSymbol(e.target.value)}>
                {!CURRENCIES.some((c) => c.value === symbol) && (
                  <option value={symbol}>{symbol} (custom)</option>
                )}
                {CURRENCIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Field label="Portal Theme">
              <Select value={theme} onChange={(e) => setTheme(e.target.value)}>
                {THEMES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </Select>
            </Field>
            <Button type="submit">Save Settings</Button>
            <Message message={generalMsg} />
          </form>
        </Card>
      </div>

      <div className="animate-fadeIn animate-stagger-2">
        <Card>
          <CardTitle icon={KeyRound}>Change Admin Password</CardTitle>
          <form onSubmit={changePassword} className="max-w-md space-y-6">
            <Field label="Current Password">
              <Input
                type="password"
                value={pw.old}
                onChange={(e) => setPw({ ...pw, old: e.target.value })}
                required
              />
            </Field>
            <Field label="New Password">
              <Input
                type="password"
                value={pw.next}
                onChange={(e) => setPw({ ...pw, next: e.target.value })}
                required
              />
            </Field>
            <Field label="Confirm New Password">
              <Input
                type="password"
                value={pw.confirm}
                onChange={(e) => setPw({ ...pw, confirm: e.target.value })}
                required
              />
            </Field>
            <Button type="submit">Change Password</Button>
            <Message message={pwMsg} />
          </form>
        </Card>
      </div>
    </div>
  )
}
