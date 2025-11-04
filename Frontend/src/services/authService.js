// API Base URL - Update this with your backend URL
const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api'

import api from '../api/axiosInstance'

// Helper function for API calls (axios)
const apiCall = async (endpoint, method = 'GET', body = null) => {
  try {
    const config = { method, url: `${endpoint}`, data: body }
    const { data } = await api(config)
    return data
  } catch (error) {
    // If error response has data with success field, return it as normal response
    // This allows handling of responses like {success: false, message: "..."}
    if (error?.response?.data && typeof error.response.data === 'object' && 'success' in error.response.data) {
      return error.response.data
    }
    // Otherwise, throw error with message
    const msg = error?.response?.data?.message || error.message || 'Request failed'
    throw new Error(msg)
  }
}

// Sign Up API
export const signUp = async (userData) => {
  return await apiCall('/auth/signup', 'POST', userData)
}

// Sign In API
export const signIn = async (credentials) => {
  return await apiCall('/auth/signin', 'POST', credentials)
}

// Send OTP API
export const sendOTP = async (email) => {
  return await apiCall('/auth/send-otp', 'POST', { email })
}

// Verify OTP API
export const verifyOTP = async (email, otp) => {
  return await apiCall('/auth/verify-otp', 'POST', { email, otp })
}

// Resend OTP API
export const resendOTP = async (email) => {
  return await apiCall('/auth/resend-otp', 'POST', { email })
}

