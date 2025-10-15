<template>
    <div class="flex justify-center mt-8">
        <video ref="videoRef" controls class="rounded-lg shadow-lg w-full object-contain"></video>
    </div>
</template>

<script setup>
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { ref, onMounted } from "vue";

const props = defineProps({
    hls_path: String,
});

const videoRef = ref(null);
const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";

onMounted(() => {
    const video = videoRef.value;
    const src = `${apiBase}${props.hls_path}`;

    // Load HLS
    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
    } else {
        video.src = src;
    }

    // Wait for metadata to load
    video.addEventListener("loadedmetadata", () => {
        const w = video.videoWidth;
        const h = video.videoHeight;

        if (w > h) {
            // Landscape
            video.style.aspectRatio = "16 / 9";
        } else {
            // Portrait
            video.style.aspectRatio = "9 / 16";
            video.style.maxHeight = "80vh";
        }
    });

    // Initialize Plyr after video element is ready
    new Plyr(video, {
        controls: [
            'play-large', 'play', 'progress', 'current-time',
            'mute', 'volume', 'settings', 'fullscreen'
        ],
        settings: ['quality', 'speed', 'loop'],
    })
});
</script>
