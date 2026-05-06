import { useState } from 'react'
import { useBudget } from '../../hooks/useBudget'
import { useUIStore } from '../../store/useUIStore'
import Modal from '../../components/ui/Modal'
import Button from '../../components/ui/Button'
import Input from '../../components/ui/Input'

const CreateCycleModal = () => {
  const { modal, closeModal } = useUIStore()
  const { createCycle } = useBudget()

  const [form, setForm] = useState({
    total_allowance: '',
    start_date: new Date().toISOString().split('T')[0],
    end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
  })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const errs = {}
    if (!form.total_allowance || parseFloat(form.total_allowance) <= 0) {
      errs.total_allowance = 'Please enter a valid allowance greater than 0.'
    }
    if (!form.start_date) errs.start_date = 'Start date is required.'
    if (!form.end_date) errs.end_date = 'End date is required.'
    if (form.start_date && form.end_date && form.end_date < form.start_date) {
      errs.end_date = 'End date must be after start date.'
    }
    setErrors(errs)
    return Object.keys(errs).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    setLoading(true)
    const payload = {
      total_allowance: parseFloat(form.total_allowance),
      start_date: form.start_date,
      end_date: form.end_date,
    }
    const success = await createCycle(payload)
    if (success) {
      closeModal()
      setForm({
        total_allowance: '',
        start_date: new Date().toISOString().split('T')[0],
        end_date: new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0],
      })
    }
    setLoading(false)
  }

  return (
    <Modal
      isOpen={modal.isOpen && modal.type === 'CREATE_CYCLE'}
      onClose={closeModal}
      title="Create New Budget Cycle"
      footer={
        <>
          <Button variant="ghost" onClick={closeModal} disabled={loading}>Cancel</Button>
          <Button onClick={handleSubmit} loading={loading}>
            Create Cycle
          </Button>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <Input
          label="Total Allowance (EGP)"
          type="number"
          step="0.01"
          placeholder="0.00"
          value={form.total_allowance}
          onChange={(e) => setForm({ ...form, total_allowance: e.target.value })}
          error={errors.total_allowance}
        />

        <div className="grid grid-cols-2 gap-4">
          <Input
            label="Start Date"
            type="date"
            value={form.start_date}
            onChange={(e) => setForm({ ...form, start_date: e.target.value })}
            error={errors.start_date}
          />
          <Input
            label="End Date"
            type="date"
            value={form.end_date}
            onChange={(e) => setForm({ ...form, end_date: e.target.value })}
            error={errors.end_date}
          />
        </div>
      </form>
    </Modal>
  )
}

export default CreateCycleModal
