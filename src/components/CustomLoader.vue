<template>
    <div class="text-gray-500 mt-10 text-center text-lg flex justify-center items-center gap-2">
      <ArrowPathIcon class="h-6 w-6 animate-spin text-gray-400" />
      {{ text_content }}
    </div>
</template>

<script setup>
import { ArrowPathIcon } from '@heroicons/vue/20/solid';

const props = defineProps({
    text_content: String
})
</script>