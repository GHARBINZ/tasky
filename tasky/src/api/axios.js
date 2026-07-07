import axios from 'axios';

const api = axios.create({
  // هذا الرابط سيعمل تلقائياً مع Vercel و Render
  baseURL: import.meta.env.VITE_API_URL || 'https://tasky-backend-0a2q.onrender.com/api',
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
    }
    return Promise.reject(error);
  }
);

export default api;
