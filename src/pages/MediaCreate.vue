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
          <label class="block text-sm font-medium text-gray-700 mb-1">Category</label>
          <select
            v-model="form.category_id"
            required
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          >
            <option value="" disabled selected>Select category</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>

        <!-- Media File Upload -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Media File</label>
          <input type="file" accept="image/*,video/*,audio/*" @change="onFileChange" required />
          <p v-if="filePreview" class="mt-2 text-sm text-gray-500">
            Selected file: {{ selectedFile?.name }}
          </p>
        </div>

        <!-- Optional Thumbnail -->
        <div v-if="form.media_type === 'video' || form.media_type === 'image'">
          <label class="block text-sm font-medium text-gray-700 mb-1">Thumbnail (optional)</label>
          <input type="file" accept="image/*" @change="onThumbnailChange" />
          <p v-if="thumbnailPreview" class="mt-2 text-sm text-gray-500">
            Selected thumbnail: {{ selectedThumbnail?.name }}
          </p>
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

const MEDIA_CREATE_URL = "http://localhost:8000/media";

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

const saving = ref(false);
const message = ref({ text: "", type: "" });

function getToken() {
  return localStorage.getItem("token");
}

async function fetchCategories() {
  const token = getToken();
  try {
    const res = await axios.get("http://localhost:8000/category/list", {
      headers: { Authorization: `Bearer ${token}` },
    });
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
}

function onFileChange(e) {
  selectedFile.value = e.target.files[0];
  filePreview.value = URL.createObjectURL(selectedFile.value);
}

function onThumbnailChange(e) {
  selectedThumbnail.value = e.target.files[0];
  thumbnailPreview.value = URL.createObjectURL(selectedThumbnail.value);
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

    const res = await axios.post(MEDIA_CREATE_URL, fd, {
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
