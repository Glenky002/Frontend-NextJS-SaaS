
// // 'use client';

// // import { useState, useEffect } from 'react';
// // import Link from 'next/link';
// // import { api } from '@/lib/api';
// // import { useAuthStore } from '@/store/authStore';
// // import { 
// //   Users, UserCheck, BookOpen, ClipboardCheck, ArrowRight, 
// //   School, Activity, Sparkles, ShieldCheck
// // } from 'lucide-react';

// // interface DashboardStats {
// //   teachersTotal: number;
// //   adminsCount: number;
// //   teachersCount: number;
// //   staffsCount: number;
// //   maleTeachers: number;
// //   femaleTeachers: number;
// //   completeTeachers: number;
// //   studentsTotal: number;
// //   classesTotal: number;
// // }

// // export default function DashboardPage() {
// //   const user = useAuthStore((state) => state.user);
// //   const [mounted, setMounted] = useState(false);
// //   const [stats, setStats] = useState<DashboardStats>({
// //     teachersTotal: 0,
// //     adminsCount: 0,
// //     teachersCount: 0,
// //     staffsCount: 0,
// //     maleTeachers: 0,
// //     femaleTeachers: 0,
// //     completeTeachers: 0,
// //     studentsTotal: 0,
// //     classesTotal: 0,
// //   });
// //   const [loading, setLoading] = useState(true);

// //   useEffect(() => {
// //     setMounted(true);

// //     const fetchAllDashboardData = async () => {
// //       try {
// //         setLoading(true);

// //         // Fetch data paralel dari endpoint Teachers, Students, dan Classes
// //         const [teachersRes, studentsRes, classesRes] = await Promise.allSettled([
// //           api.get('/users/teachers/'),
// //           api.get('/students/students/'),
// //           api.get('/students/classes/'),
// //         ]);

// //         const teachersData = teachersRes.status === 'fulfilled' ? teachersRes.value.data || [] : [];
// //         const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data || [] : [];
// //         const classesData = classesRes.status === 'fulfilled' ? classesRes.value.data || [] : [];

// //         const teachersTotal = teachersData.length;
// //         const adminsCount = teachersData.filter((t: any) => t.role === 'ADMIN').length;
// //         const teachersCount = teachersData.filter((t: any) => t.role === 'TEACHER').length;
// //         const staffsCount = teachersData.filter((t: any) => t.role === 'STAFF').length;

// //         const maleTeachers = teachersData.filter((t: any) => t.gender === 'L').length;
// //         const femaleTeachers = teachersData.filter((t: any) => t.gender === 'P').length;

// //         const completeTeachers = teachersData.filter(
// //           (t: any) => t.full_name && t.nip && t.phone_number
// //         ).length;

// //         setStats({
// //           teachersTotal,
// //           adminsCount,
// //           teachersCount,
// //           staffsCount,
// //           maleTeachers,
// //           femaleTeachers,
// //           completeTeachers,
// //           studentsTotal: Array.isArray(studentsData) ? studentsData.length : (studentsData.count || 0),
// //           classesTotal: Array.isArray(classesData) ? classesData.length : (classesData.count || 0),
// //         });
// //       } catch (err) {
// //         // Silently catch error
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //     fetchAllDashboardData();
// //   }, []);

// //   const activeUser = mounted ? user : null;
// //   const roleText = activeUser?.role ? activeUser.role.toUpperCase() : 'ADMIN';

// //   const completePercentage = stats.teachersTotal > 0 
// //     ? Math.round((stats.completeTeachers / stats.teachersTotal) * 100) 
// //     : 0;

// //   return (
// //     <div className="p-6 max-w-7xl mx-auto space-y-6">
// //       {/* BANNER UTAMA */}
// //       <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
// //         <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
// //         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
// //           <div className="space-y-2">
// //             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
// //               <Sparkles className="w-3.5 h-3.5 text-amber-300" />
// //               Sistem Pusat Informasi SaaS Sekolah
// //             </div>
// //             <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
// //               Selamat Datang, {activeUser?.full_name || activeUser?.username || 'Pengguna'}! 👋
// //             </h1>
// //             <p className="text-sm text-indigo-200/80 max-w-xl leading-relaxed">
// //               Ringkasan real-time data Guru, Staf, Siswa, dan Rombongan Belajar Sekolah Anda.
// //             </p>
// //           </div>

// //           <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
// //             <div className="p-3 bg-indigo-600/50 rounded-xl border border-indigo-400/30">
// //               <School className="w-6 h-6 text-white" />
// //             </div>
// //             <div>
// //               <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider block">Instansi Sekolah</span>
// //               <span className="text-sm font-bold text-white block truncate max-w-[180px]">
// //                 {activeUser?.school_name || 'Sekolah SaaS'}
// //               </span>
// //               <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
// //                 ROLE: {roleText}
// //               </span>
// //             </div>
// //           </div>
// //         </div>
// //       </div>

// //       {/* 4 KARTU METRIK UTAMA REAL-TIME */}
// //       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
// //         {/* Metric Guru */}
// //         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
// //           <div className="space-y-1">
// //             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Guru & Staf</span>
// //             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.teachersTotal}</span>
// //             <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
// //               <Activity className="w-3 h-3" /> Realtime Sync
// //             </span>
// //           </div>
// //           <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
// //             <UserCheck className="w-6 h-6" />
// //           </div>
// //         </div>

