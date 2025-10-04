<template>
      <!-- Main Content -->
      <main class="flex-1 bg-gray-50 p-6">
        <h1 class="text-2xl font-bold text-gray-800 mb-6">Welcome Back 👋</h1>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-indigo-600 text-3xl font-bold">{{ dashboardData.total_media }}</span>
            <p class="text-gray-600 mt-2">Total Media</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-green-600 text-3xl font-bold">{{ dashboardData.total_categories}}</span>
            <p class="text-gray-600 mt-2">Categories</p>
          </div>
          <div
            class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center"
          >
            <span class="text-pink-600 text-3xl font-bold">{{ dashboardData.total_users }}</span>
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
</template>

<script setup>
import axiosApi from '@/utils/axiosApi';
import { ref, onMounted, reactive } from 'vue';

const loading = ref(true);
const error = ref(null);

const dashboardData = reactive({
  total_media: null,
  total_users: null,
  total_categories: null
});



async function getDashboardData() {
  try {
    const res = await axiosApi.get("admin-dashboard");
    const resData = res.data;
    console.log(resData);
    dashboardData.total_media = resData.total_media,
    dashboardData.total_users =resData.total_users,
    dashboardData.total_categories = resData.total_categories
  } catch (err) {
      error.value = err.response?.data?.detail || 'Failed to load data.';
  }

}


onMounted(()=>{
  getDashboardData();
})

const recentMedia = [
  { id: 1, title: "Travel Vlog 2025", category: "Travel", date: "Sep 28" },
  { id: 2, title: "Cooking with Spices", category: "Food", date: "Sep 25" },
  { id: 3, title: "Vue.js Crash Course", category: "Education", date: "Sep 20" },
];
</script>
