<template>
  <main class="flex-1 p-6 bg-gray-50">
    <div class="bg-white rounded-xl shadow-md p-6 max-w-3xl mx-auto">
        <div class="flex items-center justify-between mt-3">
           <h1 class="text-2xl font-bold mb-4">Edit Media</h1>
            <button
            @click="goBack('/media')"
            class="px-5 py-2 bg-gray-500 text-white rounded-md hover:bg-gray-700 disabled:opacity-60"
          >
            Back
          </button>
      </div>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Title -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Title</label>
          <input
            v-model="form.title"
            type="text"
            required
            placeholder="Enter media title"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          />
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            v-model="form.description"
            rows="3"
            placeholder="Optional description"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Media Type -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Media Type</label>
          <select
            v-model="form.media_type"
            required
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          >
            <option value="image">Image</option>
            <option value="video">Video</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <!-- Category -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="form.category_id"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-500"
          >
            <option disabled value="">Select category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Media Preview -->
        <div v-if="mediaPreview" class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Current Media Preview:</p>
          <div class="rounded-md overflow-hidden bg-black flex justify-center">
            <video
              v-if="form.media_type === 'video'"
              :src="mediaPreview"
              controls
              class="max-h-64 w-full object-contain"
            />
            <audio
              v-else-if="form.media_type === 'audio'"
              :src="mediaPreview"
              controls
              class="w-full max-w-sm"
            />
            <img
              v-else-if="form.media_type === 'image'"
              :src="mediaPreview"
              class="max-h-64 w-full object-contain"
            />
          </div>
        </div>

        <!-- Thumbnail Preview -->
        <div v-if="thumbnailPreview" class="mb-4">
          <p class="text-sm text-gray-600 mb-2">Current Thumbnail:</p>
          <img :src="thumbnailPreview" class="w-32 h-32 rounded-md object-cover border" />
        </div>

        <!-- File Replace -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Replace Media File</label>
            <input type="file" :accept="getMediaAcceptType()" @change="onMediaChange" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Replace Thumbnail</label>
            <input type="file" accept="image/*" @change="onThumbnailChange" />
          </div>
        </div>

        <!-- Status -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            v-model="form.status"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
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
            <span v-if="saving">Updating...</span>
            <span v-else>Update</span>
          </button>
        </div>
      </form>
    </div>
  </main>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRoute, useRouter } from "vue-router";
import axios from "axios";
import { getFileUrl, goBack } from "@/utils/helpers";

const route = useRoute();
const router = useRouter();
const BASE_URL = import.meta.env.VITE_API_URL;

const form = ref({
  title: "",
  description: "",
  media_type: "",
  category_id: null,
  status: "",
});

const categories = ref([]);
const selectedFile = ref(null);
const selectedThumbnail = ref(null);
const mediaPreview = ref(null);
const thumbnailPreview = ref(null);

const saving = ref(false);
const message = ref({ text: "", type: "" });

function getToken() {
  return localStorage.getItem("token");
}

function getMediaAcceptType() {
  switch (form.value.media_type) {
    case "image":
      return "image/*";
    case "video":
      return "video/*";
    case "audio":
      return "audio/*";
    default:
      return "image/*,video/*,audio/*";
  }
}

function onMediaChange(e) {
  const f = e.target.files[0];
  if (f) {
    selectedFile.value = f;
    mediaPreview.value = URL.createObjectURL(f);
  }
}

function onThumbnailChange(e) {
  const f = e.target.files[0];
  if (f) {
    selectedThumbnail.value = f;
    thumbnailPreview.value = URL.createObjectURL(f);
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

async function fetchMedia() {
  const token = getToken();
  const mediaId = route.params.id;
  try {
    const res = await axios.get(BASE_URL + `media/detail/${mediaId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = res.data;
    form.value = {
      title: data.title,
      description: data.description,
      media_type: data.media_type,
      category_id: data.category_id,
      status: data.status,
    };

    mediaPreview.value = getFileUrl(data.media_url);
    thumbnailPreview.value = getFileUrl(data.thumbnail_url);
  } catch (err) {
    console.error("Failed to fetch media", err);
  }
}

async function submitForm() {
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
    fd.append("category_id", form.value.category_id || "");
    fd.append("status", form.value.status);
    if (selectedFile.value) fd.append("file", selectedFile.value);
    if (selectedThumbnail.value) fd.append("thumbnail", selectedThumbnail.value);

    await axios.put(BASE_URL + `media/update/${route.params.id}`, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    message.value = { text: "Media updated successfully!", type: "success" };
    setTimeout(() => router.push("/media"), 1200);
  } catch (err) {
    console.error(err);
    message.value = { text: err.response?.data?.detail || "Failed to update media.", type: "error" };
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchCategories();
  fetchMedia();
});
</script>
