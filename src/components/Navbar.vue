<template>
  <nav
    class="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50"
  >
    <!-- Logo -->
    <router-link to="/" class="text-2xl font-bold text-indigo-600">
      MediaHub
    </router-link>

    <!-- Navigation Links -->
    <div class="hidden md:flex space-x-6">
      <router-link
        to="/"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Home
      </router-link>
      <router-link
        to="/media"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Media
      </router-link>
      <router-link
        to="/categories"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Categories
      </router-link>
      <router-link
        to="/dashboard"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Dashboard
      </router-link>
    </div>

    <!-- User Profile/Login -->
    <div>
        <!-- If not logged in, show Login -->
      <router-link
        v-if="!loggedIn"
        to="/login"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition"
      >
        Login
      </router-link>

      <!-- If logged in, show Logout -->
      <button
        v-else
        @click="logout"
        class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition"
      >
        Logout
      </button>

    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { isLoggedIn, removeToken } from "../utils/auth";

const loggedIn = ref(false);

onMounted(() => {
  loggedIn.value = isLoggedIn();
});

function logout() {
  removeToken();
  loggedIn.value = false;
  window.location.href = "/";
}
</script>
