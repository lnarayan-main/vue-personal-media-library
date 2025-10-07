<script setup>
import { ref, onMounted, reactive, computed } from 'vue';
// Use the custom Axios instance with automatic token injection
import axiosApi from '@/utils/axiosApi';
// Import Heroicons for the action buttons
import { PencilIcon, TrashIcon, ArrowPathIcon, EyeIcon } from '@heroicons/vue/20/solid';
import { getFileUrl, getStatusColor } from '@/utils/helpers';
import { UserIcon } from '@heroicons/vue/20/solid';
import router from '@/router';
import DeleteConfirmModal from '@/components/DeleteConfirmModal.vue';
import { toast } from '@/main';
import notify from "@/utils/notify";

// --- State Management ---
const users = ref([]);
const loading = ref(true);
const error = ref(null);
//New state for search term
const searchTerm = ref("");
const appliedSearch = ref("");
// --- Delete Modal State (NEW) ---
const showDeleteModal = ref(false);
const userToDelete = ref(null);

const pagination = reactive({
    page: 1,
    size: 10, // Default items per page
    totalCount: 0,
    // totalPages: computed(() => Math.ceil(pagination.totalCount / pagination.size)),
    totalPages: null,
});

// Corrected to use console.log() instead of alert() to avoid compilation issues
function handleEdit(userId) {
    // In a real application, this would use the router:
    // router.push({ name: 'user-edit', params: { id: userId } });
    console.log(`Editing user ID: ${userId}`);
}

function handleView(userId) {
    router.push({ name: 'UserView', params: { id: userId } });
}


function handleDelete(userId) {
    userToDelete.value = userId;
    showDeleteModal.value = true;
}

async function confirmDelete() {
    if (userToDelete.value) {
        try {
            const res = await axiosApi.delete(`user/delete/${userToDelete.value}`);
            toast.success(res.data.detail || "User deleted successfully!");
            fetchUsers();
        } catch (error) {
            const errMsg = error.response?.data?.detail || "Failed to delete user.";
            toast.error(errMsg);
            console.error("Delete error:", errMsg);
        } finally {
            showDeleteModal.value = false;
            userToDelete.value = null;
        }
    }
}

function cancelDelete() {
    showDeleteModal.value = false;
    userToDelete.value = null;
}

async function fetchUsers() {
    loading.value = true;
    error.value = null;
    try {
        let queryString = `/users?page=${pagination.page}&size=${pagination.size}`;

        if (appliedSearch.value) {
            queryString += `&search=${encodeURIComponent(appliedSearch.value)}`;
        }

        // const res = await axiosApi.get(`users?page=${pagination.page}&size=${pagination.size}`);
        const res = await axiosApi.get(queryString);
        const resData = res.data;

        users.value = resData.items;
        pagination.totalCount = resData.total_count;
        pagination.page = resData.page;
        pagination.size = resData.size;

        pagination.totalPages = resData.total_pages;

    } catch (err) {
        // Handle 401/403 errors appropriately
        error.value = err.response?.data?.detail || 'Failed to load users. Check console for details.';
        console.error("API Error:", err);
    } finally {
        loading.value = false;
    }
}

function applySearch() {
    appliedSearch.value = searchTerm.value;
    pagination.page = 1;
    fetchUsers();
}

function changePage(newPage) {
    if (newPage > 0 && newPage <= pagination.totalPages) {
        pagination.page = newPage;
        fetchUsers();
    }
}

async function onChangeStatus(e) {
    try {
        const status = e.target.value;
        const userId = e.target.dataset.id;

        const payload = {
            id: Number(userId),
            status: status
        }

        const res = await axiosApi.post('user/change-status', payload);
        notify.success(res.data?.detail);
        // alert(res.data?.detail);
    } catch (err) {
        // error.value = err.response?.data?.detail || "Failed to change status of user."
        const errMsg = err.response?.data?.detail || "Failed to change status of user."
        notify.error(errMsg);
    } finally {
        loading.value = false;
    }
}

onMounted(fetchUsers);
</script>

