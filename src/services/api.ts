import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('velvet_auth_token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, (error) => {
  return Promise.reject(error);
});

// Response Interceptor: Extract data and handle errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token on 401 if expired
      const currentPath = window.location.pathname;
      if (currentPath.includes('/dashboard') || currentPath.includes('/admin')) {
        localStorage.removeItem('velvet_auth_token');
        localStorage.removeItem('velvet_auth_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
