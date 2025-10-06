<template>
  <div class="flex items-center justify-between mt-3 relative">
    <!-- Media type badge -->
    <span
      class="inline-block px-3 py-1 text-xs font-medium rounded-full capitalize"
      :class="{
        'bg-blue-100 text-blue-800': type === 'image',
        'bg-green-100 text-green-800': type === 'audio',
        'bg-red-100 text-red-800': type === 'video',
      }"
    >
      {{ type }}
    </span>

    <!-- 3-dot menu -->
    <div class="relative">
      <button
        @click.stop="toggleMenu"
        class="p-2 rounded-full hover:bg-gray-100 focus:outline-none"
      >
        <!-- vertical dots icon -->
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          stroke-width="3"
          stroke="currentColor"
          class="w-5 h-5 text-gray-600"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            d="M12 6.75h.01M12 12h.01M12 17.25h.01"
          />
        </svg>
      </button>

      <!-- Dropdown (horizontal, left side) -->
      <transition name="fade">
        <div
          v-if="menuOpen"
          class="absolute -left-32 top-1/2 -translate-y-1/2 flex items-center gap-2 bg-white border border-gray-200 rounded-full shadow-md px-2 py-1 z-20 mr-5"
        >
          <!-- View -->
          <router-link
            :to="`/media/detail/${media_id}`"
            class="p-2 hover:bg-gray-100 rounded-full group"
            title="View"
            @click="menuOpen = false"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 text-gray-600 group-hover:text-blue-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.26 4.5 12 4.5c4.739 0 8.576 3.01 9.964 7.183.07.207.07.432 0 .639C20.576 16.49 16.739 19.5 12 19.5c-4.74 0-8.577-3.01-9.964-7.178z"
              />
              <circle cx="12" cy="12" r="3" />
            </svg>
          </router-link>

          <!-- Edit -->
          <button
            @click="editMedia"
            class="p-2 hover:bg-gray-100 rounded-full group"
            title="Edit"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 text-gray-600 group-hover:text-green-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M16.862 4.487l1.687 1.687a1.5 1.5 0 010 2.121l-9.193 9.193a1.5 1.5 0 01-.53.332l-3.688 1.229a.375.375 0 01-.475-.475l1.228-3.688a1.5 1.5 0 01.332-.53l9.193-9.193a1.5 1.5 0 012.121 0z"
              />
            </svg>
          </button>

          <!-- Delete -->
          <button
            @click="deleteMedia"
            class="p-2 hover:bg-gray-100 rounded-full group"
            title="Delete"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke-width="2"
              stroke="currentColor"
              class="w-5 h-5 text-gray-600 group-hover:text-red-600"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                d="M6 7h12M9 7V4h6v3m-7 4v7m4-7v7M4 7h16l-1 12a2 2 0 01-2 2H7a2 2 0 01-2-2L4 7z"
              />
            </svg>
          </button>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const props = defineProps({
  type: String,
  media_id: [String, Number],
})

const menuOpen = ref(false)
const toggleMenu = () => (menuOpen.value = !menuOpen.value)

onMounted(() => {
  document.addEventListener('click', (e) => {
    const isMenuButton = e.target.closest('.relative')
    if (!isMenuButton) menuOpen.value = false
  })
})

const editMedia = () => {
  menuOpen.value = false
  alert(`Edit media ${props.media_id}`)
}

const deleteMedia = () => {
  menuOpen.value = false
  alert(`Delete media ${props.media_id}`)
}
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
