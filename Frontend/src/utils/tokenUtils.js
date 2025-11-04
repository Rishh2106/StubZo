export function getTokenPayload(token) {
  try {
    const base64Url = token.split('.')[1]
    if (!base64Url) return null
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/')
    const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
      return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)
    }).join(''))
    return JSON.parse(jsonPayload)
  } catch (_e) {
    return null
  }
}

export function redirectToRoleDashboard(role) {
  switch (role) {
    case 'ADMIN':
      window.location.href = '/admin'
      break
    case 'EMPLOYEE':
      window.location.href = '/employee'
      break
    case 'WORKER':
      window.location.href = '/worker'
      break
    case 'RESIDENT':
      window.location.href = '/resident'
      break
    case 'PSEUDO_ADMIN':
      window.location.href = '/pseudo-admin'
      break
    default:
      window.location.href = '/login'
  }
}


