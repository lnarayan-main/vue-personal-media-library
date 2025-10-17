<!-- src/pages/MediaList.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <!-- Hero Section -->
    <!-- <section class="bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white rounded-2xl shadow-lg p-10 text-center mb-5">
      <h1 class="text-4xl md:text-5xl font-bold mb-4">
        Welcome to <span class="text-yellow-300">MediaHub</span>
      </h1>
      <p class="text-lg md:text-xl max-w-2xl mx-auto mb-6">
        Upload, explore, and share your favorite images, videos, and audio
        files — all in one place.
      </p>
    </section> -->

    <HeroSection @scroll-to-media="handleScrollToMedia"/>

    <div ref="mediaLibraryRef" class="flex justify-between items-center mt-5 mb-6">
      <h1 class="text-2xl font-bold">Media Library</h1>
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

     <!-- Loader -->
    <CustomLoader v-if="loading" :text_content="'Loading media...'"/>

    <!-- Empty State -->
    <div v-else-if="filteredMedia.length === 0" class="text-gray-500 mt-10 text-center text-lg flex flex-col items-center">
      <PhotoIcon class="h-10 w-10 mb-3 text-gray-400" />
      <p>No media found in this category.</p>
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
          @delete-media="openDeleteModal"
        />

    </div>
  </div>
  <DeleteConfirmModal :show="showDeleteModal" :recordId="mediaToDelete" @cancel="cancelDelete"
            @confirm="confirmDelete" :recordType="'media'" />
</template>

<script setup>
import CustomLoader from "@/components/CustomLoader.vue";
import DeleteConfirmModal from "@/components/DeleteConfirmModal.vue";
import HeroSection from "@/components/HeroSection.vue";
import MediaCard from "@/components/MediaCard.vue";
import { useAuthStore } from "@/stores/auth";
import axiosApi from "@/utils/axiosApi";
import notify from "@/utils/notify";
import { PhotoIcon } from "@heroicons/vue/20/solid";
import { ref, onMounted, computed } from "vue";

const auth = useAuthStore();

// Media and Categories state
const mediaItems = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);
const BASE_URL = import.meta.env.VITE_API_URL;
const loading = ref(false);

const showDeleteModal = ref(false)
const mediaToDelete = ref(null)

const mediaLibraryRef = ref(null);

const openDeleteModal = (id) => {
  mediaToDelete.value = id
  showDeleteModal.value = true
}

const cancelDelete = () => {
  showDeleteModal.value = false
  mediaToDelete.value = null
}

async function confirmDelete() {
    if (mediaToDelete.value) {
        try {
            const res = await axiosApi.delete(`media/delete/${mediaToDelete.value}`);
            notify.success(res.data.detail || "Media deleted successfully!");
            fetchMedia();
        } catch (error) {
            const errMsg = error.response?.data?.detail || "Failed to delete media.";
            notify.error(errMsg);
            console.error("Delete error:", errMsg);
        } finally {
            showDeleteModal.value = false;
            mediaToDelete.value = null;
        }
    }
}

// Fetch all media items
async function fetchMedia() {
  try {
    loading.value = true;
    const res = await axiosApi.get("media/lists");
    mediaItems.value = await res.data;
  } catch (err) {
    console.error("Failed to fetch media items", err);
  } finally {
    loading.value = false;
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

// handleScrollToMedia

function handleScrollToMedia(){
  if (mediaLibraryRef.value) {
        mediaLibraryRef.value.scrollIntoView({
            behavior: 'smooth',
            block: 'start',
        });
    }
}

// Load data on mounted
onMounted(() => {
  fetchCategories();
  fetchMedia();
});
</script>
