import { useEffect, useState } from 'react'
import { Users } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { Card, CardTitle } from '../components/ui.jsx'
import { formatDateTime, formatRemaining, remainingSeconds, voucherStatus } from '../lib/format.js'

export default function Sessions({ onUnauthorized, search = '' }) {
  const [vouchers, setVouchers] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api.vouchers()
      if (res.status === 401) return onUnauthorized()
      const data = await asJson(res, 'Failed to load sessions')
      setVouchers(data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  // Refresh from the server periodically; a 1s tick keeps the countdown live.
  const [, setTick] = useState(0)
  useEffect(() => {
    load()
    const reload = setInterval(load, 30000)
    const tick = setInterval(() => setTick((t) => t + 1), 1000)
    return () => {
      clearInterval(reload)
      clearInterval(tick)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const query = search.trim().toLowerCase()
  const active = vouchers
    .filter((v) => voucherStatus(v) === 'active')
    .filter(
      (v) =>
        !query ||
        (v.name || '').toLowerCase().includes(query) ||
        (v.code || '').toLowerCase().includes(query) ||
        (v.user_mac || '').toLowerCase().includes(query) ||
        (v.user_ip || '').toLowerCase().includes(query),
    )
    .sort((a, b) => remainingSeconds(a) - remainingSeconds(b))

  return (
    <div className="animate-fadeIn animate-stagger-1">
      <Card className="p-0 sm:p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b-2 border-default">
          <CardTitle icon={Users} className="mb-0">
            Active Sessions
          </CardTitle>
          <span className="rounded-none border-2 border-default bg-brand px-3 py-1 text-sm font-bold text-black shadow-xs">
            {active.length} online
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] text-left text-sm text-body">
            <thead>
              <tr className="border-b-2 border-default bg-neutral-secondary-soft text-body">
                {['Voucher', 'Code', 'MAC', 'IP', 'Started', 'Time Left'].map((h) => (
                  <th key={h} className="px-6 py-3.5 font-bold select-none text-heading" scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {active.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-8 text-center text-body-subtle bg-neutral-primary">
                    {error || 'No active sessions.'}
                  </td>
                </tr>
              )}
              {active.map((v, index) => {
                const isLast = index === active.length - 1
                return (
                  <tr
                    key={v.id}
                    className={`bg-neutral-primary transition hover:bg-neutral-secondary-soft ${
                      isLast ? '' : 'border-b-2 border-default'
                    }`}
                  >
                    <th scope="row" className="px-6 py-4 font-bold text-heading whitespace-nowrap text-left">
                      {v.name || 'N/A'}
                    </th>
                    <td className="px-6 py-4 text-fg-brand-strong font-black">{v.code}</td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold">{v.user_mac || '—'}</td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold">{v.user_ip || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap font-semibold">{formatDateTime(v.start_time)}</td>
                    <td className="px-6 py-4 font-bold text-fg-success-strong whitespace-nowrap">
                      {formatRemaining(remainingSeconds(v))}
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  )
}
