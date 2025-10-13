<script setup>
import { ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import axiosApi from "@/utils/axiosApi";
import { EyeIcon, EyeSlashIcon } from "@heroicons/vue/20/solid";

const route = useRoute();
const router = useRouter();

const password = ref("");
const confirmPassword = ref("");
const currentPassword = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);
const showCurrentPassword = ref(false);
const showPassword = ref(false);
const showConfirmPassword = ref(false);

const handleSubmit = async () => {
  error.value = "";
  message.value = "";

  if (!password.value || !confirmPassword.value || !currentPassword.value) {
    error.value = "Please fill out all fields.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  if (password.value.length < 8) {
    error.value = "Password must be at least 8 characters.";
    return;
  }

  if (password.value.length > 32) {
    error.value = "Password must not be greater than 32 characters.";
    return;
  }

  try {
    loading.value = true;
    const payload = {
      current_password: currentPassword.value,
      new_password: password.value,
    };
    const response = await axiosApi.post("auth/change-password", payload);

    message.value = response.data.message || "Password change successful! Redirecting...";
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (err) {
    error.value = err.response?.data?.detail || "Failed to reset password.";
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="bg-white p-8 rounded-2xl shadow-lg w-full max-w-md">
      <h2 class="text-2xl font-semibold text-center mb-6">Change Your Password</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">Current Password</label>
          <div class="relative">
            <input :type="showCurrentPassword ? 'text' : 'password'" v-model="currentPassword"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 pr-10"
              placeholder="Enter current password" />
            <button type="button" @click="showCurrentPassword = !showCurrentPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none hover:cursor-pointer">
              <component :is="showCurrentPassword ? EyeSlashIcon : EyeIcon" class="w-5 h-5" />
            </button>
          </div>
        </div>
        <div>
          <label class="block text-gray-700 mb-1">New Password</label>
          <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" v-model="password"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 pr-10"
              placeholder="Enter new password" />
            <button type="button" @click="showPassword = !showPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none hover:cursor-pointer">
              <component :is="showPassword ? EyeSlashIcon : EyeIcon" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Confirm Password</label>
          <div class="relative">
            <input :type="showConfirmPassword ? 'text' : 'password'" v-model="confirmPassword"
              class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400 pr-10"
              placeholder="Confirm new password" />
            <button type="button" @click="showConfirmPassword = !showConfirmPassword"
              class="absolute inset-y-0 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none hover:cursor-pointer">
              <component :is="showConfirmPassword ? EyeSlashIcon : EyeIcon" class="w-5 h-5" />
            </button>
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition">
          {{ loading ? "Changing..." : "Change Password" }}
        </button>

        <p v-if="message" class="text-green-600 text-sm text-center mt-2">{{ message }}</p>
        <p v-if="error" class="text-red-600 text-sm text-center mt-2">{{ error }}</p>
      </form>
    </div>
  </div>
</template>

<style scoped>
input:disabled,
button:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
</style>
