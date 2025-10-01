<template>
  <aside class="bg-gray-100 w-64 min-h-screen shadow-md p-5 hidden md:block">
    <!-- <h2 class="text-xl font-bold text-indigo-600 mb-6">Dashboard</h2> -->

    <nav class="flex flex-col space-y-3">
      <router-link
        to="/dashboard"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Dashboard
      </router-link>
      <router-link
        to="/media"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        My Media
      </router-link>
      <router-link
        to="/categories"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Categories
      </router-link>
      <router-link
        to="/profile"
        class="text-gray-700 hover:text-indigo-600 font-medium"
      >
        Profile
      </router-link>
    </nav>
  </aside>
</template>
