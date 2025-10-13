<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Navbar -->
    <Navbar @menu-click="toggleSidebar" />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar v-if="auth.isLoggedIn && isSideBarOpen" />

      <!-- Main content -->
      <main class="flex-1 p-8">
        <!-- <router-view /> -->
         <router-view :key="$route.fullPath" />
      </main>
    </div>
    <!-- Footer  -->
    <Footer />
  </div>
</template>

<script setup>
import { ref } from "vue";
import Footer from "./components/Footer.vue";
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
import { useAuthStore } from "./stores/auth";

const auth = useAuthStore();

const isSideBarOpen = ref(true);

function toggleSidebar(){
  isSideBarOpen.value = !isSideBarOpen.value;
}


</script>
