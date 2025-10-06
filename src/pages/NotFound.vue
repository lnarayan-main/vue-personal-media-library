<template>
  <div class="flex flex-col items-center justify-center h-screen bg-gray-100 text-center">
    <div class="max-w-md p-8 bg-white rounded-2xl shadow-lg">
      <h1 class="text-7xl font-extrabold text-blue-600 mb-4">404</h1>
      <h2 class="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
      <p class="text-gray-500 mb-6">
        Oops! The page you’re looking for doesn’t exist or may have been moved.
      </p>
      <router-link
        to="/"
        class="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors duration-300"
      >
        Back to Home
      </router-link>
    </div>
  </div>
</template>

<script setup>

</script>
