import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine
} from 'recharts'
import { formatCurrency } from '../../utils/currency'

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null
  return (
    <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="text-xs text-text-muted mb-1">{label}</p>
      <p className="font-mono font-bold text-accent">{formatCurrency(payload[0].value)}</p>
    </div>
  )
}

const DailySpendingBar = ({ data = [], dailyLimit = 0 }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-sm">
        No daily spending data yet.
      </div>
    )
  }

  // Shorten dates to "May 1" format
  const chartData = data.map((d) => ({
    ...d,
    label: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    total: parseFloat(d.total),
  }))

  return (
    <ResponsiveContainer width="100%" height={240}>
      <BarChart data={chartData} barCategoryGap="35%">
        <CartesianGrid strokeDasharray="3 3" stroke="#1F2937" vertical={false} />
        <XAxis
          dataKey="label"
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
        />
        <YAxis
          tick={{ fill: '#6B7280', fontSize: 11 }}
          axisLine={false}
          tickLine={false}
          tickFormatter={(v) => `${v}`}
          width={45}
        />
        <Tooltip content={<CustomTooltip />} cursor={{ fill: '#1C2333' }} />
        {/* Daily limit reference line */}
        {dailyLimit > 0 && (
          <ReferenceLine
            y={dailyLimit}
            stroke="#F59E0B"
            strokeDasharray="4 4"
            strokeWidth={2}
            label={{ value: 'Limit', fill: '#F59E0B', fontSize: 11, position: 'right' }}
          />
        )}
        <Bar
          dataKey="total"
          fill="#3B82F6"
          radius={[6, 6, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

export default DailySpendingBar
