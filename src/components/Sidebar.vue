<template>
  <aside class="bg-gray-100 w-64 min-h-screen shadow-md p-5 hidden md:block">
    <!-- <h2 class="text-xl font-bold text-indigo-600 mb-6">Dashboard</h2> -->

    <nav class="flex flex-col space-y-3">
      <router-link to="/dashboard" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/dashboard')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
        <HomeIcon class="h-5 w-5 mr-2" />
        Dashboard
      </router-link>
      <router-link v-if="auth.isUser" to="/media" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/media')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
      <FilmIcon class="h-5 w-5 mr-2" />
        My Media
      </router-link>
      <router-link v-if="auth.isAdmin" to="/users" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/users')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
      <UsersIcon class="h-5 w-5 mr-2" />
        User Management
      </router-link>
      <router-link v-if="auth.isAdmin" to="/media-list" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/media-list')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
      <FilmIcon class="h-5 w-5 mr-2" />
        Media Management
      </router-link>
      <router-link v-if="auth.isAdmin" to="/categories" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/categories')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
      <TagIcon class="h-5 w-5 mr-2" />
        Category Management
      </router-link>
      <router-link to="/profile" :class="[
        'flex text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/profile')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
      <UserCircleIcon class="h-5 w-5 mr-2" />
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
  HomeIcon,         // For Dashboard
  UsersIcon,        // For User Management
  FilmIcon,         // For Media Management
  TagIcon,          // For Category Management
  UserCircleIcon    // For Manage Profile
} from '@heroicons/vue/20/solid';

const auth = useAuthStore();
const route = useRoute();


</script>