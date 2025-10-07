<template>
  <div class="min-h-screen bg-gray-50 p-6">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      ￩ Back to Media List
    </button>

    <!-- Media Content -->
    <div
      v-if="media"
      class="bg-white rounded-2xl shadow-lg p-6 flex flex-col md:flex-row gap-8"
    >
      <!-- Left: Media Display -->
      <div class="flex-1">
        <div
          class="w-full rounded-xl overflow-hidden bg-gray-900 aspect-video shadow-md flex items-center justify-center"
        >
          <img
            v-if="media.media_type === 'image'"
            :src="getFileUrl(media.file_url)"
            alt="Media image"
            class="rounded-xl w-full object-cover"
          />
          <video
            v-else-if="media.media_type === 'video'"
            :src="getFileUrl(media.file_url)"
            :poster="getFileUrl(media.thumbnail_url)"
            controls
            class="w-full h-full object-cover"
          ></video>
          <AudioPlayCard
            v-else-if="media.media_type === 'audio'"
            :thumbnail_url="media.thumbnail_url"
            :file_url="media.file_url"
          />
          <div v-else class="text-gray-500">Unsupported media type</div>
        </div>
      </div>

      <!-- Right: Media Details -->
      <div class="flex-1 flex flex-col justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-800 mb-4">
            {{ media.title }}
          </h1>

          <!-- Metadata Section -->
          <div class="text-sm text-gray-500 space-y-1 mb-4">
            <p><strong>Category:</strong> {{ media.category?.name || "Uncategorized" }}</p>
            <p><strong>Type:</strong> {{ media.media_type }}</p>
            <p>
              <strong>Uploaded:</strong>
              {{ new Date(media.created_at).toLocaleString() }}
            </p>
          </div>

          <!-- Description Below Metadata -->
          <p class="text-gray-700 leading-relaxed">
            {{ media.description }}
          </p>
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-else-if="loading" class="text-gray-500">Loading media...</div>
    <div v-else class="text-red-500">Media not found.</div>

    <!-- Related Media Section -->
    <div class="mt-10">
      <h2 class="text-2xl font-semibold text-gray-800 mb-6">
        Related Media
      </h2>
      <div
        class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        <MediaCardSimple
          v-for="item in items"
          :key="item.id"
          :media="item"
        />
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosApi from "@/utils/axiosApi";
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";
import { getFileUrl } from "@/utils/helpers";
import router from "@/router";
import AudioPlayCard from "@/components/AudioPlayCard.vue";
import MediaCardSimple from "@/components/MediaCardSimple.vue";

const route = useRoute();
const media = ref(null);
const loading = ref(true);
const items = ref([]);

async function fetchMedia() {
  try {
    const id = route.params.id;
    const res = await axiosApi.get(`media/${id}/details`);
    media.value = res.data.media;
    items.value = res.data.related_media;
  } catch (err) {
    console.error("Failed to fetch media", err);
  } finally {
    loading.value = false;
  }
}

const goBack = () => {
  if (window.history.length > 1) router.back();
  else router.push("/media");
};

onMounted(fetchMedia);
</script>
