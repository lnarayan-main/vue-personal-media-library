<template>
  <aside class="bg-gray-100 w-64 min-h-screen shadow-md p-5 hidden md:block">
    <!-- <h2 class="text-xl font-bold text-indigo-600 mb-6">Dashboard</h2> -->

    <nav class="flex flex-col space-y-3">
      <router-link
        to="/dashboard"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/dashboard') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Dashboard
      </router-link>
      <router-link
        to="/media"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/media') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        My Media
      </router-link>
      <router-link
        to="/categories"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/categories') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Categories
      </router-link>
      <router-link
        to="/profile"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/profile') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Profile
      </router-link>
    </nav>
  </aside>
</template>

<script setup>
import { useRoute } from 'vue-router';

const route = useRoute();
</script>