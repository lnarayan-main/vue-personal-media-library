<template>
  <div class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden">
    <!-- <img :src="getFileUrl(thumbnail)" alt="Media thumbnail" class="w-full h-48 object-cover" /> -->
     <div class="h-48 bg-gray-200 flex items-center justify-center">
          <template v-if="media.media_type === 'image'">
            <img :src="`${BASE_URL}${media.file_url}`" alt="" class="h-full w-full object-cover" />
          </template>
          <template v-else-if="media.media_type === 'video'">
            <video :src="getFileUrl(media.file_url)" :poster="getFileUrl(media.thumbnail_url)" controls
              class="h-full w-full object-cover" muted></video>
          </template>
          <template v-else-if="media.media_type === 'audio'">
            <div class="w-full h-full flex flex-col justify-end" :style="{
              backgroundImage: `url(${getFileUrl(media.thumbnail_url)})`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundColor: '#333'
            }">
              <audio :src="`${BASE_URL}${media.file_url}`" controls class="w-full"></audio>
            </div>
          </template>
        </div>
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-sm line-clamp-2 mb-3">
        {{ description }}
      </p>
      <div class="flex items-center justify-between mt-3">
        <span class="inline-block px-3 py-1 text-xs font-medium rounded-full" :class="{
          'bg-blue-100 text-blue-800': type === 'image',
          'bg-green-100 text-green-800': type === 'audio',
          'bg-red-100 text-red-800': type === 'video',
        }">
          {{ type }}
        </span>
        <router-link :to="`/media/detail/${media_id}`" class="mt-2 text-blue-600 hover:underline">
          View Details
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { getFileUrl } from '@/utils/helpers';

const BASE_URL = import.meta.env.VITE_API_URL;

defineProps({
  media_id: Number,
  title: String,
  description: String,
  thumbnail: String,
  file_url: String,
  type: String,
  media: Object
});
</script>
