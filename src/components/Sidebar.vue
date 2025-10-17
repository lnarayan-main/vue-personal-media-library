<template>
  <aside class="bg-gray-800 w-60 min-h-screen shadow-2xl p-4 hidden md:block transition-all duration-300">
    
    <!-- <div class="mb-8 mt-2">
      <h1 class="text-2xl font-extrabold text-indigo-400 tracking-wider">MediaHub</h1>
      <p class="text-xs text-gray-500 mt-1">System Admin</p>
    </div> -->

    <nav class="flex flex-col space-y-2">
      
      <p class="text-xs font-semibold text-gray-500 uppercase tracking-wider mt-4 mb-1">General</p>

      <router-link to="/dashboard" :class="[
        'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
        route.path.startsWith('/dashboard')
          ? 'bg-indigo-600 text-white shadow-md'
          : 'text-gray-300 hover:bg-gray-700 hover:text-white'
      ]">
        <HomeIcon class="h-5 w-5 mr-3" />
        Dashboard
      </router-link>

      <router-link v-if="auth.isUser" to="/media" :class="[
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

        <router-link to="/users-list" :class="[
          'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
          route.path.startsWith('/users-list')
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]">
          <UsersIcon class="h-5 w-5 mr-3" />
          User Management
        </router-link>

        <router-link to="/media-list" :class="[
          'flex items-center py-2 px-3 rounded-lg font-semibold transition duration-200 ease-in-out',
          route.path.startsWith('/media-list')
            ? 'bg-indigo-600 text-white shadow-md'
            : 'text-gray-300 hover:bg-gray-700 hover:text-white'
        ]">
          <FilmIcon class="h-5 w-5 mr-3" />
          Media Management
        </router-link>

        <router-link to="/categories" :class="[
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

      <router-link to="/profile" :class="[
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
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { computed } from 'vue';
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
</script>