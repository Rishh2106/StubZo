import { useState } from 'react'
import './Auth.css'
import SignUp from './SignUp'
import SignIn from './SignIn'
import OTPVerification from './OTPVerification'

function Auth() {
  const [isSignUp, setIsSignUp] = useState(true)
  const [showOTP, setShowOTP] = useState(false)
  const [userEmail, setUserEmail] = useState('')

  const handleSignUpSuccess = (email) => {
    setUserEmail(email)
    setShowOTP(true)
  }

  const handleOTPVerified = () => {
    setShowOTP(false)
    setIsSignUp(false)
    // Redirect to dashboard or home page
  }

  if (showOTP) {
    return (
      <OTPVerification 
        email={userEmail} 
        onVerified={handleOTPVerified}
        onBack={() => setShowOTP(false)}
      />
    )
  }

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>StubZo</h1>
          <div className="auth-tabs">
            <button
              className={`tab ${isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
            <button
              className={`tab ${!isSignUp ? 'active' : ''}`}
              onClick={() => setIsSignUp(false)}
            >
              Sign In
            </button>
          </div>
        </div>

        {isSignUp ? (
          <SignUp onSuccess={handleSignUpSuccess} />
        ) : (
          <SignIn />
        )}
      </div>
    </div>
  )
}

export default Auth

