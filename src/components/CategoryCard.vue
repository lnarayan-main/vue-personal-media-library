<template>
  <div
    class="bg-white rounded-xl shadow hover:shadow-lg transition p-5 cursor-pointer flex flex-col items-center text-center"
  >
    <div
      class="w-16 h-16 flex items-center justify-center rounded-full bg-indigo-100 text-indigo-600 mb-3 text-xl font-bold"
    >
      {{ category.name[0].toUpperCase() }}
    </div>
    <h3 class="text-lg font-semibold">{{ category.name }}</h3>
    <p class="text-gray-600 text-sm mt-1 line-clamp-2">
      {{ category.description }}
    </p>
  </div>
</template>

<script setup>
defineProps({
  category: {
    type: Object,
    required: true,
  },
});
</script>
