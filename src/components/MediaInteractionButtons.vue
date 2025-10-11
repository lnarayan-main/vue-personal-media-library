<script setup lang="ts">
import axiosApi from '@/utils/axiosApi'
import notify from '@/utils/notify';
import { ChatBubbleLeftEllipsisIcon, HandThumbDownIcon, HandThumbUpIcon } from '@heroicons/vue/20/solid'
import { onMounted, ref } from 'vue'


const props = defineProps({
  // likes: { type: Number, default: 0 },
  // dislikes: { type: Number, default: 0 },
  // comments: { type: Number, default: 0 },
  media_id: Number
})

// const likesCount = ref(props.likes);
// const dislikesCount = ref(props.dislikes);

const likesCount = ref(0);
const dislikesCount = ref(0);
// const commentsCount = ref(0);


async function onClickToReact(isLike: boolean) {
  try {
    const mediaId = props.media_id;
    const res = await axiosApi.post(`media/${mediaId}/reaction`, { is_like: isLike });
    notify.success(res.data?.message);
    getReactions();
  } catch (err: any) {
    const errMsg = err.response?.data?.detail || "Failed to react.";
    notify.error(errMsg);
  }
}

async function getReactions() {
  const mediaId = props.media_id;
  if (mediaId) {
    try {
      const res = await axiosApi.get(`media/${mediaId}/reactions`);
      likesCount.value = res.data.likes;
      dislikesCount.value = res.data.dislikes;
    } catch (error) {
      console.error("Failed to fetch reactions", error);
    }
  }
}

onMounted(() => {
  getReactions();
});


</script>

<template>
  <div class="flex items-center gap-4">
    <!-- Likes -->
    <button @click="onClickToReact(true)" class="flex items-center gap-1 p-2 rounded-full hover:bg-green-50 transition">
      <HandThumbUpIcon class="h-5 w-5 text-green-500" />
      <span class="text-sm font-medium text-gray-700">{{ likesCount }}</span>
    </button>

    <!-- Dislikes -->
    <button @click="onClickToReact(false)" class="flex items-center gap-1 p-2 rounded-full hover:bg-red-50 transition">
      <HandThumbDownIcon class="h-5 w-5 text-red-500" />
      <span class="text-sm font-medium text-gray-700">{{ dislikesCount }}</span>
    </button>

    <!-- Comments -->
    <!-- <button class="flex items-center gap-1 p-2 rounded-full hover:bg-gray-50 transition">
      <ChatBubbleLeftEllipsisIcon class="h-5 w-5 text-gray-500" />
      <span class="text-sm font-medium text-gray-700">{{ commentsCount }}</span>
    </button> -->
  </div>
</template>
