// import axios from 'axios';

// // 1. Ambil domain dari Vercel Env, bersihkan jika ada trailing slash/path
// const rawEnv = process.env.NEXT_PUBLIC_API_URL || 'https://greennus.pythonanywhere.com';
// const domainOnly = rawEnv.replace(/\/api\/?.*$/, '').replace(/\/+$/, '');

// // 2. Kunci path ke /api/v1
// const API_BASE_URL = `${domainOnly}/api/v1`;

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // 1. Request Interceptor: Otomatis tempelkan Token JWT
// api.interceptors.request.use(
//   (config) => {
//     if (typeof window !== 'undefined') {
//       const token = localStorage.getItem('access_token');
//       if (token) {
//         config.headers.set('Authorization', `Bearer ${token}`);
//       }
//     }
//     return config;
//   },
//   (error) => Promise.reject(error)
// );

// // 2. Response Interceptor: Otomatis Lempar ke Login kalau Token Expired (401)
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && typeof window !== 'undefined') {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
      
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );



import axios from 'axios';

// Membaca variabel dari Vercel (atau fallback ke localhost saat dev)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Interceptor Token JWT
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

// Interceptor 401 Unauthorized
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