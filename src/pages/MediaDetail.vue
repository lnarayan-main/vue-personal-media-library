<template>
  <div class="min-h-screen bg-white md:bg-gray-50 px-4 py-6 md:p-8">

    <div v-if="loading" class="text-gray-500 mt-10 text-center text-lg">
      <i class="fas fa-spinner fa-spin mr-2"></i> Loading media details...
    </div>

    <div v-else-if="!media" class="text-red-500 mt-10 text-center text-lg font-semibold">
      404: Media not found.
    </div>

    <div v-else class="grid grid-cols-1 lg:grid-cols-[auto_400px] gap-6 lg:gap-8">
      
      <div class="min-w-0">
        
        <div class="w-full rounded-xl overflow-hidden bg-black shadow-2xl">
          <VideoPlayer v-if="media.media_type === 'video'" 
            :hls_path="media.hls_path" 
            :thumbnail_url="getFileUrl(media.thumbnail_url)" 
            :media="media" 
          />
          <div v-else-if="media.media_type === 'audio'"
            class=" flex items-center justify-center">
            <!-- <AudioPlayCard :thumbnail_url="media.thumbnail_url" :file_url="media.file_url" :showControls="true" /> -->
            <AudioPlayer :hls_path="media.hls_path" :thumbnail_url="getFileUrl(media.thumbnail_url)"  />
          </div>
          <div v-else class="aspect-video text-gray-500 p-8 text-center bg-gray-900">Unsupported media type</div>
        </div>
        
        <h1 class="font-bold text-gray-600 mt-5 mb-3 line-clamp-2">
          {{ media.title }}
        </h1>
        
        <div class="flex flex-col sm:flex-row sm:items-center justify-between py-3 border-y border-gray-200 mb-4">
          
          <div class="flex items-center gap-4 mb-3 sm:mb-0">
            <div class="flex items-center gap-3">
                <router-link :to="`/user-profile/${media.user?.id}`">
                    <ProfilePic :url="media.user?.profile_pic_url" class="w-10 h-10 rounded-full border border-gray-200 flex-shrink-0" />
                </router-link>
              <div>
                <p class="font-bold text-gray-900 leading-none hover:text-indigo-600 transition">
                  {{ media.user.name }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ media.user?.subscribers ? media.user.subscribers.toLocaleString() + ' Subscribers' : '' }}
                </p>
              </div>
            </div>

            <button class="px-5 py-2 bg-red-600 text-white rounded-full font-semibold text-sm shadow hover:bg-red-700 transition flex-shrink-0">
              <i class="fas fa-bell mr-1"></i> Subscribe
            </button>
          </div>
          
          <div class="flex-shrink-0 ml-auto">
            <div class="bg-gray-100 rounded-full flex divide-x divide-gray-200">
              <MediaInteractionButtons :media_id="media.id" />
            </div>
          </div>
        </div>
        
        <div class="bg-gray-100 rounded-xl p-4 mt-4 text-sm hover:bg-gray-180 transition duration-300">
          <div class="flex flex-wrap items-center gap-x-6 gap-y-2 font-medium mb-3 border-b border-gray-200 pb-2">
            
            <p class="text-gray-700">
              <i class="fas fa-eye text-gray-500 mr-1"></i>
              {{ media.views.toLocaleString() }} Views
            </p>
            <p class="text-gray-700">
              <i class="fas fa-calendar-alt text-gray-500 mr-1"></i>
              {{ new Date(media.created_at).toLocaleDateString(undefined, {
                month: 'short', day: 'numeric', year: 'numeric'
              }) }} ({{ timeAgo(media.created_at) }})
            </p>
            
            <p class="text-indigo-700 font-bold sm:ml-auto">
              <i class="fas fa-tag mr-1"></i>
              {{ media.category?.name || "Uncategorized" }}
            </p>
            <p class="text-gray-700 sm:pr-0">
              <i class="fas fa-file-alt text-gray-500 mr-1"></i>
              Type: {{ media.media_type }}
            </p>
          </div>

          <p class="text-gray-700 leading-relaxed whitespace-pre-line text-base line-clamp-2 hover:cursor-pointer mb-2" :class="!isSeeMore ? 'line-clamp-none' : ''">
            {{ media.description }}
          </p>
            <span v-if="isSeeMore" @click="isSeeMore = !isSeeMore" class="p-2 font-bold hover:cursor-pointer">see more</span>
            <span v-else @click="isSeeMore = !isSeeMore" class="p-2 font-bold hover:cursor-pointer">see less</span>
        </div>

        <div class="mt-8 border-t border-gray-200 pt-6">
          <Comments :media_id="media.id" :media="media" />
        </div>
      </div>

      <div class="lg:sticky lg:top-8 self-start pt-0">
        
        <h2 class="text-xl font-bold text-gray-900 mb-4">Related Media</h2>

        <div class="mb-5 flex gap-3 overflow-x-auto pb-2 border-b border-gray-200">
          <button @click="selectedCategory = null" :class="[
            'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap',
            selectedCategory === null ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            All
          </button>
          <button v-for="cat in categories" :key="cat.id" @click="selectedCategory = cat.id" :class="[
            'px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap',
            selectedCategory === cat.id ? 'bg-indigo-600 text-white shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          ]">
            {{ cat.name }}
          </button>
        </div>
        
        <div class="flex flex-col gap-3">
          <CategoryMediaCard v-for="item in filteredMedia" :key="item.id" :media="item"
            class="hover:shadow-lg transition-shadow duration-200" 
          />
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
import VideoPlayer from "@/components/VideoPlayer.vue";
import AudioPlayer from "@/components/AudioPlayer.vue";

const route = useRoute();
const media = ref(null);
const items = ref([]);
const loading = ref(true);
const selectedCategory = ref(null);
const categories = ref([]);
const isSeeMore = ref(true);


async function fetchMedia() {
  try {
    const id = route.params.id;
    const res = await axiosApi.get(`media/${id}/details`);
    media.value = res.data.media;
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

async function incrementMediaViews() {
  const id = route.params.id;
  if (id) {
    try {
      await axiosApi.post(`media/views/${id}`);
    } catch (err) {
      console.error(err);
    }
  }
}

onMounted(() => {
  fetchCategories();
  fetchMedia();
  fetchMediaList();
  setTimeout(() => {
    incrementMediaViews();
  }, 8000);
});
</script>