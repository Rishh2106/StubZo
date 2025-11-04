import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Login from '../pages/Login'
import Signup from '../pages/Signup'
import AdminPanel from '../pages/AdminPanel'
import BuildingsManagement from '../pages/admin/BuildingsManagement'
import RoomsManagement from '../pages/admin/RoomsManagement'
import ServicesManagement from '../pages/admin/ServicesManagement'
import UsersManagement from '../pages/admin/UsersManagement'
import EmployeePanel from '../pages/EmployeePanel'
import WorkerPanel from '../pages/WorkerPanel'
import ResidentPanel from '../pages/ResidentPanel'
import PseudoAdminPanel from '../pages/PseudoAdminPanel'
import ProtectedRoute from '../components/common/ProtectedRoute'

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/resident/signup" element={<Signup />} />

        <Route
          path="/admin"
          element={<ProtectedRoute roles={["ADMIN", "PSEUDO_ADMIN"]}><AdminPanel /></ProtectedRoute>}
        />
        <Route
          path="/admin/buildings"
          element={<ProtectedRoute roles={["ADMIN", "PSEUDO_ADMIN"]}><BuildingsManagement /></ProtectedRoute>}
        />
        <Route
          path="/admin/rooms"
          element={<ProtectedRoute roles={["ADMIN", "PSEUDO_ADMIN"]}><RoomsManagement /></ProtectedRoute>}
        />
        <Route
          path="/admin/services"
          element={<ProtectedRoute roles={["ADMIN", "PSEUDO_ADMIN"]}><ServicesManagement /></ProtectedRoute>}
        />
        <Route
          path="/admin/users"
          element={<ProtectedRoute roles={["ADMIN", "PSEUDO_ADMIN"]}><UsersManagement /></ProtectedRoute>}
        />
        <Route
          path="/employee"
          element={<ProtectedRoute roles={["EMPLOYEE", "ADMIN", "PSEUDO_ADMIN"]}><EmployeePanel /></ProtectedRoute>}
        />
        <Route
          path="/worker"
          element={<ProtectedRoute roles={["WORKER", "ADMIN", "PSEUDO_ADMIN"]}><WorkerPanel /></ProtectedRoute>}
        />
        <Route
          path="/resident"
          element={<ProtectedRoute roles={["RESIDENT", "ADMIN", "PSEUDO_ADMIN"]}><ResidentPanel /></ProtectedRoute>}
        />
        <Route
          path="/pseudo-admin"
          element={<ProtectedRoute roles={["PSEUDO_ADMIN", "ADMIN"]}><PseudoAdminPanel /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter


