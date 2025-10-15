<template>
  <div class="min-h-screen bg-gray-50">
    <div v-if="loading" class="p-8 text-center text-gray-500">Loading user profile...</div>
    
    <div v-else-if="!user" class="p-8 text-center text-red-500 font-semibold">User not found.</div>

    <div v-else class="max-w-8xl mx-auto bg-white shadow-xl rounded-lg overflow-hidden">

      <header class="relative">
        <div 
          :style="{ backgroundImage: user.banner_url ? `url(${getFileUrl(user.banner_url)})` : 'none' }"
          :class="[
            'w-full h-48 bg-gray-800 bg-cover bg-center',
            { 'bg-indigo-600': !user.banner_url }
          ]"
        >
          <div class="absolute inset-0 bg-black opacity-10"></div>
        </div>

        <div class="p-6 md:p-8 flex flex-col md:flex-row items-start md:items-center -mt-16 md:-mt-12 relative z-10">
          
          <ProfilePic 
            :url="user.profile_pic_url" 
            class="w-32 h-32 rounded-full border-4 border-white shadow-lg flex-shrink-0 bg-gray-300" 
          />
          
          <div class="md:ml-6 mt-4 md:mt-0 flex-1 flex flex-col sm:flex-row sm:items-center justify-between">
            <div>
              <h1 class="text-4xl font-extrabold text-gray-900 leading-none">{{ user.name }}</h1>
              <p class="text-gray-600 mt-1">@{{ user.email }}</p>
              <p class="text-sm text-gray-500 mt-1 font-medium flex">
                <UsersIcon class="h-5 w-5 mr-2"/>
                {{ user.subscribers ? user.subscribers.toLocaleString() : 0 }} Subscribers
              </p>
            </div>

            <div class="flex gap-3 mt-4 sm:mt-0">
              <button class="flex px-6 py-2 bg-red-600 text-white rounded-full font-semibold shadow hover:bg-red-700 transition">
                <BellAlertIcon class="h-5 w-5 mr-2"/> Subscribe
              </button>
              <button v-if="!isOwner" class="px-4 py-2 bg-gray-200 text-gray-800 rounded-full font-semibold hover:bg-gray-300 transition">
                <EllipsisHorizontalIcon class="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </header>

      <nav class="border-b border-gray-200 mt-6 px-8 flex gap-8 text-lg font-semibold text-gray-600">
        <button 
          @click="activeTab = 'all'" 
          :class="['pb-2 transition duration-200', activeTab === 'all' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'hover:text-gray-800']"
        >
          Media ({{ mediaList.length }})
        </button>
        <button 
          @click="activeTab = 'video'" 
          :class="['pb-2 transition duration-200', activeTab === 'video' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'hover:text-gray-800']"
        >
          Video ({{ videoCount.toLocaleString() }})
        </button>
        <button 
          @click="activeTab = 'audio'" 
          :class="['pb-2 transition duration-200', activeTab === 'audio' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'hover:text-gray-800']"
        >
          Audio ({{ audioCount.toLocaleString() }})
        </button>
        <button 
          @click="activeTab = 'about'" 
          :class="['pb-2 transition duration-200', activeTab === 'about' ? 'text-indigo-600 border-b-4 border-indigo-600' : 'hover:text-gray-800']"
        >
          About
        </button>
      </nav>

      <div class="p-6 md:p-8">
        
        <div v-if="activeTab !== 'about'" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
           <div v-if="filteredMediaList.length === 0" class="text-center py-12 bg-gray-50 rounded-lg border border-gray-200">
            
            <VideoCameraIcon class="w-16 h-16 text-indigo-500 mx-auto mb-4" /> 
            
            <h2 class="text-xl font-semibold text-gray-800 mb-2">
                {{ activeTab === 'all' ? 'No Media Uploaded Yet' : `No ${activeTab} content found` }}
            </h2>
            <p class="text-gray-600 max-w-md mx-auto">
                {{ activeTab === 'all' 
                    ? `This user hasn't shared any content yet. Check back later!` 
                    : `Please check the 'All Media' tab or change your filter.`
                }}
            </p>
            
            <button 
                v-if="isOwner" 
                @click="$router.push('/media/create')"
                class="mt-6 px-6 py-2 bg-indigo-600 text-white rounded-full font-semibold hover:bg-indigo-700 transition"
            >
                <ArrowUpTrayIcon class="w-5 h-5 mr-2 inline-block" /> Upload Your First Media
            </button>
        </div>
          <MediaCard v-else 
            v-for="item in filteredMediaList" 
            :key="item.id" 
            :media="item" 
            :media_id="item.id"
            :title="item.title"
            :description="item.description"
            type="user"
          />
        </div>

        <div v-if="activeTab === 'about'" class="max-w-3xl">
          <h2 class="text-2xl font-bold text-gray-800 mb-4">Channel Description</h2>
          <p class="text-gray-700 leading-relaxed whitespace-pre-line">{{ user.about || 'This user has not provided a description yet.' }}</p>

          <h3 class="text-xl font-bold text-gray-800 mt-8 mb-3">Statistics</h3>
          <ul class="space-y-3 text-gray-600">
              <li class="flex items-center text-base">
                  <CalendarIcon class="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0" /> 
                  <span class="font-medium text-gray-700">Joined:</span> 
                  <span class="ml-1">{{ new Date(user.created_at).toLocaleDateString() }}</span>
              </li>
              
              <li class="flex items-center text-base">
                  <ChartBarIcon class="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0" />
                  <span class="font-medium text-gray-700">Total Media Views:</span>
                  <span class="ml-1">{{ totalViews.toLocaleString() }}</span>
              </li>
              
              <li class="flex items-center text-base">
                  <VideoCameraIcon class="w-5 h-5 mr-2 text-indigo-500 flex-shrink-0" />
                  <span class="font-medium text-gray-700">Media Uploaded:</span>
                  <span class="ml-1">{{ mediaList.length }}</span>
              </li>
          </ul>
        </div>

      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute } from 'vue-router';
