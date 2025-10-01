<!-- src/pages/Profile.vue -->
<template>
  <main class="flex-1 bg-gray-50 p-6">
    <!-- Header: single card with avatar + basic info -->
    <div class="bg-white rounded-xl shadow-md p-6 mb-6 flex items-center gap-6">
      <img
        :src="profilePictureUrl || defaultAvatar"
        alt="{{ profile.name }}"
        class="w-20 h-20 rounded-full object-cover border-2 border-indigo-100"
      />
      <div>
        <h1 class="text-xl font-bold text-gray-800">{{ profile.name }}</h1>
        <p class="text-sm text-gray-600">{{ profile.email }}</p>
        <p class="mt-2 text-gray-500 text-sm">{{ profile.about }}</p>
      </div>
    </div>

    <!-- Update Form -->
    <div class="bg-white rounded-xl shadow-md p-6">
      <h2 class="text-lg font-semibold mb-4">Update Profile</h2>

      <form @submit.prevent="submitForm" class="space-y-6">
        <!-- Name + Email (single row) -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
            <input
              v-model="form.name"
              type="text"
              required
              class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input
              v-model="form.email"
              type="email"
              required
              class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />
          </div>
        </div>

        <!-- About (full width) -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">About</label>
          <textarea
            v-model="form.about"
            rows="3"
            class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
          ></textarea>
        </div>

        <!-- Avatar + Passwords row -->
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
          <!-- Left: avatar preview + change button -->
          <div class="flex items-center gap-4">
            <div class="relative">
              <img
                :src="preview || profilePictureUrl || defaultAvatar"
                :alt="profile.name"
                class="w-24 h-24 rounded-full object-cover border"
              />
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">Profile Picture</label>
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  @click="triggerFile"
                  class="px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-sm hover:bg-gray-200"
                >
                  Change Photo
                </button>
                <button
                  v-if="profile.avatar || preview"
                  type="button"
                  @click="removeSelectedPhoto"
                  class="px-3 py-2 bg-red-50 border border-red-200 rounded-md text-sm text-red-600 hover:bg-red-100"
                >
                  Remove
                </button>
              </div>

              <p class="text-xs text-gray-500 mt-2">Max 2MB. JPG/PNG recommended.</p>
              <input
                ref="fileInput"
                type="file"
                accept="image/*"
                class="hidden"
                @change="onFileChange"
              />
            </div>
          </div>

          <!-- Right: password fields -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">New Password</label>
            <input
              v-model="form.newPassword"
              type="password"
              placeholder="Leave blank to keep current password"
              class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />

            <label class="block text-sm font-medium text-gray-700 mb-1 mt-4">Confirm Password</label>
            <input
              v-model="form.confirmPassword"
              type="password"
              placeholder="Confirm new password"
              class="block w-full px-4 py-2 border rounded-md border-gray-300 focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500"
            />

            <p class="text-sm text-gray-500 mt-3">Leave password fields blank if you don’t want to change your password.</p>

            <p v-if="passwordError" class="text-sm text-red-600 mt-2">{{ passwordError }}</p>
          </div>
        </div>

        <!-- server error / success message -->
        <div v-if="message.text" :class="message.type === 'error' ? 'text-red-600' : 'text-green-600'">
          {{ message.text }}
        </div>

        <!-- Buttons -->
        <div class="flex items-center gap-4">
          <button
            type="submit"
            :disabled="saving"
            class="px-5 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-60"
          >
            <span v-if="saving">Saving...</span>
            <span v-else>Save Changes</span>
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
import { ref, onMounted, computed } from "vue";
import axios from "axios";

// Adjust these if your backend URLs differ
const BASE_URL = "http://localhost:8000"
const PROFILE_URL = "http://localhost:8000/user/profile"; // GET current user
const UPDATE_URL = "http://localhost:8000/user/profile"; // PATCH endpoint (your code uses PATCH /profile)

