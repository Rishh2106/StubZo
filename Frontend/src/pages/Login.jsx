import SignIn from '../components/SignIn'
import '../components/Auth.css'

function Login() {
  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Login</h1>
        </div>
        <SignIn />
        <div style={{ marginTop: '1rem', textAlign: 'center', color: '#4a5568' }}>
          New resident? <a href="/signup" style={{ color: '#667eea', fontWeight: 600 }}>Create your account</a>
        </div>
      </div>
    </div>
  )
}

export default Login


