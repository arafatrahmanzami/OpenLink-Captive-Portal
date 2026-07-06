import { useEffect, useState } from 'react'
import { BarChart2, DollarSign, ShoppingCart, Wallet } from 'lucide-react'
import { api, asJson } from '../lib/api.js'
import { useCurrency } from '../lib/currency.js'
import { Card, CardTitle } from '../components/ui.jsx'
import { SalesBarChart } from '../components/charts.jsx'

function StatCard({ title, value, icon: Icon, variant = 'brand' }) {
  const accentClasses = {
    brand: 'bg-brand text-black',
    purple: 'bg-purple text-white',
    success: 'bg-success text-white',
  }
  return (
    <Card className="h-full relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div>
          <div className="mb-2 text-[12px] font-bold uppercase tracking-wider text-body-subtle">
            {title}
          </div>
          <div className="text-3xl font-black tracking-tight text-heading font-heading">
            {value}
          </div>
        </div>
        <div className={`flex items-center justify-center rounded-none border-2 border-default p-3 shadow-xs ${accentClasses[variant] || accentClasses.brand}`}>
          <Icon className="h-5 w-5" />
        </div>
      </div>
    </Card>
  )
}

export default function Reports({ onUnauthorized }) {
  const { currency } = useCurrency()
  const [vouchers, setVouchers] = useState([])
  const [error, setError] = useState('')

  useEffect(() => {
    ;(async () => {
      try {
        const res = await api.vouchers()
        if (res.status === 401) return onUnauthorized()
        const data = await asJson(res, 'Failed to load reports')
        setVouchers(data || [])
      } catch (err) {
        setError(err.message)
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const money = (n) =>
    `${currency}${(n || 0).toLocaleString(undefined, { maximumFractionDigits: 2 })}`

  const totalRevenue = vouchers.reduce((s, v) => s + (v.price || 0), 0)
  const redeemed = vouchers.filter((v) => v.is_used)
  const redeemedRevenue = redeemed.reduce((s, v) => s + (v.price || 0), 0)
  const sold = vouchers.length
  const avg = sold ? totalRevenue / sold : 0

  // Revenue by month (last 6 months) from created_at.
  const now = new Date()
  const labels = []
  const monthKeys = []
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    labels.push(d.toLocaleString([], { month: 'short' }))
    monthKeys.push(`${d.getFullYear()}-${d.getMonth()}`)
  }
  const monthData = monthKeys.map(() => 0)
  for (const v of vouchers) {
    if (!v.created_at) continue
    const d = new Date(v.created_at)
    const idx = monthKeys.indexOf(`${d.getFullYear()}-${d.getMonth()}`)
    if (idx !== -1) monthData[idx] += v.price || 0
  }

  // Revenue grouped by plan, highest earner first.
  const planMap = new Map()
  for (const v of vouchers) {
    const name = v.name || v.code || 'Unnamed'
    const p = planMap.get(name) || { name, count: 0, revenue: 0 }
    p.count += 1
    p.revenue += v.price || 0
    planMap.set(name, p)
  }
  const plans = [...planMap.values()].sort((a, b) => b.revenue - a.revenue)

  return (
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
      <div className="lg:col-span-3 animate-fadeIn animate-stagger-1">
        <StatCard title="Total Revenue" value={money(totalRevenue)} icon={DollarSign} variant="brand" />
      </div>
      <div className="lg:col-span-3 animate-fadeIn animate-stagger-2">
        <StatCard title="Redeemed Revenue" value={money(redeemedRevenue)} icon={Wallet} variant="success" />
      </div>
      <div className="lg:col-span-3 animate-fadeIn animate-stagger-3">
        <StatCard title="Vouchers Sold" value={sold} icon={ShoppingCart} variant="purple" />
      </div>
      <div className="lg:col-span-3 animate-fadeIn animate-stagger-4">
        <StatCard title="Average Sale" value={money(avg)} icon={BarChart2} variant="brand" />
      </div>

      <div className="lg:col-span-7 animate-fadeIn animate-stagger-5">
        <Card className="h-full">
          <CardTitle icon={BarChart2}>Revenue by Month</CardTitle>
          <div className="h-64 sm:h-80">
            <SalesBarChart labels={labels} data={monthData} />
          </div>
        </Card>
      </div>

      <div className="lg:col-span-5 animate-fadeIn animate-stagger-5">
        <Card className="h-full p-0 sm:p-0 overflow-hidden">
          <div className="p-5 sm:p-6 border-b-2 border-default">
            <CardTitle className="mb-0">Revenue by Plan</CardTitle>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[360px] text-left text-sm text-body">
              <thead>
                <tr className="border-b-2 border-default bg-neutral-secondary-soft text-body">
                  {['Plan', 'Sold', 'Revenue', 'Share'].map((h) => (
                    <th key={h} className="px-6 py-3.5 font-bold select-none text-heading" scope="col">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {plans.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-6 py-8 text-center text-body-subtle bg-neutral-primary">
                      {error || 'No sales data yet.'}
                    </td>
                  </tr>
                )}
                {plans.map((p, index) => {
                  const isLast = index === plans.length - 1
                  const share = totalRevenue ? Math.round((p.revenue / totalRevenue) * 100) : 0
                  return (
                    <tr
                      key={p.name}
                      className={`bg-neutral-primary transition hover:bg-neutral-secondary-soft ${
                        isLast ? '' : 'border-b-2 border-default'
                      }`}
                    >
                      <th scope="row" className="px-6 py-4 font-bold text-heading whitespace-nowrap text-left">
                        {p.name}
                      </th>
                      <td className="px-6 py-4 font-mono font-semibold">{p.count}</td>
                      <td className="px-6 py-4 text-fg-brand-strong font-black whitespace-nowrap">
                        {money(p.revenue)}
                      </td>
                      <td className="px-6 py-4 font-semibold">{share}%</td>
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
