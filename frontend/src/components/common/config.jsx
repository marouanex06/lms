export const apiUrl = import.meta.env.VITE_API_URL;
export const fileUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace('/api', '') : 'http://localhost:8000';

const userInfo = JSON.parse(localStorage.getItem('userInfoLms') || '{}');

export const userToken = userInfo?.token || null;
export const userId = userInfo?.id || null;