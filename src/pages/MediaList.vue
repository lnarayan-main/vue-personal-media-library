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
      <MediaCard
          v-for="item in filteredMedia"
          :key="item.id"
          :media_id="item.id"
          :title="item.title"
          :description="item.description"
          :thumbnail="item.media_type === 'image' ? item.file_url : item.thumbnail_url"
          :file_url="item.file_url"
          :type="item.media_type"
          :media="item"
        />

    </div>
  </div>
</template>

<script setup>
import MediaCard from "@/components/MediaCard.vue";
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
