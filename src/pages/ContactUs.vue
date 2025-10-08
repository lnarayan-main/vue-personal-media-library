<template>
  <div class="max-w-3xl mx-auto bg-white shadow-sm rounded-xl p-8 mt-6">
    <h1 class="text-2xl font-semibold text-indigo-600 mb-4">Contact Us</h1>
    <p class="text-gray-700 mb-6">
      Have a question, feedback, or issue? We’d love to hear from you.
      Fill out the form below, and our team will get back to you shortly.
    </p>

    <form @submit.prevent="submitForm" class="space-y-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Name</label>
        <input v-model="form.name" type="text" required placeholder="Enter name"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input v-model="form.email" type="email" required placeholder="Enter email"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Message</label>
        <textarea v-model="form.message" rows="4" required
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          placeholder="Enter message"></textarea>
      </div>

      <button type="submit" class="bg-indigo-600 text-white px-5 py-2 rounded-lg hover:bg-indigo-700 transition">
        Send Message
      </button>
    </form>

    <p v-if="submitted" class="text-green-600 mt-4">
      ✅ Message sent successfully! We'll respond soon.
    </p>
  </div>
</template>

<script setup>
import { ref } from "vue";

const form = ref({ name: "", email: "", message: "" });
const submitted = ref(false);

const submitForm = () => {
  // Normally, send to backend (e.g., via axios)
  console.log("Form submitted:", form.value);
  submitted.value = true;
  form.value = { name: "", email: "", message: "" };
};
</script>
