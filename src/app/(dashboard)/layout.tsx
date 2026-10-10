// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { usePathname, useRouter } from 'next/navigation';
// import { useAuthStore } from '@/store/authStore';
// import { 
//   Users, 
//   BookOpen, 
//   ClipboardCheck, 
//   GraduationCap, 
//   LogOut, 
//   LayoutDashboard,
//   Menu,
//   X,
//   UserCheck,
//   Shield,
//   School,
//   Presentation
// } from 'lucide-react';

// export default function DashboardLayout({
//   children,
// }: {
//   children: React.ReactNode;
// }) {
//   const pathname = usePathname();
//   const router = useRouter();
//   const logout = useAuthStore((state) => state.logout);
//   const user = useAuthStore((state) => state.user);
//   const [sidebarOpen, setSidebarOpen] = useState(false);
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     setMounted(true);
//   }, []);

//   // Handler Logout: Hapus session & Lempar langsung ke Landing Page Utama (/)
//   const handleLogout = () => {
//     logout();
//     router.push('/');
//   };

//   const navigation = [
//     { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
//     { name: 'Data Guru', href: '/teachers', icon: UserCheck },
//     { name: 'Data Siswa', href: '/students', icon: Users },
//     { name: 'Kelola Kelas', href: '/classes', icon: Presentation },
//     { name: 'Absensi', href: '/attendance', icon: ClipboardCheck },
//     { name: 'Nilai & Rapor', href: '/grades', icon: GraduationCap },
//     { name: 'Mata Pelajaran', href: '/academics', icon: BookOpen },
//   ];

//   const getRoleBadgeClass = (role?: string) => {
//     switch (role?.toUpperCase()) {
//       case 'ADMIN':
//       case 'SUPERUSER':
//         return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
//       case 'TEACHER':
//         return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
//       case 'STAFF':
//         return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
//       default:
//         return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
//     }
//   };

//   const activeUser = mounted ? user : null;
//   const roleText = activeUser?.role ? activeUser.role.toUpperCase() : 'ADMIN';

//   return (
//     <div className="min-h-screen bg-slate-100 flex">
//       {/* Sidebar Desktop */}
//       <aside className="hidden md:flex flex-col w-64 bg-slate-900 text-white p-4 justify-between">
//         <div>
//           <div className="px-2 py-3 border-b border-slate-800">
//             <h1 className="text-xl font-bold tracking-wide">SaaS Sekolah</h1>
//             {activeUser?.school_name && (
//               <div className="text-xs text-slate-400 mt-1 flex items-center gap-1.5 truncate">
//                 <School className="w-3.5 h-3.5 shrink-0 text-blue-400" />
//                 <span className="truncate">{activeUser.school_name}</span>
//               </div>
//             )}
//           </div>

//           <nav className="mt-6 space-y-1">
//             {navigation.map((item) => {
//               const isActive = pathname === item.href;
//               const Icon = item.icon;
//               return (
//                 <Link
//                   key={item.name}
//                   href={item.href}
//                   className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
//                     isActive
//                       ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
//                       : 'text-slate-400 hover:bg-slate-800 hover:text-white'
//                   }`}
//                 >
//                   <Icon className="w-5 h-5" />
//                   {item.name}
//                 </Link>
//               );
//             })}
//           </nav>
//         </div>

//         {/* Profil Singkat & Logout di Bawah Sidebar */}
//         <div className="pt-4 border-t border-slate-800 space-y-3">
//           <div className="flex items-center gap-3 px-2">
//             <div className="w-9 h-9 rounded-full bg-blue-600/30 text-blue-400 border border-blue-500/30 flex items-center justify-center text-sm font-bold shrink-0">
//               {activeUser?.full_name?.charAt(0) || activeUser?.username?.charAt(0) || 'A'}
//             </div>
//             <div className="min-w-0 flex-1">
//               <p className="text-xs font-bold text-slate-200 truncate">
//                 {activeUser?.full_name || activeUser?.username || 'Admin User'}
//               </p>
//               <div className="flex items-center gap-1.5 mt-0.5">
//                 <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[10px] font-bold rounded-md border ${getRoleBadgeClass(roleText)}`}>
//                   <Shield className="w-2.5 h-2.5" />
//                   {roleText}
//                 </span>
//               </div>
//             </div>
//           </div>

