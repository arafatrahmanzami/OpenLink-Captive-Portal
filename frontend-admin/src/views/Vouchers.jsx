import { useEffect, useState } from 'react'
import { Trash2, Plus } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { useCurrency } from '../lib/currency.js'
import { Card, CardTitle, Button, Input, Select, Field, StatusChip } from '../components/ui.jsx'
import { formatDuration, voucherStatus } from '../lib/format.js'

const UNIT_TO_MINUTES = { minutes: 1, days: 24 * 60, months: 30 * 24 * 60 }

const EMPTY_FORM = {
  name: '',
  duration: '',
  unit: 'days',
  price: '',
  code: '',
  reusable: false,
}

export default function Vouchers({ onUnauthorized, search = '' }) {
  const { currency } = useCurrency()
  const [vouchers, setVouchers] = useState([])
  const [form, setForm] = useState(EMPTY_FORM)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api.vouchers()
      if (res.status === 401) return onUnauthorized()
      const data = await asJson(res, 'Failed to load vouchers')
      setVouchers((data || []).sort((a, b) => b.id - a.id))
    } catch (err) {
      setError(err.message)
    }
  }

  useEffect(() => {
    load()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const set = (key) => (e) => {
    const value = e.target.type === 'checkbox' ? e.target.checked : e.target.value
    setForm((f) => ({ ...f, [key]: value }))
  }

  const submit = async (e) => {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    const duration = parseInt(form.duration, 10) || 0
    const payload = {
      name: form.name.trim(),
      duration: duration * (UNIT_TO_MINUTES[form.unit] || 1),
      price: parseFloat(form.price) || 0,
      is_reusable: form.reusable,
      ...(form.code.trim() && { code: form.code.trim() }),
    }
    try {
      const res = await api.addVoucher(payload)
      if (res.status === 401) return onUnauthorized()
      await asJson(res, 'Failed to add voucher')
      setForm(EMPTY_FORM)
      load()
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  const remove = async (id) => {
    if (!window.confirm('Are you sure you want to delete this voucher?')) return
    try {
      const res = await api.deleteVoucher(id)
      if (res.status === 401) return onUnauthorized()
      await asJson(res, 'Failed to delete voucher')
      setVouchers((vs) => vs.filter((v) => v.id !== id))
    } catch (err) {
      window.alert(err.message)
    }
  }

  const query = search.trim().toLowerCase()
  const filtered = query
    ? vouchers.filter(
        (v) =>
          (v.name || '').toLowerCase().includes(query) ||
          (v.code || '').toLowerCase().includes(query) ||
          (v.user_mac || '').toLowerCase().includes(query),
      )
    : vouchers

  return (
    <div className="space-y-6">
      <div className="animate-fadeIn animate-stagger-1">
        <Card>
          <CardTitle icon={Plus}>Add New Voucher</CardTitle>
          <form onSubmit={submit} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <Field label="Voucher Name (e.g., 1 Day Pass)">
                <Input
                  value={form.name}
                  onChange={set('name')}
                  placeholder="Voucher Name"
                  required
                />
              </Field>
              <Field label="Duration">
                <Input
                  type="number"
                  value={form.duration}
                  onChange={set('duration')}
                  placeholder="e.g., 1"
                  min="0"
                  required
                />
              </Field>
              <Field label="Unit">
                <Select value={form.unit} onChange={set('unit')}>
                  <option value="minutes">Minutes</option>
                  <option value="days">Days</option>
                  <option value="months">Months</option>
                </Select>
              </Field>
              <Field label={`Price (${currency})`}>
                <Input
                  type="number"
                  step="0.01"
                  value={form.price}
                  onChange={set('price')}
                  placeholder="e.g., 5.00"
                  min="0"
                  required
                />
              </Field>
              <Field label="Custom Code (optional)">
                <Input
                  value={form.code}
                  onChange={set('code')}
                  placeholder="Leave blank for random"
                />
              </Field>
            </div>
            <div className="flex flex-wrap items-center gap-6 pt-1">
              <Button type="submit" disabled={submitting} className="w-auto px-6">
                {submitting ? 'Adding…' : 'Add Voucher'}
              </Button>
              <label className="flex cursor-pointer select-none items-center gap-2 text-sm text-heading">
                <input
                  type="checkbox"
                  checked={form.reusable}
                  onChange={set('reusable')}
                />
                Reusable
              </label>
              {error && <span className="text-sm text-danger font-semibold">{error}</span>}
            </div>
          </form>
        </Card>
      </div>

      <div className="animate-fadeIn animate-stagger-2">
        <Card className="p-0 sm:p-0 overflow-hidden">
          <div className="p-5 sm:p-6">
            <CardTitle className="mb-0">Existing Vouchers</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-sm text-body">
              <thead>
                <tr className="border-b border-border bg-neutral-secondary-soft text-body">
                  {['Name', 'Code', 'Duration', 'Price', 'Status', 'Used By', 'Actions'].map(
                    (h) => (
                      <th key={h} className="px-6 py-3 font-medium select-none" scope="col">
                        {h}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-body-subtle bg-neutral-primary">
                      No vouchers found.
                    </td>
                  </tr>
                )}
                {filtered.map((v, index) => {
                  const isLast = index === filtered.length - 1
                  return (
                    <tr
                      key={v.id}
                      className={`bg-neutral-primary transition hover:bg-neutral-secondary-soft ${
                        isLast ? '' : 'border-b border-border-default'
                      }`}
                    >
                      <th scope="row" className="px-6 py-4 font-medium text-heading whitespace-nowrap text-left">
                        {v.name || 'N/A'}
                      </th>
                      <td className="px-6 py-4 text-fg-brand-strong font-semibold">{v.code}</td>
                      <td className="px-6 py-4 font-mono">{formatDuration(v.duration)}</td>
                      <td className="px-6 py-4 text-heading">
                        {currency}
                        {(v.price || 0).toFixed(2)}
                      </td>
                      <td className="px-6 py-4">
                        <StatusChip status={voucherStatus(v)} />
                      </td>
                      <td className="px-6 py-4 text-xs font-mono text-body">
                        {v.is_used ? v.user_mac || 'N/A' : '—'}
                      </td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => remove(v.id)}
                          className="flex h-8 w-8 items-center justify-center rounded-none border border-border-default bg-neutral-primary-soft text-body-subtle shadow-xs hover:bg-danger-soft hover:text-danger hover:border-danger-subtle hover:-translate-y-[0.5px] transition-all duration-200 focus:outline-none focus:ring-1 focus:ring-danger"
                          aria-label="Delete voucher"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  )
}
