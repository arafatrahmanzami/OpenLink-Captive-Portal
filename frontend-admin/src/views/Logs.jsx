import { useEffect, useState } from 'react'
import { FileText } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { Card, CardTitle, StatusChip } from '../components/ui.jsx'
import { formatDateTime, formatDuration, voucherStatus } from '../lib/format.js'

export default function Logs({ onUnauthorized, search = '' }) {
  const [vouchers, setVouchers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.vouchers()
        if (res.status === 401) return onUnauthorized()
        const data = await asJson(res, 'Failed to load logs')
        setVouchers(data || [])
      } catch (err) {
        setError(err.message)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const query = search.trim().toLowerCase()
  // Only redeemed vouchers count as user activity; newest first.
  const logs = vouchers
    .filter((v) => v.is_used && v.start_time)
    .filter(
      (v) =>
        !query ||
        (v.name || '').toLowerCase().includes(query) ||
        (v.code || '').toLowerCase().includes(query) ||
        (v.user_mac || '').toLowerCase().includes(query) ||
        (v.user_ip || '').toLowerCase().includes(query),
    )
    .sort((a, b) => new Date(b.start_time) - new Date(a.start_time))

  return (
    <div className="animate-fadeIn animate-stagger-1">
      <Card className="p-0 sm:p-0 overflow-hidden">
        <div className="p-5 sm:p-6">
          <CardTitle icon={FileText} className="mb-0">
            User Logs
          </CardTitle>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] text-left text-sm text-body">
            <thead>
              <tr className="border-b border-border-default bg-neutral-secondary-soft text-body">
                {['Voucher', 'Code', 'MAC', 'IP', 'Connected', 'Duration', 'Status'].map((h) => (
                  <th key={h} className="px-6 py-3 font-medium select-none" scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {logs.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-8 text-center text-body-subtle bg-neutral-primary">
                    {error || 'No user activity yet.'}
                  </td>
                </tr>
              )}
              {logs.map((v, index) => {
                const isLast = index === logs.length - 1
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
                    <td className="px-6 py-4 font-mono text-xs">{v.user_mac || '—'}</td>
                    <td className="px-6 py-4 font-mono text-xs">{v.user_ip || '—'}</td>
                    <td className="px-6 py-4 whitespace-nowrap">{formatDateTime(v.start_time)}</td>
                    <td className="px-6 py-4 font-mono">{formatDuration(v.duration)}</td>
                    <td className="px-6 py-4">
                      <StatusChip status={voucherStatus(v)} />
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
