<!-- src/pages/Categories.vue -->
<template>
  <div class="p-6 bg-gray-100 min-h-screen">
    <h1 class="text-2xl font-bold mb-6">Categories</h1>

    <!-- Add New Category -->
    <div class="mb-6">
      <form @submit.prevent="addCategory" class="flex gap-2">
        <input v-model="newCategoryName" type="text" placeholder="New Category Name"
          class="flex-1 px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" />
        <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          Add
        </button>
      </form>
    </div>

    <!-- Categories List -->
    <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
      <div v-for="category in categories" :key="category.id"
        class="bg-white shadow rounded-lg p-4 flex justify-between items-center">
        <!-- Editable Name -->
        <input v-model="category.name" @blur="updateCategory(category)"
          class="flex-1 px-2 py-1 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400" />
        <button @click="deleteCategory(category.id)"
          class="ml-2 px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600">
          Delete
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import axiosApi from "@/utils/axiosApi";
import { ref, onMounted } from "vue";

const BASE_URL = import.meta.env.VITE_API_URL;

const categories = ref([]);
const newCategoryName = ref("");

// Fetch categories from backend
async function fetchCategories() {
  try {
    const res = await axiosApi.get('category/list');
    categories.value = await res.data;
  } catch (err) {
    console.error("Failed to fetch categories", err);
  }
}

// Add a new category
async function addCategory() {
  if (!newCategoryName.value.trim()) return;

  try {
    const payload = { name: newCategoryName.value };

    const res = await axiosApi.post('category/create', payload);

    const newCat = await res.data;
    categories.value.push(newCat);
    newCategoryName.value = "";
  } catch (err) {
    console.error(err);
  }
}

// Update category
async function updateCategory(category) {
  try {
    const payload = { name: category.name };

    const res = await axiosApi.put(`category/update/${category.id}`, payload);

  } catch (err) {
    console.error(err);
  }
}

// Delete category
async function deleteCategory(id) {
  try {
    const res = await axiosApi.delete(`category/delete/${id}`);
    categories.value = categories.value.filter((c) => c.id !== id);
  } catch (err) {
    console.error(err);
  }
}

// Load categories on page load
onMounted(fetchCategories);
</script>
