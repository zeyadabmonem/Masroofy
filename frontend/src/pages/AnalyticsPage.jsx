import { useEffect } from 'react'
import { PieChart, BarChart2, TrendingUp, Wallet } from 'lucide-react'
import Card from '../components/ui/Card'
import StatCard from '../components/ui/StatCard'
import EmptyState from '../components/feedback/EmptyState'
import SpendingPieChart from '../components/charts/SpendingPieChart'
import DailySpendingBar from '../components/charts/DailySpendingBar'
import { useAnalytics } from '../hooks/useAnalytics'
import { useBudgetStore } from '../store/useBudgetStore'
import { formatCurrency } from '../utils/currency'

const AnalyticsPage = () => {
  const { categoryBreakdown, dailySpending, fetchAll } = useAnalytics()
  const { activeCycle, summary } = useBudgetStore()

  useEffect(() => {
    if (activeCycle) fetchAll()
  }, [activeCycle])

  if (!activeCycle) {
    return (
      <EmptyState
        icon={BarChart2}
        title="No Budget Active"
        description="Create a budget cycle first to view your spending analytics."
      />
    )
  }

  const dailyAvg = summary.days_elapsed > 0 ? summary.total_spent / summary.days_elapsed : 0

  return (
    <div className="space-y-8 animate-fade-in">
      <header>
        <h2 className="text-3xl font-bold">Analytics</h2>
        <p className="text-text-secondary">Insights for your current cycle.</p>
      </header>

      {/* Summary row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Spent"     value={formatCurrency(summary.total_spent)}         icon={Wallet}    trendType="down"    />
        <StatCard label="Daily Average"   value={formatCurrency(dailyAvg)}                    icon={TrendingUp} trendType="neutral" />
        <StatCard label="Remaining"       value={formatCurrency(summary.remaining_balance)}   icon={Wallet}    trendType={summary.remaining_balance > 0 ? 'up' : 'down'} />
        <StatCard label="Safe Daily"      value={formatCurrency(summary.safe_daily_limit)}    icon={TrendingUp} trendType="neutral" />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <div className="flex items-center gap-2 mb-6">
            <PieChart size={20} className="text-accent" />
            <h3 className="text-lg font-bold">Spending by Category</h3>
          </div>
          <SpendingPieChart data={categoryBreakdown} />
        </Card>

        <Card>
          <div className="flex items-center gap-2 mb-6">
            <BarChart2 size={20} className="text-accent" />
            <h3 className="text-lg font-bold">Daily Spending (Last 30d)</h3>
          </div>
          <DailySpendingBar data={dailySpending} dailyLimit={summary.safe_daily_limit} />
          <p className="text-xs text-text-muted text-center mt-3">
            ── Yellow dashed line = your safe daily limit
          </p>
        </Card>
      </div>

      {/* Breakdown table */}
      {categoryBreakdown.length > 0 && (
        <Card>
          <h3 className="text-lg font-bold mb-4">Category Breakdown</h3>
          <div className="divide-y divide-border">
            {categoryBreakdown.map((item) => {
              const total = categoryBreakdown.reduce((s, d) => s + parseFloat(d.total), 0)
              const pct = total > 0 ? ((parseFloat(item.total) / total) * 100).toFixed(1) : 0
              return (
                <div key={item.category} className="flex items-center justify-between py-3">
                  <span className="text-text-secondary font-medium">{item.category}</span>
                  <div className="flex items-center gap-6">
                    <div className="w-28 bg-bg-elevated rounded-full h-1.5">
                      <div className="bg-accent h-1.5 rounded-full" style={{ width: `${pct}%` }} />
                    </div>
                    <span className="text-xs text-text-muted w-10 text-right">{pct}%</span>
                    <span className="font-mono font-bold text-text-primary w-32 text-right">{formatCurrency(item.total)}</span>
                  </div>
                </div>
              )
            })}
          </div>
        </Card>
      )}
    </div>
  )
}

export default AnalyticsPage