// //         {/* Metric Siswa */}
// //         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
// //           <div className="space-y-1">
// //             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Siswa</span>
// //             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.studentsTotal}</span>
// //             <span className="text-[11px] text-blue-600 font-semibold block flex items-center gap-1">
// //               <Activity className="w-3 h-3" /> Terdaftar di Sistem
// //             </span>
// //           </div>
// //           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
// //             <Users className="w-6 h-6" />
// //           </div>
// //         </div>

// //         {/* Metric Kelas */}
// //         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
// //           <div className="space-y-1">
// //             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Kelas</span>
// //             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.classesTotal}</span>
// //             <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
// //               <Activity className="w-3 h-3" /> Rombel Aktif
// //             </span>
// //           </div>
// //           <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
// //             <BookOpen className="w-6 h-6" />
// //           </div>
// //         </div>

// //         {/* Metric Absensi */}
// //         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
// //           <div className="space-y-1">
// //             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Kehadiran Hari Ini</span>
// //             <span className="text-2xl font-bold text-slate-800">-</span>
// //             <span className="text-[11px] text-slate-400 block font-medium">Modul Absensi</span>
// //           </div>
// //           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
// //             <ClipboardCheck className="w-6 h-6" />
// //           </div>
// //         </div>
// //       </div>

// //       {/* GRID RINCIAN DATA & PINTASAN */}
// //       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
// //         {/* KOLOM KIRI (2/3) */}
// //         <div className="lg:col-span-2 space-y-6">
// //           <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
// //             <div className="flex items-center justify-between pb-3 border-b border-slate-100">
// //               <div>
// //                 <h2 className="text-base font-bold text-slate-800">Distribusi Pengguna Sekolah</h2>
// //                 <p className="text-xs text-slate-400 mt-0.5">Komposisi peran guru dan staf operasional.</p>
// //               </div>
// //               <Link
// //                 href="/teachers"
// //                 className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
// //               >
// //                 Kelola Guru <ArrowRight className="w-3.5 h-3.5" />
// //               </Link>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
// //               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
// //                 <span className="text-xs font-bold text-indigo-800 block">Guru Pengajar</span>
// //                 <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
// //                   {loading ? '...' : stats.teachersCount}
// //                 </span>
// //                 <span className="text-[10px] text-indigo-600 font-medium block mt-1">Tenaga Pendidik</span>
// //               </div>

// //               <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
// //                 <span className="text-xs font-bold text-emerald-800 block">Staf Tata Usaha</span>
// //                 <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
// //                   {loading ? '...' : stats.staffsCount}
// //                 </span>
// //                 <span className="text-[10px] text-emerald-600 font-medium block mt-1">Operasional</span>
// //               </div>

// //               <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
// //                 <span className="text-xs font-bold text-amber-800 block">Admin Sekolah</span>
// //                 <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
// //                   {loading ? '...' : stats.adminsCount}
// //                 </span>
// //                 <span className="text-[10px] text-amber-600 font-medium block mt-1">Pengelola Sistem</span>
// //               </div>
// //             </div>

// //             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
// //               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
// //                 <div className="flex items-center justify-between text-xs font-bold text-slate-700">
// //                   <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Kelengkapan Profil Guru</span>
// //                   <span>{completePercentage}%</span>
// //                 </div>
// //                 <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
// //                   <div 
// //                     className="bg-emerald-500 h-full rounded-full transition-all duration-500"
// //                     style={{ width: `${completePercentage}%` }}
// //                   />
// //                 </div>
// //                 <div className="flex justify-between text-[11px] text-slate-500 pt-1">
// //                   <span>Lengkap: <b className="text-slate-800">{stats.completeTeachers}</b></span>
// //                   <span>Belum Lengkap: <b className="text-rose-600">{stats.teachersTotal - stats.completeTeachers}</b></span>
// //                 </div>
// //               </div>

// //               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
// //                 <span className="text-xs font-bold text-slate-700 block">Demografi Pengajar</span>
// //                 <div className="flex items-center justify-around pt-1 text-xs">
// //                   <div className="text-center">
// //                     <span className="text-slate-400 block text-[10px] uppercase font-bold">Laki-Laki</span>
// //                     <span className="text-base font-bold text-indigo-700">{stats.maleTeachers}</span>
// //                   </div>
// //                   <div className="h-8 w-px bg-slate-200" />
// //                   <div className="text-center">
// //                     <span className="text-slate-400 block text-[10px] uppercase font-bold">Perempuan</span>
// //                     <span className="text-base font-bold text-rose-600">{stats.femaleTeachers}</span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>
// //           </div>
// //         </div>

// //         {/* KOLOM KANAN (1/3) */}
// //         <div className="space-y-6">
// //           <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
// //             <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
// //               Akses Pintas Modul
// //             </h2>

// //             <div className="space-y-2.5">
// //               <Link
// //                 href="/teachers"
// //                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
// //                     <UserCheck className="w-4 h-4" />
// //                   </div>
// //                   <div>
// //                     <h3 className="text-xs font-bold text-slate-800">Kelola Data Guru</h3>
// //                     <p className="text-[10px] text-slate-400">Total {stats.teachersTotal} Pengguna</p>
// //                   </div>
// //                 </div>
// //                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
// //               </Link>

