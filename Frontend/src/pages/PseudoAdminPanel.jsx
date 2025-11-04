import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function PseudoAdminPanel() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/pseudo-admin', label: 'Overview' },
          { to: '/admin', label: 'Admin View' },
        ]} />
        <main className="content">
          <h2 className="page-title">Pseudo Admin Dashboard</h2>
          <div className="cards">
            <div className="card">Permissions</div>
            <div className="card">Active Period</div>
            <div className="card">History</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default PseudoAdminPanel


