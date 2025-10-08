<!-- src/pages/Register.vue -->
<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="w-full max-w-md p-8 bg-white rounded-lg shadow-md">
      <h2 class="text-2xl font-bold mb-6 text-center">Register</h2>

      <form @submit.prevent="registerUser" enctype="multipart/form-data" class="space-y-4">
        <!-- Name -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Name</label>
          <input
            type="text"
            v-model="form.name"
            required
            placeholder="Enter Name"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Email</label>
          <input
            type="email"
            v-model="form.email"
            required
            placeholder="you@example.com"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Password -->
        <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Password</label>
          <input
            type="password"
            v-model="form.password"
            required
            placeholder="••••••••"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <!-- Profile Picture -->
        <!-- <div>
          <label class="block text-sm font-medium text-gray-600 mb-1">Profile Picture</label>
          <input
            type="file"
            @change="handleFileUpload"
            accept="image/*"
            class="mt-1 block w-full text-sm text-gray-900"
          />
        </div> -->

        <!-- Submit -->
        <div>
          <button
            type="submit"
            :disabled="saving"
            class="w-full py-2 px-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
             <span v-if="saving">Registering...</span>
            <span v-else>Register</span>
          </button>
        </div>
      </form>

      <p class="mt-4 text-center text-sm text-gray-600">
        Already have an account?
        <router-link to="/login" class="text-blue-600 hover:underline">Login</router-link>
      </p>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
import axiosApi from "@/utils/axiosApi";
import notify from "@/utils/notify";

const BASE_URL = import.meta.env.VITE_API_URL;

const router = useRouter();
const saving = ref(false);

const form = ref({
  name: "",
  email: "",
  password: "",
  profile_pic: null,
});

// Handle file selection
const handleFileUpload = (event) => {
  form.value.profile_pic = event.target.files[0];
};

// Submit form
const registerUser = async () => {
  try {
    saving.value = true;
    const formData = new FormData();
    formData.append("name", form.value.name);
    formData.append("email", form.value.email);
    formData.append("password", form.value.password);
    // if (form.value.profile_pic) {
    //   formData.append("profile_pic", form.value.profile_pic);
    // }

    const response = await axiosApi.post("user/register", formData);
    notify.success(response.data?.message);
    setTimeout(() => {
      router.push("/login");
    }, 2000);
  } catch (error) {
    console.error(error);
    const errMsg = error.response?.data?.detail || "Registration failed";
    notify.error(errMsg);
  } finally {
    saving.value = false;
  }
};
</script>

<style scoped>

</style>
