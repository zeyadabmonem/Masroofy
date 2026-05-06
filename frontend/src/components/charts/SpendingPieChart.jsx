import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import { formatCurrency } from '../../utils/currency'

const CATEGORY_COLORS = {
  FOOD:          '#3B82F6',
  TRANSPORT:     '#8B5CF6',
  SHOPPING:      '#EC4899',
  BILLS:         '#F59E0B',
  ENTERTAINMENT: '#10B981',
  EDUCATION:     '#06B6D4',
  OTHER:         '#6B7280',
}

const CATEGORY_EMOJI = {
  FOOD: '🍔', TRANSPORT: '🚗', SHOPPING: '🛍️',
  BILLS: '📄', ENTERTAINMENT: '🎮', EDUCATION: '📚', OTHER: '📦',
}

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null
  const item = payload[0]
  return (
    <div className="bg-bg-elevated border border-border rounded-xl px-4 py-3 shadow-xl">
      <p className="font-bold text-text-primary">{CATEGORY_EMOJI[item.name]} {item.name}</p>
      <p className="text-accent font-mono font-bold">{formatCurrency(item.value)}</p>
      <p className="text-xs text-text-muted">{item.payload.percentage}% of total</p>
    </div>
  )
}

const SpendingPieChart = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex items-center justify-center h-48 text-text-muted text-sm">
        No spending data yet.
      </div>
    )
  }

  const total = data.reduce((sum, d) => sum + parseFloat(d.total), 0)
  const chartData = data.map((d) => ({
    ...d,
    name: d.category,
    value: parseFloat(d.total),
    percentage: total > 0 ? ((parseFloat(d.total) / total) * 100).toFixed(1) : 0,
  }))

  return (
    <div>
      <ResponsiveContainer width="100%" height={240}>
        <PieChart>
          <Pie
            data={chartData}
            cx="50%"
            cy="50%"
            innerRadius={70}
            outerRadius={110}
            paddingAngle={3}
            dataKey="value"
            stroke="none"
          >
            {chartData.map((entry) => (
              <Cell key={entry.category} fill={CATEGORY_COLORS[entry.category] || '#6B7280'} />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
        </PieChart>
      </ResponsiveContainer>
      {/* Legend */}
      <div className="space-y-2 mt-4">
        {data.map((item) => (
          <div key={item.category} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full flex-shrink-0" style={{ background: CATEGORY_COLORS[item.category] || '#6B7280' }} />
              <span className="text-sm text-text-secondary">{CATEGORY_EMOJI[item.category]} {item.category}</span>
            </div>
            <span className="text-sm font-mono font-bold text-text-primary">{formatCurrency(item.total)}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

export default SpendingPieChart
