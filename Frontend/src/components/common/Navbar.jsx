function Navbar() {
  return (
    <nav className="navbar">
      <div className="navbar-brand">StubZo Hostel</div>
      <div className="navbar-actions">
        <button onClick={() => { localStorage.removeItem('token'); window.location.href = '/login' }} className="btn btn-ghost">Logout</button>
      </div>
    </nav>
  )
}

export default Navbar