//           <button
//             onClick={handleLogout}
//             className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-semibold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full text-left transition"
//           >
//             <LogOut className="w-4 h-4" />
//             Keluar Akun
//           </button>
//         </div>
//       </aside>

//       {/* Main Content Area */}
//       <div className="flex-1 flex flex-col min-w-0">
//         {/* Header / Navbar */}
//         <header className="bg-white border-b border-slate-200 px-6 py-3.5 flex justify-between items-center shadow-xs">
//           <div className="flex items-center gap-3">
//             <button
//               onClick={() => setSidebarOpen(!sidebarOpen)}
//               className="md:hidden text-slate-600 focus:outline-none p-1 rounded-lg hover:bg-slate-100"
//             >
//               {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
//             </button>
//             <div className="text-sm font-bold text-slate-700">
//               Sistem Manajemen Sekolah & Rapor
//             </div>
//           </div>

//           {/* Profil User Status di Header Kanan */}
//           <div className="flex items-center gap-3">
//             <button
//               onClick={handleLogout}
//               className="text-xs font-semibold text-slate-500 hover:text-rose-600 px-3 py-2 rounded-lg hover:bg-rose-50 transition hidden md:flex items-center gap-1.5"
//             >
//               <LogOut className="w-4 h-4" />
//               Logout
//             </button>
//           </div>
//         </header>

//         {/* Page Content */}
//         <main className="flex-1 p-6 overflow-y-auto">{children}</main>
//       </div>
//     </div>
//   );
// }



