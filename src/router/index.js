// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router'
import { useAuthStore } from '@/stores/auth'

import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

import Home from '../pages/Home.vue'
import Dashboard from '../pages/Dashboard.vue'
import MediaList from '../pages/MediaList.vue'
import MediaDetail from '../pages/MediaDetail.vue'
import Categories from '../pages/Categories.vue'
import Login from '../pages/Login.vue'
import Register from '../pages/Register.vue'
import Profile from '../pages/Profile.vue'
import MediaCreate from '../pages/MediaCreate.vue'
import MediaEdit from '../pages/MediaEdit.vue'
import UsersList from '../pages/UsersList.vue'
import ForgotPassword from '../pages/ForgotPassword.vue'
import ResetPassword from '../pages/ResetPassword.vue'
import MediaManagement from '@/pages/MediaManagement.vue'
import UserView from '@/pages/UserView.vue'
import MediaView from '@/pages/MediaView.vue'

import NotFound from '@/pages/NotFound.vue'
import PrivacyPolicy from "../pages/PrivacyPolicy.vue";
import TermsOfService from "../pages/TermsOfService.vue";
import ContactUs from "../pages/ContactUs.vue";


const routes = [
  { path: '/', name: 'Home', component: Home, meta: { requiresAuth: false } },
  { path: '/login', name: 'Login', component: Login },
  { path: '/register', name: 'Register', component: Register },
  { path: '/forgot-password', name: 'ForgotPassword', component: ForgotPassword },
  { path: '/reset-password/:token', name: 'ResetPassword', component: ResetPassword, props: true },
  { path: '/dashboard', name: 'Dashboard', component: Dashboard, meta: { requiresAuth: true } },
  { path: '/media', name: 'MediaList', component: MediaList, meta: { requiresAuth: true } },
  {
    path: '/media/detail/:id',
    name: 'MediaDetail',
    component: MediaDetail,
    props: true,
    meta: { requiresAuth: false },
  },
  { path: '/categories', name: 'Categories', component: Categories, meta: { requiresAuth: true } },
  { path: '/profile', name: 'Profile', component: Profile, meta: { requiresAuth: true } },
  {
    path: '/media/create',
    name: 'MediaCreate',
    component: MediaCreate,
    meta: { requiresAuth: true },
  },
  {
    path: '/media/update/:id',
    name: 'MediaEdit',
    component: MediaEdit,
    props: true,
    meta: { requiresAuth: true },
  },
  { path: '/users-list', name: 'UsersList', component: UsersList, meta: { requiresAuth: true } },
  {
    path: '/users/:id',
    name: 'UserView',
    component: UserView,
    props: true,
    meta: { requiresAuth: true },
  },
  {
    path: '/media-list',
    name: 'MediaManagement',
    component: MediaManagement,
    meta: { requiresAuth: true },
  },
  {
    path: '/media/view/:id',
    name: 'MediaView',
    component: MediaView,
    props: true,
    meta: { requiresAuth: true },
  },

  { path: "/privacy", name: "privacy", component: PrivacyPolicy },
  { path: "/terms", name: "terms", component: TermsOfService },
  { path: "/contact", name: "contact", component: ContactUs },

  // Page Not found path
  { path: '/:pathMatch(.*)*', name: 'NotFound', component: NotFound },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
  scrollBehavior(to, from, savedPosition) {
    // Always scroll to top
    return { top: 0 }
  },
})

// --- NProgress Settings ---
NProgress.configure({
  showSpinner: false, // remove the small spinner
  trickleSpeed: 200, // smoother progress
})

// Track if auth has been initialized to prevent multiple calls
let authInitialized = false

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  NProgress.start()
  const auth = useAuthStore()

  // Initialize auth only once on first navigation
  if (!authInitialized) {
    await auth.initAuth()
    authInitialized = true
  }

  // Check if route requires authentication
  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next('/login')
  }

  // If going to login but already logged in, redirect to dashboard
  if (to.path === '/login' && auth.isLoggedIn) {
    return next('/dashboard')
  }

  next()
})

// Stop progress after navigation completes
router.afterEach(() => {
  NProgress.done()
})

export default router
