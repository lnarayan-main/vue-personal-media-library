<script setup lang="ts">
import { getFileUrl } from '@/utils/helpers';
const defaultAvatar = "/images/default_avatar.jpg";

const props = defineProps({
    url: String
})

</script>

<template>
    <img :src="url || defaultAvatar" alt="User Avatar"
        class="h-10 w-10 object-cover rounded-full border-2 border-indigo-500 cursor-pointer hover:shadow-lg transition"
        onerror="this.onerror=null; this.src=defaultAvatar" />
</template>