// //               <Link
// //                 href="/students"
// //                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition group"
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
// //                     <Users className="w-4 h-4" />
// //                   </div>
// //                   <div>
// //                     <h3 className="text-xs font-bold text-slate-800">Kelola Data Siswa</h3>
// //                     <p className="text-[10px] text-slate-400">Total {stats.studentsTotal} Siswa</p>
// //                   </div>
// //                 </div>
// //                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
// //               </Link>

// //               <Link
// //                 href="/classes"
// //                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition group"
// //               >
// //                 <div className="flex items-center gap-3">
// //                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
// //                     <BookOpen className="w-4 h-4" />
// //                   </div>
// //                   <div>
// //                     <h3 className="text-xs font-bold text-slate-800">Kelola Kelas</h3>
// //                     <p className="text-[10px] text-slate-400">Total {stats.classesTotal} Kelas</p>
// //                   </div>
// //                 </div>
// //                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
// //               </Link>
// //             </div>
// //           </div>
// //         </div>
// //       </div>
// //     </div>
// //   );
// // }













// 'use client';

// import { useState, useEffect } from 'react';
// import Link from 'next/link';
// import { api } from '@/lib/api';
// import { useAuthStore } from '@/store/authStore';
// import { 
//   Users, UserCheck, BookOpen, ClipboardCheck, ArrowRight, 
//   School, Activity, Sparkles, ShieldCheck, GraduationCap, 
//   CheckCircle2, Clock, AlertTriangle, FileSpreadsheet
// } from 'lucide-react';

// interface DashboardStats {
//   teachersTotal: number;
//   adminsCount: number;
//   teachersCount: number;
//   staffsCount: number;
//   maleTeachers: number;
//   femaleTeachers: number;
//   completeTeachers: number;
//   studentsTotal: number;
//   classesTotal: number;
//   // Tambahan Stat untuk Absensi & Akademik
//   todayAttendanceRecorded: number;
//   todayAttendanceTotal: number;
//   subjectsTotal: number;
// }

// export default function DashboardPage() {
//   const user = useAuthStore((state) => state.user);
//   const [mounted, setMounted] = useState(false);
//   const [stats, setStats] = useState<DashboardStats>({
//     teachersTotal: 0,
//     adminsCount: 0,
//     teachersCount: 0,
//     staffsCount: 0,
//     maleTeachers: 0,
//     femaleTeachers: 0,
//     completeTeachers: 0,
//     studentsTotal: 0,
//     classesTotal: 0,
//     todayAttendanceRecorded: 0,
//     todayAttendanceTotal: 0,
//     subjectsTotal: 0,
//   });
//   const [loading, setLoading] = useState(true);

//   useEffect(() => {
//     setMounted(true);

//     const fetchAllDashboardData = async () => {
//       try {
//         setLoading(true);

//         const todayDate = new Date().toISOString().split('T')[0];

//         // Fetch paralel dari seluruh modul yang sudah diperbarui
//         const [teachersRes, studentsRes, classesRes, subjectsRes, attendanceRes] = await Promise.allSettled([
//           api.get('/users/teachers/'),
//           api.get('/students/students/?page_size=1'),
//           api.get('/students/classes/?page_size=100'),
//           api.get('/academics/subjects/?page_size=100'),
//           api.get(`/attendance/attendances/monitoring/?date=${todayDate}`),
//         ]);

//         const teachersData = teachersRes.status === 'fulfilled' ? teachersRes.value.data?.results || teachersRes.value.data || [] : [];
//         const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data : null;
//         const classesData = classesRes.status === 'fulfilled' ? classesRes.value.data?.results || classesRes.value.data || [] : [];
//         const subjectsData = subjectsRes.status === 'fulfilled' ? subjectsRes.value.data?.results || subjectsRes.value.data || [] : [];
//         const attendanceData = attendanceRes.status === 'fulfilled' ? attendanceRes.value.data?.classes_monitoring || attendanceRes.value.data || [] : [];

//         // Hitung statistik Guru & Staf
//         const teachersTotal = teachersData.length;
//         const adminsCount = teachersData.filter((t: any) => t.role === 'ADMIN').length;
//         const teachersCount = teachersData.filter((t: any) => t.role === 'TEACHER').length;
//         const staffsCount = teachersData.filter((t: any) => t.role === 'STAFF').length;

//         const maleTeachers = teachersData.filter((t: any) => t.gender === 'L').length;
//         const femaleTeachers = teachersData.filter((t: any) => t.gender === 'P').length;

//         const completeTeachers = teachersData.filter(
//           (t: any) => t.full_name && t.nip && t.phone_number
//         ).length;

//         // Hitung progres absensi harian
//         const recordedClasses = attendanceData.filter((c: any) => c.status === 'COMPLETED' || c.status === 'PARTIAL').length;

