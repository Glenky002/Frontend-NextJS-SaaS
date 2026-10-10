// // import axios from 'axios';

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// // export const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // 1. Request Interceptor: Otomatis tempelkan JWT Token dari localStorage
// // api.interceptors.request.use(
// //   (config) => {
// //     if (typeof window !== 'undefined') {
// //       const token = localStorage.getItem('access_token');
// //       if (token && config.headers) {
// //         config.headers.Authorization = `Bearer ${token}`;
// //       }
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // 2. Response Interceptor: Tangani redirect jika Token Invalid / Expired (401)
// // api.interceptors.response.use(
// //   (response) => response,
// //   async (error) => {
// //     if (error.response?.status === 401 && typeof window !== 'undefined') {
// //       localStorage.removeItem('access_token');
// //       localStorage.removeItem('refresh_token');
// //       window.location.href = '/login';
// //     }
// //     return Promise.reject(error);
// //   }
// // );

// // import axios from 'axios';

// // const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// // export const api = axios.create({
// //   baseURL: API_BASE_URL,
// //   headers: {
// //     'Content-Type': 'application/json',
// //   },
// // });

// // // Request Interceptor
// // api.interceptors.request.use(
// //   (config) => {
// //     if (typeof window !== 'undefined') {
// //       const token = localStorage.getItem('access_token');
// //       if (token) {
// //         // Menggunakan set method bawaan AxiosHeaders agar tidak error/undefined
// //         config.headers.set('Authorization', `Bearer ${token}`);
// //       }
// //     }
// //     return config;
// //   },
// //   (error) => Promise.reject(error)
// // );

// // // Response Interceptor
// // api.interceptors.response.use(
// //   (response) => response,
// //   (error) => {
// //     if (error.response?.status === 401 && typeof window !== 'undefined') {
// //       localStorage.removeItem('access_token');
// //       localStorage.removeItem('refresh_token');
// //       window.location.href = '/login';
// //     }
// //     return Promise.reject(error);
// //   }

// // );

// import axios from 'axios';

// const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/v1';

// export const api = axios.create({
//   baseURL: API_BASE_URL,
//   headers: {
//     'Content-Type': 'application/json',
//   },
// });

// // Request Interceptor: Menambahkan Bearer Token
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

// // Response Interceptor: Handling 401 & Forwarding Error
// api.interceptors.response.use(
//   (response) => response,
//   (error) => {
//     if (error.response?.status === 401 && typeof window !== 'undefined') {
//       localStorage.removeItem('access_token');
//       localStorage.removeItem('refresh_token');
      
//       // Cegah infinite redirect jika user sudah di halaman login
//       if (window.location.pathname !== '/login') {
//         window.location.href = '/login';
//       }
//     }
//     return Promise.reject(error);
//   }
// );














import axios from 'axios';

// Otomatis pakai URL PythonAnywhere saat live di Vercel,
// atau balik ke localhost saat kamu ngoding di laptop.
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL 
  ? `${process.env.NEXT_PUBLIC_API_URL}/api`
  : 'http://127.0.0.1:8000/api';

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