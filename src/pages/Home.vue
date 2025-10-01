<template>
  <div class="space-y-12">
    <!-- Hero Section -->

    <section class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-10 text-center">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Welcome to <span class="text-yellow-300">MediaHub</span>
      </h1>
      <p class="text-lg md:text-xl max-w-2xl mx-auto mb-6">
        Upload, explore, and share your favorite images, videos, and audio
        files — all in one place.
      </p>
      <router-link
        to="/media"
        class="px-6 py-3 bg-yellow-400 text-gray-900 rounded-lg shadow-md font-semibold hover:bg-yellow-300 transition"
      >
        Explore Media
      </router-link>
    </section>

    <!-- Featured Media Section -->
    <section>
      <h2 class="text-2xl font-bold mb-6">Featured Media</h2>
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        <!-- Example Media Cards -->
        <MediaCard
          v-for="item in mediaItems"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :thumbnail="item.media_type === 'image' ? item.file_url : item.thumbnail_url"
          :file_url="item.file_url"
          :type="item.media_type"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import MediaCard from "../components/MediaCard.vue";

import { getFileUrl } from "@/utils/helpers";
import { ref, onMounted, computed } from "vue";

// Media and Categories state
const mediaItems = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const BASE_URL = import.meta.env.VITE_API_URL;

// Get token from localStorage
const token = localStorage.getItem("token");

// Fetch all media items
async function fetchMedia() {
  try {
    const res = await fetch(BASE_URL + "media/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    mediaItems.value = await res.json();
  } catch (err) {
    console.error("Failed to fetch media items", err);
  }
}

// Fetch all categories
async function fetchCategories() {
  try {
    const res = await fetch(BASE_URL + "category/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    categories.value = await res.json();
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
