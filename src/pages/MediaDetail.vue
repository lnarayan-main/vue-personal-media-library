<template>
  <div class="min-h-screen bg-gray-50 p-2 md:p-6">
    <!-- Back Button -->
    <!-- <button
      @click="goBack"
      class="inline-flex items-center gap-1 mb-4 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition"
    >
      <span class="text-lg">←</span> Back
    </button> -->

    <!-- Loading / Error -->
    <div v-if="loading" class="text-gray-500 mt-8 text-center">
      Loading media...
    </div>

    <div v-else-if="!media" class="text-red-500 mt-8 text-center">
      Media not found.
    </div>

    <!-- ✅ Show only after data is ready -->
    <div v-else class="flex flex-col lg:flex-row gap-2">
      <!-- LEFT SECTION -->
      <div class="flex-1">
        <!-- Media Display -->
        <div class="w-full rounded-xl overflow-hidden bg-black aspect-video shadow-md flex items-center justify-center">
          <video v-if="media.media_type === 'video'" :src="getFileUrl(media.file_url)"
            :poster="getFileUrl(media.thumbnail_url)" controls class="w-full h-full object-cover"></video>

          <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url"
            :file_url="media.file_url" />

          <div v-else class="text-gray-500">Unsupported media type</div>
        </div>

        <!-- Title & Meta -->
        <h1 class="text-2xl md:text-3xl font-semibold text-gray-800 mt-4">
          {{ media.title }}
        </h1>

        <div class="flex items-center justify-between text-sm text-gray-700 mt-3 p-2 border-t border-b border-gray-200">

          <!-- === LEFT GROUP: Profile Pic, Name, and Interaction Buttons === -->
          <div class="flex items-center gap-4 flex-shrink-0">

            <!-- 1. Owner Profile Picture & Name -->
            <span class="flex items-center gap-2">
              <!-- ProfilePic and Name -->
              <ProfilePic :url="media.owner?.profile_pic_url" class="w-8 h-8 rounded-full" />
              <p class="font-semibold text-gray-800">
                {{ media.owner.name }}
              </p>
            </span>

            <button class="px-4 py-2 bg-gray-500 text-white rounded-3xl font-semibold hover:bg-gray-600 transition">
              Subscribe
            </button>

          </div>

          <!-- === RIGHT GROUP: Metadata (Pushed to the far right) === -->
          <div class="flex items-center gap-5 text-gray-600 ml-auto pr-3">

            <div class="flex-shrink-0 bg-gray-200 rounded-2xl">
              <MediaInteractionButtons :media_id="media.id" />
            </div>

            <p>
              <strong class="font-medium text-gray-500">Category:</strong>
              <span class="ml-1 text-indigo-600">{{ media.category?.name || "Uncategorized" }}</span>
            </p>

            <!-- Separator -->
            <div class="h-4 w-px bg-gray-300"></div>

            <p>
              <strong class="font-medium text-gray-500">Type:</strong>
              <span class="ml-1">{{ media.media_type }}</span>
            </p>

            <div class="h-4 w-px bg-gray-300"></div>
            <p>
              <strong class="font-medium text-gray-500">Uploaded:</strong>
              <!-- <span class="ml-1">{{ new Date(media.created_at).toLocaleString() }}</span> -->
              <span class="ml-1">{{ new Date(media.created_at).toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' }) }}</span>
            </p>
          </div>

        </div>


        <!-- Description -->
        <div class="mt-2 border-t border-gray-200 pt-2">
           <p class="text-gray-500 font-bold text-sm">
            12K Views
            <span class="pl-2 text-xs text-gray-500 font-bold">{{ timeAgo(media.created_at) }}</span>
          </p>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">
            {{ media.description }}
          </p>
        </div>

        <!-- Comments Section -->
        <div class=" border-t border-gray-200 pt-2 px-5">
          <Comments :media_id="media.id" :media="media" />
        </div>
      </div>

      <!-- RIGHT SECTION: Related Media -->
      <div class="lg:w-96 flex-shrink-0">
        <div class="mb-4 flex gap-2 overflow-x-auto">
          <button @click="selectedCategory = null" :class="[
            'px-4 py-2 rounded-lg text-white',
            selectedCategory === null ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          ]">
            All
          </button>
          <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
            'px-4 py-2 rounded-lg text-white',
            selectedCategory === cat.id ? 'bg-blue-600' : 'bg-gray-500 hover:bg-gray-600'
          ]">
            {{ cat.name }}
          </button>
        </div>
        <div class="flex flex-col gap-4">
          <CategoryMediaCard v-for="item in filteredMedia" :key="item.id" :media="item"
            class="hover:scale-[1.01] transition-transform duration-300" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { useRoute } from "vue-router";
import router from "@/router";
import axiosApi from "@/utils/axiosApi";
import { getFileUrl, timeAgo } from "@/utils/helpers";
import AudioPlayCard from "@/components/AudioPlayCard.vue";
import MediaInteractionButtons from "@/components/MediaInteractionButtons.vue";
import Comments from "@/components/Comments.vue";
import CategoryMediaCard from "@/components/CategoryMediaCard.vue";
import ProfilePic from "@/components/ProfilePic.vue";

const route = useRoute();
const media = ref(null);
const items = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);
const categories = ref([]);


async function fetchMedia() {
  try {
    const id = route.params.id;
    const res = await axiosApi.get(`media/${id}/details`);
    media.value = res.data.media;
    // items.value = res.data.related_media || [];
  } catch (err) {
    console.error("Failed to fetch media", err);
  } finally {
    loading.value = false;
  }
}


// Fetch all media items
async function fetchMediaList() {
  try {
    const res = await axiosApi.get("media/lists");
    items.value = await res.data;
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

const filteredMedia = computed(() => {
  if (!selectedCategory.value) return items.value;
  return items.value.filter((m) => m.category_id === selectedCategory.value);
});

function goBack() {
  if (window.history.length > 1) router.back();
  else router.push("/media");
}

onMounted(() => {
  fetchCategories();
  fetchMedia();
  fetchMediaList();
});
</script>
