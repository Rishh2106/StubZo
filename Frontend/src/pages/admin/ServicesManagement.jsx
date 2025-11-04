import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { getAllServices, createService, updateService, deleteService } from '../../services/adminService'
import '../dashboard.css'

function ServicesManagement() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', description: '' })
  const [error, setError] = useState('')

  useEffect(() => {
    loadServices()
  }, [])

  const loadServices = async () => {
    setLoading(true)
    try {
      const response = await getAllServices()
      if (response.success) {
        setServices(response.data || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load services')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (editingId) {
        await updateService(editingId, formData)
      } else {
        await createService(formData)
      }
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', description: '' })
      loadServices()
    } catch (err) {
      setError(err.message || 'Failed to save service')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (service) => {
    setFormData({
      name: service.name || '',
      description: service.description || ''
    })
    setEditingId(service.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return
    setLoading(true)
    try {
      await deleteService(id)
      loadServices()
    } catch (err) {
      setError(err.message || 'Failed to delete service')
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
            <h2 className="page-title">Services Management</h2>
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', description: '' }) }} className="submit-button">
              + Add Service
            </button>
          </div>

          {error && <div className="error-message submit-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {showForm && (
            <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
              <h3>{editingId ? 'Edit Service' : 'Add New Service'}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Service Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Description</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    rows="3"
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', description: '' }) }} className="submit-button" style={{ background: '#666' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && !showForm && <div>Loading...</div>}
          
          <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {services.map(service => (
              <div key={service.id} className="card" style={{ padding: '1rem', position: 'relative' }}>
                <h3>{service.name}</h3>
                <p>{service.description || 'No description'}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(service)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(service.id)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: '#dc3545' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && services.length === 0 && !showForm && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No services found. Click "Add Service" to create one.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default ServicesManagement

