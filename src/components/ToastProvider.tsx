// 'use client';

// import { Toaster } from 'react-hot-toast';

// export default function ToastProvider() {
//   return <Toaster position="top-right" reverseOrder={false} />;
// }

'use client';

import { Toaster } from 'react-hot-toast';

export default function ToastProvider() {
  return (
    <Toaster
      position="top-right"
      reverseOrder={false}
      gutter={8}
      containerStyle={{
        top: 20,
        right: 20,
        zIndex: 99999, // Memastikan selalu di atas modal
      }}
      toastOptions={{
        duration: 4000,
        style: {
          background: '#0f172a',
          color: '#fff',
          fontSize: '13px',
          borderRadius: '10px',
          padding: '12px 16px',
        },
        success: {
          duration: 3000,
          iconTheme: {
            primary: '#10b981',
            secondary: '#fff',
          },
        },
        error: {
          duration: 5000,
          iconTheme: {
            primary: '#ef4444',
            secondary: '#fff',
          },
        },
      }}
    />
  );
}