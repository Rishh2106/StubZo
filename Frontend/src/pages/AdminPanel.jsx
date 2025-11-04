import { useNavigate } from 'react-router-dom'
import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function AdminPanel() {
  const navigate = useNavigate()

  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/admin', label: 'Overview' },
          { to: '/admin/buildings', label: 'Buildings' },
          { to: '/admin/rooms', label: 'Rooms' },
          { to: '/admin/services', label: 'Services' },
          { to: '/admin/users', label: 'Users' },
        ]} />
        <main className="content">
          <h2 className="page-title">Admin Dashboard</h2>
          <div className="cards">
            <div className="card" onClick={() => navigate('/admin/buildings')} style={{ cursor: 'pointer' }}>
              <h3>Manage Buildings</h3>
              <p>Add, edit, and remove buildings</p>
            </div>
            <div className="card" onClick={() => navigate('/admin/rooms')} style={{ cursor: 'pointer' }}>
              <h3>Manage Rooms</h3>
              <p>Add, edit, and remove rooms</p>
            </div>
            <div className="card" onClick={() => navigate('/admin/services')} style={{ cursor: 'pointer' }}>
              <h3>Manage Services</h3>
              <p>Add, edit, and remove services</p>
            </div>
            <div className="card" onClick={() => navigate('/admin/users')} style={{ cursor: 'pointer' }}>
              <h3>Manage Users</h3>
              <p>Add, edit, and remove users</p>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default AdminPanel


