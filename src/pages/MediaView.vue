<script setup>
import { ref, onMounted } from 'vue'
import axiosApi from '@/utils/axiosApi'
import { useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { getFileUrl, goBack } from '@/utils/helpers'

const route = useRoute()
const mediaId = route.params.id

const media = ref(null)
const loading = ref(true)

onMounted(async () => {
    try {
        const res = await axiosApi.get(`media-view/${mediaId}`)
        console.log(res.data);
        media.value = res.data
    } catch (error) {
        toast.error(error.response?.data?.detail || 'Failed to fetch media details')
    } finally {
        loading.value = false
    }
})
</script>

<template>
    <div class="max-w-5xl mx-auto mt-8 px-4">
        <div class="flex items-center justify-between mt-3">
            <button @click="goBack('/media-list')"
                class="inline-block mb-6 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition">
                ￩ Back to Media List
            </button>
        </div>
        <div v-if="loading" class="text-center py-10 text-gray-500">Loading media details...</div>

        <div v-else-if="media" class="bg-white shadow-md rounded-2xl p-6">
            <!-- Header -->
            <h1 class="text-2xl font-bold mb-4 text-gray-800">{{ media.title }}</h1>

            <!-- Media Thumbnail -->
            <div class="flex flex-col md:flex-row gap-6">
                <div class="md:w-1/2">
                    <img v-if="media.thumbnail_url" :src="getFileUrl(media.thumbnail_url)" alt="Media Thumbnail"
                        class="rounded-xl shadow-md object-cover w-full h-64" />
                    <div v-else
                        class="w-full h-64 flex items-center justify-center bg-gray-100 text-gray-400 rounded-xl">
                        No thumbnail available
                    </div>
                </div>

                <!-- Media Player -->
                <div class="md:w-1/2 flex flex-col justify-center">
                    <div v-if="media.media_type === 'video'" class="w-full">
                        <video v-if="media.file_url" :src="getFileUrl(media.file_url)" controls
                            class="rounded-xl shadow-md w-full h-64 bg-black" />
                        <div v-else class="text-gray-500 text-center">No video available</div>
                    </div>

                    <div v-else-if="media.media_type === 'audio'" class="w-full flex flex-col items-center">
                        <audio v-if="media.file_url" :src="getFileUrl(media.file_url)" controls class="mt-4 w-full" />
                        <div v-else class="text-gray-500 text-center">No audio available</div>
                    </div>
                </div>
            </div>

            <!-- Media Details -->
            <div class="mt-8 space-y-4">
                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-600">Category:</span>
                    <span class="text-gray-800">{{ media.category?.name || 'N/A' }}</span>
                </div>

                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-600">Media Type:</span>
                    <span class="text-gray-800 capitalize">{{ media.media_type }}</span>
                </div>

                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-600">Status:</span>
                    <span
                        :class="media.status === 'active' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'">
                        {{ media.status }}
                    </span>
                </div>

                <div class="flex justify-between border-b pb-2">
                    <span class="font-semibold text-gray-600">Owner:</span>
                    <span class="text-gray-800 capitalize">{{ media.owner?.name || 'N/A' }}</span>
                </div>

                <div>
                    <h2 class="font-semibold text-gray-600 mb-2">Description:</h2>
                    <p class="text-gray-700 leading-relaxed whitespace-pre-line">
                        {{ media.description || 'No description provided.' }}
                    </p>
                </div>
            </div>
        </div>

        <div v-else class="text-center py-10 text-red-500">Media not found</div>
    </div>
</template>

<style scoped>
video,
audio {
    outline: none;
}
</style>
