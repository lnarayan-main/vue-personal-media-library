<template>
  <div
    class="bg-white rounded-xl shadow hover:shadow-lg  overflow-hidden transition-transform duration-300 hover:scale-101">
    <div class="h-48 bg-gray-200 flex items-center justify-center relative">
      <div v-if="media.duration" class="absolute bottom-2 right-2 bg-black bg-opacity-70 text-white text-xs px-2 py-1 rounded-md z-10">
        {{ formatDuration(media.duration) }}
      </div>
      <template v-if="media.media_type === 'video'">
        <video src="" :poster="getFileUrl(media.thumbnail_url)"
          class="h-full w-full object-cover" muted></video>
      </template>
      <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url"
        :file_url="media.file_url" />
    </div>
    <div class="p-4">
      <router-link :to="`/media/detail/${media_id}`">
        <h3 class="text-lg font-semibold mb-2 line-clamp-2">{{ title }}</h3>
        <p class="text-gray-600 text-sm line-clamp-2 mb-3">
          {{ description }}
        </p>
      </router-link>
      <ActionMenu :type="type" :media_id="media_id" @delete-media="$emit('delete-media', $event)"
        :owner_id="media.owner_id" :auth_user="auth_user" />
    </div>
  </div>
</template>

<script setup>
import { formatDuration, getFileUrl } from '@/utils/helpers';
import AudioPlayCard from './AudioPlayCard.vue';
import ActionMenu from './ActionMenu.vue';

const BASE_URL = import.meta.env.VITE_API_URL;

const props = defineProps({
  media_id: Number,
  title: String,
  description: String,
  thumbnail: String,
  file_url: String,
  type: String,
  media: Object,
  auth_user: Object,
});

const emit = defineEmits(['delete-media'])

</script>