// defaults
const defaultAvatar = "https://avatar.iran.liara.run/public/38";

// reactive state
const profile = ref({
  id: null,
  name: "Rakesh Kumar",
  email: "rakesh.kumar@yopmail.com",
  about: "Full Stack Developer passionate about Vue & FastAPI.",
  profile_pic_url: ""
});

const profilePictureUrl = computed(() => {
  if (profile.value.profile_pic_url) {
    return `${BASE_URL}${profile.value.profile_pic_url}`;
  }
  return null;
});


const form = ref({
  name: "",
  email: "",
  about: "",
  newPassword: "",
  confirmPassword: "",
});

const preview = ref(null); // objectURL preview for newly selected image
const selectedFile = ref(null);
const fileInput = ref(null);
const saving = ref(false);
const message = ref({ text: "", type: "" });
const passwordError = ref("");

// helpers
function getToken() {
  return localStorage.getItem("token");
}

async function fetchProfile() {
  const token = getToken();
  if (!token) {
    // redirect to login or handle unauthenticated case
    return;
  }
  try {
    const res = await axios.get(PROFILE_URL, {
      headers: { Authorization: `Bearer ${token}` },
    });

    profile.value = { ...res.data };
    // populate form with current values
    form.value.name = profile.value.name || "";
    form.value.email = profile.value.email || "";
    form.value.about = profile.value.about || "";
  } catch (err) {
    console.error("Failed to fetch profile", err);
    message.value = { text: "Failed to load profile.", type: "error" };
  }
}

function triggerFile() {
  fileInput.value && fileInput.value.click();
}

function onFileChange(e) {
  const f = e.target.files && e.target.files[0];
  if (!f) return;
  if (f.size > 2 * 1024 * 1024) { // 2MB limit
    message.value = { text: "File too large (max 2MB).", type: "error" };
    return;
  }
  selectedFile.value = f;
  preview.value = URL.createObjectURL(f);
}

function removeSelectedPhoto() {
  selectedFile.value = null;
  preview.value = null;
  // optionally also clear profile.avatar to remove on server side
}

function resetForm() {
  form.value.name = profile.value.name || "";
  form.value.email = profile.value.email || "";
  form.value.about = profile.value.about || "";
  form.value.newPassword = "";
  form.value.confirmPassword = "";
  selectedFile.value = null;
  preview.value = null;
  message.value = { text: "", type: "" };
  passwordError.value = "";
}

async function submitForm() {
  message.value = { text: "", type: "" };
  passwordError.value = "";

  // password validation
  if (form.value.newPassword || form.value.confirmPassword) {
    if (form.value.newPassword !== form.value.confirmPassword) {
      passwordError.value = "Passwords do not match.";
      return;
    }
    if (form.value.newPassword.length < 8) {
      passwordError.value = "New password must be at least 8 characters.";
      return;
    }
  }

  const token = getToken();
  if (!token) {
    message.value = { text: "Not authenticated.", type: "error" };
    return;
  }

  saving.value = true;
  try {
    const fd = new FormData();
    fd.append("name", form.value.name);
    fd.append("email", form.value.email);
    fd.append("about", form.value.about || "");
    if (selectedFile.value) fd.append("profile_pic", selectedFile.value);
    if (form.value.newPassword) fd.append("password", form.value.newPassword);

    const res = await axios.patch(UPDATE_URL, fd, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    // update local profile and reset state
    profile.value = { ...res.data };
    form.value.newPassword = "";
    form.value.confirmPassword = "";
    selectedFile.value = null;
    preview.value = null;

    message.value = { text: "Profile updated successfully.", type: "success" };
  } catch (err) {
    console.error("Update failed", err);
    const errMsg = err.response?.data?.detail || "Update failed";
    message.value = { text: errMsg, type: "error" };
  } finally {
    saving.value = false;
  }
}

onMounted(() => {
  fetchProfile();
});
</script>
