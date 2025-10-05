<script setup>
import { ref } from "vue";
import axios from "axios";
import { useRoute, useRouter } from "vue-router";
import axiosApi from "@/utils/axiosApi";

const route = useRoute();
const router = useRouter();

const token = ref(route.query.token || ""); // Token from URL query param
const password = ref("");
const confirmPassword = ref("");
const message = ref("");
const error = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  message.value = "";

  if (!password.value || !confirmPassword.value) {
    error.value = "Please fill out all fields.";
    return;
  }

  if (password.value !== confirmPassword.value) {
    error.value = "Passwords do not match.";
    return;
  }

  try {
    loading.value = true;
    const payload = {
      token: token.value,
      new_password: password.value,
    };
    const response = await axiosApi.post("auth/reset-password", payload);

    message.value = response.data.message || "Password reset successful! Redirecting...";
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
      <h2 class="text-2xl font-semibold text-center mb-6">Reset Your Password</h2>

      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label class="block text-gray-700 mb-1">New Password</label>
          <input
            type="password"
            v-model="password"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Enter new password"
          />
        </div>

        <div>
          <label class="block text-gray-700 mb-1">Confirm Password</label>
          <input
            type="password"
            v-model="confirmPassword"
            class="w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring focus:border-blue-400"
            placeholder="Confirm new password"
          />
        </div>

        <button
          type="submit"
          :disabled="loading"
          class="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
        >
          {{ loading ? "Resetting..." : "Reset Password" }}
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