'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, 
  BookOpen, 
  ClipboardCheck, 
  GraduationCap, 
  LogOut, 
  LayoutDashboard,
  Menu,
  X,
  UserCheck,
  Shield,
  School,
  Presentation,
  ChevronRight
} from 'lucide-react';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const logout = useAuthStore((state) => state.logout);
  const user = useAuthStore((state) => state.user);
  
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Otomatis tutup sidebar mobile saat lokasi halaman berubah
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
    { name: 'Data Guru', href: '/teachers', icon: UserCheck },
    { name: 'Data Siswa', href: '/students', icon: Users },
    { name: 'Kelola Kelas', href: '/classes', icon: Presentation },
    { name: 'Absensi', href: '/attendance', icon: ClipboardCheck },
    { name: 'Nilai & Rapor', href: '/grades', icon: GraduationCap },
    { name: 'Mata Pelajaran', href: '/academics', icon: BookOpen },
  ];

  const getRoleBadgeClass = (role?: string) => {
    switch (role?.toUpperCase()) {
      case 'ADMIN':
      case 'SUPERUSER':
        return 'bg-amber-500/20 text-amber-300 border-amber-500/30';
      case 'TEACHER':
        return 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30';
      case 'STAFF':
        return 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30';
      default:
        return 'bg-slate-500/20 text-slate-300 border-slate-500/30';
    }
  };

  const activeUser = mounted ? user : null;
  const roleText = activeUser?.role ? activeUser.role.toUpperCase() : 'ADMIN';

  // Komponen Isi Sidebar (Reusable untuk Desktop & Mobile)
  const SidebarContent = () => (
    <div className="flex flex-col h-full justify-between p-4 bg-slate-900 text-white">
      <div className="space-y-6">
        {/* Brand / Logo Sekolah */}
        <div className="px-2 py-3 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-2 bg-blue-600 rounded-xl shadow-lg shadow-blue-600/30">
                <School className="w-5 h-5 text-white" />
              </div>
              <div className="min-w-0">
                <h1 className="text-base font-extrabold tracking-tight text-white leading-none">
                  EduSaaS
                </h1>
                <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                  Sistem Sekolah
                </span>
              </div>
            </div>
            
            {/* Tombol Tutup Mobile */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="md:hidden p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {activeUser?.school_name && (
            <div className="mt-3 p-2 bg-slate-800/60 rounded-lg border border-slate-700/50 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
              <span className="text-xs font-semibold text-slate-300 truncate">
                {activeUser.school_name}
              </span>
            </div>
          )}
        </div>

        {/* Navigasi Utama */}
        <nav className="space-y-1.5">
          {navigation.map((item) => {
            const isActive = pathname === item.href;
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 group ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-600/30'
                    : 'text-slate-400 hover:bg-slate-800/80 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform group-hover:scale-110 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-400'}`} />
                  <span>{item.name}</span>
                </div>
                {isActive && <ChevronRight className="w-4 h-4 text-blue-200" />}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Profil User & Bottom Logout */}
      <div className="pt-4 border-t border-slate-800/80 space-y-3">
        <div className="flex items-center gap-3 px-2 py-1 bg-slate-800/40 rounded-xl border border-slate-800">
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white font-black flex items-center justify-center text-sm shadow-md shrink-0">
            {activeUser?.full_name?.charAt(0) || activeUser?.username?.charAt(0) || 'A'}
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-xs font-bold text-slate-100 truncate">
              {activeUser?.full_name || activeUser?.username || 'Admin User'}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <span className={`inline-flex items-center gap-1 px-2 py-0.5 text-[9px] font-extrabold rounded-md border ${getRoleBadgeClass(roleText)}`}>
                <Shield className="w-2.5 h-2.5" />
                {roleText}
              </span>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="flex items-center justify-center gap-2 px-3 py-2.5 rounded-xl text-xs font-bold text-rose-400 hover:bg-rose-500/10 hover:text-rose-300 w-full transition border border-rose-500/20"
        >
          <LogOut className="w-4 h-4" />
          <span>Keluar Akun</span>
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col md:flex-row antialiased">
      {/* SIDEBAR DESKTOP */}
      <aside className="hidden md:block w-64 shrink-0 h-screen sticky top-0 shadow-xl z-20">
        <SidebarContent />
      </aside>

      {/* MOBILE SIDEBAR (DRAWER OVERLAY) */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 md:hidden flex">
          {/* Backdrop Blur */}
          <div
            className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
            onClick={() => setSidebarOpen(false)}
          />

          {/* Drawer Content */}
          <div className="relative flex-1 max-w-xs w-full bg-slate-900 h-full shadow-2xl z-10 flex flex-col">
            <SidebarContent />
          </div>
        </div>
      )}

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        {/* HEADER / TOP NAVBAR */}
        <header className="sticky top-0 z-30 bg-white/90 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 py-3.5 flex justify-between items-center shadow-2xs">
          <div className="flex items-center gap-3">
            {/* Toggle Mobile Menu */}
            <button
              onClick={() => setSidebarOpen(true)}
              className="md:hidden p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl focus:outline-none transition"
              aria-label="Buka Menu Navigation"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div>
              <h2 className="text-xs sm:text-sm font-bold text-slate-800">
                Sistem Manajemen Sekolah & Rapor
              </h2>
              <p className="text-[10px] text-slate-400 hidden sm:block">
                Portal Kontrol Terpadu Multi-Tenant
              </p>
            </div>
          </div>

          {/* User Profile Info On Top Right */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2.5 pl-3 border-l border-slate-200">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 border border-blue-200/80 flex items-center justify-center font-bold text-xs">
                {activeUser?.full_name?.charAt(0) || activeUser?.username?.charAt(0) || 'U'}
              </div>
              <div className="text-left hidden lg:block">
                <p className="text-xs font-bold text-slate-800 leading-none">
                  {activeUser?.full_name || activeUser?.username || 'Pengguna'}
                </p>
                <p className="text-[10px] text-slate-400 font-semibold mt-0.5">
                  Role: <span className="text-blue-600 font-extrabold">{roleText}</span>
                </p>
              </div>
            </div>

            <button
              onClick={handleLogout}
              className="p-2 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-xl transition md:flex items-center gap-1.5 hidden text-xs font-bold"
              title="Keluar"
            >
              <LogOut className="w-4 h-4" />
              <span>Keluar</span>
            </button>
          </div>
        </header>

        {/* PAGE CONTENT ROUTER */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}