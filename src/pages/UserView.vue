<template>
  <div class="p-6 max-w-3xl mx-auto">
    <!-- Loading -->
    <div v-if="loading" class="text-gray-500 text-center">Loading user details...</div>

    <!-- Error -->
    <div v-else-if="error" class="text-red-500 text-center">{{ error }}</div>

    <!-- User Details -->
    <div v-else-if="user" class="bg-white shadow-lg rounded-2xl p-6 space-y-6">
      <div class="flex items-center space-x-6">
        <img
          :src="getFileUrl(user.profile_pic_url) || defaultAvatar"
          alt="Profile Picture"
          class="w-28 h-28 object-cover rounded-full border"
        />
        <div>
          <h2 class="text-2xl font-bold text-gray-800">{{ user.name }}</h2>
          <p class="text-gray-500">{{ user.email }}</p>
          <p class="mt-1">
            <span
              :class="user.status === 'active' ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'"
              class="px-2 py-1 text-sm rounded-full, capitalize"
            >
              {{ user.status }}
            </span>
          </p>
        </div>
      </div>

      <div class="border-t pt-4">
        <h3 class="font-semibold text-lg text-gray-800 mb-2">About</h3>
        <p class="text-gray-600 leading-relaxed" v-if="user.about">
          {{ user.about }}
        </p>
        <p v-else class="text-gray-400 italic">No about information provided.</p>
      </div>

      <div class="text-center">
        <button
          @click="goBack"
          class="mt-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
        >
          ← Back to Users
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { getFileUrl } from '@/utils/helpers'
import axiosApi from '@/utils/axiosApi'

const route = useRoute()
const router = useRouter()
const user = ref(null)
const loading = ref(true)
const error = ref(null)
const defaultAvatar = '/images/default_avatar.jpg'

async function fetchUserDetails() {
  try {
    const response = await axiosApi.get(`users/${route.params.id}`)
    user.value = response.data
  } catch (err) {
    error.value = err.response?.data?.detail || 'Failed to load user details.'
  } finally {
    loading.value = false
  }
}

function goBack() {
  router.push({ name: 'UsersList' })
}

onMounted(fetchUserDetails)
</script>
