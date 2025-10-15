<template>
    <video ref="videoRef" controls class="rounded-lg shadow-lg w-full"></video>
</template>

<script setup>
import Hls from "hls.js";
import { ref, onMounted } from "vue";

const props = defineProps({
    hls_path: String,
});
const apiBase = import.meta.env.VITE_API_URL || "http://localhost:8000";
const videoRef = ref(null);

onMounted(() => {
    const video = videoRef.value;
    const src = `${apiBase}${props.hls_path}`;

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(video);
    } else {
        video.src = src;
    }
});
</script>
