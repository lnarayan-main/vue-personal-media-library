<template>
  <div class="flex items-center relative">
    <!-- Left: Like/Dislike Buttons -->
    <!-- <div class="flex items-center">
      <MediaInteractionButtons :media_id="media_id" />
    </div> -->

    <!-- Right: 3-dot Menu -->
    <div class="relative flex items-center justify-end">
      <!-- 3 dots icon -->
      <button
        @click.stop="toggleMenu"
        class="p-2 rounded-full hover:bg-gray-100 focus:outline-none transition"
        title="Options"
      >
        <EllipsisVerticalIcon class="h-5 w-5 text-gray-600 hover:text-gray-800" />
      </button>

      <!-- Dropdown (aligned to the right of icon) -->
      <transition name="fade">
        <div
          v-if="menuOpen"
          class="absolute right-8 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-lg px-2 py-1 z-30"
        >
          <!-- Edit -->
          <!-- <router-link
            v-if="canEditDelete"
            :to="`/media/update/${media_id}`"
            @click="menuOpen = false"
            class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="Edit"
          >
            <PencilIcon class="h-4 w-4" />
          </router-link> -->

          <!-- Delete -->
          <button
            v-if="canEditDelete"
            @click="deleteMedia(media_id)"
            class="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500"
            title="Delete"
          >
            <TrashIcon class="h-4 w-4" />
          </button>

          <!-- View -->
          <router-link
            :to="`/media/detail/${media_id}`"
            @click="menuOpen = false"
            class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            title="View"
          >
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
import MediaInteractionButtons from './MediaInteractionButtons.vue'

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
