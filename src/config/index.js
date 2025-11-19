const config = {
    // API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
    API_BASE_URL: import.meta.env.VITE_API_URL || "https://mediahub-backend-9vwj.onrender.com/",

    // FEATURE_FLAG_PROFILES: import.meta.env.VITE_ENABLE_PROFILES === 'true',
};

// Ensure the base URL always ends with a slash for clean concatenation
if (config.API_BASE_URL && !config.API_BASE_URL.endsWith('/')) {
    config.API_BASE_URL += '/';
}

export default config;