//         setStats({
//           teachersTotal,
//           adminsCount,
//           teachersCount,
//           staffsCount,
//           maleTeachers,
//           femaleTeachers,
//           completeTeachers,
//           studentsTotal: Array.isArray(studentsData) ? studentsData.length : (studentsData?.count || 0),
//           classesTotal: Array.isArray(classesData) ? classesData.length : (classesData?.count || 0),
//           todayAttendanceRecorded: recordedClasses,
//           todayAttendanceTotal: Array.isArray(classesData) ? classesData.length : 0,
//           subjectsTotal: Array.isArray(subjectsData) ? subjectsData.length : 0,
//         });
//       } catch (err) {
//         // Silently catch error
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAllDashboardData();
//   }, []);

//   const activeUser = mounted ? user : null;
//   const roleText = activeUser?.role ? activeUser.role.toUpperCase() : 'ADMIN';

//   const completePercentage = stats.teachersTotal > 0 
//     ? Math.round((stats.completeTeachers / stats.teachersTotal) * 100) 
//     : 0;

//   const attendancePercentage = stats.todayAttendanceTotal > 0
//     ? Math.round((stats.todayAttendanceRecorded / stats.todayAttendanceTotal) * 100)
//     : 0;

//   return (
//     <div className="p-6 max-w-7xl mx-auto space-y-6">
//       {/* BANNER UTAMA */}
//       <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
//         <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
//         <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
//           <div className="space-y-2">
//             <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
//               <Sparkles className="w-3.5 h-3.5 text-amber-300" />
//               Sistem Pusat Informasi SaaS Sekolah
//             </div>
//             <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
//               Selamat Datang, {activeUser?.full_name || activeUser?.username || 'Pengguna'}! 👋
//             </h1>
//             <p className="text-sm text-indigo-200/80 max-w-xl leading-relaxed">
//               Ringkasan real-time data Guru, Staf, Siswa, Presensi Harian, dan Nilai Akademik Sekolah Anda.
//             </p>
//           </div>

//           <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
//             <div className="p-3 bg-indigo-600/50 rounded-xl border border-indigo-400/30">
//               <School className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider block">Instansi Sekolah</span>
//               <span className="text-sm font-bold text-white block truncate max-w-[180px]">
//                 {activeUser?.school_name || 'Sekolah SaaS'}
//               </span>
//               <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
//                 ROLE: {roleText}
//               </span>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* 4 KARTU METRIK UTAMA REAL-TIME */}
//       <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//         {/* Metric Guru */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//           <div className="space-y-1">
//             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Guru & Staf</span>
//             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.teachersTotal}</span>
//             <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
//               <Activity className="w-3 h-3" /> Realtime Sync
//             </span>
//           </div>
//           <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
//             <UserCheck className="w-6 h-6" />
//           </div>
//         </div>

//         {/* Metric Siswa */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//           <div className="space-y-1">
//             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Siswa</span>
//             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.studentsTotal}</span>
//             <span className="text-[11px] text-blue-600 font-semibold block flex items-center gap-1">
//               <Activity className="w-3 h-3" /> Terdaftar di Sistem
//             </span>
//           </div>
//           <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
//             <Users className="w-6 h-6" />
//           </div>
//         </div>

//         {/* Metric Kelas */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//           <div className="space-y-1">
//             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Kelas</span>
//             <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.classesTotal}</span>
//             <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
//               <Activity className="w-3 h-3" /> Rombel Aktif
//             </span>
//           </div>
//           <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
//             <BookOpen className="w-6 h-6" />
//           </div>
//         </div>

//         {/* Metric Status Absensi Harian */}
//         <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
//           <div className="space-y-1">
//             <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Absensi Hari Ini</span>
//             <span className="text-2xl font-bold text-slate-800">
//               {loading ? '...' : `${stats.todayAttendanceRecorded}/${stats.todayAttendanceTotal}`}
//             </span>
//             <span className="text-[11px] text-amber-600 font-semibold block flex items-center gap-1">
//               <Clock className="w-3 h-3" /> Kelas Terisi ({attendancePercentage}%)
//             </span>
//           </div>
//           <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
//             <ClipboardCheck className="w-6 h-6" />
//           </div>
//         </div>
//       </div>

//       {/* GRID RINCIAN DATA & PINTASAN */}
//       <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
//         {/* KOLOM KIRI (2/3) */}
//         <div className="lg:col-span-2 space-y-6">
//           <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
//             <div className="flex items-center justify-between pb-3 border-b border-slate-100">
//               <div>
//                 <h2 className="text-base font-bold text-slate-800">Distribusi Pengguna Sekolah</h2>
//                 <p className="text-xs text-slate-400 mt-0.5">Komposisi peran guru dan staf operasional.</p>
//               </div>
//               <Link
//                 href="/teachers"
//                 className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
//               >
//                 Kelola Guru <ArrowRight className="w-3.5 h-3.5" />
//               </Link>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
//               <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
//                 <span className="text-xs font-bold text-indigo-800 block">Guru Pengajar</span>
//                 <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
//                   {loading ? '...' : stats.teachersCount}
//                 </span>
//                 <span className="text-[10px] text-indigo-600 font-medium block mt-1">Tenaga Pendidik</span>
//               </div>

//               <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
//                 <span className="text-xs font-bold text-emerald-800 block">Staf Tata Usaha</span>
//                 <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
//                   {loading ? '...' : stats.staffsCount}
//                 </span>
//                 <span className="text-[10px] text-emerald-600 font-medium block mt-1">Operasional</span>
//               </div>

