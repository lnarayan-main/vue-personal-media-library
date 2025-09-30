<!-- src/pages/MediaList.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Media Library</h1>

    <!-- Category Filter -->
    <div class="mb-4 flex gap-2 overflow-x-auto">
      <button
        v-for="cat in categories"
        :key="cat.id"
        @click="selectedCategory = cat.id"
        :class="[
          'px-4 py-2 rounded-lg text-white',
          selectedCategory === cat.id ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
        ]"
      >
        {{ cat.name }}
      </button>
      <button
        @click="selectedCategory = null"
        :class="[
          'px-4 py-2 rounded-lg text-white',
          selectedCategory === null ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
        ]"
      >
        All
      </button>
    </div>

    <!-- Media Grid -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      <div
        v-for="media in filteredMedia"
        :key="media.id"
        class="bg-white shadow rounded-lg overflow-hidden"
      >
        <!-- Media Preview -->
        <div class="h-48 bg-gray-200 flex items-center justify-center">
          <template v-if="media.media_type === 'image'">
            <img :src="media.file_url" alt="" class="h-full w-full object-cover" />
          </template>
          <template v-else-if="media.media_type === 'video'">
            <video :src="media.file_url" class="h-full w-full object-cover" muted></video>
          </template>
          <template v-else-if="media.media_type === 'audio'">
            <audio :src="media.file_url" controls class="w-full"></audio>
          </template>
        </div>

        <!-- Media Info -->
        <div class="p-4 flex flex-col gap-2">
          <h2 class="font-semibold text-lg truncate">{{ media.title }}</h2>
          <p class="text-sm text-gray-600 truncate">{{ media.description }}</p>
          <router-link
            :to="`/media/${media.id}`"
            class="mt-2 text-blue-600 hover:underline"
          >
            View Details
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";

// Media and Categories state
const mediaItems = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);

// Get token from localStorage
const token = localStorage.getItem("token");

// Fetch all media items
async function fetchMedia() {
  try {
    const res = await fetch("http://localhost:8000/media", {
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
    const res = await fetch("http://localhost:8000/categories", {
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