<template>
    <!-- OUTER CARD (Section Background) -->
    <div class="p-6 bg-gray-50 rounded-xl shadow-xl m-4 border border-gray-100 min-h-[500px]">
        <h1 class="text-3xl font-extrabold text-gray-800 mb-6 border-b pb-3">User Management</h1>

        <!-- Search and Filter Section -->
        <div
            class="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white p-4 rounded-xl shadow-md">

            <!-- Search Input -->
            <div class="w-full sm:w-1/3">
                <label for="search" class="sr-only">Search Users</label>
                <div class="relative">
                    <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <!-- Search Icon -->
                        <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                clip-rule="evenodd" />
                        </svg>
                    </div>
                    <input type="text" id="search" v-model="searchTerm" @keyup.enter="applySearch"
                        placeholder="Search by name or email..."
                        class="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition duration-150">
                </div>
            </div>

            <!-- Apply Button -->
            <button @click="applySearch" :disabled="loading"
                class="w-full sm:w-auto px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg hover:bg-indigo-700 transition disabled:opacity-50">
                Search
            </button>
        </div>

        <!-- LOADING & ERROR STATES (Placed directly inside the outer card) -->
        <div v-if="loading" class="text-indigo-600 font-medium flex items-center justify-center py-20">
            <ArrowPathIcon class="animate-spin h-6 w-6 mr-2" /> Loading User Data...
        </div>
        <div v-else-if="error" class="text-red-600 bg-red-50 p-4 rounded-lg border border-red-200">
            Error: {{ error }}
        </div>

        <!-- INNER CARD (Table Wrapper) -->
        <div v-else class="bg-white rounded-lg shadow-lg border border-gray-200 overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
                <thead class="bg-indigo-50">
                    <tr>
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                            S.N.</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-16">
                            Profile</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Name</th>
                        <th class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                            Email</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-24">
                            Status</th>
                        <th
                            class="px-4 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider w-32">
                            Action</th>
                    </tr>
                </thead>
                <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="(user, i) in users" :key="i" class="hover:bg-indigo-50/50 transition duration-100">
                        <!-- S.N. -->
                        <td class="px-4 py-3 text-sm text-gray-700">{{ i + 1 }}</td>

                        <!-- Name -->
                        <td class="px-4 py-3 text-sm font-medium text-gray-800"><img
                                :src="getFileUrl(user.profile_pic_url) || 'https://placehold.co/40x40/9ca3af/ffffff?text=U'"
                                alt="Profile Pic" class="w-10 h-10 rounded-full object-cover"
                                onerror="this.onerror=null; this.src='https://placehold.co/40x40/9ca3af/ffffff?text=U';">
                        </td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ user.name }}</td>

                        <!-- Email -->
                        <td class="px-4 py-3 text-sm text-gray-600">{{ user.email }}</td>

                        <!-- Status -->
                        <td class="px-4 py-3">
                            <select v-model="user.status" @change="onChangeStatus" :data-id="user.id">
                                <option value="active">Active</option>
                                <option value="inactive">Inactive</option>
                                <option value="pending">Pending</option>
                            </select>
                        </td>

                        <!-- Action Buttons -->
                        <td class="px-4 py-3 text-sm">
                            <div class="flex space-x-2">
                                <!-- View Button  -->
                                <button @click="handleView(user.id)" title="View User"
                                    class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <EyeIcon class="h-5 w-5" />
                                </button>
                                <!-- Edit Button -->
                                <!-- <button @click="handleEdit(user.id)" title="Edit User"
                                    class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <PencilIcon class="h-5 w-5" />
                                </button> -->

                                <!-- Delete Button -->
                                <button @click="handleDelete(user.id)" title="Delete User"
                                    class="p-2 rounded-full text-red-600 hover:bg-red-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-red-500">
                                    <TrashIcon class="h-5 w-5" />
                                </button>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div v-if="users.length === 0 && !loading && !error" class="text-center py-12 text-gray-500">
                No users found in the system.
            </div>
        </div>
        <div v-if="pagination.totalPages > 1"
            class="flex items-center justify-between border-t border-gray-200 bg-gray-50 px-6 py-3">
            <div class="flex-1 flex justify-between sm:hidden">
                <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                    class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Previous
                </button>
                <button @click="changePage(pagination.page + 1)" :disabled="pagination.page >= pagination.totalPages"
                    class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                    Next
                </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                    <p class="text-sm text-gray-700">
                        Showing
                        <span class="font-medium">{{ (pagination.page - 1) * pagination.size + 1 }}</span>
                        to
                        <span class="font-medium">{{ Math.min(pagination.page * pagination.size, pagination.totalCount)
                        }}</span>
                        of
                        <span class="font-medium">{{ pagination.totalCount }}</span>
                        results
                    </p>
                </div>
                <div>
                    <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                        <button @click="changePage(pagination.page - 1)" :disabled="pagination.page <= 1"
                            class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <!-- Chevron Left -->
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>

                        <span
                            class="relative inline-flex items-center px-4 py-2 border border-gray-300 bg-indigo-600 text-sm font-medium text-white">
                            {{ pagination.page }} / {{ pagination.totalPages }}
                        </span>

                        <button @click="changePage(pagination.page + 1)"
                            :disabled="pagination.page >= pagination.totalPages"
                            class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                            <!-- Chevron Right -->
                            <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor" aria-hidden="true">
                                <path fill-rule="evenodd"
                                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                                    clip-rule="evenodd" />
                            </svg>
                        </button>
                    </nav>
                </div>
            </div>
        </div>
        <!-- Delete Confirmation Modal -->
        <DeleteConfirmModal :show="showDeleteModal" :recordId="userToDelete" @cancel="cancelDelete"
            @confirm="confirmDelete" :recordType="'user'" />

    </div>
</template>

<style scoped>
/* Removed specific CSS to rely purely on Tailwind classes */
</style>
