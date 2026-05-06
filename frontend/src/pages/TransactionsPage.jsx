import { useEffect, useState } from 'react'
import { Search, Plus, Trash2, Pencil } from 'lucide-react'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'
import EmptyState from '../components/feedback/EmptyState'
import LoadingState from '../components/feedback/LoadingState'
import { useTransactions } from '../hooks/useTransactions'
import { useBudget } from '../hooks/useBudget'
import { useUIStore } from '../store/useUIStore'
import { Wallet } from 'lucide-react'
import { clsx } from 'clsx'

const CATEGORY_LABELS = {
  FOOD: '🍔 Food',
  TRANSPORT: '🚗 Transport',
  SHOPPING: '🛍️ Shopping',
  BILLS: '📄 Bills',
  ENTERTAINMENT: '🎮 Entertainment',
  EDUCATION: '📚 Education',
  OTHER: '📦 Other',
}

const groupByDate = (transactions) => {
  const groups = {}
  for (const tx of transactions) {
    const date = new Date(tx.created_at).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })
    if (!groups[date]) groups[date] = []
    groups[date].push(tx)
  }
  return groups
}

const TransactionsPage = () => {
  const { transactions, fetchTransactions, removeTransaction, applyFilters } = useTransactions()
  const { activeCycle } = useBudget()
  const { isLoading, openModal } = useUIStore()
  const [search, setSearch] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('ALL')

  useEffect(() => {
    fetchTransactions()
  }, [])

  if (!activeCycle && !isLoading) {
    return (
      <EmptyState
        icon={Wallet}
        title="No Active Budget"
        description="You need an active budget cycle to view or log transactions."
        action={<Button onClick={() => openModal('CREATE_CYCLE')}>Create Budget</Button>}
      />
    )
  }

  const handleSearchChange = (e) => {
    const val = e.target.value
    setSearch(val)
    applyFilters({ search: val, category: selectedCategory === 'ALL' ? undefined : selectedCategory })
  }

  const handleFilterChange = (cat) => {
    setSelectedCategory(cat)
    applyFilters({ search, category: cat === 'ALL' ? undefined : cat })
  }

  const grouped = groupByDate(transactions)

  return (
    <div className="space-y-8 animate-fade-in">
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold">Transaction History</h2>
          <p className="text-text-secondary">{transactions.length} expenses this cycle.</p>
        </div>
        <Button onClick={() => openModal('ADD_TRANSACTION')}>
          <Plus size={20} className="mr-2" />
          Log Expense
        </Button>
      </header>

      {/* Search & Filters */}
      <div className="flex flex-col gap-4">
        {/* Search Bar */}
        <div className="relative max-w-md">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted" size={18} />
          <input 
            className="w-full bg-bg-elevated border border-border rounded-xl py-3 pl-11 pr-4 text-sm focus:outline-none focus:border-accent transition-colors text-text-primary placeholder:text-text-muted"
            placeholder="Search expenses by note..." 
            value={search} 
            onChange={handleSearchChange} 
          />
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-hide">
          <button
            onClick={() => handleFilterChange('ALL')}
            className={clsx(
              "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
              selectedCategory === 'ALL' 
                ? "bg-text-primary text-bg-primary shadow-sm border-text-primary" 
                : "bg-bg-elevated text-text-secondary hover:bg-bg-secondary hover:text-text-primary border-border"
            )}
          >
            All Categories
          </button>
          {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
            <button
              key={key}
              onClick={() => handleFilterChange(key)}
              className={clsx(
                "px-4 py-2 rounded-xl text-sm font-medium whitespace-nowrap transition-all border",
                selectedCategory === key
                  ? "bg-accent/10 text-accent border-accent/20"
                  : "bg-bg-elevated text-text-secondary hover:bg-bg-secondary hover:text-text-primary border-border"
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingState message="Loading transactions..." />
      ) : transactions.length === 0 ? (
        <EmptyState
          icon={Search}
          title="No Transactions Found"
          description="Log your first expense to get started."
          action={<Button size="sm" onClick={() => openModal('ADD_TRANSACTION')}>Log Expense</Button>}
        />
      ) : (
        <div className="space-y-8">
          {Object.entries(grouped).map(([date, txs]) => (
            <section key={date} className="space-y-3">
              <h4 className="text-xs font-bold text-text-muted uppercase tracking-widest">{date}</h4>
              <div className="space-y-3">
                {txs.map((tx) => (
                  <Card key={tx.id} className="p-4 flex items-center justify-between group">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 bg-bg-elevated rounded-2xl flex items-center justify-center text-xl flex-shrink-0">
                        {CATEGORY_LABELS[tx.category]?.split(' ')[0]}
                      </div>
                      <div>
                        <p className="font-bold">{tx.note || CATEGORY_LABELS[tx.category]}</p>
                        <Badge variant="neutral">{CATEGORY_LABELS[tx.category]}</Badge>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-lg font-bold font-mono text-danger">
                        -{Number(tx.amount).toFixed(2)} EGP
                      </p>
                      <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => openModal('EDIT_TRANSACTION', tx)}
                          className="p-2 hover:bg-bg-elevated rounded-xl text-text-muted hover:text-accent transition-colors"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => removeTransaction(tx.id)}
                          className="p-2 hover:bg-danger/10 rounded-xl text-text-muted hover:text-danger transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            </section>
          ))}
        </div>
      )}
    </div>
  )
}

export default TransactionsPage
