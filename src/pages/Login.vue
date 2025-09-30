<!-- src/pages/Login.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div
      class="w-full max-w-md bg-white shadow-lg rounded-2xl p-8 space-y-6"
    >
      <h1 class="text-2xl font-bold text-gray-800 text-center">
        Login to Your Account
      </h1>

      <!-- Error Alert -->
      <div
        v-if="error"
        class="p-3 rounded-lg bg-red-100 text-red-700 text-sm"
      >
        {{ error }}
      </div>

      <!-- Login Form -->
      <form @submit.prevent="handleLogin" class="space-y-4">
        <!-- Email -->
        <div>
          <label
            for="email"
            class="block text-sm font-medium text-gray-600 mb-1"
            >Email</label
          >
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label
            for="password"
            class="block text-sm font-medium text-gray-600 mb-1"
            >Password</label
          >
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          :disabled="loading"
          class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg shadow hover:bg-blue-700 focus:ring-2 focus:ring-blue-400 disabled:opacity-50 transition"
        >
          <span v-if="loading">Logging in...</span>
          <span v-else>Login</span>
        </button>
      </form>

      <!-- Extra -->
      <p class="text-center text-gray-500 text-sm">
        Don’t have an account?
        <router-link to="/register" class="text-blue-600 hover:underline"
          >Register</router-link
        >
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const email = ref("");
const password = ref("");
const loading = ref(false);
const error = ref("");

// Handle login
async function handleLogin() {
  loading.value = true;
  error.value = "";

  try {
    const res = await fetch("http://localhost:8000/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: email.value, password: password.value }),
    });

    if (!res.ok) {
      const errData = await res.json();
      error.value = errData.detail || "Login failed";
      return;
    }

    const data = await res.json();
    localStorage.setItem("token", data.access_token);

    // Redirect to dashboard
    router.push("/dashboard");
  } catch (err) {
    console.error(err);
    error.value = "Something went wrong!";
  } finally {
    loading.value = false;
  }
}
</script>
