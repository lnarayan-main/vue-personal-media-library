<template>
  <!-- Main Content -->
  <main class="flex-1 bg-gray-50 p-6">
    <h1 class="text-2xl font-bold text-gray-800 mb-6">Welcome Back 👋</h1>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

      <DashboardStatCard title="Total Media" :value="dashboardData.totalMedia" :icon="FilmIcon" color="indigo" />

      <DashboardStatCard v-if="auth.isAdmin" title="Total Categories" :value="dashboardData.totalCategories"
        :icon="TagIcon" color="green" />

      <DashboardStatCard v-if="auth.isAdmin" title="Total Users" :value="dashboardData.totalUsers" :icon="UsersIcon"
        color="pink" />

    </div>

    <!-- Recent Media List -->
    <DashboardRecentList v-if="auth.isAdmin || auth.isUser" title="Recent Media" :items="dashboardData.recentMedia"
      type="media" />
    <!-- Recent Users List -->
    <DashboardRecentList v-if="auth.isAdmin" title="Recent Users" :items="dashboardData.recentUsers" type="users" />

  </main>
</template>

<script setup>
import DashboardRecentList from '@/components/DashboardRecentList.vue';
import DashboardStatCard from '@/components/DashboardStatCard.vue';
import { useAuthStore } from '@/stores/auth';
import axiosApi from '@/utils/axiosApi';
import { ref, onMounted, reactive } from 'vue';

import {
  UsersIcon,        // For User Management
  FilmIcon,         // For Media Management
  TagIcon,          // For Category Management
} from '@heroicons/vue/20/solid';

const auth = useAuthStore();

const loading = ref(true);
const error = ref(null);

const dashboardData = reactive({
  totalMedia: null,
  totalUsers: null,
  totalCategories: null,
  recentUsers: null,
  recentMedia: null,
});



async function getDashboardData() {
  try {
    const res = await axiosApi.get("dashboard");
    const resData = res.data;
    dashboardData.totalMedia = resData.total_media,
      dashboardData.totalUsers = resData.total_users,
      dashboardData.totalCategories = resData.total_categories,
      dashboardData.recentMedia = resData.recent_media,
      dashboardData.recentUsers = resData.recent_users
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load data.';
  }

}


onMounted(() => {
  getDashboardData();
})
</script>
