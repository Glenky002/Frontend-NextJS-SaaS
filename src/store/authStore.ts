// // import { create } from 'zustand';
// // import { api } from '@/lib/api';

// // interface AuthState {
// //   token: string | null;
// //   isAuthenticated: boolean;
// //   login: (credentials: { username: string; password: string }) => Promise<void>;
// //   logout: () => void;
// // }

// // export const useAuthStore = create<AuthState>((set) => ({
// //   token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
// //   isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,

// //   login: async (credentials) => {
// //     const response = await api.post('/auth/login/', credentials);
// //     const { access, refresh } = response.data;

// //     localStorage.setItem('access_token', access);
// //     localStorage.setItem('refresh_token', refresh);

// //     set({
// //       token: access,
// //       isAuthenticated: true,
// //     });
// //   },

// //   logout: () => {
// //     localStorage.removeItem('access_token');
// //     localStorage.removeItem('refresh_token');
// //     set({ token: null, isAuthenticated: false });
// //     if (typeof window !== 'undefined') {
// //       window.location.href = '/login';
// //     }
// //   },
// // }));

// import { create } from 'zustand';
// import { api } from '@/lib/api';

// interface User {
//   id: number;
//   username: string;
//   email: string;
//   full_name?: string;
//   role: string;
//   school_id?: number | null;
//   school_name?: string | null;
// }

// interface AuthState {
//   user: User | null;
//   token: string | null;
//   isAuthenticated: boolean;
//   login: (credentials: { username: string; password: string }) => Promise<void>;
//   logout: () => void;
// }

// export const useAuthStore = create<AuthState>((set) => ({
//   // Read Initial Data dari LocalStorage
//   token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
//   isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
//   user: typeof window !== 'undefined' && localStorage.getItem('user_data')
//     ? JSON.parse(localStorage.getItem('user_data') || '{}')
//     : null,

//   login: async (credentials) => {
//     const response = await api.post('/auth/login/', credentials);
//     const { access, refresh, user } = response.data;

//     // 1. Ambil data user & tentukan role (fallback ke 'ADMIN' jika akun login adalah admin sekolah)
//     const userData: User = {
//       id: user?.id || 1,
//       username: user?.username || credentials.username,
//       email: user?.email || '',
//       full_name: user?.full_name || user?.username || credentials.username,
//       role: (user?.role || 'ADMIN').toUpperCase(),
//       school_id: user?.school_id || null,
//       school_name: user?.school_name || null,
//     };

//     // 2. Simpan Tokens & User Data ke LocalStorage
//     localStorage.setItem('access_token', access);
//     localStorage.setItem('refresh_token', refresh);
//     localStorage.setItem('user_data', JSON.stringify(userData));

//     // 3. Update React / Zustand State
//     set({
//       token: access,
//       isAuthenticated: true,
//       user: userData,
//     });
//   },

//   logout: () => {
//     // Bersihkan seluruh data dari LocalStorage
//     localStorage.removeItem('access_token');
//     localStorage.removeItem('refresh_token');
//     localStorage.removeItem('user_data');

//     set({ token: null, isAuthenticated: false, user: null });

//     if (typeof window !== 'undefined') {
//       window.location.href = '/login';
//     }
//   },
// }));

import { create } from 'zustand';
import { api } from '@/lib/api';

interface User {
  id: number;
  username: string;
  email: string;
  full_name?: string;
  role: string;
  school_id?: number | null;
  school_name?: string | null;
}

interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (credentials: { username: string; password: string }) => Promise<void>;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  token: typeof window !== 'undefined' ? localStorage.getItem('access_token') : null,
  isAuthenticated: typeof window !== 'undefined' ? !!localStorage.getItem('access_token') : false,
  user: typeof window !== 'undefined' && localStorage.getItem('user_data')
    ? JSON.parse(localStorage.getItem('user_data') || '{}')
    : null,

  login: async (credentials) => {
    const response = await api.post('/auth/login/', credentials);
    const { access, refresh, user } = response.data;

    const userData: User = {
      id: user?.id || 1,
      username: user?.username || credentials.username,
      email: user?.email || '',
      full_name: user?.full_name || user?.username || credentials.username,
      role: (user?.role || 'ADMIN').toUpperCase(),
      school_id: user?.school_id || null,
      school_name: user?.school_name || null,
    };

    localStorage.setItem('access_token', access);
    localStorage.setItem('refresh_token', refresh);
    // localStorage.setItem('user_data', JSON.stringify(userData));

    set({
      token: access,
      isAuthenticated: true,
      user: userData,
    });
  },

  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user_data');

    set({ token: null, isAuthenticated: false, user: null });

    if (typeof window !== 'undefined') {
      window.location.href = '/';
    }
  },
}));