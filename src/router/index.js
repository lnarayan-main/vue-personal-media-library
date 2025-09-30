// src/router/index.js
import { createRouter, createWebHistory } from "vue-router";

import Home from "../pages/Home.vue";
import Dashboard from "../pages/Dashboard.vue";
import MediaList from "../pages/MediaList.vue";
import MediaDetail from "../pages/MediaDetail.vue";
import Categories from "../pages/Categories.vue";
import Login from "../pages/Login.vue";
import Register from "../pages/Register.vue";

const routes = [
  { path: "/", name: "Home", component: Home },
  { path: "/dashboard", name: "Dashboard", component: Dashboard },
  { path: "/media", name: "MediaList", component: MediaList },
  { path: "/media/:id", name: "MediaDetail", component: MediaDetail, props: true },
  { path: "/categories", name: "Categories", component: Categories },
  { path: "/login", name: "Login", component: Login },
  { path: "/register", name: "Register", component: Register},
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;