import axiosApi from '@/utils/axiosApi';
import { getFileUrl } from '@/utils/helpers';
import MediaCard from '@/components/MediaCard.vue'; // The grid card component
import ProfilePic from '@/components/ProfilePic.vue';
import { ArrowUpTrayIcon, BellAlertIcon, BellIcon, CalendarIcon, ChartBarIcon, EllipsisHorizontalIcon, UsersIcon, VideoCameraIcon } from '@heroicons/vue/20/solid';
import { useAuthStore } from '@/stores/auth';

const auth = useAuthStore();

const route = useRoute();
const user = ref(null);
const mediaList = ref([]);
const loading = ref(true);
const activeTab = ref('all');
// const isOwner = ref(false); 

const isOwner = computed(()=>{
  if (auth && auth.isLoggedIn){
    if (auth.currentUser.id == user.value.id){
      return true;
    }
    return false;
  }
  return false;
})



const totalViews =  computed(()=>{
    if (!mediaList.value || mediaList.value.length === 0){
        return 0;
    }
    const sum = mediaList.value.reduce((accumulator, mediaItem) =>{
        const views = mediaItem.views || 0;
        return accumulator += views;
    }, 0); // 0 means starting at 0
    return sum;
});

const videoCount = computed(() => mediaList.value.filter(item => item.media_type === 'video').length);
const audioCount = computed(() => mediaList.value.filter(item => item.media_type === 'audio').length);


const filteredMediaList = computed(() => {
    if(!mediaList.value){
        return [];
    }
    if(activeTab.value === 'all'){
        return mediaList.value;
    }
    
    return  mediaList.value.filter(item => item.media_type === activeTab.value);
});

async function fetchUserProfile() {
  try {
    const userId = route.params.id;
    const [userRes, mediaRes] = await Promise.all([
      axiosApi.get(`users/${userId}/profile`), // Assuming you have an API endpoint for user details
      axiosApi.get(`media/user/${userId}`)      // Assuming you have an API endpoint for a user's media
    ]);
    
    user.value = userRes.data;
    mediaList.value = mediaRes.data;
    
    
  } catch (err) {
    console.error("Failed to fetch user profile:", err);
    user.value = null; 
  } finally {
    loading.value = false;
  }
}

onMounted(() => {
  fetchUserProfile();
});
</script>