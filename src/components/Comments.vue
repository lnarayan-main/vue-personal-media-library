<template>
    <div class="w-full mt-5">
        <!-- Comments count -->
        <div class="flex items-center gap-2 mb-4">
            <span class="text-sm font-semibold text-gray-800">{{ commentsCount }}</span>
            <span class="text-sm text-gray-600">Comments</span>
        </div>

        <!-- Comment input section -->
        <div class="flex items-center gap-3">
            <input type="text" id="comments" placeholder="Add a comment..."
                class="flex-1 border-b border-gray-300 focus:border-blue-500 focus:outline-none py-2 text-sm text-gray-800 placeholder-gray-400 transition"
                v-model="comments" @focus="onFocus" />

            <button v-show="isFocus" @click="onClickCancel"
                class="px-3 py-1.5 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition">
                Cancel
            </button>

            <button v-show="isFocus" @click="onClickcomment" :disabled="!comments"
                class="px-3 py-1.5 text-sm font-medium rounded-md text-white transition"
                :class="comments ? 'bg-blue-600 hover:bg-blue-700' : 'bg-gray-400 cursor-not-allowed'">
                Comment
            </button>
        </div>
        <div class="list items-center">
            <div v-for="(comment, i) in totalComments" :key="i">
                <p>{{ comment.content }}</p>
            </div>
        </div>
    </div>
</template>

<script setup>
import axiosApi from '@/utils/axiosApi'
import notify from '@/utils/notify'
import { onMounted, ref } from 'vue'

const props = defineProps({
    media_id: Number
})

const commentsCount = ref(10)
const comments = ref('')
const isFocus = ref(false)
const totalComments = ref(null)

function onFocus() {
    isFocus.value = true
}

function onClickCancel() {
    comments.value = ''
    isFocus.value = false
}

async function onClickcomment() {
    const commentData = comments.value;
    if (commentData) {
        try {
            const mediaId = props.media_id;
            const res = await axiosApi.post(`media/${mediaId}/comments`, { content: commentData});
            notify.success(res.data?.message);
        } catch (err) {
            console.error(err);
            let errMsg = err.response?.data || "Message sending failed";
            notify.error(errMsg);
        }
    }
}

async function fetchMediaComments() {
    try {
        const mediaId = props.media_id;
        const res = await axiosApi.get(`media/${mediaId}/comments`);
        totalComments.value = res.data;
    } catch (err) {
        console.error(err);
    }
}

onMounted(() => {
    fetchMediaComments();
})

</script>
