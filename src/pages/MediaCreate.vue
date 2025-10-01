<template>
  <main class="flex-1 p-6 bg-gray-50">
    <div class="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
      <h1 class="text-2xl font-bold mb-4">Create Media</h1>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Enter media title"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Optional description"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Media Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
          <select
            v-model="form.media_type"
            required
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          >
            <option value="" disabled>Select type</option>
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <!-- Category -->
          <div>
            <label for="category" class="block text-sm font-medium text-gray-700 mb-1">Category</label>
            <select
                id="category"
                v-model="form.category_id"
                class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
            >
                <option disabled value="">Select category (optional)</option>
                <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.name }}
                </option>
            </select>
        </div>

        <!-- Media + Thumbnail row -->
    
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        
          <!-- Media File Selector (Clickable) -->
          <div v-on:click="triggerMediaInput" class="cursor-pointer">
              <label class="block text-sm font-medium text-gray-700 mb-2">Media File</label>
              <div
                  class="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 min-h-[160px] bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition duration-300 ease-in-out group"
              >
                  <input
                      type="file"
                      :accept="getMediaAcceptType()"
                      v-on:change="onMediaChange"
                      class="hidden"
                      ref="mediaInput"
                  />
                  
                  <!-- Media Preview -->
                  <div v-if="mediaPreview" class="w-full h-full rounded-lg overflow-hidden flex items-center justify-center bg-black">
                      <video
                          v-if="form.media_type === 'video'"
                          :src="mediaPreview"
                          controls
                          class="max-h-64 w-full object-contain"
                      ></video>
                      <audio
                          v-else-if="form.media_type === 'audio'"
                          :src="mediaPreview"
                          controls
                          class="w-full max-w-sm p-4"
                      ></audio>
                      <img
                          v-else-if="form.media_type === 'image'"
                          :src="mediaPreview"
                          class="max-h-64 w-full object-contain"
                      />
                      <p v-else class="text-sm text-white p-4">Preview unavailable. Click to change file.</p>
                  </div>

                  <!-- Placeholder -->
                  <div v-else class="text-center p-4">
                      <svg class="mx-auto h-12 w-12 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                      <p class="mt-2 text-sm font-medium text-gray-600">Click to select {{ form.media_type || 'media' }} file</p>
                      <p class="text-xs text-gray-400">Max size 50MB</p>
                  </div>
              </div>
          </div>

          <!-- Thumbnail Selector (Clickable) -->
          <div v-on:click="triggerThumbnailInput" class="cursor-pointer">
              <label class="block text-sm font-medium text-gray-700 mb-2">Thumbnail (Image)</label>
              <div
                  class="flex flex-col items-center justify-center border-2 border-dashed rounded-xl p-4 h-40 w-40 mx-auto bg-gray-50 hover:bg-indigo-50 hover:border-indigo-400 transition duration-300 ease-in-out group"
              >
                  <input
                      type="file"
                      accept="image/*"
                      v-on:change="onThumbnailChange"
                      class="hidden"
                      ref="thumbnailInput"
                  />
                  
                  <!-- Thumbnail Preview -->
                  <img
                      v-if="thumbnailPreview"
                      :src="thumbnailPreview"
                      class="w-full h-full rounded-lg object-cover border-4 border-white shadow-lg"
                  />
                  
                  <!-- Placeholder -->
                  <div v-else class="text-center">
                      <svg class="mx-auto h-12 w-12 text-indigo-400 group-hover:text-indigo-600 transition" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <p class="mt-2 text-sm font-medium text-gray-600">Select Thumbnail</p>
                  </div>
              </div>
          </div>
        </div>

       

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="form.status"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          >
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
          </select>
        </div>

        <!-- Error / Success -->
        <div v-if="message.text" :class="message.type === 'error' ? 'text-red-600' : 'text-green-600'">
          {{ message.text }}
        </div>

        <!-- Buttons -->
        <div class="flex gap-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save</span>
          </button>

          <button type="button" @click="resetForm" class="px-4 py-2 border rounded-md text-sm">
            Reset
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_URL;

const form = ref({
  title: "",
  description: "",
  media_type: "",
  category_id: null,
  status: "ACTIVE",
});

const categories = ref([]);
const selectedFile = ref(null);
const selectedThumbnail = ref(null);
const filePreview = ref(null);
const thumbnailPreview = ref(null);
const mediaPreview = ref(null);

// Refs for the hidden file inputs
const mediaInput = ref(null);
const thumbnailInput = ref(null);


const saving = ref(false);
const message = ref({ text: "", type: "" });

function getToken() {
  return localStorage.getItem("token");
}

// Function to determine the accepted file type for the media input based on the dropdown selection
function getMediaAcceptType() {
    switch (form.value.media_type) {
        case 'image':
            return 'image/*';
        case 'video':
            return 'video/*';
        case 'audio':
            return 'audio/*';
        default:
            return 'image/*,video/*,audio/*';
    }
}

// Functions to manually trigger the hidden file inputs
function triggerMediaInput() {
    if (mediaInput.value) {
        mediaInput.value.click();
    }
}

function triggerThumbnailInput() {
    if (thumbnailInput.value) {
        thumbnailInput.value.click();
    }
}

async function fetchCategories() {
  const token = getToken();
  try {
    const res = await axios.get(BASE_URL + "category/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
}



function onMediaChange(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  selectedFile.value = f;
  mediaPreview.value = URL.createObjectURL(f);
}

function onThumbnailChange(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  selectedThumbnail.value = f;
  thumbnailPreview.value = URL.createObjectURL(f);
}

function resetForm() {
  form.value = { title: "", description: "", media_type: "", category_id: null, status: "ACTIVE" };
  selectedFile.value = null;
  selectedThumbnail.value = null;
  filePreview.value = null;
  thumbnailPreview.value = null;
  message.value = { text: "", type: "" };
}

async function submitForm() {
  if (!selectedFile.value) {
    message.value = { text: "Media file is required.", type: "error" };
    return;
  }

  const token = getToken();
  if (!token) {
    message.value = { text: "Not authenticated.", type: "error" };
    return;
  }

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("title", form.value.title);
    fd.append("description", form.value.description || "");
    fd.append("media_type", form.value.media_type);
    if (form.value.category_id) fd.append("category_id", form.value.category_id);
    fd.append("status", form.value.status);
    fd.append("file", selectedFile.value);
    if (selectedThumbnail.value) fd.append("thumbnail", selectedThumbnail.value);

    const res = await axios.post(BASE_URL + "media/create", fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    message.value = { text: "Media created successfully!", type: "success" };
    resetForm();
  } catch (err) {
    console.error(err);
    message.value = { text: err.response?.data?.detail || "Failed to create media.", type: "error" };
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchCategories();
});
</script>
