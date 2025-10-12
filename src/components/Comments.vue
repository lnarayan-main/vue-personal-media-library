<template>
    <div class="w-full mt-8">
        <!-- Comments count -->
        <div class="flex items-center gap-2 mb-6">
            <h2 class="text-xl font-bold text-gray-800">{{ totalComments?.length || 0 }} Comments</h2>
        </div>

        <!-- Comment input section -->
        <div v-if="auth.currentUser" class="flex items-start gap-4 mb-6">
            <!-- Current User Profile Pic (assuming the current user data is available in `media.owner`) -->
            <ProfilePic :url="auth.currentUser?.profile_pic_url" class="w-10 h-10 flex-shrink-0 mt-1" />

            <div class="flex flex-col flex-grow">
                <input 
                    type="text" 
                    id="comments" 
                    placeholder="Add a comment..."
                    class="w-full border-b border-gray-300 focus:border-blue-600 focus:outline-none py-2 text-base text-gray-800 placeholder-gray-500 transition-colors"
                    v-model="newCommentContent" 
                    @focus="onFocus"
                    @keyup.enter="onClickComment"
                />

                <!-- Action buttons (Cancel/Comment) shown only when focused -->
                <div v-show="isFocus" class="flex justify-end gap-3 mt-3">
                    <button 
                        @click="onClickCancel"
                        class="px-4 py-1.5 text-sm font-medium text-gray-700 bg-gray-100 rounded-full hover:bg-gray-200 transition duration-150">
                        Cancel
                    </button>

                    <button 
                        @click="onClickComment" 
                        :disabled="!newCommentContent.trim()"
                        class="px-4 py-1.5 text-sm font-medium rounded-full text-white transition duration-150"
                        :class="newCommentContent.trim() ? 'bg-blue-600 hover:bg-blue-700 shadow-md' : 'bg-gray-300 text-gray-500 cursor-not-allowed'">
                        Comment
                    </button>
                </div>
            </div>
        </div>

        <!-- Comment List -->
        <div class="space-y-6">
            <div v-for="comment in totalComments" :key="comment.id" class="flex items-start gap-4">
                <!-- Commenter Profile Pic -->
                <ProfilePic :url="comment.owner?.profile_pic_url" class="w-10 h-10 flex-shrink-0 mt-1" />
                
                <div class="flex-grow">
                    <!-- Commenter Name and Time -->
                    <div class="flex items-center space-x-2 mb-1">
                        <p class="font-semibold text-sm text-gray-800">{{ comment.owner?.name || 'User' }}</p>
                        <span class="text-xs text-gray-500">{{ timeAgo(comment.created_at) }}</span>
                    </div>
                    
                    <!-- Comment Content -->
                    <p class="text-gray-700 text-sm whitespace-pre-wrap">{{ comment.content }}</p>

                    <!-- Optional: Add Reply/Like actions here in the future -->
                    <div class="flex gap-4 mt-2 text-xs text-gray-500">
                        <button class="hover:text-blue-600">👍 0</button>
                        <button class="hover:text-blue-600">👎 0</button>
                        <button class="hover:text-blue-600">Reply</button>
                    </div>
                </div>
            </div>
            
            <p v-if="!totalComments || totalComments.length === 0" class="text-center text-gray-500 py-8">
                No comments yet. Be the first to start the conversation!
            </p>
        </div>
    </div>
</template>

<script setup>
import axiosApi from '@/utils/axiosApi'
import notify from '@/utils/notify'
import { onMounted, ref } from 'vue'
import ProfilePic from './ProfilePic.vue'
import { useAuthStore } from '@/stores/auth'
import { timeAgo } from '@/utils/helpers'

const auth = useAuthStore();

const props = defineProps({
    media_id: Number,
    media: Object,
})

const newCommentContent = ref('')
const isFocus = ref(false)
const totalComments = ref(null) // Will hold the array of comments


function onFocus() {
    isFocus.value = true
}

function onClickCancel() {
    newCommentContent.value = ''
    isFocus.value = false
}

async function onClickComment() {
    const commentData = newCommentContent.value.trim();
    if (!commentData) return;

    try {
        const mediaId = props.media_id;
        // Assuming your backend expects 'content'
        const res = await axiosApi.post(`media/${mediaId}/comments`, { content: commentData });
        
        notify.success("Comment posted successfully!");
        
        // Clear the input and reset focus state
        newCommentContent.value = '';
        isFocus.value = false;

        // Re-fetch the comments to update the list in real-time
        await fetchMediaComments();

    } catch (err) {
        console.error("Error posting comment:", err);
        let errMsg = err.response?.data?.message || "Message sending failed";
        notify.error(errMsg);
    }
}

async function fetchMediaComments() {
    try {
        const mediaId = props.media_id;
        // NOTE: Ensure your API response for comments includes the 'user' object for each comment, 
        // which contains 'name' and 'profile_pic_url'.
        const res = await axiosApi.get(`media/${mediaId}/comments`);
        totalComments.value = Array.isArray(res.data) ? res.data : []; // Ensure it's an array
    } catch (err) {
        console.error("Error fetching comments:", err);
        totalComments.value = [];
    }
}

onMounted(() => {
    fetchMediaComments();
})

</script>

