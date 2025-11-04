import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function AdminPanel() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/admin', label: 'Overview' },
          { to: '/admin/buildings', label: 'Buildings' },
          { to: '/admin/rooms', label: 'Rooms' },
          { to: '/admin/services', label: 'Services' },
          { to: '/pseudo-admin', label: 'Pseudo Admins' },
        ]} />
        <main className="content">
          <h2 className="page-title">Admin Dashboard</h2>
          <div className="cards">
            <div className="card">Manage Buildings</div>
            <div className="card">Manage Rooms</div>
            <div className="card">Manage Services</div>
            <div className="card">Manage Users</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel


