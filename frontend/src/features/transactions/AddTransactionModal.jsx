import { useState } from 'react'
import { useTransactions } from '../../hooks/useTransactions'
import { useUIStore } from '../../store/useUIStore'
import Modal from '../ui/Modal'
import Button from '../ui/Button'
import Input from '../ui/Input'

const CATEGORIES = [
  { value: 'FOOD', label: '🍔 Food & Dining' },
  { value: 'TRANSPORT', label: '🚗 Transportation' },
  { value: 'SHOPPING', label: '🛍️ Shopping' },
  { value: 'BILLS', label: '📄 Bills & Utilities' },
  { value: 'ENTERTAINMENT', label: '🎮 Entertainment' },
  { value: 'EDUCATION', label: '📚 Education' },
  { value: 'OTHER', label: '📦 Other' },
]

const AddTransactionModal = () => {
  const { modal, closeModal } = useUIStore()
  const { logExpense, editTransaction } = useTransactions()

  const isEdit = modal.type === 'EDIT_TRANSACTION'
  const existing = modal.data

  const [form, setForm] = useState({
    amount: existing?.amount || '',
    category: existing?.category || 'FOOD',
    note: existing?.note || '',
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.amount || parseFloat(form.amount) <= 0) {
      errs.amount = 'Please enter a valid amount greater than 0.'
    }
    if (!form.category) errs.category = 'Category is required.'
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = { ...form, amount: parseFloat(form.amount) }
    if (isEdit) {
      await editTransaction(existing.id, payload)
    } else {
      await logExpense(payload)
    }
    setLoading(false)
  }

  return (
    <Modal
      isOpen={modal.isOpen && (modal.type === 'ADD_TRANSACTION' || isEdit)}
      onClose={closeModal}
      title={isEdit ? 'Edit Expense' : 'Log New Expense'}
      footer={
        <>
          <Button variant="ghost" onClick={closeModal} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>
            {isEdit ? 'Save Changes' : 'Log Expense'}
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Amount (EGP)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.amount}
          onChange={(e) => setForm({ ...form, amount: e.target.value })}
          error={errors.amount}
        />

        <div className="space-y-2">
          <label className="text-sm font-medium text-text-secondary px-1">Category</label>
          <div className="grid grid-cols-2 gap-2">
            {CATEGORIES.map(({ value, label }) => (
              <button
                key={value}
                type="button"
                onClick={() => setForm({ ...form, category: value })}
                className={`px-3 py-2.5 rounded-xl text-sm font-medium text-left transition-all border ${
                  form.category === value
                    ? 'bg-accent/10 border-accent text-accent'
                    : 'bg-bg-elevated border-border text-text-secondary hover:border-text-muted'
                }`}
              >
                {label}
              </button>
            ))}
          </div>
          {errors.category && <p className="text-xs text-danger px-1">{errors.category}</p>}
        </div>

        <Input
          label="Note (optional)"
          placeholder="What was this for?"
          value={form.note}
          onChange={(e) => setForm({ ...form, note: e.target.value })}
        />
      </form>
    </Modal>
  )
}

export default AddTransactionModal
