import { Navigate } from 'react-router-dom'
import { getTokenPayload } from '../../utils/tokenUtils'

function ProtectedRoute({ children, roles = [] }) {
  const token = localStorage.getItem('token')
  if (!token) return <Navigate to="/login" replace />

  const payload = getTokenPayload(token)
  if (!payload) return <Navigate to="/login" replace />

  if (roles.length > 0 && !roles.includes(payload.role)) {
    // Redirect based on role
    switch (payload.role) {
      case 'ADMIN':
        return <Navigate to="/admin" replace />
      case 'EMPLOYEE':
        return <Navigate to="/employee" replace />
      case 'WORKER':
        return <Navigate to="/worker" replace />
      case 'RESIDENT':
        return <Navigate to="/resident" replace />
      case 'PSEUDO_ADMIN':
        return <Navigate to="/pseudo-admin" replace />
      default:
        return <Navigate to="/login" replace />
    }
  }

  return children
}

export default ProtectedRoute


