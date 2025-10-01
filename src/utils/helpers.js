
const BASE_URL = import.meta.env.VITE_APP_API_BASE_URL || 'http://localhost:8000/';

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
        case 'ACTIVE':
            return 'text-green-600 bg-green-100';
        case 'INACTIVE':
            return 'text-red-600 bg-red-100';
        case 'PENDING':
            return 'text-yellow-600 bg-yellow-100';
        default:
            return 'text-gray-600 bg-gray-100';
    }
}


function buildUrl(base, path) {
  if (!base) return path;
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`;
}