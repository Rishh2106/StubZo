import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function WorkerPanel() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/worker', label: 'Overview' },
          { to: '/worker/requests', label: 'Requests' },
          { to: '/worker/history', label: 'History' },
        ]} />
        <main className="content">
          <h2 className="page-title">Worker Dashboard</h2>
          <div className="cards">
            <div className="card">Pending Requests</div>
            <div className="card">In Progress</div>
            <div className="card">Completed (48h)</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default WorkerPanel


