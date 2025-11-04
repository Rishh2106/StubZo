import { useState, useEffect, useRef } from 'react'
import { verifyOTP, resendOTP } from '../services/authService'

function OTPVerification({ email, onVerified, onBack }) {
  const [otp, setOtp] = useState(['', '', '', '', '', ''])
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)
  const [resendLoading, setResendLoading] = useState(false)
  const [timer, setTimer] = useState(60)
  const [canResend, setCanResend] = useState(false)
  const inputRefs = useRef([])

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => {
        setTimer(prev => prev - 1)
      }, 1000)
      return () => clearInterval(interval)
    } else {
      setCanResend(true)
    }
  }, [timer])

  const handleChange = (index, value) => {
    if (value.length > 1) return
    
    const newOtp = [...otp]
    newOtp[index] = value
    setOtp(newOtp)

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus()
    }

    // Clear errors
    if (errors.otp) {
      setErrors({})
    }
  }

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  const handlePaste = (e) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').trim()
    if (/^\d{6}$/.test(pastedData)) {
      const newOtp = pastedData.split('')
      setOtp(newOtp)
      inputRefs.current[5]?.focus()
    }
  }

  const handleVerify = async (e) => {
    e.preventDefault()
    const otpString = otp.join('')

    if (otpString.length !== 6) {
      setErrors({ otp: 'Please enter the complete 6-digit OTP' })
      return
    }

    setLoading(true)
    try {
      const response = await verifyOTP(email, otpString)
      
      if (response.success === true) {
        onVerified()
      } else {
        setErrors({ otp: response.message || 'Invalid OTP. Please try again.' })
        setOtp(['', '', '', '', '', ''])
        inputRefs.current[0]?.focus()
      }
    } catch (error) {
      setErrors({ otp: error.message || 'Verification failed. Please try again.' })
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } finally {
      setLoading(false)
    }
  }

  const handleResend = async () => {
    setResendLoading(true)
    try {
      const response = await resendOTP(email)
      // If OTP is returned (dev mode), show alert
      if (response.devOtp) {
        alert(`Development Mode: Your new OTP is ${response.devOtp}. Use this to verify your email.`)
      }
      setTimer(60)
      setCanResend(false)
      setErrors({})
      setOtp(['', '', '', '', '', ''])
      inputRefs.current[0]?.focus()
    } catch (error) {
      setErrors({ resend: error.message || 'Failed to resend OTP. Please try again.' })
    } finally {
      setResendLoading(false)
    }
  }

  return (
    <div className="otp-container">
      <div className="otp-card">
        <button className="back-button" onClick={onBack}>
          ← Back
        </button>
        
        <div className="otp-header">
          <h2>Verify Your Email</h2>
          <p>We've sent a 6-digit OTP to <strong>{email}</strong></p>
        </div>

        <form onSubmit={handleVerify} className="otp-form">
          <div className="otp-inputs">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={el => inputRefs.current[index] = el}
                type="text"
                inputMode="numeric"
                maxLength="1"
                value={digit}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={index === 0 ? handlePaste : undefined}
                className={`otp-input ${errors.otp ? 'error' : ''}`}
              />
            ))}
          </div>

          {errors.otp && <div className="error-message submit-error">{errors.otp}</div>}
          {errors.resend && <div className="error-message submit-error">{errors.resend}</div>}

          <button type="submit" className="submit-button" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>

        <div className="otp-footer">
          <p>Didn't receive the OTP?</p>
          {canResend ? (
            <button 
              className="resend-button" 
              onClick={handleResend}
              disabled={resendLoading}
            >
              {resendLoading ? 'Sending...' : 'Resend OTP'}
            </button>
          ) : (
            <p className="timer">Resend OTP in {timer}s</p>
          )}
        </div>
      </div>
    </div>
  )
}

export default OTPVerification

