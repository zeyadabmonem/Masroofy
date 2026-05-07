import { useEffect } from 'react'
import { Wallet, TrendingUp, Calendar, AlertCircle, Plus, Banknote } from 'lucide-react'
import StatCard from '../components/ui/StatCard'
import ProgressBar from '../components/ui/ProgressBar'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import Card from '../components/ui/Card'
import EmptyState from '../components/feedback/EmptyState'
import LoadingState from '../components/feedback/LoadingState'
import { useBudget } from '../hooks/useBudget'
import { useTransactions } from '../hooks/useTransactions'
import { useUIStore } from '../store/useUIStore'
import { formatCurrency } from '../utils/currency'

const CATEGORY_LABELS = {
  FOOD: 'Food & Dining',
  TRANSPORT: 'Transportation',
  SHOPPING: 'Shopping',
  BILLS: 'Bills & Utilities',
  ENTERTAINMENT: 'Entertainment',
  EDUCATION: 'Education',
  OTHER: 'Other',
}

const DashboardPage = () => {
  const { activeCycle, summary, fetchActiveCycle } = useBudget()
  const { transactions, fetchTransactions } = useTransactions()
  const { isLoading, openModal } = useUIStore()

  useEffect(() => {
    fetchActiveCycle()
    fetchTransactions()
  }, [])

  const spendingVariant =
    summary.alert_level === 'EXHAUSTED' ? 'danger'
    : summary.alert_level === 'WARNING' ? 'warning'
    : 'success'

  const recentTransactions = [...transactions].slice(0, 5)

  if (isLoading && !activeCycle) return <LoadingState message="Loading your dashboard..." />

  if (!activeCycle) {
    return (
      <EmptyState
        icon={Wallet}
        title="No Active Budget"
        description="Create your first budget cycle to start tracking your spending."
        action={<Button onClick={() => openModal('CREATE_CYCLE')}>Create Budget</Button>}
      />
    )
  }

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Dashboard</h2>
          <p className="text-text-secondary">
            Cycle ends <span className="text-text-primary font-medium">{activeCycle.end_date}</span> · {summary.remaining_days} days left
          </p>
        </div>
        <Button onClick={() => openModal('ADD_TRANSACTION')}>
          <Plus size={20} className="mr-2" />
          Log Expense
        </Button>
      </header>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        <StatCard
          label="Remaining Balance"
          value={formatCurrency(summary.remaining_balance)}
          icon={Wallet}
          trend={`of ${formatCurrency(summary.total_allowance)}`}
          trendType={summary.remaining_balance > 0 ? 'up' : 'down'}
        />
        <StatCard
          label="Safe Daily Limit"
          value={formatCurrency(summary.safe_daily_limit)}
          icon={TrendingUp}
          trend="per day"
          trendType={summary.alert_level === 'NONE' ? 'neutral' : summary.alert_level === 'WARNING' ? 'down' : 'down'}
        />
        <StatCard
          label="Days Remaining"
          value={`${summary.remaining_days}d`}
          icon={Calendar}
          trend={`${summary.days_elapsed || 0} elapsed`}
          trendType="neutral"
        />
      </div>

      {/* Spending Progress */}
      <Card className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-lg font-bold">Spending Progress</h3>
          <span className="text-text-secondary text-sm font-mono">
            <span className="text-text-primary font-bold">{Number(summary.total_spent).toFixed(2)}</span> / {Number(summary.total_allowance).toFixed(2)} EGP
          </span>
        </div>
        <ProgressBar
          value={summary.spending_percentage}
          variant={spendingVariant}
        />
      </Card>

      {/* Alerts — driven by alert_level from the calculation engine */}
      {summary.alert_level === 'WARNING' && (
        <div className="bg-warning/10 border border-warning/20 p-4 rounded-2xl flex items-start gap-4 text-warning animate-scale-in">
          <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Warning: 80% Budget Used</p>
            <p className="text-sm opacity-90">You have used {Math.round(summary.spending_percentage)}% of your budget. Your new daily limit is {formatCurrency(summary.safe_daily_limit)}.</p>
          </div>
        </div>
      )}
      {summary.alert_level === 'EXHAUSTED' && (
        <div className="bg-danger/10 border border-danger/20 p-4 rounded-2xl flex items-start gap-4 text-danger animate-scale-in">
          <AlertCircle size={24} className="flex-shrink-0 mt-0.5" />
          <div>
            <p className="font-bold">Budget Exhausted</p>
            <p className="text-sm opacity-90">You have exceeded your {formatCurrency(summary.total_allowance)} allowance for this cycle.</p>
          </div>
        </div>
      )}

      {/* Recent Activity */}
      <section className="space-y-4">
        <div className="flex justify-between items-center">
          <h3 className="text-xl font-bold">Recent Activity</h3>
          <Button variant="ghost" size="sm" onClick={() => {}}>View All</Button>
        </div>

        {recentTransactions.length === 0 ? (
          <EmptyState
            icon={Banknote}
            title="No Expenses Yet"
            description="Start logging your expenses to see them here."
            action={<Button size="sm" onClick={() => openModal('ADD_TRANSACTION')}>Log First Expense</Button>}
          />
        ) : (
          <div className="space-y-3">
            {recentTransactions.map((tx) => (
              <Card key={tx.id} hover className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg-elevated rounded-2xl flex items-center justify-center text-text-muted">
                    <Wallet size={24} />
                  </div>

                  <div>
                    <p className="font-bold text-text-primary">{tx.note || CATEGORY_LABELS[tx.category]}</p>
                    <div className="flex items-center gap-2">
                      <Badge variant="neutral">{CATEGORY_LABELS[tx.category]}</Badge>
                      <span className="text-[11px] text-text-muted">{new Date(tx.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>
                <p className="text-lg font-bold font-mono text-danger">-{Number(tx.amount).toFixed(2)} EGP</p>
              </Card>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}

export default DashboardPage