//               <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
//                 <span className="text-xs font-bold text-amber-800 block">Admin Sekolah</span>
//                 <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
//                   {loading ? '...' : stats.adminsCount}
//                 </span>
//                 <span className="text-[10px] text-amber-600 font-medium block mt-1">Pengelola Sistem</span>
//               </div>
//             </div>

//             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
//               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
//                 <div className="flex items-center justify-between text-xs font-bold text-slate-700">
//                   <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Kelengkapan Profil Guru</span>
//                   <span>{completePercentage}%</span>
//                 </div>
//                 <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
//                   <div 
//                     className="bg-emerald-500 h-full rounded-full transition-all duration-500"
//                     style={{ width: `${completePercentage}%` }}
//                   />
//                 </div>
//                 <div className="flex justify-between text-[11px] text-slate-500 pt-1">
//                   <span>Lengkap: <b className="text-slate-800">{stats.completeTeachers}</b></span>
//                   <span>Belum Lengkap: <b className="text-rose-600">{stats.teachersTotal - stats.completeTeachers}</b></span>
//                 </div>
//               </div>

//               <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
//                 <span className="text-xs font-bold text-slate-700 block">Demografi Pengajar</span>
//                 <div className="flex items-center justify-around pt-1 text-xs">
//                   <div className="text-center">
//                     <span className="text-slate-400 block text-[10px] uppercase font-bold">Laki-Laki</span>
//                     <span className="text-base font-bold text-indigo-700">{stats.maleTeachers}</span>
//                   </div>
//                   <div className="h-8 w-px bg-slate-200" />
//                   <div className="text-center">
//                     <span className="text-slate-400 block text-[10px] uppercase font-bold">Perempuan</span>
//                     <span className="text-base font-bold text-rose-600">{stats.femaleTeachers}</span>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* KOLOM KANAN (1/3) */}
//         <div className="space-y-6">
//           <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
//             <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
//               Akses Pintas Modul
//             </h2>

//             <div className="space-y-2.5">
//               <Link
//                 href="/teachers"
//                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
//                     <UserCheck className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-bold text-slate-800">Kelola Data Guru</h3>
//                     <p className="text-[10px] text-slate-400">Total {stats.teachersTotal} Pengguna</p>
//                   </div>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
//               </Link>

//               <Link
//                 href="/students"
//                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
//                     <Users className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-bold text-slate-800">Kelola Data Siswa</h3>
//                     <p className="text-[10px] text-slate-400">Total {stats.studentsTotal} Siswa</p>
//                   </div>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
//               </Link>

//               <Link
//                 href="/classes"
//                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
//                     <BookOpen className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-bold text-slate-800">Kelola Kelas</h3>
//                     <p className="text-[10px] text-slate-400">Total {stats.classesTotal} Rombel</p>
//                   </div>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
//               </Link>

//               {/* Pintasan Modul Presensi & Matriks */}
//               <Link
//                 href="/attendance"
//                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30 transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
//                     <ClipboardCheck className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-bold text-slate-800">Presensi & Matriks</h3>
//                     <p className="text-[10px] text-slate-400">Input Harian & Monitoring Live</p>
//                   </div>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
//               </Link>

//               {/* Pintasan Modul Penilaian & KKM */}
//               <Link
//                 href="/grades"
//                 className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition group"
//               >
//                 <div className="flex items-center gap-3">
//                   <div className="p-2 bg-purple-100 text-purple-700 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
//                     <GraduationCap className="w-4 h-4" />
//                   </div>
//                   <div>
//                     <h3 className="text-xs font-bold text-slate-800">Nilai & Evaluasi Ujian</h3>
//                     <p className="text-[10px] text-slate-400">Master KKM & Export Excel</p>
//                   </div>
//                 </div>
//                 <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
//               </Link>
//             </div>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
















'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useAuthStore } from '@/store/authStore';
import { 
  Users, UserCheck, BookOpen, ClipboardCheck, ArrowRight, 
  School, Activity, Sparkles, ShieldCheck, GraduationCap, 
  Clock, AlertTriangle, CheckCircle2, Server, HelpCircle, 
  AlertCircle, UserX, FileSpreadsheet
} from 'lucide-react';

