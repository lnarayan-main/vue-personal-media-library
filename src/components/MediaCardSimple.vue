<template>
  <div
    class="bg-white rounded-xl shadow hover:shadow-lg overflow-hidden transition-transform duration-300 hover:scale-101">
    <div class="h-48 bg-gray-200 flex items-center justify-center">
      <template v-if="media.media_type === 'video'">
        <video :src="getFileUrl(media.file_url)" :poster="getFileUrl(media.thumbnail_url)" controls
          class="h-full w-full object-cover" muted></video>
      </template>

      <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url"
        :file_url="media.file_url" />
    </div>
    <div class="p-4">
      <router-link :to="`/media/detail/${media.id}`">
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ media.title }}</h3>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">{{ media.description }}</p>
      </router-link>
      <ActionMenu :type="media.media_type" :media_id="media.id" />
    </div>
  </div>
</template>

<script setup>
import { getFileUrl } from '@/utils/helpers';
import AudioPlayCard from './AudioPlayCard.vue';
import ActionMenu from './ActionMenu.vue';

defineProps({
  media: {
    type: Object,
    required: true,
  },
});
</script>
