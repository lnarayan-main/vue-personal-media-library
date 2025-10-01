<template>
  <div
    class="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
  >
    <img
      :src="getFileUrl(thumbnail)"
      alt="Media thumbnail"
      class="w-full h-48 object-cover"
    />
    <div class="p-4">
      <h3 class="text-lg font-semibold mb-2">{{ title }}</h3>
      <p class="text-gray-600 text-sm line-clamp-2 mb-3">
        {{ description }}
      </p>
      <span
        class="inline-block px-3 py-1 text-xs font-medium rounded-full"
        :class="{
          'bg-blue-100 text-blue-800': type === 'image',
          'bg-green-100 text-green-800': type === 'audio',
          'bg-red-100 text-red-800': type === 'video',
        }"
      >
        {{ type }}
      </span>
    </div>
  </div>
</template>

<script setup>
import { getFileUrl } from '@/utils/helpers';

defineProps({
  title: String,
  description: String,
  thumbnail: String,
  file_url: String,
  type: String,
});
</script>
