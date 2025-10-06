<!-- src/pages/MediaDetail.vue -->
<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Back Button -->
    <button @click="goBack"
      class="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
      ￩ Back to Media List
    </button>

    <!-- Media Content -->
    <div v-if="media" class="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-6">
      <!-- Left Side: Thumbnail/Video/Image -->
      <div class="flex-1">
        <div
          class="w-full max-w-4xl mx-auto rounded-xl shadow-xl overflow-hidden bg-gray-900 aspect-video flex items-center justify-center">
          <img v-if="media.media_type === 'image'" :src="getFileUrl(media.file_url)" alt="Media image"
            class="rounded-xl w-full object-cover" />
          <video v-if="media.media_type === 'video'" :src="getFileUrl(media.file_url)"
            :poster="getFileUrl(media.thumbnail_url)" controls class="w-full h-full object-cover">
            Your browser does not support the video tag.
          </video>
          <!-- <div v-else-if="media.media_type === 'audio'" class="w-full h-full flex flex-col justify-end p-4"
            :style="{ backgroundImage: `url(${getFileUrl(media.thumbnail_url)})`, backgroundSize: 'cover', backgroundPosition: 'center' }">
            <audio :src="getFileUrl(media.file_url)" controls class="w-full bg-white rounded-b-lg shadow-xl opacity-90"></audio>
          </div> -->
          <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url" :file_url="media.file_url" />
          <div v-else class="text-gray-500">Unsupported media type</div>
        </div>
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
          <router-link :to="`/media/update/${media.id}`">
            <button class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
              Edit
            </button>
          </router-link>
          <button class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition">
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
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getFileUrl } from "@/utils/helpers";
import router from "@/router";
import axiosApi from "@/utils/axiosApi";
import AudioPlayCard from "@/components/AudioPlayCard.vue";

const route = useRoute();
const media = ref(null);
const loading = ref(true);

async function fetchProfile() {
  try {
    const id = route.params.id;

    const res = await axiosApi.get(`media/detail/${id}`);

    media.value = { ...res.data };

  } catch (err) {
    console.error("Failed to fetch media", err);
  } finally {
    loading.value = false;
  }
}

const goBack = () => {
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push('/media');
  }
};


onMounted(() => {
  fetchProfile();
});

</script>


