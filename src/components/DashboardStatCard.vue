<template>
    <div class="bg-white rounded-xl shadow-md p-5 flex flex-col items-center">
        <span :class="`text-${color}-600 text-3xl font-bold`">{{ value }}</span>
        <p class="text-gray-600 mt-2 flex">
            <icon class="h-5 w-5 mr-2" />
            {{ title }}
        </p>
    </div>
</template>

<script setup>
defineProps({
    title: String,
    value: Number,
    color: String,
    icon: Function
})
</script>