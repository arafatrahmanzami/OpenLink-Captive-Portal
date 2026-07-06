import { useEffect, useState } from 'react'
import { MapPin } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { useCurrency } from '../lib/currency.js'
import { Card, CardTitle } from '../components/ui.jsx'
import { zoneLabel, voucherStatus } from '../lib/format.js'

export default function Zones({ onUnauthorized, search = '' }) {
  const { currency } = useCurrency()
  const [vouchers, setVouchers] = useState([])
  const [error, setError] = useState('')

  const load = async () => {
    try {
      const res = await api.vouchers()
      if (res.status === 401) return onUnauthorized()
      const data = await asJson(res, 'Failed to load zones')
      setVouchers(data || [])
    } catch (err) {
      setError(err.message)
    }
  }

  // Active counts drift as sessions expire; refresh periodically.
  useEffect(() => {
    load()
    const reload = setInterval(load, 30000)
    return () => clearInterval(reload)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // A device only belongs to a zone once it has redeemed (and so has an IP).
  const zoneMap = new Map()
  for (const v of vouchers) {
    if (!v.is_used || !v.user_ip) continue
    const label = zoneLabel(v.user_ip)
    const z = zoneMap.get(label) || { label, users: 0, active: 0, revenue: 0 }
    z.users += 1
    if (voucherStatus(v) === 'active') z.active += 1
    z.revenue += v.price || 0
    zoneMap.set(label, z)
  }

  const money = (n) =>
    `${currency}${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  const query = search.trim().toLowerCase()
  const zones = [...zoneMap.values()]
    .filter((z) => !query || z.label.toLowerCase().includes(query))
    .sort((a, b) => b.active - a.active || b.users - a.users)

  return (
    <div className="animate-fadeIn animate-stagger-1">
      <Card className="p-0 sm:p-0 overflow-hidden">
        <div className="flex flex-wrap items-center justify-between gap-4 p-5 sm:p-6 border-b-2 border-default">
          <CardTitle icon={MapPin} className="mb-0">
            Hotspot Zones
          </CardTitle>
          <span className="rounded-none border-2 border-default bg-brand px-3 py-1 text-sm font-bold text-black shadow-xs">
            {zones.length} {zones.length === 1 ? 'zone' : 'zones'}
          </span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[560px] text-left text-sm text-body">
            <thead>
              <tr className="border-b-2 border-default bg-neutral-secondary-soft text-body">
                {['Zone (Subnet)', 'Active Now', 'Total Users', 'Revenue'].map((h) => (
                  <th key={h} className="px-6 py-3.5 font-bold select-none text-heading" scope="col">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {zones.length === 0 && (
                <tr>
                  <td colSpan={4} className="px-6 py-8 text-center text-body-subtle bg-neutral-primary">
                    {error || 'No zone activity yet.'}
                  </td>
                </tr>
              )}
              {zones.map((z, index) => {
                const isLast = index === zones.length - 1
                return (
                  <tr
                    key={z.label}
                    className={`bg-neutral-primary transition hover:bg-neutral-secondary-soft ${
                      isLast ? '' : 'border-b-2 border-default'
                    }`}
                  >
                    <th scope="row" className="px-6 py-4 font-bold text-heading whitespace-nowrap text-left">
                      {z.label}
                    </th>
                    <td className="px-6 py-4">
                      <span className="font-bold text-fg-success">{z.active}</span>
                    </td>
                    <td className="px-6 py-4 font-mono font-semibold">{z.users}</td>
                    <td className="px-6 py-4 text-fg-brand-strong font-black whitespace-nowrap">
                      {money(z.revenue)}
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
