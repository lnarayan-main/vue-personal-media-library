<template>
  <div class="p-6 bg-gray-100 min-h-screen">
  <!-- <div class="bg-white rounded-xl shadow-md p-6"> -->
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
      <h1 class="text-3xl font-bold text-gray-800 mb-4 sm:mb-0">Categories</h1>

      <!-- Add Category -->
      <form @submit.prevent="addCategory" class="flex gap-2">
        <input
          v-model="newCategoryName"
          type="text"
          placeholder="Enter new category"
          class="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          class="px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
        >
          Add
        </button>
      </form>
    </div>

    <!-- Category List -->
    <div
      v-if="categories.length"
      class="bg-white rounded-xl shadow-md overflow-hidden divide-y divide-gray-200"
    >
      <div
        v-for="category in categories"
        :key="category.id"
        class="flex flex-col sm:flex-row sm:items-center justify-between px-4 py-3 hover:bg-gray-50 transition"
      >
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <span class="font-semibold text-gray-700">{{ category.id }}</span>
          <input
            v-model="category.name"
            @blur="updateCategory(category)"
            class="flex-1 sm:w-60 px-3 py-2 border border-gray-300 rounded-md text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
        </div>

        <div class="mt-3 sm:mt-0 flex gap-2 justify-end w-full sm:w-auto">
          <button
            @click="updateCategory(category)"
            class="px-3 py-1.5 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
          >
            Save
          </button>
          <button
            @click="deleteCategory(category.id)"
            class="px-3 py-1.5 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
          >
            Delete
          </button>
        </div>
      </div>
    </div>

    <!-- Empty State -->
    <div v-else class="text-center text-gray-500 py-16">
      <p class="text-lg">No categories found.</p>
      <p class="text-sm text-gray-400 mt-1">Start by adding a new category above.</p>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import axiosApi from "@/utils/axiosApi";
import notify from "@/utils/notify";

const categories = ref([]);
const newCategoryName = ref("");

// Fetch categories
async function fetchCategories() {
  try {
    const res = await axiosApi.get("category/list");
    categories.value = res.data;
  } catch (err) {
    console.error("Failed to fetch categories:", err);
  }
}

// Add new category
async function addCategory() {
  if (!newCategoryName.value.trim()) return;

  try {
    const res = await axiosApi.post("category/create", {
      name: newCategoryName.value.trim(),
    });
    categories.value.push(res.data);
    newCategoryName.value = "";
    notify.success("Category added successfully.")
  } catch (err) {
    console.error("Failed to add category:", err);
    notify.error("Failed to add category.")
  }
}

// Update category
async function updateCategory(category) {
  try {
    await axiosApi.put(`category/update/${category.id}`, {
      name: category.name,
    });
    notify.success("Category updated successfully.")
  } catch (err) {
    console.error("Failed to update category:", err);
    notify.error("Failed to update category.");
  }
}

// Delete category
async function deleteCategory(id) {
  try {
    await axiosApi.delete(`category/delete/${id}`);
    categories.value = categories.value.filter((c) => c.id !== id);
    notify.success("Category deleted successfully.");
  } catch (err) {
    console.error("Failed to delete category:", err);
    notify.error("Failed to delete category.");
  }
}

// Initial load
onMounted(fetchCategories);
</script>
