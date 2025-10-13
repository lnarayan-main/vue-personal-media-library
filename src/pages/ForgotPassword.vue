<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 text-center">
        Forgot Password
      </h1>

      <!-- Success Message -->
      <div v-if="success" class="p-3 rounded-lg bg-green-100 text-green-700 text-sm">
        {{ success }}
      </div>

      <!-- Error Message -->
      <div v-if="error" class="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Form -->
      <form @submit.prevent="handleSubmit" class="space-y-4">
        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1">
            Email Address
          </label>
          <div class="relative">

            <input id="email" v-model="email" type="email" required placeholder="you@example.com"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10" />
            <EnvelopeIcon
              class="w-5 h-5 absolute inset-y-3 right-3 flex items-center text-gray-500 hover:text-gray-700 focus:outline-none" />
          </div>
        </div>

        <button type="submit" :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition">
          <span v-if="loading">Sending...</span>
          <span v-else>Send Reset Link</span>
        </button>
      </form>

      <p class="text-center text-gray-500 text-sm">
        Remembered your password?
        <router-link to="/login" class="text-blue-600 hover:underline">
          Back to Login
        </router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import axiosApi from "@/utils/axiosApi";
import { EnvelopeIcon } from "@heroicons/vue/20/solid";

const email = ref("");
const error = ref("");
const success = ref("");
const loading = ref(false);

const handleSubmit = async () => {
  error.value = "";
  success.value = "";
  loading.value = true;

  try {
    const res = await axiosApi.post("auth/forgot-password", { email: email.value });
    success.value = res.data.message || "Reset link sent to your email.";
  } catch (err) {
    console.error(err);
    error.value = err.response?.data?.detail || "Failed to send reset link.";
  } finally {
    loading.value = false;
  }
};
</script>
