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
          v-for="item in featuredMedia"
          :key="item.id"
          :title="item.title"
          :description="item.description"
          :thumbnail="item.thumbnail"
          :type="item.type"
        />
      </div>
    </section>
  </div>
</template>

<script setup>
import MediaCard from "../components/MediaCard.vue";

const featuredMedia = [
  {
    id: 1,
    title: "Sunset Landscape",
    description: "A breathtaking view of the mountains during sunset.",
    thumbnail:
      "https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?w=500",
    type: "image",
  },
  {
    id: 2,
    title: "Relaxing Music",
    description: "Calm your mind with soothing instrumental audio.",
    thumbnail:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=500",
    type: "audio",
  },
  {
    id: 3,
    title: "Adventure Vlog",
    description: "Join us on an epic adventure through the wild!",
    thumbnail:
      "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=500",
    type: "video",
  },
];
</script>
