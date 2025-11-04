import { useState, useEffect } from 'react'
import Navbar from '../../components/common/Navbar'
import Sidebar from '../../components/common/Sidebar'
import { getAllRooms, createRoom, updateRoom, deleteRoom, getAllBuildings } from '../../services/adminService'
import '../dashboard.css'

function RoomsManagement() {
  const [rooms, setRooms] = useState([])
  const [buildings, setBuildings] = useState([])
  const [loading, setLoading] = useState(false)
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState(null)
  const [formData, setFormData] = useState({ roomNumber: '', buildingId: '', sharingType: '', capacity: '', rent: '', status: 'AVAILABLE' })
  const [error, setError] = useState('')

  useEffect(() => {
    loadRooms()
    loadBuildings()
  }, [])

  const loadBuildings = async () => {
    try {
      const response = await getAllBuildings()
      if (response.success) {
        setBuildings(response.data || [])
      }
    } catch (err) {
      console.error('Failed to load buildings:', err)
    }
  }

  const loadRooms = async () => {
    setLoading(true)
    try {
      const response = await getAllRooms()
      if (response.success) {
        setRooms(response.data || [])
      }
    } catch (err) {
      setError(err.message || 'Failed to load rooms')
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
        roomNumber: formData.roomNumber,
        buildingId: parseInt(formData.buildingId),
        sharingType: formData.sharingType,
        capacity: formData.capacity ? parseInt(formData.capacity) : null,
        rent: formData.rent ? parseFloat(formData.rent) : null,
        status: formData.status
      }
      
      if (editingId) {
        await updateRoom(editingId, data)
      } else {
        await createRoom(data)
      }
      
      setShowForm(false)
      setEditingId(null)
      setFormData({ roomNumber: '', buildingId: '', sharingType: '', capacity: '', rent: '', status: 'AVAILABLE' })
      loadRooms()
    } catch (err) {
      setError(err.message || 'Failed to save room')
    } finally {
      setLoading(false)
    }
  }

  const handleEdit = (room) => {
    setFormData({
      roomNumber: room.roomNumber || '',
      buildingId: room.building?.id?.toString() || '',
      sharingType: room.sharingType || '',
      capacity: room.capacity?.toString() || '',
      rent: room.rent?.toString() || '',
      status: room.status || 'AVAILABLE'
    })
    setEditingId(room.id)
    setShowForm(true)
  }

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this room?')) return
    setLoading(true)
    try {
      await deleteRoom(id)
      loadRooms()
    } catch (err) {
      setError(err.message || 'Failed to delete room')
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
            <h2 className="page-title">Rooms Management</h2>
            <button onClick={() => { setShowForm(true); setEditingId(null); setFormData({ roomNumber: '', buildingId: '', sharingType: '', capacity: '', rent: '', status: 'AVAILABLE' }) }} className="submit-button">
              + Add Room
            </button>
          </div>

          {error && <div className="error-message submit-error" style={{ marginBottom: '1rem' }}>{error}</div>}

          {showForm && (
            <div className="card" style={{ marginBottom: '1rem', padding: '1.5rem' }}>
              <h3>{editingId ? 'Edit Room' : 'Add New Room'}</h3>
              <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Room Number *</label>
                  <input
                    type="text"
                    value={formData.roomNumber}
                    onChange={(e) => setFormData({ ...formData, roomNumber: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Building *</label>
                  <select
                    value={formData.buildingId}
                    onChange={(e) => setFormData({ ...formData, buildingId: e.target.value })}
                    required
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  >
                    <option value="">Select Building</option>
                    {buildings.map(b => (
                      <option key={b.id} value={b.id}>{b.name}</option>
                    ))}
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Sharing Type</label>
                  <select
                    value={formData.sharingType}
                    onChange={(e) => setFormData({ ...formData, sharingType: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  >
                    <option value="">Select Type</option>
                    <option value="single">Single</option>
                    <option value="double">Double</option>
                    <option value="triple">Triple</option>
                    <option value="custom">Custom</option>
                  </select>
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Capacity</label>
                  <input
                    type="number"
                    value={formData.capacity}
                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Rent</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.rent}
                    onChange={(e) => setFormData({ ...formData, rent: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  />
                </div>
                <div style={{ marginBottom: '1rem' }}>
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    style={{ width: '100%', padding: '0.5rem', marginTop: '0.25rem' }}
                  >
                    <option value="AVAILABLE">Available</option>
                    <option value="OCCUPIED">Occupied</option>
                    <option value="MAINTENANCE">Maintenance</option>
                  </select>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button type="submit" className="submit-button" disabled={loading}>
                    {loading ? 'Saving...' : editingId ? 'Update' : 'Create'}
                  </button>
                  <button type="button" onClick={() => { setShowForm(false); setEditingId(null); setFormData({ roomNumber: '', buildingId: '', sharingType: '', capacity: '', rent: '', status: 'AVAILABLE' }) }} className="submit-button" style={{ background: '#666' }}>
                    Cancel
                  </button>
                </div>
              </form>
            </div>
          )}

          {loading && !showForm && <div>Loading...</div>}
          
          <div className="cards" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1rem' }}>
            {rooms.map(room => (
              <div key={room.id} className="card" style={{ padding: '1rem', position: 'relative' }}>
                <h3>Room {room.roomNumber}</h3>
                <p>Building: {room.building?.name || 'N/A'}</p>
                <p>Sharing Type: {room.sharingType || 'N/A'}</p>
                <p>Capacity: {room.capacity || 'N/A'}</p>
                <p>Rent: ₹{room.rent || 'N/A'}</p>
                <p>Status: {room.status || 'N/A'}</p>
                <div style={{ marginTop: '1rem', display: 'flex', gap: '0.5rem' }}>
                  <button onClick={() => handleEdit(room)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem' }}>
                    Edit
                  </button>
                  <button onClick={() => handleDelete(room.id)} className="submit-button" style={{ flex: 1, padding: '0.5rem', fontSize: '0.9rem', background: '#dc3545' }}>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>

          {!loading && rooms.length === 0 && !showForm && (
            <div className="card" style={{ textAlign: 'center', padding: '2rem' }}>
              <p>No rooms found. Click "Add Room" to create one.</p>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}

export default RoomsManagement

