import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function ResidentPanel() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/resident', label: 'Overview' },
          { to: '/resident/room', label: 'My Room' },
          { to: '/resident/requests', label: 'Service Requests' },
        ]} />
        <main className="content">
          <h2 className="page-title">Resident Dashboard</h2>
          <div className="cards">
            <div className="card">Room Details</div>
            <div className="card">Raise Request</div>
            <div className="card">Track Requests</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default ResidentPanel


