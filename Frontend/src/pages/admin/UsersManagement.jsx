import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { getAllUsers, createUser, updateUser, deleteUser } from '../../services/adminService'
import '../dashboard.css'

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', email: '', password: '', role: 'RESIDENT', active: true })
  const [error, setError] = useState('')

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await getAllUsers()
      if (response.success) {
        setUsers(response.data || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      const data = {
        name: formData.name,
        email: formData.email,
        role: formData.role,
        active: formData.active
      }
      
      // Only include password if it's provided (for updates, password is optional)
      if (formData.password) {
        data.password = formData.password
      }
      
      if (editingId) {
        await updateUser(editingId, data)
      } else {
        if (!formData.password) {
          setError('Password is required for new users')
          setLoading(false)
          return
        }
        await createUser(data)
      }
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', email: '', password: '', role: 'RESIDENT', active: true })
      loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to save user')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (user) => {
    setFormData({
      name: user.name || '',
      email: user.email || '',
      password: '',
      role: user.role || 'RESIDENT',
      active: user.active !== undefined ? user.active : true
    })
    setEditingId(user.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this user?')) return
    setLoading(true)
    try {
      await deleteUser(id)
      loadUsers()
    } catch (err) {
      setError(err.message || 'Failed to delete user')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="layout">
      <Navbar />
      <div className="layout-body">
        <Sidebar links={[
          { to: '/admin', label: 'Overview' },
          { to: '/admin/buildings', label: 'Buildings' },
          { to: '/admin/rooms', label: 'Rooms' },
          { to: '/admin/services', label: 'Services' },
          { to: '/admin/users', label: 'Users' },
        ]} />
        <main className="content">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
            <h2 className="page-title">Users Management</h2>
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'RESIDENT', active: true }) }} className="submit-button">
              + Add User
            </button>
          </div>

          {error && <div className="error-message submit-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {showForm && (
            <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
              <h3>{editingId ? 'Edit User' : 'Add New User'}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required
                    disabled={editingId !== null}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem', opacity: editingId ? 0.6 : 1 }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Password {editingId ? '(leave empty to keep current)' : '*'}</label>
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    required={!editingId}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Role *</label>
                  <select
                    value={formData.role}
                    onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  >
                    <option value="RESIDENT">Resident</option>
                    <option value="EMPLOYEE">Employee</option>
                    <option value="WORKER">Worker</option>
                    <option value="ADMIN">Admin</option>
                    <option value="PSEUDO_ADMIN">Pseudo Admin</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.active}
                      onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Active
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', email: '', password: '', role: 'RESIDENT', active: true }) }} className="submit-button" style={{ background: '#666' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && !showForm && <div>Loading...</div>}
          
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '1rem' }}>
              <thead>
                <tr style={{ borderBottom: '2px solid #ddd', background: '#f5f5f5' }}>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Name</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Email</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Role</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Status</th>
                  <th style={{ padding: '0.75rem', textAlign: 'left' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(user => (
                  <tr key={user.id} style={{ borderBottom: '1px solid #eee' }}>
                    <td style={{ padding: '0.75rem' }}>{user.name}</td>
                    <td style={{ padding: '0.75rem' }}>{user.email}</td>
                    <td style={{ padding: '0.75rem' }}>{user.role}</td>
                    <td style={{ padding: '0.75rem' }}>
                      <span style={{ padding: '0.25rem 0.5rem', borderRadius: '4px', background: user.active ? '#d4edda' : '#f8d7da', color: user.active ? '#155724' : '#721c24' }}>
                        {user.active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem' }}>
                      <div style={{ display: 'flex', gap: '0.5rem' }}>
                        <button onClick={() => handleEdit(user)} className="submit-button" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem' }}>
                          Edit
                        </button>
                        <button onClick={() => handleDelete(user.id)} className="submit-button" style={{ padding: '0.25rem 0.75rem', fontSize: '0.9rem', background: '#dc3545' }}>
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {!loading && users.length === 0 && !showForm && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem', marginTop: '1rem' }}>
              <p>No users found. Click "Add User" to create one.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default UsersManagement

