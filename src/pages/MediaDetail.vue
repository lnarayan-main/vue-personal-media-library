<!-- src/pages/MediaDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Back Button -->
    <router-link
      to="/media"
      class="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      ← Back to Media List
    </router-link>

    <!-- Media Content -->
    <div
      v-if="media"
      class="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6"
    >
      <!-- Left Side: Thumbnail/Video/Image -->
      <div class="flex-1">
        <img
          v-if="media.media_type === 'image'"
          :src="media.file_url"
          alt="Media image"
          class="rounded-xl w-full object-cover"
        />
        <video
          v-else-if="media.media_type === 'video'"
          :src="media.file_url"
          controls
          class="rounded-xl w-full"
        ></video>
        <audio
          v-else-if="media.media_type === 'audio'"
          :src="media.file_url"
          controls
          class="w-full"
        ></audio>
        <div v-else class="text-gray-500">Unsupported media type</div>
      </div>

      <!-- Right Side: Details -->
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-2">
            {{ media.title }}
          </h1>
          <p class="text-gray-600 mb-4">{{ media.description }}</p>

          <div class="text-sm text-gray-500 space-y-1">
            <p><strong>Category:</strong> {{ media.category?.name || "Uncategorized" }}</p>
            <p><strong>Type:</strong> {{ media.media_type }}</p>
            <p>
              <strong>Uploaded:</strong>
              {{ new Date(media.created_at).toLocaleString() }}
            </p>
          </div>
        </div>

        <!-- Actions (for later: edit/delete if owner) -->
        <div class="mt-6 flex gap-4">
          <button
            class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Edit
          </button>
          <button
            class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-else-if="loading" class="text-gray-500">Loading media...</div>
    <div v-else class="text-red-500">Media not found.</div>
  </div>
</template>

<script setup>
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const media = ref(null);
const loading = ref(true);

onMounted(async () => {
  try {
    const id = route.params.id;
    const res = await fetch(`http://localhost:8000/media/${id}`);
    if (res.ok) {
      media.value = await res.json();
    }
  } catch (err) {
    console.error("Failed to fetch media", err);
  } finally {
    loading.value = false;
  }
});
</script>
