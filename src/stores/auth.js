import { defineStore } from 'pinia'
import axios from 'axios'
const BASE_URL = import.meta.env.VITE_API_URL

export const useAuthStore = defineStore('auth', {
  state: () => ({
    token: localStorage.getItem('token') || null,
    currentUser: null,
  }),
  getters: {
    isLoggedIn: (state) => !!state.token && !!state.currentUser,
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
          },
          {
            headers: { 'Content-Type': 'application/json' },
          },
        )

        this.token = res.data.access_token
        localStorage.setItem('token', this.token)

        // fetch user immediately
        await this.fetchCurrentUser()

        return true
      } catch (err) {
        console.error('Login failed', err)
        return false
      }
    },
    logout() {
      this.token = null
      this.currentUser = null
      localStorage.removeItem('token')
    },
  },
})
