<template>
  <div class="min-h-screen flex flex-col">
    <!-- Top Navbar -->
    <Navbar />

    <div class="flex flex-1">
      <!-- Sidebar (visible on desktop only) -->
      <Sidebar />

      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Welcome Back 👋</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-indigo-600 text-3xl font-bold">120</span>
            <p class="text-gray-600 mt-2">Total Media</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-green-600 text-3xl font-bold">15</span>
            <p class="text-gray-600 mt-2">Categories</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-pink-600 text-3xl font-bold">48</span>
            <p class="text-gray-600 mt-2">Users</p>
          </div>
        </div>

        <!-- Recent Media List -->
        <div class="bg-white rounded-xl shadow-md p-6">
          <h2 class="text-xl font-semibold mb-4">Recent Media</h2>

          <div class="space-y-4">
            <div
              v-for="item in recentMedia"
              :key="item.id"
              class="flex items-center justify-between border-b pb-3"
            >
              <div>
                <h3 class="font-medium text-gray-800">{{ item.title }}</h3>
                <p class="text-gray-500 text-sm">{{ item.category }}</p>
              </div>
              <span class="text-sm text-gray-400">{{ item.date }}</span>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup>
import Navbar from "@/components/Navbar.vue";
import Sidebar from "@/components/Sidebar.vue";

const recentMedia = [
  { id: 1, title: "Travel Vlog 2025", category: "Travel", date: "Sep 28" },
  { id: 2, title: "Cooking with Spices", category: "Food", date: "Sep 25" },
  { id: 3, title: "Vue.js Crash Course", category: "Education", date: "Sep 20" },
];
</script>
