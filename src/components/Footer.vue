<!-- src/components/Footer.vue -->
<template>
    <footer class="bg-white border-t border-gray-200 shadow-sm mt-auto">
        <div
            class="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between text-sm text-gray-600">
            <!-- Left side -->
            <div class="flex items-center space-x-2">
                <span>&copy; {{ new Date().getFullYear() }} Streamify Media</span>
                <span class="hidden sm:inline">•</span>
                <span class="text-gray-500">All rights reserved</span>
            </div>

            <!-- Right side -->
            <div class="flex space-x-4 mt-2 sm:mt-0">
                <router-link to="/privacy" class="hover:text-indigo-600 transition">Privacy</router-link>
                <router-link to="/terms" class="hover:text-indigo-600 transition">Terms</router-link>
                <router-link to="/contact" class="hover:text-indigo-600 transition">Contact</router-link>
            </div>
        </div>
    </footer>
</template>
