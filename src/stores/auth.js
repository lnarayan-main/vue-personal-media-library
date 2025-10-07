import { defineStore } from 'pinia'
import axios from 'axios'

const BASE_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // token: null,
    token: localStorage.getItem('token') || null,
    currentUser: null,
    isInitialized: false,
  }),
  
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.currentUser,
    role: (state) => state.currentUser?.role || null,
    isAdmin: (state) => state.currentUser?.role === 'admin',
    isUser: (state) => state.currentUser?.role === 'user',
  },
  
  actions: {
    async fetchCurrentUser() {
      if (!this.token) return

      try {
        const res = await axios.get(BASE_URL + 'user/profile', {
          headers: { Authorization: `Bearer ${this.token}` },
        })
        this.currentUser = res.data
      } catch (err) {
        console.warn('Token expired or invalid. Logging out.')
        this.logout()
      }
    },

    async initAuth() {
      if (this.isInitialized) return

      this.loadToken()
      
      if (this.token) {
        await this.fetchCurrentUser()
      }
      
      this.isInitialized = true
    },

    async login(credentials) {
      try {
        const res = await axios.post(
          BASE_URL + 'auth/login',
          {
            email: credentials.email,
            password: credentials.password,
            remember_me: credentials.rememberMe,
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )

        const token = res.data.access_token

        // Always use localStorage for cross-tab compatibility
        localStorage.setItem('token', token)
        
        if (!credentials.rememberMe) {
          // Mark that this token should be cleared when browser closes
          sessionStorage.setItem('token_session_only', 'true')
        } else {
          sessionStorage.removeItem('token_session_only')
        }

        this.token = token
        
        // Fetch user immediately after login
        await this.fetchCurrentUser()

        return { success: true }
      } catch (err) {
        const message = err.response?.data?.detail || 'Login failed. Please try again.'
        console.error('Login failed:', message)
        return { success: false, message }
      }
    },

    logout() {
      localStorage.removeItem('token')
      sessionStorage.removeItem('token')
      sessionStorage.removeItem('token_session_only')
      localStorage.removeItem("remember_me")
      this.token = null
      this.currentUser = null
      this.isInitialized = false
    },

    loadToken() {
      // Always load from localStorage (works across tabs)
      this.token = localStorage.getItem('token')
    },
  },
})