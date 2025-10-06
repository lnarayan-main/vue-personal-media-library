<!-- src/pages/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6">
      <h1 class="text-2xl font-bold text-gray-800 text-center">
        Login to Your Account
      </h1>

      <!-- Error Alert -->
      <div v-if="error" class="p-3 rounded-lg bg-red-100 text-red-700 text-sm">
        {{ error }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label for="email" class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input id="email" v-model="email" type="email" required placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Password -->
        <div>
          <label for="password" class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input id="password" v-model="password" type="password" required placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        </div>

        <!-- Remember Me -->
        <div class="flex items-center justify-between">
          <label class="flex items-center space-x-2 text-sm text-gray-600">
            <input type="checkbox" v-model="rememberMe" class="form-checkbox h-4 w-4 text-blue-600" />
            <span>Remember Me</span>
          </label>

          <!-- Forgot Password -->
          <router-link to="/forgot-password" class="text-sm text-blue-600 hover:underline">
            Forgot Password?
          </router-link>
        </div>

        <!-- Submit Button -->
        <button type="submit" :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition">
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Extra -->
      <p class="text-center text-gray-500 text-sm">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 hover:underline">Register</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import { useAuthStore } from "@/stores/auth";


const auth = useAuthStore();
const router = useRouter();

const username = ref("");
const email = ref("");
const password = ref("");
const error = ref("");
const loading = ref(false);
const rememberMe = ref(localStorage.getItem("remember_me") === "true");

const handleLogin = async () => {
  const {success, message} = await auth.login({
    email: email.value,
    password: password.value,
    rememberMe: rememberMe.value
  });

  
  if (success) {
    if (rememberMe.value) {
      localStorage.setItem("remember_me", "true");
    } else {
      localStorage.removeItem("remember_me");
    }
    router.push("/dashboard");
  } else {
    error.value = message;
  }
};
</script>
