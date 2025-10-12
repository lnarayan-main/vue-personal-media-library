<template>
  <div v-if="media" class="bg-white rounded-2xl shadow-lg p-1 flex flex-col md:flex-row gap-2">
    <!-- Left: Media Display -->
    <router-link :to="`/media/detail/${media.id}`" class="flex-1">
      <div class="w-full rounded overflow-hidden bg-gray-900 aspect-video shadow-md flex items-center justify-center">
        <video v-if="media.media_type === 'video'" :src="getFileUrl(media.file_url)"
          :poster="getFileUrl(media.thumbnail_url)" class="w-full h-full object-cover"></video>
        <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url"
          :file_url="media.file_url" />
        <div v-else class="text-gray-500">Unsupported media type</div>
      </div>
    </router-link>

    <!-- Right: Media Details -->
    <div class="flex-1 flex flex-col justify-between">
      <router-link :to="`/media/detail/${media.id}`">
        <h1 class="font-bold text-gray-800 mb-2 line-clamp-2">
          {{ media.title }}
        </h1>
        <span>{{ media.user?.name }}</span>
      </router-link>
      <p class="text-gray-500 font-bold text-sm">
        {{ media.views }} Views
        <span class="pl-2 text-xs text-gray-500 font-bold">{{ timeAgo(media.created_at) }}</span>
      </p>
    </div>
  </div>

  <!-- Loading / Error -->
  <div v-else-if="loading" class="text-gray-500">Loading media...</div>
  <div v-else class="text-red-500">Media not found.</div>
</template>

<script setup>
import { getFileUrl, timeAgo } from '@/utils/helpers';
import AudioPlayCard from './AudioPlayCard.vue';
import ActionMenu from './ActionMenu.vue';

defineProps({
  media: {
    type: Object,
    required: true,
  },
});
</script>
