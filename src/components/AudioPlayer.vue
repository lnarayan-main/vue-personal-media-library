<template>
    <div :class="[
        'relative w-full h-120 bg-cover bg-center rounded-xl overflow-hidden transition-all duration-500 shadow-xl',
        isPlaying ? 'animate-glow' : ''
    ]" :style="{ backgroundImage: `url(${thumbnail_url})` }">
        <div class="absolute inset-0 bg-black/30"></div>

        <div class="absolute bottom-0 left-0 right-0 bg-gray-900/90 p-3 backdrop-blur-sm">
            <audio ref="audioRef" class="plyr w-full"></audio>
        </div>
    </div>
</template>

<script setup>
import config from "@/config";
import Hls from "hls.js";
import Plyr from "plyr";
import "plyr/dist/plyr.css";
import { ref, onMounted, onBeforeUnmount } from "vue";

const props = defineProps({
    hls_path: String,       
    thumbnail_url: String,   
});

const apiBase = config.API_BASE_URL;
const audioRef = ref(null);
const isPlaying = ref(false);
let player;

onMounted(() => {
    const audio = audioRef.value;
    // const src = `${apiBase}${props.hls_path}`;
    const src = props.hls_path;

    if (Hls.isSupported()) {
        const hls = new Hls();
        hls.loadSource(src);
        hls.attachMedia(audio);
        hls.on(Hls.Events.MANIFEST_PARSED, () => initPlayer());
    } else {
        audio.src = src;
        initPlayer();
    }

    const initPlayer = () => {
        player = new Plyr(audio, {
            controls: ["play", "progress", "current-time", "mute", "volume", "download"],
            seekTime: 5,
            tooltips: { controls: true, seek: true },
        });

        player.on("play", () => (isPlaying.value = true));
        player.on("pause", () => (isPlaying.value = false));
    };
});

onBeforeUnmount(() => {
    if (player) player.destroy();
});
</script>

<style scoped>
.plyr {
    --plyr-color-main: #10b981;
    /* Tailwind emerald-500 */
    background: transparent !important;
}

/* Animation for glowing audio thumbnail */
@keyframes glow {
    0% {
        box-shadow:
            0 0 15px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(0, 150, 255, 0.5),
            0 0 45px rgba(0, 255, 200, 0.4),
            0 0 60px rgba(0, 100, 255, 0.3);
        filter: hue-rotate(0deg);
    }

    25% {
        box-shadow:
            0 0 25px rgba(255, 255, 255, 0.8),
            0 0 45px rgba(0, 255, 200, 0.6),
            0 0 70px rgba(0, 200, 255, 0.5),
            0 0 90px rgba(0, 150, 255, 0.4);
        filter: hue-rotate(45deg);
    }

    50% {
        box-shadow:
            0 0 35px rgba(255, 255, 255, 0.9),
            0 0 60px rgba(0, 255, 255, 0.7),
            0 0 90px rgba(0, 200, 255, 0.6),
            0 0 120px rgba(0, 100, 255, 0.5);
        filter: hue-rotate(90deg);
    }

    75% {
        box-shadow:
            0 0 25px rgba(255, 255, 255, 0.8),
            0 0 45px rgba(0, 200, 255, 0.6),
            0 0 70px rgba(0, 255, 200, 0.5),
            0 0 90px rgba(0, 150, 255, 0.4);
        filter: hue-rotate(180deg);
    }

    100% {
        box-shadow:
            0 0 15px rgba(255, 255, 255, 0.6),
            0 0 30px rgba(0, 150, 255, 0.5),
            0 0 45px rgba(0, 255, 200, 0.4),
            0 0 60px rgba(0, 100, 255, 0.3);
        filter: hue-rotate(360deg);
    }
}

.animate-glow {
    animation: glow 3s ease-in-out infinite alternate;
    border-radius: 12px;
    transition: transform 0.3s ease-in-out;
}

.animate-glow:hover {
    transform: scale(1.01);
}
</style>
