<template>
  <nav class="bg-white shadow-md px-6 py-3 flex items-center justify-between sticky top-0 z-50">
    <!-- Logo -->
    <router-link to="/home" class="text-2xl font-bold text-indigo-600">
      MediaHub
    </router-link>

    <!-- Navigation Links -->
    <div class="hidden md:flex space-x-6">
      <router-link to="/home" :class="[
        'text-gray-700 hover:text-indigo-600 font-medium',
        route.path.startsWith('/home')
          ? 'text-indigo-600'
          : 'text-gray-700'
      ]">
        Home
      </router-link>
      <!-- <router-link
        to="/media"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/media') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Media
      </router-link> -->
      <!-- <router-link
        v-if="auth.isLoggedIn"
        to="/categories"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/categories') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Categories
      </router-link> -->
      <!-- <router-link
        v-if="auth.isLoggedIn" 
        to="/dashboard"
        :class="[
          'text-gray-700 hover:text-indigo-600 font-medium',
          route.path.startsWith('/dashboard') 
            ? 'text-indigo-600' 
            : 'text-gray-700'
        ]"
      >
        Dashboard
      </router-link> -->
    </div>

    <!-- User Profile/Login -->
    <!-- <div>
      <router-link v-if="!auth.isLoggedIn" to="/login"
        class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-500 transition">
        Login
      </router-link>

      <button v-else @click="auth.logout"
        class="px-4 py-2 bg-red-600 text-white rounded-lg font-semibold hover:bg-red-500 transition">
        Logout
      </button>

    </div> -->

    <div class="flex items-center space-x-6">
      <!-- Authenticated User Actions -->
      <!-- <div v-if="auth.isLoggedIn" class="flex items-center space-x-4">

        <router-link to="/profile">
          <img :src="getFileUrl(auth.currentUser.profile_pic_url) || 'https://avatar.iran.liara.run/public/38'"
            alt="User Avatar"
            class="h-10 w-10 object-cover rounded-full border-2 border-indigo-500 cursor-pointer hover:shadow-lg transition"
            onerror="this.onerror=null; this.src='https://avatar.iran.liara.run/public/38''" />
        </router-link>

        <button @click="auth.logout"
          class="px-4 py-2 bg-red-600 text-white text-sm rounded-lg font-semibold hover:bg-red-700 transition shadow-md">
          Logout
        </button>

      </div> -->


      <div v-if="auth.isLoggedIn && auth.currentUser" class="relative flex">

        <span class="text-gray-700 font-medium mr-4">
          {{ auth.currentUser.name }}
        </span>

        <button @click="toggleDropdown" class="focus:outline-none" ref="profileButton">
          <img :src="auth.currentUser.profile_pic_url || 'https://avatar.iran.liara.run/public/38'" alt="User Avatar"
            class="h-10 w-10 object-cover rounded-full border-2 border-indigo-500 cursor-pointer hover:shadow-lg transition"
            onerror="this.onerror=null; this.src='https://avatar.iran.liara.run/public/38'" />
        </button>

        <div v-if="isDropdownOpen"
          class="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-1 z-20 border border-gray-100">

          <!-- <div class="px-4 py-2 text-sm text-gray-700 border-b mb-1 truncate">
                {{ auth.currentUser.email }}
            </div> -->

          <router-link to="/profile" @click="isDropdownOpen = false"
            class="block px-4 py-2 text-gray-700 hover:bg-gray-100 transition">
            Profile
          </router-link>

          <button @click="handleLogout"
            class="w-full text-left px-4 py-2 text-red-600 hover:bg-red-50 transition rounded-b-lg">
            Logout
          </button>
        </div>
      </div>

      <!-- Guest Actions -->
      <div v-else class="flex items-center space-x-4">
        <router-link to="/login" class="text-indigo-600 font-medium hover:underline">Login</router-link>
        <router-link to="/register"
          class="px-4 py-2 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition">
          Register
        </router-link>
      </div>

    </div>

  </nav>
</template>

<script setup>
import { useAuthStore } from '@/stores/auth';
import { getFileUrl } from '@/utils/helpers';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';

const auth = useAuthStore();
const route = useRoute();


const isDropdownOpen = ref(false);
const profileButton = ref(null);

const toggleDropdown = () => {
  isDropdownOpen.value = !isDropdownOpen.value;
};

const handleLogout = () => {
  auth.logout();
  isDropdownOpen.value = false;
  router.push('/login');
};

// Function to close dropdown if click is outside
const handleOutsideClick = (event) => {
  // If the dropdown is open and the click target is not the button or part of the dropdown
  if (isDropdownOpen.value && profileButton.value && !profileButton.value.contains(event.target)) {
    // Check if the click is outside the dropdown itself
    const dropdown = profileButton.value.nextElementSibling; // Assuming the dropdown is the next sibling
    if (dropdown && !dropdown.contains(event.target)) {
      isDropdownOpen.value = false;
    }
  }
};

// Attach and remove the event listener
onMounted(() => {
  document.addEventListener('click', handleOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', handleOutsideClick);
});

</script>
