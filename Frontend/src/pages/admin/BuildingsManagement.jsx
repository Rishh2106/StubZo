import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { getAllBuildings, createBuilding, updateBuilding, deleteBuilding } from '../../services/adminService'
import '../dashboard.css'

function BuildingsManagement() {
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ name: '', totalRooms: '', startingRoomNumber: '', customRoomNumbering: false })
  const [error, setError] = useState('')

  useEffect(() => {
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    setLoading(true)
    try {
      const response = await getAllBuildings()
      if (response.success) {
        setBuildings(response.data || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load buildings')
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
        totalRooms: formData.totalRooms ? parseInt(formData.totalRooms) : null,
        startingRoomNumber: formData.startingRoomNumber ? parseInt(formData.startingRoomNumber) : null,
        customRoomNumbering: formData.customRoomNumbering
      }
      
      if (editingId) {
        await updateBuilding(editingId, data)
      } else {
        await createBuilding(data)
      }
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ name: '', totalRooms: '', startingRoomNumber: '', customRoomNumbering: false })
      loadBuildings()
    } catch (err) {
      setError(err.message || 'Failed to save building')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (building) => {
    setFormData({
      name: building.name || '',
      totalRooms: building.totalRooms?.toString() || '',
      startingRoomNumber: building.startingRoomNumber?.toString() || '',
      customRoomNumbering: building.customRoomNumbering || false
    })
    setEditingId(building.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this building?')) return
    setLoading(true)
    try {
      await deleteBuilding(id)
      loadBuildings()
    } catch (err) {
      setError(err.message || 'Failed to delete building')
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
            <h2 className="page-title">Buildings Management</h2>
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ name: '', totalRooms: '', startingRoomNumber: '', customRoomNumbering: false }) }} className="submit-button">
              + Add Building
            </button>
          </div>

          {error && <div className="error-message submit-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {showForm && (
            <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
              <h3>{editingId ? 'Edit Building' : 'Add New Building'}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Building Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Total Rooms</label>
                  <input
                    type="number"
                    value={formData.totalRooms}
                    onChange={(e) => setFormData({ ...formData, totalRooms: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Starting Room Number</label>
                  <input
                    type="number"
                    value={formData.startingRoomNumber}
                    onChange={(e) => setFormData({ ...formData, startingRoomNumber: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>
                    <input
                      type="checkbox"
                      checked={formData.customRoomNumbering}
                      onChange={(e) => setFormData({ ...formData, customRoomNumbering: e.target.checked })}
                      style={{ marginRight: '0.5rem' }}
                    />
                    Custom Room Numbering
                  </label>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ name: '', totalRooms: '', startingRoomNumber: '', customRoomNumbering: false }) }} className="submit-button" style={{ background: '#666' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && !showForm && <div>Loading...</div>}
          
          <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {buildings.map(building => (
              <div key={building.id} className="card" style={{ padding: '1rem', position: 'relative' }}>
                <h3>{building.name}</h3>
                <p>Total Rooms: {building.totalRooms || 'N/A'}</p>
                <p>Starting Room: {building.startingRoomNumber || 'N/A'}</p>
                <p>Custom Numbering: {building.customRoomNumbering ? 'Yes' : 'No'}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(building)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(building.id)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: '#dc3545' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && buildings.length === 0 && !showForm && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No buildings found. Click "Add Building" to create one.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default BuildingsManagement

