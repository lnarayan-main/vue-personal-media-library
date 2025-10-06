<!-- src/components/DeleteConfirmModal.vue -->
<template>
  <div
    v-if="show"
    class="fixed inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm z-50"
  >
    <div class="bg-white dark:bg-gray-200 p-6 rounded-2xl shadow-xl w-full max-w-md">
      <h2 class="text-lg font-semibold mb-3 text-gray-800 dark:text-black">
        Confirm Delete
      </h2>
      <p class="text-gray-600 dark:text-black mb-6">
        Are you sure you want to delete user
        <span class="font-bold text-red-600">#{{ userId }}</span>?  
        This action cannot be undone.
      </p>

      <div class="flex justify-end gap-3">
        <button
          @click="$emit('cancel')"
          class="px-4 py-2 rounded-lg bg-gray-300 text-gray-700 hover:bg-gray-400"
        >
          Cancel
        </button>
        <button
          @click="$emit('confirm', userId)"
          class="px-4 py-2 rounded-lg bg-red-500 text-white hover:bg-red-800"
        >
          Yes, Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
defineProps({
  show: Boolean,
  userId: [String, Number],
})
defineEmits(['cancel', 'confirm'])
</script>
