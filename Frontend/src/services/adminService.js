import api from '../api/axiosInstance'

const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const config = { method, url: endpoint, data: body }
    const { data } = await api(config)
    return data
  } catch (error) {
    if (error?.response?.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
      return error.response.data
    }
    const msg = error?.response?.data?.message || error.message || 'Request failed'
    throw new Error(msg)
  }
}

// Building APIs
export const getAllBuildings = async () => {
  return await apiCall('/admin/buildings', 'GET')
}

export const getBuilding = async (id) => {
  return await apiCall(`/admin/buildings/${id}`, 'GET')
}

export const createBuilding = async (buildingData) => {
  return await apiCall('/admin/buildings', 'POST', buildingData)
}

export const updateBuilding = async (id, buildingData) => {
  return await apiCall(`/admin/buildings/${id}`, 'PUT', buildingData)
}

export const deleteBuilding = async (id) => {
  return await apiCall(`/admin/buildings/${id}`, 'DELETE')
}

// Room APIs
export const getAllRooms = async () => {
  return await apiCall('/admin/rooms', 'GET')
}

export const getRoom = async (id) => {
  return await apiCall(`/admin/rooms/${id}`, 'GET')
}

export const createRoom = async (roomData) => {
  return await apiCall('/admin/rooms', 'POST', roomData)
}

export const updateRoom = async (id, roomData) => {
  return await apiCall(`/admin/rooms/${id}`, 'PUT', roomData)
}

export const deleteRoom = async (id) => {
  return await apiCall(`/admin/rooms/${id}`, 'DELETE')
}

// Service APIs
export const getAllServices = async () => {
  return await apiCall('/admin/services', 'GET')
}

export const getService = async (id) => {
  return await apiCall(`/admin/services/${id}`, 'GET')
}

export const createService = async (serviceData) => {
  return await apiCall('/admin/services', 'POST', serviceData)
}

export const updateService = async (id, serviceData) => {
  return await apiCall(`/admin/services/${id}`, 'PUT', serviceData)
}

export const deleteService = async (id) => {
  return await apiCall(`/admin/services/${id}`, 'DELETE')
}

// User APIs
export const getAllUsers = async () => {
  return await apiCall('/admin/users', 'GET')
}

export const getUser = async (id) => {
  return await apiCall(`/admin/users/${id}`, 'GET')
}

export const createUser = async (userData) => {
  return await apiCall('/admin/users', 'POST', userData)
}

export const updateUser = async (id, userData) => {
  return await apiCall(`/admin/users/${id}`, 'PUT', userData)
}

export const deleteUser = async (id) => {
  return await apiCall(`/admin/users/${id}`, 'DELETE')
}

