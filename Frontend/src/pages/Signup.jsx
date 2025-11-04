import { useState } from 'react'
import SignUp from '../components/SignUp'
import OTPVerification from '../components/OTPVerification'
import '../components/Auth.css'

function Signup() {
  const [showOTP, setShowOTP] = useState(false)
  const [emailToVerify, setEmailToVerify] = useState('')

  const handleSignUpSuccess = (email) => {
    setEmailToVerify(email)
    setShowOTP(true)
  }

  if (showOTP) {
    return (
      <OTPVerification
        email={emailToVerify}
        onVerified={() => { setShowOTP(false); window.location.href = '/resident' }}
        onBack={() => setShowOTP(false)}
      />
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Resident Sign Up</h1>
        </div>
        <SignUp onSuccess={handleSignUpSuccess} />
      </div>
    </div>
  )
}

export default Signup


