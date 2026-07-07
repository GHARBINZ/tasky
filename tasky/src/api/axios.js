import axios from 'axios';

const backendOrigin = (import.meta.env.VITE_API_URL || 'https://tasky-backend-0a2q.onrender.com').replace(/\/$/, '');

const api = axios.create({
  baseURL: `${backendOrigin}/api`,
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