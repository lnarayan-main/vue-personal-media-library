<!-- src/components/HeroSection.vue -->
<template>
    <!-- <section class="relative overflow-hidden bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 text-white py-24 animate-gradient-move"> -->
    <section class="relative overflow-hidden bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 text-white py-10 animate-gradient-move">

        <div class="absolute inset-0 bg-white/10 backdrop-blur-sm"></div>

        <!-- Background pattern overlay -->
        <div class="absolute inset-0 opacity-20">
            <img :src="heroBgPattern" alt="pattern" class="w-full h-full object-cover mix-blend-overlay" />
        </div>

        <!-- Main content -->
        <div class="container mx-auto px-6 relative z-10 text-center">
            <h1 class="text-4xl md:text-6xl font-extrabold mb-6 leading-tight fade-up">
                Stream, Learn & Create <br />
                <span class="text-blue-200">Educational Media that Inspires</span>
            </h1>

            <p class="text-lg md:text-xl text-blue-100 max-w-2xl mx-auto mb-8 fade-up" style="animation-delay: 0.3s">
                Explore curated videos and podcasts crafted by educators and creators
                worldwide. Empower your learning through seamless streaming.
            </p>

            <div class="flex justify-center space-x-4 fade-up" style="animation-delay: 0.6s">
                <button @click="scrollToMedia"
                    class="bg-white text-blue-700 font-semibold px-6 py-3 rounded-full shadow hover:scale-105 transform transition">
                    Explore Media
                </button>
                <RouterLink to="/media/create"
                    class="bg-transparent border border-white font-semibold px-6 py-3 rounded-full hover:bg-white hover:text-blue-700 transition">
                    Upload Your Content
                </RouterLink>
            </div>
        </div>

        <!-- Floating thumbnails -->
        <div class="absolute top-12 left-16 opacity-50 rotate-6 floating-left">
            <img :src="bannerOne" class="w-96 md:w-112 rounded-2xl shadow-2xl blur-[1px]" />
        </div>

        <div class="absolute bottom-8 right-16 opacity-50 -rotate-6 floating-right">
            <img :src="bannerTwo" class="w-112 md:w-128 rounded-2xl shadow-2xl blur-[1px] ring-1 ring-white/20" />
        </div>
    </section>
</template>

<script setup>
import heroBgPattern from "@/assets/hero-bg-pattern.svg";
import bannerOne from "@/assets/images/banner_one.webp";
import bannerTwo from "@/assets/images/banner_two.jpg";

const emit = defineEmits(['scrollToMedia']);

function scrollToMedia() {
    emit('scrollToMedia');
}

</script>

<style scoped>
/* --- Subtle animations --- */
@keyframes gradientMove {
    0% {
        background-position: 0% 50%;
    }

    50% {
        background-position: 100% 50%;
    }

    100% {
        background-position: 0% 50%;
    }
}

.animate-gradient-move {
    background-size: 200% 200%;
    animation: gradientMove 10s ease infinite;
}

@keyframes floatLeft {

    0%,
    100% {
        transform: translateY(0) rotate(6deg) scale(1);
    }

    50% {
        transform: translateY(-8px) rotate(6deg) scale(1.02);
    }
}

@keyframes floatRight {

    0%,
    100% {
        transform: translateY(0) rotate(-6deg) scale(1);
    }

    50% {
        transform: translateY(8px) rotate(-6deg) scale(1.02);
    }
}

.floating-left {
    animation: floatLeft 7s ease-in-out infinite;
}

.floating-right {
    animation: floatRight 7s ease-in-out infinite;
}

@keyframes fadeUp {
    from {
        opacity: 0;
        transform: translateY(20px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-up {
    opacity: 0;
    animation: fadeUp 1s ease-out forwards;
}
</style>
