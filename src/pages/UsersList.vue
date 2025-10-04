<script setup>
import { ref, onMounted } from 'vue';
// Use the custom Axios instance with automatic token injection
import axiosApi from '@/utils/axiosApi';
// Import Heroicons for the action buttons
import { PencilIcon, TrashIcon, ArrowPathIcon, EyeIcon } from '@heroicons/vue/20/solid';
import { getFileUrl, getStatusColor } from '@/utils/helpers';

const users = ref([]);
const loading = ref(true);
const error = ref(null);

// Corrected to use console.log() instead of alert() to avoid compilation issues
function handleEdit(userId) {
    // In a real application, this would use the router:
    // router.push({ name: 'user-edit', params: { id: userId } });
    console.log(`Editing user ID: ${userId}`);
}

// Corrected to use console.log() instead of confirm() and alert()
async function handleDelete(userId) {
    // In a real application, a custom modal would confirm the action here.
    console.log(`Preparing to delete user ID: ${userId}`);

    // Simulate successful delete after confirmation
    // await api.delete(`/users/${userId}`); 

    // After successful delete, refresh the list or remove the user locally
    users.value = users.value.filter(user => user.id !== userId);
    console.log(`User ID ${userId} deleted from local list.`);
}

// Corrected to use function keyword to avoid JSX parsing error
async function fetchUsers() {
    // Note: The `api` instance automatically includes the Bearer token.
    try {
        // Fetch users list from the protected endpoint
        const res = await axiosApi.get('users');
        users.value = res.data;
    } catch (err) {
        // Handle 401/403 errors appropriately
        error.value = err.response?.data?.detail || 'Failed to load users. Check console for details.';
        console.error("API Error:", err);
    } finally {
        loading.value = false;
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
        alert(res.data?.detail);
    } catch (err) {
        error.value = err.response?.data?.detail || "Failed to change status of user."
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
                    <tr v-for="(user, i) in users" :key="user.id" class="hover:bg-indigo-50/50 transition duration-100">
                        <!-- S.N. -->
                        <td class="px-4 py-3 text-sm text-gray-700">{{ i + 1 }}</td>

                        <!-- Name -->
                        <td class="px-4 py-3 text-sm font-medium text-gray-800"><img
                                :src="getFileUrl(user.profile_pic_url)" class="rounded-md" alt="Profile Pic"></td>
                        <td class="px-4 py-3 text-sm font-medium text-gray-800">{{ user.name }}</td>

                        <!-- Email -->
                        <td class="px-4 py-3 text-sm text-gray-600">{{ user.email }}</td>

                        <!-- Status -->
                        <td class="px-4 py-3">
                            <!-- <span class="px-2 py-0.5 rounded-full text-xs font-semibold uppercase"
                                :class="getStatusColor(user.status)">
                                {{ user.status }}
                            </span> -->
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
                                 <button class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <EyeIcon class="h-5 w-5"/>
                                 </button>
                                <!-- Edit Button -->
                                <button @click="handleEdit(user.id)" title="Edit User"
                                    class="p-2 rounded-full text-indigo-600 hover:bg-indigo-100 transition duration-150 focus:outline-none focus:ring-2 focus:ring-indigo-500">
                                    <PencilIcon class="h-5 w-5" />
                                </button>

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
    </div>
</template>

<style scoped>
/* Removed specific CSS to rely purely on Tailwind classes */
</style>
