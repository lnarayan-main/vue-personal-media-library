<template>
  <div class="flex justify-center">
    <video ref="videoRef" class="rounded-lg shadow-lg w-full object-contain" controls playsinline :poster="thumbnail_url"></video>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import Hls from 'hls.js'
import Plyr from 'plyr'
import 'plyr/dist/plyr.css'
import config from '@/config'

const props = defineProps({
  hls_path: String,
  thumbnail_url: String,
})

const videoRef = ref(null)
const apiBase = config.API_BASE_URL;

let hlsInstance = null
let playerInstance = null

onMounted(() => {
  const video = videoRef.value
  const src = `${apiBase}${props.hls_path}`

  if (Hls.isSupported()) {
    hlsInstance = new Hls({
      enableWorker: true,
      capLevelToPlayerSize: false,
      startLevel: -1 // automatically pick the best one first
    })
    hlsInstance.loadSource(src)
    hlsInstance.attachMedia(video)

    // Once levels are detected, populate Plyr quality menu
    hlsInstance.on(Hls.Events.MANIFEST_PARSED, (event, data) => {
      const availableQualities = data.levels.map(l => l.height).sort((a, b) => b - a)
      const defaultQuality = availableQualities[0] || 720

      playerInstance = new Plyr(video, {
        controls: [
          'play-large', 'play', 'progress', 'current-time',
          'mute', 'volume', 'settings', 'fullscreen'
        ],
        settings: ['quality', 'speed', 'loop'],
        quality: {
          default: defaultQuality,
          options: availableQualities,
          forced: true,
          onChange: q => updateQuality(q)
        }
      })
    })

    // Optional: Adjust aspect ratio dynamically
    video.addEventListener('loadedmetadata', () => {
      const w = video.videoWidth
      const h = video.videoHeight
      if (w > h) {
        video.style.aspectRatio = '16 / 9'
      } else {
        video.style.aspectRatio = '9 / 16'
        video.style.maxHeight = '80vh'
      }
    })
  } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
    // For Safari (native HLS)
    video.src = src
    playerInstance = new Plyr(video)
  }
})

onBeforeUnmount(() => {
  if (hlsInstance) {
    hlsInstance.destroy()
  }
  if (playerInstance) {
    playerInstance.destroy()
  }
})

function updateQuality(newQuality) {
  if (!hlsInstance) return

  const levelIndex = hlsInstance.levels.findIndex(l => l.height === newQuality)
  if (levelIndex !== -1) {
    hlsInstance.currentLevel = levelIndex
  }
}
</script>

<style scoped>
.plyr--video {
  border-radius: 0.75rem;
  overflow: hidden;
}
</style>