interface DashboardStats {
  teachersTotal: number;
  adminsCount: number;
  teachersCount: number;
  staffsCount: number;
  maleTeachers: number;
  femaleTeachers: number;
  completeTeachers: number;
  studentsTotal: number;
  classesTotal: number;
  // Stats Absensi Harian Real-time
  todayAttendanceRecorded: number;
  todayAttendanceTotal: number;
  todayHadir: number;
  todaySakit: number;
  todayIzin: number;
  todayAlpa: number;
  subjectsTotal: number;
}

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [mounted, setMounted] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    teachersTotal: 0,
    adminsCount: 0,
    teachersCount: 0,
    staffsCount: 0,
    maleTeachers: 0,
    femaleTeachers: 0,
    completeTeachers: 0,
    studentsTotal: 0,
    classesTotal: 0,
    todayAttendanceRecorded: 0,
    todayAttendanceTotal: 0,
    todayHadir: 0,
    todaySakit: 0,
    todayIzin: 0,
    todayAlpa: 0,
    subjectsTotal: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setMounted(true);

    const fetchAllDashboardData = async () => {
      try {
        setLoading(true);
        const todayDate = new Date().toISOString().split('T')[0];

        const [teachersRes, studentsRes, classesRes, subjectsRes, attendanceRes] = await Promise.allSettled([
          api.get('/users/teachers/'),
          api.get('/students/students/?page_size=1'),
          api.get('/students/classes/?page_size=100'),
          api.get('/academics/subjects/?page_size=100'),
          api.get(`/attendance/attendances/monitoring/?date=${todayDate}`),
        ]);

        const teachersData = teachersRes.status === 'fulfilled' ? teachersRes.value.data?.results || teachersRes.value.data || [] : [];
        const studentsData = studentsRes.status === 'fulfilled' ? studentsRes.value.data : null;
        const classesData = classesRes.status === 'fulfilled' ? classesRes.value.data?.results || classesRes.value.data || [] : [];
        const subjectsData = subjectsRes.status === 'fulfilled' ? subjectsRes.value.data?.results || subjectsRes.value.data || [] : [];
        const attendanceData = attendanceRes.status === 'fulfilled' ? attendanceRes.value.data?.classes_monitoring || attendanceRes.value.data || [] : [];

        // Hitung statistik Guru
        const teachersTotal = teachersData.length;
        const adminsCount = teachersData.filter((t: any) => t.role === 'ADMIN').length;
        const teachersCount = teachersData.filter((t: any) => t.role === 'TEACHER').length;
        const staffsCount = teachersData.filter((t: any) => t.role === 'STAFF').length;

        const maleTeachers = teachersData.filter((t: any) => t.gender === 'L').length;
        const femaleTeachers = teachersData.filter((t: any) => t.gender === 'P').length;

        const completeTeachers = teachersData.filter(
          (t: any) => t.full_name && t.nip && t.phone_number
        ).length;

        // Hitung progres absensi & akumulasi H/S/I/A hari ini
        let recordedClasses = 0;
        let sumHadir = 0;
        let sumSakit = 0;
        let sumIzin = 0;
        let sumAlpa = 0;

        if (Array.isArray(attendanceData)) {
          attendanceData.forEach((c: any) => {
            if (c.status === 'COMPLETED' || c.status === 'PARTIAL') {
              recordedClasses += 1;
            }
            sumHadir += c.present_count || 0;
            sumSakit += c.sick_count || 0;
            sumIzin += c.permit_count || 0;
            sumAlpa += c.absent_count || 0;
          });
        }

        setStats({
          teachersTotal,
          adminsCount,
          teachersCount,
          staffsCount,
          maleTeachers,
          femaleTeachers,
          completeTeachers,
          studentsTotal: Array.isArray(studentsData) ? studentsData.length : (studentsData?.count || 0),
          classesTotal: Array.isArray(classesData) ? classesData.length : (classesData?.count || 0),
          todayAttendanceRecorded: recordedClasses,
          todayAttendanceTotal: Array.isArray(classesData) ? classesData.length : 0,
          todayHadir: sumHadir,
          todaySakit: sumSakit,
          todayIzin: sumIzin,
          todayAlpa: sumAlpa,
          subjectsTotal: Array.isArray(subjectsData) ? subjectsData.length : 0,
        });
      } catch (err) {
        // Silently catch
      } finally {
        setLoading(false);
      }
    };

    fetchAllDashboardData();
  }, []);

  const activeUser = mounted ? user : null;
  const roleText = activeUser?.role ? activeUser.role.toUpperCase() : 'ADMIN';

  const completePercentage = stats.teachersTotal > 0 
    ? Math.round((stats.completeTeachers / stats.teachersTotal) * 100) 
    : 0;

  const attendancePercentage = stats.todayAttendanceTotal > 0
    ? Math.round((stats.todayAttendanceRecorded / stats.todayAttendanceTotal) * 100)
    : 0;

  const unrecordedClassesCount = Math.max(0, stats.todayAttendanceTotal - stats.todayAttendanceRecorded);

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* SYSTEM STATUS BAR */}
      <div className="flex items-center justify-between text-xs text-slate-500 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-xs">
        <div className="flex items-center gap-2 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-slate-700 font-bold">API Backend Online:</span> Django DRF Tenant Connected
        </div>
        <div className="hidden sm:flex items-center gap-4 font-mono text-[11px]">
          <span>VERSI: v1.2.0-STABLE</span>
          <span>SISTEM: SAAS MULTI-TENANT</span>
        </div>
      </div>

      {/* BANNER UTAMA */}
      <div className="relative overflow-hidden bg-gradient-to-r from-indigo-900 via-indigo-800 to-slate-900 rounded-3xl p-6 sm:p-8 text-white shadow-xl">
        <div className="absolute -right-10 -bottom-10 w-64 h-64 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 border border-indigo-400/30 text-xs font-semibold text-indigo-200">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" />
              Sistem Pusat Informasi SaaS Sekolah
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Selamat Datang, {activeUser?.full_name || activeUser?.username || 'Pengguna'}! 👋
            </h1>
            <p className="text-sm text-indigo-200/80 max-w-xl leading-relaxed">
              Ringkasan real-time data Guru, Staf, Siswa, Presensi Harian, dan Nilai Akademik Sekolah Anda.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md p-4 rounded-2xl border border-white/10 flex items-center gap-4 shrink-0">
            <div className="p-3 bg-indigo-600/50 rounded-xl border border-indigo-400/30">
              <School className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="text-xs text-indigo-200 uppercase font-bold tracking-wider block">Instansi Sekolah</span>
              <span className="text-sm font-bold text-white block truncate max-w-[180px]">
                {activeUser?.school_name || 'Sekolah SaaS'}
              </span>
              <span className="inline-block mt-1 px-2 py-0.5 text-[10px] font-extrabold rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30">
                ROLE: {roleText}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* SMART ALERT (JIKA ADA KELAS BELUM DIABSEN) */}
      {unrecordedClassesCount > 0 && (
        <div className="bg-amber-50 border border-amber-200 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 text-amber-900 text-xs">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-100 rounded-xl text-amber-700 shrink-0">
              <AlertTriangle className="w-5 h-5" />
            </div>
            <div>
              <span className="font-bold text-sm block">Perhatian Presensi Harian</span>
              <p className="text-amber-800">
                Masih ada <strong className="font-extrabold">{unrecordedClassesCount} Rombel/Kelas</strong> yang belum menyelesaikan absensi hari ini.
              </p>
            </div>
          </div>
          <Link
            href="/attendance"
            className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl transition shrink-0"
          >
            Isi Absensi Sekarang &rarr;
          </Link>
        </div>
      )}

      {/* 4 KARTU METRIK UTAMA REAL-TIME */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric Guru */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Guru & Staf</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.teachersTotal}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
              <Activity className="w-3 h-3" /> Realtime Sync
            </span>
          </div>
          <div className="p-3.5 bg-indigo-50 text-indigo-600 rounded-2xl">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Siswa */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Siswa</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.studentsTotal}</span>
            <span className="text-[11px] text-blue-600 font-semibold block flex items-center gap-1">
              <Activity className="w-3 h-3" /> Terdaftar di Sistem
            </span>
          </div>
          <div className="p-3.5 bg-blue-50 text-blue-600 rounded-2xl">
            <Users className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Kelas */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Total Rombel</span>
            <span className="text-2xl font-bold text-slate-800">{loading ? '...' : stats.classesTotal}</span>
            <span className="text-[11px] text-emerald-600 font-semibold block flex items-center gap-1">
              <Activity className="w-3 h-3" /> Kelas Aktif
            </span>
          </div>
          <div className="p-3.5 bg-emerald-50 text-emerald-600 rounded-2xl">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        {/* Metric Status Absensi Harian */}
        <div className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs flex items-center justify-between">
          <div className="space-y-1">
            <span className="text-xs font-semibold text-slate-400 block uppercase tracking-wider">Absensi Hari Ini</span>
            <span className="text-2xl font-bold text-slate-800">
              {loading ? '...' : `${stats.todayAttendanceRecorded}/${stats.todayAttendanceTotal}`}
            </span>
            <span className="text-[11px] text-amber-600 font-semibold block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Rombel Selesai ({attendancePercentage}%)
            </span>
          </div>
          <div className="p-3.5 bg-amber-50 text-amber-600 rounded-2xl">
            <ClipboardCheck className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* GRID RINCIAN DATA & PINTASAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* KOLOM KIRI (2/3) */}
        <div className="lg:col-span-2 space-y-6">
          {/* AKUMULASI PRESENSI HARIAN SEKOLAH (H / S / I / A) */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-base font-bold text-slate-800">Rangkuman Kehadiran Siswa Hari Ini</h2>
                <p className="text-xs text-slate-400 mt-0.5">Akumulasi seluruh status absensi siswa di semua kelas.</p>
              </div>
              <Link
                href="/attendance"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                Lihat Matriks <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="p-3.5 bg-emerald-50/60 rounded-xl border border-emerald-100 text-center">
                <span className="text-xs font-bold text-emerald-800 block">Hadir</span>
                <span className="text-2xl font-extrabold text-emerald-700 mt-0.5 block">{stats.todayHadir}</span>
                <span className="text-[10px] text-emerald-600">Siswa</span>
              </div>

              <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-100 text-center">
                <span className="text-xs font-bold text-amber-800 block">Sakit</span>
                <span className="text-2xl font-extrabold text-amber-700 mt-0.5 block">{stats.todaySakit}</span>
                <span className="text-[10px] text-amber-600">Siswa</span>
              </div>

              <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-100 text-center">
                <span className="text-xs font-bold text-blue-800 block">Izin</span>
                <span className="text-2xl font-extrabold text-blue-700 mt-0.5 block">{stats.todayIzin}</span>
                <span className="text-[10px] text-blue-600">Siswa</span>
              </div>

              <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-100 text-center">
                <span className="text-xs font-bold text-rose-800 block">Alpa</span>
                <span className="text-2xl font-extrabold text-rose-700 mt-0.5 block">{stats.todayAlpa}</span>
                <span className="text-[10px] text-rose-600">Siswa</span>
              </div>
            </div>
          </div>

          {/* DISTRIBUSI PENGGUNA SEKOLAH */}
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-800">Distribusi Pengguna Sekolah</h2>
                <p className="text-xs text-slate-400 mt-0.5">Komposisi peran guru dan staf operasional.</p>
              </div>
              <Link
                href="/teachers"
                className="text-xs font-bold text-indigo-600 hover:text-indigo-700 flex items-center gap-1 hover:underline"
              >
                Kelola Guru <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="p-4 bg-indigo-50/50 rounded-2xl border border-indigo-100">
                <span className="text-xs font-bold text-indigo-800 block">Guru Pengajar</span>
                <span className="text-2xl font-extrabold text-indigo-900 mt-1 block">
                  {loading ? '...' : stats.teachersCount}
                </span>
                <span className="text-[10px] text-indigo-600 font-medium block mt-1">Tenaga Pendidik</span>
              </div>

              <div className="p-4 bg-emerald-50/50 rounded-2xl border border-emerald-100">
                <span className="text-xs font-bold text-emerald-800 block">Staf Tata Usaha</span>
                <span className="text-2xl font-extrabold text-emerald-900 mt-1 block">
                  {loading ? '...' : stats.staffsCount}
                </span>
                <span className="text-[10px] text-emerald-600 font-medium block mt-1">Operasional</span>
              </div>

              <div className="p-4 bg-amber-50/50 rounded-2xl border border-amber-100">
                <span className="text-xs font-bold text-amber-800 block">Admin Sekolah</span>
                <span className="text-2xl font-extrabold text-amber-900 mt-1 block">
                  {loading ? '...' : stats.adminsCount}
                </span>
                <span className="text-[10px] text-amber-600 font-medium block mt-1">Pengelola Sistem</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-slate-700">
                  <span className="flex items-center gap-1.5"><ShieldCheck className="w-4 h-4 text-emerald-600" /> Kelengkapan Profil Guru</span>
                  <span>{completePercentage}%</span>
                </div>
                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                  <div 
                    className="bg-emerald-500 h-full rounded-full transition-all duration-500"
                    style={{ width: `${completePercentage}%` }}
                  />
                </div>
                <div className="flex justify-between text-[11px] text-slate-500 pt-1">
                  <span>Lengkap: <b className="text-slate-800">{stats.completeTeachers}</b></span>
                  <span>Belum Lengkap: <b className="text-rose-600">{stats.teachersTotal - stats.completeTeachers}</b></span>
                </div>
              </div>

              <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200/60 space-y-2">
                <span className="text-xs font-bold text-slate-700 block">Demografi Pengajar</span>
                <div className="flex items-center justify-around pt-1 text-xs">
                  <div className="text-center">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Laki-Laki</span>
                    <span className="text-base font-bold text-indigo-700">{stats.maleTeachers}</span>
                  </div>
                  <div className="h-8 w-px bg-slate-200" />
                  <div className="text-center">
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Perempuan</span>
                    <span className="text-base font-bold text-rose-600">{stats.femaleTeachers}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* KOLOM KANAN (1/3) */}
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
            <h2 className="text-base font-bold text-slate-800 border-b border-slate-100 pb-3">
              Akses Pintas Modul
            </h2>

            <div className="space-y-2.5">
              <Link
                href="/teachers"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-indigo-300 hover:bg-indigo-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-indigo-100 text-indigo-700 rounded-lg group-hover:bg-indigo-600 group-hover:text-white transition">
                    <UserCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Kelola Data Guru</h3>
                    <p className="text-[10px] text-slate-400">Total {stats.teachersTotal} Pengguna</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-600 transition" />
              </Link>

              <Link
                href="/students"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-blue-300 hover:bg-blue-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-blue-100 text-blue-700 rounded-lg group-hover:bg-blue-600 group-hover:text-white transition">
                    <Users className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Kelola Data Siswa</h3>
                    <p className="text-[10px] text-slate-400">Total {stats.studentsTotal} Siswa</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-600 transition" />
              </Link>

              <Link
                href="/classes"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-emerald-300 hover:bg-emerald-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-emerald-100 text-emerald-700 rounded-lg group-hover:bg-emerald-600 group-hover:text-white transition">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Kelola Kelas</h3>
                    <p className="text-[10px] text-slate-400">Total {stats.classesTotal} Rombel</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-emerald-600 transition" />
              </Link>

              <Link
                href="/attendance"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-amber-300 hover:bg-amber-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-amber-100 text-amber-700 rounded-lg group-hover:bg-amber-600 group-hover:text-white transition">
                    <ClipboardCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Presensi & Matriks</h3>
                    <p className="text-[10px] text-slate-400">Input Harian & Monitoring Live</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-600 transition" />
              </Link>

              <Link
                href="/academics"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-teal-300 hover:bg-teal-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-teal-100 text-teal-700 rounded-lg group-hover:bg-teal-600 group-hover:text-white transition">
                    <BookOpen className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Mapel & Jadwal</h3>
                    <p className="text-[10px] text-slate-400">{stats.subjectsTotal} Mata Pelajaran</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-teal-600 transition" />
              </Link>

              <Link
                href="/grades"
                className="flex items-center justify-between p-3 rounded-xl border border-slate-200/80 hover:border-purple-300 hover:bg-purple-50/30 transition group"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 bg-purple-100 text-purple-700 rounded-lg group-hover:bg-purple-600 group-hover:text-white transition">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-slate-800">Nilai & Evaluasi Ujian</h3>
                    <p className="text-[10px] text-slate-400">Master KKM & Export Excel</p>
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-purple-600 transition" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}