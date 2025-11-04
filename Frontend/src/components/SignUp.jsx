import { useState } from 'react'
import { signUp } from '../services/authService'

function SignUp({ onSuccess }) {
  const [formData, setFormData] = useState({
    fullName: '',
    dateOfBirth: '',
    age: '',
    password: '',
    occupation: '',
    localAddress: '',
    mobileNumber: '',
    email: ''
  })

  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const calculateAge = (dob) => {
    if (!dob) return ''
    const today = new Date()
    const birthDate = new Date(dob)
    let age = today.getFullYear() - birthDate.getFullYear()
    const monthDiff = today.getMonth() - birthDate.getMonth()
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--
    }
    return age.toString()
  }

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))

    // Auto-calculate age when DOB changes
    if (name === 'dateOfBirth') {
      const age = calculateAge(value)
      setFormData(prev => ({
        ...prev,
        age: age
      }))
    }

    // Clear error for this field
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }))
    }
  }

  const validate = () => {
    const newErrors = {}

    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required'
    }

    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required'
    } else {
      const dob = new Date(formData.dateOfBirth)
      const today = new Date()
      if (dob >= today) {
        newErrors.dateOfBirth = 'Date of birth must be in the past'
      }
    }

    if (!formData.age || parseInt(formData.age) < 18) {
      newErrors.age = 'Age must be 18 or older'
    }

    if (!formData.localAddress.trim()) {
      newErrors.localAddress = 'Local address is required'
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required'
    } else if (!/^[0-9]{10}$/.test(formData.mobileNumber.replace(/[\s-]/g, ''))) {
      newErrors.mobileNumber = 'Please enter a valid 10-digit mobile number'
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required'
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address'
    }

    if (!formData.occupation) {
      newErrors.occupation = 'Please select your occupation'
    }

    if (!formData.password || formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters'
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
      // Map formData to match backend SignupRequest format
      const signupData = {
        name: formData.fullName,
        email: formData.email,
        password: formData.password,
        aadharNumber: formData.aadharNumber || '',
        occupation: formData.occupation,
        localAddress: formData.localAddress,
        dateOfBirth: formData.dateOfBirth,
        age: parseInt(formData.age),
        mobileNumber: formData.mobileNumber
      }

      // Submit signup data (OTP is already sent by backend)
      const response = await signUp(signupData)
      
      if (response.success) {
        // If OTP is returned (dev mode), show alert
        if (response.devOtp) {
          alert(`Development Mode: Your OTP is ${response.devOtp}. Use this to verify your email.`)
        }
        onSuccess(formData.email)
      } else {
        setErrors({ submit: response.message || 'Sign up failed. Please try again.' })
      }
    } catch (error) {
      setErrors({ submit: error.message || 'An error occurred. Please try again.' })
    } finally {
      setLoading(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="signup-form">
      <div className="form-group">
        <label htmlFor="fullName">Full Name *</label>
        <input
          type="text"
          id="fullName"
          name="fullName"
          value={formData.fullName}
          onChange={handleChange}
          placeholder="Enter your full name"
          className={errors.fullName ? 'error' : ''}
        />
        {errors.fullName && <span className="error-message">{errors.fullName}</span>}
      </div>

      <div className="form-row">
        <div className="form-group">
          <label htmlFor="dateOfBirth">Date of Birth *</label>
          <input
            type="date"
            id="dateOfBirth"
            name="dateOfBirth"
            value={formData.dateOfBirth}
            onChange={handleChange}
            max={new Date().toISOString().split('T')[0]}
            className={errors.dateOfBirth ? 'error' : ''}
          />
          {errors.dateOfBirth && <span className="error-message">{errors.dateOfBirth}</span>}
        </div>

        <div className="form-group">
          <label htmlFor="age">Age *</label>
          <input
            type="number"
            id="age"
            name="age"
            value={formData.age}
            onChange={handleChange}
            min="18"
            readOnly
            className={errors.age ? 'error' : ''}
          />
          {errors.age && <span className="error-message">{errors.age}</span>}
        </div>
      </div>

      <div className="form-group">
        <label htmlFor="localAddress">Local Address *</label>
        <textarea
          id="localAddress"
          name="localAddress"
          value={formData.localAddress}
          onChange={handleChange}
          placeholder="Enter your local address"
          rows="3"
          className={errors.localAddress ? 'error' : ''}
        />
        {errors.localAddress && <span className="error-message">{errors.localAddress}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="mobileNumber">Mobile Number *</label>
        <input
          type="tel"
          id="mobileNumber"
          name="mobileNumber"
          value={formData.mobileNumber}
          onChange={handleChange}
          placeholder="Enter your 10-digit mobile number"
          maxLength="10"
          className={errors.mobileNumber ? 'error' : ''}
        />
        {errors.mobileNumber && <span className="error-message">{errors.mobileNumber}</span>}
      </div>

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
          placeholder="Choose a password (min 6 characters)"
          className={errors.password ? 'error' : ''}
        />
        {errors.password && <span className="error-message">{errors.password}</span>}
      </div>

      <div className="form-group">
        <label htmlFor="occupation">Occupation *</label>
        <select
          id="occupation"
          name="occupation"
          value={formData.occupation}
          onChange={handleChange}
          className={errors.occupation ? 'error' : ''}
        >
          <option value="">Select your occupation</option>
          <option value="student">Student</option>
          <option value="working-professional">Working Professional</option>
          <option value="other">Other</option>
        </select>
        {errors.occupation && <span className="error-message">{errors.occupation}</span>}
      </div>

      {errors.submit && <div className="error-message submit-error">{errors.submit}</div>}

      <button type="submit" className="submit-button" disabled={loading}>
        {loading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  )
}

export default SignUp

