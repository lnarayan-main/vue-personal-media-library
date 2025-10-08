<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Navbar -->
    <Navbar />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar v-if="auth.isLoggedIn" />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <!-- <router-view /> -->
         <router-view :key="$route.fullPath" />
      </main>
    </div>
    <!-- Footer  -->
    <Footer />
  </div>
</template>

<script setup>
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();


</script>
