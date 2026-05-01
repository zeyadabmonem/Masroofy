import { ShieldCheck, Calendar, Wallet, RefreshCcw } from 'lucide-react'
import Card from '../components/ui/Card'
import Input from '../components/ui/Input'
import Button from '../components/ui/Button'
import Badge from '../components/ui/Badge'

const BudgetPage = () => {
  return (
    <div className="space-y-8 animate-fade-in max-w-2xl mx-auto">
      <header className="text-center space-y-2">
        <h2 className="text-3xl font-bold">Budget Settings</h2>
        <p className="text-text-secondary">Configure your allowance and cycle dates.</p>
      </header>

      {/* Active Cycle Status */}
      <Card className="bg-accent/5 border-accent/20 flex items-center justify-between p-4">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-accent rounded-xl text-white">
            <ShieldCheck size={24} />
          </div>
          <div>
            <p className="font-bold">Active Cycle</p>
            <p className="text-xs text-text-secondary">May 01 - May 31, 2024</p>
          </div>
        </div>
        <Badge variant="primary">Active</Badge>
      </Card>

      {/* Settings Form (Static) */}
      <section className="space-y-6">
        <Card className="space-y-6">
          <div className="space-y-4">
            <h3 className="text-lg font-bold flex items-center gap-2">
              <Wallet size={20} className="text-accent" />
              Allowance Configuration
            </h3>
            <Input 
              label="Total Monthly Allowance" 
              placeholder="e.g. 5000" 
              type="number"
              defaultValue={5000}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Input 
              label="Start Date" 
              type="date"
              defaultValue="2024-05-01"
              icon={Calendar}
            />
            <Input 
              label="End Date" 
              type="date"
              defaultValue="2024-05-31"
              icon={Calendar}
            />
          </div>
        </Card>

        <Card className="border-danger/20 bg-danger/5 space-y-4">
          <h3 className="text-lg font-bold text-danger flex items-center gap-2">
            <RefreshCcw size={20} />
            Danger Zone
          </h3>
          <p className="text-sm text-text-secondary">
            Resetting your cycle will archive current data and start fresh. This action cannot be undone.
          </p>
          <Button variant="danger" className="w-full sm:w-auto">
            Reset Budget Cycle
          </Button>
        </Card>

        <div className="flex justify-end gap-3 pt-4">
          <Button variant="ghost">Cancel</Button>
          <Button>Save Changes</Button>
        </div>
      </section>
    </div>
  )
}

export default BudgetPage
