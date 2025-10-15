
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000/';
import router from "@/router";
import axiosApi from "./axiosApi";

export function getFileUrl(file_url){
    if (!file_url){
        return null;
    }

    // return BASE_URL + file_url;
    return buildUrl(BASE_URL, file_url);
}


export function formatDate(dateInput, locale = 'en-US') {
    if (!dateInput) return 'N/A';
    try {
        const date = new Date(dateInput);
        return date.toLocaleDateString(locale, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    } catch (e) {
        console.error('Invalid date format:', e);
        return 'Invalid Date';
    }
}


export function truncateString(str, length) {
    if (!str || str.length <= length) {
        return str;
    }
    return str.substring(0, length) + '...';
}


export function getStatusColor(status) {
    switch (status) {
        case 'active':
            return 'text-green-600 bg-green-100';
        case 'inactive':
            return 'text-red-600 bg-red-100';
        case 'pending':
            return 'text-yellow-600 bg-yellow-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
}


function buildUrl(base, path) {
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}


export function goBack(path){
  if (window.history.length > 1) {
    router.back();
  } else {
    router.push(path);
  }
};


export function getToken() {
  return localStorage.getItem("token");
}


export function timeAgo(dateString) {
    const now = new Date();
    const past = new Date(dateString);
    const seconds = Math.floor((now - past) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + " years ago";
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " months ago";
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + " days ago";
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + " hours ago";
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + " minutes ago";
    }
    return "just now";
}


export const formatDuration = (seconds) => {
  if (typeof seconds !== 'number' || isNaN(seconds) || seconds < 0) return '00:00';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);

  const format = (val) => (val < 10 ? '0' + val : val);

  if (h > 0) {
    return `${h}:${format(m)}:${format(s)}`;
  } else {
    return `${format(m)}:${format(s)}`;
  }
};