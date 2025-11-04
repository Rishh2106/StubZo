import { useState } from 'react'
import { signIn } from '../services/authService'
import { redirectToRoleDashboard, getTokenPayload } from '../utils/tokenUtils'

function SignIn() {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!validate()) {
      return
    }

    setLoading(true)
    try {
      const response = await signIn(formData)
      
      if (response.success && response.token) {
        // Store token
        localStorage.setItem('token', response.token)
        
        // Get user role from token and redirect accordingly
        const payload = getTokenPayload(response.token)
        if (payload && payload.role) {
          redirectToRoleDashboard(payload.role)
        } else {
          // Fallback to login if role not found
          setErrors({ submit: 'Unable to determine user role. Please try again.' })
          localStorage.removeItem('token')
        }
      } else {
        setErrors({ submit: response.message || 'Invalid email or password' })
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signin-form">
      <div className="form-group">
        <label htmlFor="email">Email *</label>
        <input
          type="email"
          id="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          placeholder="Enter your email address"
          className={errors.email ? 'error' : ''}
        />
        {errors.email && <span className="error-message">{errors.email}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="password">Password *</label>
        <input
          type="password"
          id="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Enter your password"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  )
}

export default SignIn

