import { Outlet } from 'react-router-dom'
import Sidebar from '../components/navigation/Sidebar'
import BottomNav from '../components/navigation/BottomNav'
import ToastContainer from '../components/feedback/ToastContainer'
import AddTransactionModal from '../features/transactions/AddTransactionModal'
import CreateCycleModal from '../features/budget/CreateCycleModal'

const AppLayout = () => {
  return (
    <div className="flex min-h-screen bg-bg-primary text-text-primary">
      <Sidebar />

      <main className="flex-1 flex flex-col min-w-0">
        <div className="flex-1 overflow-y-auto px-4 py-8 sm:px-8 lg:px-12 pb-28 lg:pb-8">
          <div className="max-w-5xl mx-auto w-full">
            <Outlet />
          </div>
        </div>
      </main>

      <BottomNav />

      {/* Global Modals */}
      <AddTransactionModal />
      <CreateCycleModal />

      {/* Global Toasts */}
      <ToastContainer />
    </div>
  )
}

export default AppLayout
