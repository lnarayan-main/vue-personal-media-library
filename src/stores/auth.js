import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    // token: localStorage.getItem('token') || null,
    token: localStorage.getItem('token') || sessionStorage.getItem('token') || null,
    currentUser: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.currentUser,
    role: (state) => state.currentUser?.role || null, // ✅ role getter
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
        // If token invalid → logout
        console.warn('Token expired or invalid. Logging out.')
        this.logout()
      }
    },
    async initAuth() {
      // call this in App.vue onMounted()
      this.loadToken()
      if (this.token) {
        await this.fetchCurrentUser()
      }
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

        if (credentials.rememberMe) {
          localStorage.setItem('token', token)
        } else {
          sessionStorage.setItem('token', token)
        }

        this.token = token
        // fetch user immediately
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
      localStorage.removeItem("remember_me")
      this.token = null
      this.currentUser = null
    },
    loadToken() {
      this.token = localStorage.getItem('token') || sessionStorage.getItem('token')
    },
  },
})
