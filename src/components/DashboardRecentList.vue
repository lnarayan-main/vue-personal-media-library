<template>
    <div class="bg-white rounded-xl shadow-lg p-6 mb-6">
        <h2 class="text-2xl font-semibold text-gray-800 mb-6">{{ title }}</h2>
        <div class="hidden sm:grid grid-cols-12 gap-4 border-b pb-3 text-xs font-bold uppercase text-gray-500 tracking-wider">
            <div class="col-span-1"></div> 
            <div class="col-span-4">
                {{ type === 'media' ? 'Media Title' : 'User Name' }}
            </div>
            <div class="col-span-4">
                {{ type === 'media' ? 'Description' : 'Email' }}
            </div>
            <div class="col-span-3 text-right">Date Added</div>
        </div>

        <!-- List Items -->
        <div class="space-y-4 pt-2">
            <div 
                v-for="item in items" 
                :key="item.id" 
                class="grid grid-cols-12 items-center gap-4 py-3 border-b hover:bg-gray-50 transition duration-150 rounded-md -mx-2 px-2"
            >
                <div class="col-span-1 flex justify-center">
                    <img
                        :src="getAssetUrl(item, type)"
                        alt="Asset thumbnail/profile"
                        :class="{ 
                            'w-10 h-10 rounded-full object-cover': type === 'users',
                            'w-10 h-10 rounded-lg object-cover': type === 'media' 
                        }"
                        class="object-cover shadow-sm bg-gray-200"
                        onerror="this.onerror=null; this.src='https://placehold.co/32x32/d1d5db/4b5563?text=N/A';"
                    />
                </div>

                <div class="col-span-4 min-w-0">
                    <h3 class="font-medium text-gray-800 truncate">
                        {{ type === 'media' ? item.title : item.name }}
                    </h3>
                    <p v-if="type === 'media'" class="text-sm text-gray-600 truncate">
                        {{  item.category?.name }}
                    </p>
                </div>

                <div class="col-span-4 min-w-0">
                    <p v-if="type === 'media'" class="text-sm text-gray-600 truncate">
                        {{ item.description }}
                    </p>
                    <p v-else-if="type === 'users'" class="text-sm text-gray-600 truncate">
                        {{ item.email }}
                    </p>
                </div>

                <!-- 4. Date Column -->
                <div class="col-span-3 text-right">
                    <span class="text-xs text-gray-500">
                        {{ formatDate(item.created_at, 'en-GB') }}
                    </span>
                </div>
            </div>
        </div>

        <div v-if="!items || items.length === 0" class="text-center text-gray-500 py-4">
            No recent items to display.
        </div>
    </div>
</template>

<script setup>
import { defineProps } from 'vue';
// ⭐️ Import the necessary helpers ⭐️
import { getFileUrl, formatDate } from '@/utils/helpers'; 

defineProps({
    title: String,
    // Note: It's better to use 'Array' for list props, though 'Object' is valid for reactive array
    items: {
        type: [Array, Object],
        default: () => []
    },
    type: {
        type: String,
        required: true,
        validator: (value) => ['media', 'users'].includes(value)
    }
});

/**
 * Determines the correct URL for the asset (thumbnail or profile pic).
 */
function getAssetUrl(item, type) {
    let urlPath = '';
    
    if (type === 'media') {
        // Use thumbnail_url if available, otherwise fallback to the main file_url
        urlPath = item.thumbnail_url || item.file_url;
    } else if (type === 'users') {
        // Use the user's profile picture URL
        urlPath = item.profile_pic_url;
    }

    if (urlPath) {
        return getFileUrl(urlPath);
    }

    // Default placeholder based on type
    if (type === 'media') {
        return 'https://placehold.co/32x32/a8a8a8/ffffff?text=M'; // Media placeholder
    } else {
        return 'https://placehold.co/32x32/6366f1/ffffff?text=U'; // User placeholder (Indigo)
    }
}
</script>
