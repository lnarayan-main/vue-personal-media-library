import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { useAuthStore } from './stores/auth'

import Vue3Toastify, { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

// TailwindCSS
import './assets/main.css'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);
app.use(router)

const auth = useAuthStore();
auth.initAuth();

// app.use(createPinia())

app.use(Vue3Toastify, {
  autoClose: 3000,
  position: 'top-right',
  theme: 'colored',
  pauseOnHover: true,
  closeOnClick: true,
})

app.mount('#app')

export { toast }
