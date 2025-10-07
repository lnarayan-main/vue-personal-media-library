<template>
  <div class="flex items-center justify-between mt-3 relative">
    <!-- Media type badge -->
    <span class="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize" :class="{
      'bg-blue-100 text-blue-800': type === 'image',
      'bg-green-100 text-green-800': type === 'audio',
      'bg-red-100 text-red-800': type === 'video',
    }">
      {{ type }}
    </span>

    <!-- 3-dot menu -->
    <div class="relative">
      <button @click.stop="toggleMenu" class="p-2 rounded-full hover:bg-gray-100 focus:outline-none">
        <!-- vertical dots icon -->
        <!-- <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="4"
          stroke="currentColor"
          class="w-5 h-5 text-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75h.01M12 12h.01M12 17.25h.01"
          />
        </svg> -->
        <EllipsisVerticalIcon class="h-4 w-4" />
      </button>

      <!-- Dropdown (horizontal, left side) -->
      <transition name="fade">
        <div v-if="menuOpen"
          class="absolute -left-32 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-md px-2 py-1 z-20 mr-5">
          <!-- Edit -->
          <router-link v-if="canEditDelete" :to="`/media/update/${media_id}`"
            class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Edit">
            <PencilIcon class="h-4 w-4" />
          </router-link>

          <!-- Delete -->
          <button v-if="canEditDelete" @click="deleteMedia(media_id)"
            class="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Delete">
            <TrashIcon class="h-4 w-4" />
          </button>

          <!-- View -->
          <router-link :to="`/media/detail/${media_id}`"
            class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="View" @click="menuOpen = false">
            <EyeIcon class="h-4 w-4" />
          </router-link>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { EllipsisVerticalIcon, EyeIcon, PencilIcon, TrashIcon } from '@heroicons/vue/20/solid'
import { ref, onMounted, computed } from 'vue'

const props = defineProps({
  type: String,
  media_id: [String, Number],
  owner_id: [String, Number],
  auth_user: { type: Object, default: null },
})

const emit = defineEmits(['delete-media'])

const deleteMedia = () => {
  emit('delete-media', props.media_id)
}


const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

onMounted(() => {
  document.addEventListener('click', (e) => {
    const isMenuButton = e.target.closest('.relative')
    if (!isMenuButton) menuOpen.value = false
  })
})


const canEditDelete = computed(() => {
  if (!props.auth_user) return false
  if (props.auth_user.role !== 'user') return false
  return props.auth_user.id === props.owner_id
})


</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: all 0.15s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scale(0.95);
}
</style>
