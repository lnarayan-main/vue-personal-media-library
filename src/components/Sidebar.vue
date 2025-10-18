<template>
  <transition name="slide">
    <aside
      v-show="isOpen"
      class="fixed md:static top-0 left-0 z-50 md:z-auto
             w-64 md:w-60 h-full md:min-h-screen
             bg-gray-800 shadow-2xl p-4
             transform md:translate-x-0
             transition-transform duration-300 ease-in-out"
      :class="{
        'translate-x-0': isOpen,
        '-translate-x-full md:translate-x-0': !isOpen
      }"
    >
      <!-- Close button (visible on mobile only) -->
      <button
        class="md:hidden text-gray-300 hover:text-white absolute top-4 right-4"
        @click="$emit('close')"
      >
        ✕
      </button>

      <nav class="flex flex-col space-y-2 mt-10 md:mt-0">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-1">General</p>

      <router-link to="/dashboard" @click="handleLinkClick" :class="[
        'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
        route.path.startsWith('/dashboard')
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      ]">
        <HomeIcon class="h-5 w-5 mr-3" />
        Dashboard
      </router-link>

      <router-link v-if="auth.isUser" to="/media" @click="handleLinkClick" :class="[
        'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
        route.path.startsWith('/media')
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      ]">
        <FilmIcon class="h-5 w-5 mr-3" />
        My Media
      </router-link>
      
      <template v-if="auth.isAdmin">
        <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-6 pb-1 border-t border-gray-700">Administration</p>

        <router-link to="/users-list" @click="handleLinkClick" :class="[
          'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
          route.path.startsWith('/users-list')
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]">
          <UsersIcon class="h-5 w-5 mr-3" />
          User Management
        </router-link>

        <router-link to="/media-list" @click="handleLinkClick" :class="[
          'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
          route.path.startsWith('/media-list')
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]">
          <FilmIcon class="h-5 w-5 mr-3" />
          Media Management
        </router-link>

        <router-link to="/categories" @click="handleLinkClick" :class="[
          'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
          route.path.startsWith('/categories')
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]">
          <TagIcon class="h-5 w-5 mr-3" />
          Category Management
        </router-link>
      </template>
      
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider pt-6 pb-1 border-t border-gray-700">Account</p>

      <router-link to="/profile" @click="handleLinkClick" :class="[
        'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
        route.path.startsWith('/profile')
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      ]">
        <UserCircleIcon class="h-5 w-5 mr-3" />
        Manage Profile
      </router-link>
      </nav>
    </aside>
  </transition>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { useRoute } from 'vue-router';

import {
  HomeIcon,         
  UsersIcon,        
  FilmIcon,         
  TagIcon,          
  UserCircleIcon    
} from '@heroicons/vue/20/solid'; 

const auth = useAuthStore();
const route = useRoute();

defineProps({
  isOpen: {
    type: Boolean,
    default: false,
  },
});

const emit = defineEmits(['close']);

// Method to check screen size and close sidebar if mobile
const handleLinkClick = () => {
  // Check if the current window width is less than the Tailwind 'md' breakpoint (768px)
  if (window.innerWidth < 768) {
    emit('close');
  }
};
</script>

<style scoped>
/* Simple slide transition */
.slide-enter-active,
.slide-leave-active {
  transition: transform 0.3s ease;
}
.slide-enter-from,
.slide-leave-to {
  transform: translateX(-100%);
}
</style>
