// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";
import { useAuthStore } from "@/stores/auth";

import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import MediaList from "../pages/MediaList.vue";
import MediaDetail from "../pages/MediaDetail.vue";
import Categories from "../pages/Categories.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";
import Profile from "../pages/Profile.vue";
import MediaCreate from "../pages/MediaCreate.vue";
import MediaEdit from "../pages/MediaEdit.vue";
import UsersList from "../pages/UsersList.vue";
import ForgotPassword from "../pages/ForgotPassword.vue";
import ResetPassword from "../pages/ResetPassword.vue";
import MediaManagement from "@/pages/MediaManagement.vue";
import UserView from "@/pages/UserView.vue";

const routes = [
  { path: "/", name: "Home", component: Home, meta: { requiresAuth: false } },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/media", name: "MediaList", component: MediaList },
  { path: "/media/detail/:id", name: "MediaDetail", component: MediaDetail, props: true, meta: { requiresAuth: false } },
  { path: "/categories", name: "Categories", component: Categories },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register},
  { path: "/profile", name: "Profile", component: Profile},
  { path: "/media/create", name: "MediaCreate", component: MediaCreate},
  { path: "/media/update/:id", name: "MediaEdit", component: MediaEdit, props: true},
  { path: "/users", name: "UsersList", component: UsersList},
  { path: '/users/:id', name: 'UserView', component: UserView, props: true },
  { path: "/media-list", name: "MediaManagement", component: MediaManagement},
  { path: "/forgot-password", name: "ForgotPassword", component: ForgotPassword},
  { path: "/reset-password/:token", name: "ResetPassword", component: ResetPassword, props: true},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

// Navigation Guard
router.beforeEach(async (to, from, next) => {
  const auth = useAuthStore();

  if (to.meta.requiresAuth && !auth.isLoggedIn) {
    return next("/login"); // redirect guest to login
  }

  next();
});

export default router;

