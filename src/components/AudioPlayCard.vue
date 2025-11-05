<template v-else-if="media.media_type === 'audio'">
    <div :class="[
        'relative w-full h-full bg-cover bg-center rounded-lg overflow-hidden transition-all duration-500',
        isPlaying ? 'animate-glow' : ''
    ]" :style="{ backgroundImage: `url(${thumbnail_url})` }">
        <audio :src="getFileUrl(file_url)" :controls="showControls" @play="handlePlay" @pause="handlePause"
            class="absolute bottom-0 left-0 w-full bg-white/80 backdrop-blur-sm"></audio>
    </div>
</template>


<script setup>
import { getFileUrl } from '@/utils/helpers'
import { ref } from 'vue'

// Props to accept data dynamically
const props = defineProps({
    thumbnail_url: String,
    file_url: String,
    showControls: {
      type: Boolean,
      default: false
    }
})

// Local state
const isPlaying = ref(false)

const handlePlay = () => {
    isPlaying.value = true
}

const handlePause = () => {
    isPlaying.value = false
}

</script>


<style scoped>
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
