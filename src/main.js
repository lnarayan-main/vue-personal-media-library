import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'

import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// TailwindCSS
import './assets/main.css'

import './assets/nprogress-custom.css'

const app = createApp(App)
const pinia = createPinia()

app.use(pinia)
app.use(router)

// Clear token on browser close if user didn't check "remember me"
window.addEventListener('beforeunload', () => {
  const isSessionOnly = sessionStorage.getItem('token_session_only') === 'true'

  if (isSessionOnly) {
    localStorage.removeItem('token')
    sessionStorage.removeItem('token_session_only')
  }
})

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  pauseOnHover: true,
  closeOnClick: true,
})

app.mount('#app')

export { toast }
