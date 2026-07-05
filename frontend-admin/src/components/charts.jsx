import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'
import { Bar, Doughnut, Radar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  RadialLinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
  Filler,
)

ChartJS.defaults.font.family = '"Nunito Sans", sans-serif'
ChartJS.defaults.font.size = 11

const getVar = (name) => {
  if (typeof window === 'undefined') return ''
  return window.getComputedStyle(document.documentElement).getPropertyValue(name).trim()
}

// Shared dynamic palette reflecting the neumorphic CSS variables.
export const C = {
  get brand() { return getVar('--brand') || '#C83C56' },
  get success() { return getVar('--success') || '#1E7854' },
  get danger() { return getVar('--danger') || '#C83C56' },
  get body() { return getVar('--body') || '#5C4E50' },
  get neutralPrimary() { return getVar('--neutral-primary-soft') || '#F5EFEF' },
  get heading() { return getVar('--heading') || '#3D2E30' },
}

const getGridColor = () => {
  if (typeof window === 'undefined') return 'rgba(0,0,0,0.05)'
  const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches
  return isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(61, 46, 48, 0.06)'
}

export function SalesBarChart({ labels, data }) {
  const brandColor = C.brand
  const bodyColor = C.body
  const gridColor = getGridColor()

  return (
    <Bar
      data={{
        labels,
        datasets: [
          {
            label: 'Voucher Sales',
            data,
            backgroundColor: brandColor + '25',
            borderColor: brandColor,
            borderWidth: 1.5,
            borderRadius: 4,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: gridColor },
            ticks: { color: bodyColor },
          },
          x: { grid: { display: false }, ticks: { color: bodyColor } },
        },
      }}
    />
  )
}

export function StatusDoughnutChart({ active, expired, unused }) {
  const successColor = C.success
  const dangerColor = C.danger
  const brandColor = C.brand
  const bodyColor = C.body

  return (
    <Doughnut
      data={{
        labels: ['Active', 'Expired', 'Unused'],
        datasets: [
          {
            data: [active, expired, unused],
            backgroundColor: [successColor, dangerColor, brandColor],
            borderWidth: 0,
            hoverOffset: 12,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        cutout: '75%',
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: bodyColor, usePointStyle: true, padding: 16 },
          },
        },
      }}
    />
  )
}

export function TrafficRadarChart({ labels, data }) {
  const brandColor = C.brand
  const bodyColor = C.body
  const neutralPrimary = C.neutralPrimary
  const headingColor = C.heading
  const gridColor = getGridColor()

  return (
    <Radar
      data={{
        labels,
        datasets: [
          {
            label: 'Traffic',
            data,
            backgroundColor: brandColor + '15',
            borderColor: brandColor,
            pointBackgroundColor: brandColor,
            pointBorderColor: neutralPrimary,
            pointHoverBackgroundColor: headingColor,
            borderWidth: 1.5,
          },
        ],
      }}
      options={{
        responsive: true,
        maintainAspectRatio: false,
        plugins: { legend: { display: false } },
        scales: {
          r: {
            angleLines: { color: gridColor },
            grid: { color: gridColor },
            pointLabels: { color: bodyColor, font: { size: 10 } },
            ticks: { display: false },
          },
        },
      }}
    />
  )
}
