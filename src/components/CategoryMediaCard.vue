<template>
  <router-link :to="`/media/detail/${media.id}`" 
    class="flex gap-2 p-1 hover:bg-gray-100 rounded-lg transition duration-150 group"
  >
    
    <div class="w-24 h-16 flex-shrink-0 relative"> 
      
      <div v-if="media.duration"
        class="absolute bottom-1 right-1 bg-black bg-opacity-70 text-white text-xs px-1.5 py-0.5 rounded z-10 font-medium"
      >
        {{ formatDuration(media.duration) }}
      </div>
      
      <div class="w-full h-full rounded-md overflow-hidden bg-gray-900 flex items-center justify-center">
        <img v-if="media.thumbnail_url" 
          :src="getFileUrl(media.thumbnail_url)" 
          alt="Media Thumbnail"
          class="w-full h-full object-cover"
        />
        <div v-else class="text-xs text-gray-400">No Image</div>
      </div>
    </div>

    <div class="flex-1 min-w-0">
      <h3 class="text-sm text-gray-900 line-clamp-2 leading-tight group-hover:text-indigo-600">
        {{ media.title }}
      </h3>
      
      <p class="text-xs text-gray-600 mt-0.5">
        {{ media.user?.name }}
      </p>
      
      <p class="text-xs text-gray-500 mt-0.5">
        {{ media.views.toLocaleString() }} Views 
        <span class="text-gray-400">•</span>
        {{ timeAgo(media.created_at) }}
      </p>
    </div>
  </router-link>
</template>

<script setup>
import { formatDuration, getFileUrl, timeAgo } from '@/utils/helpers';

// Props definition for this small card
defineProps({
  media: {
    type: Object,
    required: true,
  },
});
</script>