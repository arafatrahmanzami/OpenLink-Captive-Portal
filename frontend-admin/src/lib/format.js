// Convert a duration in minutes to a human-friendly string.
export function formatDuration(minutes) {
  if (minutes < 60) return `${minutes} min`
  if (minutes < 1440) return `${(minutes / 60).toFixed(1)} hours`
  return `${(minutes / 1440).toFixed(1)} days`
}

// Determine a voucher's status: 'unused' | 'active' | 'expired'.
export function voucherStatus(voucher) {
  if (!voucher.is_used) return 'unused'
  const start = new Date(voucher.start_time).getTime()
  const expires = start + voucher.duration * 60000
  return Date.now() > expires ? 'expired' : 'active'
}

// Seconds left on a used, time-limited voucher session (0 if expired/unused).
export function remainingSeconds(voucher) {
  if (!voucher.is_used || !voucher.duration) return 0
  const expires = new Date(voucher.start_time).getTime() + voucher.duration * 60000
  return Math.max(0, Math.round((expires - Date.now()) / 1000))
}

// Human-friendly countdown, e.g. "2h 15m" or "45s".
export function formatRemaining(seconds) {
  if (seconds <= 0) return 'Expired'
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = seconds % 60
  if (h > 0) return `${h}h ${m}m`
  if (m > 0) return `${m}m ${s}s`
  return `${s}s`
}

// Format an ISO timestamp for the logs/sessions tables ('—' when absent).
export function formatDateTime(iso) {
  if (!iso) return '—'
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString([], {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}
