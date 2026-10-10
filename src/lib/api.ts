import axios from 'axios';

// Langsung ambil URL utuh dari env, fallback ke localhost jika lokal
// Domain utama dari env + prefix standar Django /api/v1
const rawBase = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';
// Hilangkan trailing slash jika ada
const cleanBase = rawBase.replace(/\/+$/, ''); 

const API_BASE_URL = `${cleanBase}/api/v1`;

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 1. Request Interceptor: Otomatis tempelkan Token JWT
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('access_token');
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 2. Response Interceptor: Otomatis Lempar ke Login kalau Token Expired (401)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && typeof window !== 'undefined') {
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);