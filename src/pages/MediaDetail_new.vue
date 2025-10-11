<template>
  <div class="min-h-screen bg-gray-50 p-4 md:p-6">
    <!-- Back Button -->
    <button
      @click="goBack"
      class="inline-flex items-center gap-1 mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      <span class="text-lg">←</span> Back
    </button>

    <div class="flex flex-col lg:flex-row gap-8">
      <!-- LEFT SECTION: Main Video & Info -->
      <div class="flex-1">
        <!-- Media Display -->
        <div
          class="w-full rounded-xl overflow-hidden bg-black aspect-video shadow-md flex items-center justify-center"
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

        <!-- Title & Meta -->
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
          {{ media.title }}
        </h1>

        <div class="text-sm text-gray-500 mt-2">
          <p>
            <strong>Category:</strong>
            {{ media.category?.name || "Uncategorized" }}
          </p>
          <p><strong>Type:</strong> {{ media.media_type }}</p>
          <p>
            <strong>Uploaded:</strong>
            {{ new Date(media.created_at).toLocaleString() }}
          </p>
        </div>

        <!-- Interaction Buttons -->
        <div class="mt-4 border-t border-gray-200 pt-4">
          <MediaInteractionButtons :media_id="media.id" />
        </div>

        <!-- Description -->
        <div class="mt-6 border-t border-gray-200 pt-4">
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ media.description }}
          </p>
        </div>

        <!-- Comments Section -->
        <div class="mt-8 border-t border-gray-200 pt-6">
          <h2 class="text-lg font-semibold text-gray-800 mb-4">Comments</h2>
          <Comments :media_id="media.id" />
        </div>
      </div>

      <!-- RIGHT SECTION: Related Media -->
      <div class="lg:w-96 flex-shrink-0">
        <h2 class="text-xl font-semibold text-gray-800 mb-4">Related Media</h2>
        <div class="flex flex-col gap-4">
          <MediaCardSimple
            v-for="item in items"
            :key="item.id"
            :media="item"
            class="hover:scale-[1.02] transition-transform duration-300"
          />
        </div>
      </div>
    </div>

    <!-- Loading / Error -->
    <div v-if="loading" class="text-gray-500 mt-8 text-center">
      Loading media...
    </div>
    <div v-else-if="!media" class="text-red-500 mt-8 text-center">
      Media not found.
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import axiosApi from "@/utils/axiosApi";
import { getFileUrl } from "@/utils/helpers";
import AudioPlayCard from "@/components/AudioPlayCard.vue";
import MediaCardSimple from "@/components/MediaCardSimple.vue";
import MediaInteractionButtons from "@/components/MediaInteractionButtons.vue";
import Comments from "@/components/Comments.vue";

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

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/media");
}

onMounted(fetchMedia);
</script>
