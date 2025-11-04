import Navbar from '../components/common/Navbar'
import Sidebar from '../components/common/Sidebar'
import './dashboard.css'

function EmployeePanel() {
  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/employee', label: 'Overview' },
          { to: '/employee/residents', label: 'Residents' },
          { to: '/employee/assignments', label: 'Room Assignments' },
        ]} />
        <main className="content">
          <h2 className="page-title">Employee Dashboard</h2>
          <div className="cards">
            <div className="card">Add Resident</div>
            <div className="card">Assign Rooms</div>
            <div className="card">View Availability</div>
          </div>
        </main>
      </div>
    </div>
  )
}

export default EmployeePanel


