<template>
    <div class="bg-white rounded-xl shadow-lg transition-shadow duration-300 hover:shadow-2xl overflow-hidden group">
        <router-link :to="`/media/detail/${media_id}`" class="block relative aspect-video h-auto w-full">

            <div
                class="w-full h-full bg-gray-900 flex items-center justify-center relative overflow-hidden rounded-t-xl">
                <div
                    class="absolute inset-0 bg-black opacity-0 group-hover:opacity-10 transition-opacity duration-300 pointer-events-none">
                </div>

                <div v-if="media.duration"
                    class="absolute bottom-2 right-2 bg-black bg-opacity-80 text-white text-xs px-2 py-0.5 rounded-full z-10 font-medium tracking-wide">
                    {{ formatDuration(media.duration) }}
                </div>

                <template v-if="media.media_type === 'video'">
                    <video :src="media.file_url" :poster="getFileUrl(media.thumbnail_url)"
                        class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        muted></video>
                </template>

                <AudioPlayCard v-else-if="media.media_type === 'audio'" :thumbnail_url="media.thumbnail_url"
                    :file_url="media.file_url"
                    class="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105" />

                <div v-else class="text-gray-400 p-4">Unsupported Media</div>
            </div>
        </router-link>

        <div class="p-3 md:p-4 flex flex-col">
            <router-link :to="`/media/detail/${media_id}`" class="group-link">
                <h3
                    class="text-lg font-bold text-gray-900 mb-1 line-clamp-2 transition-colors duration-200 hover:text-indigo-600">
                    {{ title }}
                </h3>

                <p class="text-sm text-gray-600 font-medium transition-colors duration-200 hover:text-gray-800">
                    {{ media.user?.name || 'Unknown Uploader' }}
                </p>
            </router-link>

            <p class="text-xs text-gray-500 mt-2 flex items-center">
                <span class="font-medium">{{ media.views ? media.views.toLocaleString() : 0 }} Views</span>
                <span class="mx-2 text-gray-300">•</span>
                <span>{{ media.created_at ? timeAgo(media.created_at) : '' }}</span>
            </p>

            <!-- <div class="mt-3 pt-3 border-t border-gray-100">
        <ActionMenu 
          :type="type" 
          :media_id="media_id" 
          @delete-media="$emit('delete-media', $event)"
          :owner_id="media.owner_id" 
          :auth_user="auth_user" 
        />
      </div> -->
        </div>
    </div>
</template>

<script setup>
import { formatDuration, getFileUrl, timeAgo } from '@/utils/helpers';
import AudioPlayCard from './AudioPlayCard.vue';
import ActionMenu from './ActionMenu.vue';

const BASE_URL = import.meta.env.VITE_API_URL;

const props = defineProps({
    media_id: Number,
    title: String,
    description: String,
    type: String,
    media: {
        type: Object,
        required: true,
    },
    auth_user: Object,
});

const emit = defineEmits(['delete-media'])

</script>