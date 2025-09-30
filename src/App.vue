<!-- src/App.vue -->
<template>
  <div class="min-h-screen bg-gray-100 text-gray-900">
    <!-- Navbar -->
    <Navbar />

    <div class="flex">
      <!-- Sidebar -->
      <Sidebar />

      <!-- Main content -->
      <main class="flex-1 p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from "./components/Navbar.vue";
import Sidebar from "./components/Sidebar.vue";
</script>
