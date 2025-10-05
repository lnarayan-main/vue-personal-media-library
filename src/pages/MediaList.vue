<!-- src/pages/MediaList.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <div class="flex justify-between items-center mb-6">
      <h1 class="text-2xl font-bold">Media Library</h1>
      <router-link v-if="auth.isLoggedIn" to="/media/create" class="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
        + Create Media
      </router-link>
    </div>

    <!-- Category Filter -->
    <div class="mb-4 flex gap-2 overflow-x-auto">
      <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
        'px-4 py-2 rounded-lg text-white',
        selectedCategory === cat.id ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
      ]">
        {{ cat.name }}
      </button>
      <button @click="selectedCategory = null" :class="[
        'px-4 py-2 rounded-lg text-white',
        selectedCategory === null ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
      ]">
        All
      </button>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div v-for="media in filteredMedia" :key="media.id" class="bg-white shadow rounded-lg overflow-hidden">
        <!-- Media Preview -->
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <template v-if="media.media_type === 'image'">
            <img :src="`${BASE_URL}${media.file_url}`" alt="" class="h-full w-full object-cover" />
          </template>
          <template v-else-if="media.media_type === 'video'">
            <video :src="getFileUrl(media.file_url)" :poster="getFileUrl(media.thumbnail_url)" controls
              class="h-full w-full object-cover" muted></video>
          </template>
          <template v-else-if="media.media_type === 'audio'">
            <div class="w-full h-full flex flex-col justify-end" :style="{
              backgroundImage: `url(${getFileUrl(media.thumbnail_url)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#333'
            }">
              <audio :src="`${BASE_URL}${media.file_url}`" controls class="w-full"></audio>
            </div>
          </template>
        </div>

        <!-- Media Info -->
        <div class="p-4 flex flex-col gap-2">
          <h2 class="font-semibold text-lg truncate">{{ media.title }}</h2>
          <p class="text-sm text-gray-600 truncate">{{ media.description }}</p>
          <router-link :to="`/media/detail/${media.id}`" class="mt-2 text-blue-600 hover:underline">
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useAuthStore } from "@/stores/auth";
import axiosApi from "@/utils/axiosApi";
import { getFileUrl } from "@/utils/helpers";
import { ref, onMounted, computed } from "vue";
const auth = useAuthStore();

// Media and Categories state
const mediaItems = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const BASE_URL = import.meta.env.VITE_API_URL;

// Fetch all media items
async function fetchMedia() {
  try {
    const res = await axiosApi.get("media/list");
    mediaItems.value = await res.data;
  } catch (err) {
    console.error("Failed to fetch media items", err);
  }
}

// Fetch all categories
async function fetchCategories() {
  try {
    const res = await axiosApi.get("category/list");
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
}

// Filtered media based on selected category
const filteredMedia = computed(() => {
  if (!selectedCategory.value) return mediaItems.value;
  return mediaItems.value.filter((m) => m.category_id === selectedCategory.value);
});

// Load data on mounted
onMounted(() => {
  fetchCategories();
  fetchMedia();
});
</script>
