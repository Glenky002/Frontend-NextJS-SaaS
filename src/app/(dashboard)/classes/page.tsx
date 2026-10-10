// 'use client';

// import { useState, useEffect } from 'react';
// import { api } from '@/lib/api';
// import toast from 'react-hot-toast';
// import {
//   Plus,
//   BookOpen,
//   UserCheck,
//   RefreshCw,
//   X,
//   Edit2,
//   Trash2,
//   Users,
//   Eye,
//   User,
//   Phone,
// } from 'lucide-react';

// interface Teacher {
//   id: number;
//   full_name?: string;
//   user?: {
//     first_name: string;
//     last_name: string;
//   };
// }

// interface StudentClass {
//   id: number;
//   name: string;
//   grade_level: number;
//   academic_year?: string;
//   homeroom_teacher?: number | null;
//   homeroom_teacher_name?: string;
//   total_students?: number;
// }

// interface Student {
//   id: number;
//   nisn: string;
//   full_name: string;
//   gender: 'L' | 'P';
//   parent_phone_number?: string;
//   status: string;
// }

// export default function ClassesPage() {
//   const [classes, setClasses] = useState<StudentClass[]>([]);
//   const [teachers, setTeachers] = useState<Teacher[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingClass, setEditingClass] = useState<StudentClass | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Drawer Detail Kelas State
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null);
//   const [classStudents, setClassStudents] = useState<Student[]>([]);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   // Custom Delete Modal State
//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     targetId?: number;
//     targetName?: string;
//   }>({
//     isOpen: false,
//   });

//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     grade_level: 10,
//     academic_year: '2026/2027',
//     homeroom_teacher: '',
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const [resClasses, resTeachers] = await Promise.all([
//         api.get('/students/classes/'),
//         api.get('/users/teachers/').catch(() => ({ data: [] })),
//       ]);
//       setClasses(resClasses.data.results || resClasses.data);
//       setTeachers(resTeachers.data.results || resTeachers.data || []);
//     } catch (err) {
//       toast.error('Gagal memuat data kelas dari server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, []);

//   // Open Drawer Detail Kelas & Fetch Siswa
//   const handleOpenDrawer = async (cls: StudentClass) => {
//     setSelectedClass(cls);
//     setIsDrawerOpen(true);
//     setLoadingStudents(true);
//     try {
//       const res = await api.get(`/students/students/?class_id=${cls.id}&page_size=100`);
//       setClassStudents(res.data.results || res.data || []);
//     } catch (err) {
//       toast.error('Gagal memuat daftar siswa di kelas ini.');
//     } finally {
//       setLoadingStudents(false);
//     }
//   };

//   const handleOpenModal = (cls?: StudentClass) => {
//     if (cls) {
//       setEditingClass(cls);
//       setFormData({
//         name: cls.name || '',
//         grade_level: cls.grade_level || 10,
//         academic_year: cls.academic_year || '2026/2027',
//         homeroom_teacher: cls.homeroom_teacher ? String(cls.homeroom_teacher) : '',
//       });
//     } else {
//       setEditingClass(null);
//       setFormData({
//         name: '',
//         grade_level: 10,
//         academic_year: '2026/2027',
//         homeroom_teacher: '',
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const payload = {
//       ...formData,
//       homeroom_teacher: formData.homeroom_teacher ? Number(formData.homeroom_teacher) : null,
//     };

//     const toastId = toast.loading(
//       editingClass ? 'Memperbarui data kelas...' : 'Menambahkan kelas baru...'
//     );

//     try {
//       if (editingClass) {
//         await api.patch(`/students/classes/${editingClass.id}/`, payload);
//         toast.success('Data kelas berhasil diperbarui!', { id: toastId });
//       } else {
//         await api.post('/students/classes/', payload);
//         toast.success('Kelas baru berhasil ditambahkan!', { id: toastId });
//       }
//       setIsModalOpen(false);
//       fetchData();
//     } catch (err: any) {
//       const resp = err.response?.data;
//       if (resp) {
//         const firstKey = Object.keys(resp)[0];
//         toast.error(`${firstKey}: ${JSON.stringify(resp[firstKey])}`, { id: toastId });
//       } else {
//         toast.error('Gagal menyimpan data kelas.', { id: toastId });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const triggerDelete = (id: number, name: string) => {
//     setDeleteModal({
//       isOpen: true,
//       targetId: id,
//       targetName: name,
//     });
//   };

//   const handleConfirmDelete = async () => {
//     if (!deleteModal.targetId) return;

//     const toastId = toast.loading('Menghapus data kelas...');

//     try {
//       await api.delete(`/students/classes/${deleteModal.targetId}/`);
//       toast.success(`Kelas ${deleteModal.targetName} berhasil dihapus.`, { id: toastId });
//       fetchData();
//     } catch (err) {
//       toast.error('Gagal menghapus kelas. Pastikan tidak ada siswa terkait.', { id: toastId });
//     } finally {
//       setDeleteModal({ isOpen: false });
//     }
//   };

//   // Hitung Laki-laki / Perempuan di Drawer
//   const countL = classStudents.filter((s) => s.gender === 'L').length;
//   const countP = classStudents.filter((s) => s.gender === 'P').length;

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Kelas</h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Kelola daftar kelas, wali kelas, dan tingkat pendidikan aktif di sekolah Anda.
//           </p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
//         >
//           <Plus className="w-5 h-5" />
//           Tambah Kelas Baru
//         </button>
//       </div>

//       {/* Grid List Kelas */}
//       {loading ? (
//         <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
//           <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
//           <span className="ml-2 text-sm text-slate-600">Memuat data kelas dari server...</span>
//         </div>
//       ) : classes.length === 0 ? (
//         <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
//           <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//           <p className="text-slate-600 font-medium">Belum ada data kelas terdaftar.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {classes.map((cls) => (
//             <div
//               key={cls.id}
//               className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
//             >
//               <div>
//                 <div className="flex justify-between items-start mb-3">
//                   <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
//                     Tingkat {cls.grade_level}
//                   </span>
//                   <div className="flex items-center gap-1">
//                     <button
//                       onClick={() => handleOpenDrawer(cls)}
//                       className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
//                       title="Lihat Detail Siswa"
//                     >
//                       <Eye className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => handleOpenModal(cls)}
//                       className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                       title="Edit Kelas"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() => triggerDelete(cls.id, cls.name)}
//                       className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//                       title="Hapus Kelas"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <h3 className="text-lg font-bold text-slate-800">{cls.name}</h3>
//               </div>

//               <div className="border-t border-slate-100 pt-3 mt-4 space-y-2 text-sm text-slate-600">
//                 <div className="flex items-center gap-2">
//                   <UserCheck className="w-4 h-4 text-blue-600" />
//                   <span>
//                     Wali Kelas:{' '}
//                     <strong className="text-slate-800 font-medium">
//                       {cls.homeroom_teacher_name || 'Belum diatur'}
//                     </strong>
//                   </span>
//                 </div>

//                 <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-50">
//                   <span>Tahun Ajaran: {cls.academic_year || '2026/2027'}</span>
//                   <button
//                     onClick={() => handleOpenDrawer(cls)}
//                     className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
//                   >
//                     <Users className="w-3.5 h-3.5" />
//                     <span>{cls.total_students || 0} Siswa</span>
//                   </button>
//                 </div>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Drawer Detail Kelas (Slide-over) */}
//       {isDrawerOpen && selectedClass && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
//           <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
//             <div>
//               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
//                 <div>
//                   <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
//                     Tingkat {selectedClass.grade_level}
//                   </span>
//                   <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedClass.name}</h2>
//                 </div>
//                 <button
//                   onClick={() => setIsDrawerOpen(false)}
//                   className="text-slate-400 hover:text-slate-600"
//                 >
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               {/* Ringkasan Kelas */}
//               <div className="grid grid-cols-3 gap-3 my-4">
//                 <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
//                   <span className="text-xs text-slate-500">Total Siswa</span>
//                   <div className="text-lg font-bold text-slate-800">{classStudents.length}</div>
//                 </div>
//                 <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-center">
//                   <span className="text-xs text-blue-600">Laki-laki</span>
//                   <div className="text-lg font-bold text-blue-700">{countL}</div>
//                 </div>
//                 <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100 text-center">
//                   <span className="text-xs text-pink-600">Perempuan</span>
//                   <div className="text-lg font-bold text-pink-700">{countP}</div>
//                 </div>
//               </div>

//               <div className="text-xs text-slate-500 mb-4 pb-3 border-b border-slate-100">
//                 Wali Kelas:{' '}
//                 <strong className="text-slate-800">
//                   {selectedClass.homeroom_teacher_name || 'Belum diatur'}
//                 </strong>{' '}
//                 | Thn Ajaran: <strong>{selectedClass.academic_year || '2026/2027'}</strong>
//               </div>

//               {/* Daftar Siswa */}
//               <h3 className="text-sm font-bold text-slate-800 mb-3">Daftar Anggota Kelas</h3>

//               {loadingStudents ? (
//                 <div className="p-8 text-center text-slate-500 flex items-center justify-center">
//                   <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-600" />
//                   <span>Memuat anggota kelas...</span>
//                 </div>
//               ) : classStudents.length === 0 ? (
//                 <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-lg">
//                   Belum ada siswa yang terdaftar di kelas ini.
//                 </div>
//               ) : (
//                 <div className="space-y-2 max-h-[50vh] overflow-y-auto pr-1">
//                   {classStudents.map((student, idx) => (
//                     <div
//                       key={student.id}
//                       className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-sm hover:border-blue-300 transition"
//                     >
//                       <div className="flex items-center gap-3">
//                         <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
//                         <div>
//                           <div className="font-semibold text-slate-800">{student.full_name}</div>
//                           <div className="text-xs text-slate-400 font-mono">
//                             NISN: {student.nisn} • {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
//                           </div>
//                         </div>
//                       </div>
//                       {student.parent_phone_number && (
//                         <a
//                           href={`https://wa.me/${student.parent_phone_number.replace(/^0/, '62')}`}
//                           target="_blank"
//                           rel="noreferrer"
//                           className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
//                           title="Hubungi OrtU via WA"
//                         >
//                           <Phone className="w-4 h-4" />
//                         </a>
//                       )}
//                     </div>
//                   ))}
//                 </div>
//               )}
//             </div>

//             <div className="pt-4 border-t border-slate-100">
//               <button
//                 onClick={() => setIsDrawerOpen(false)}
//                 className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition text-sm"
//               >
//                 Tutup Drawer
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Form Create & Edit */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-slate-800">
//                 {editingClass ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Nama Kelas *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Contoh: X IPA 1"
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Tingkat Pendidikan *
//                 </label>
//                 <select
//                   value={formData.grade_level}
//                   onChange={(e) =>
//                     setFormData({ ...formData, grade_level: Number(e.target.value) })
//                   }
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value={10}>Tingkat 10</option>
//                   <option value={11}>Tingkat 11</option>
//                   <option value={12}>Tingkat 12</option>
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Wali Kelas
//                 </label>
//                 <select
//                   value={formData.homeroom_teacher}
//                   onChange={(e) =>
//                     setFormData({ ...formData, homeroom_teacher: e.target.value })
//                   }
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 >
//                   <option value="">-- Pilih Wali Kelas (Opsional) --</option>
//                   {teachers.map((t) => {
//                     const name =
//                       t.full_name ||
//                       (t.user ? `${t.user.first_name} ${t.user.last_name}`.trim() : `Guru #${t.id}`);
//                     return (
//                       <option key={t.id} value={t.id}>
//                         {name}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium text-slate-700 mb-1">
//                   Tahun Ajaran *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.academic_year}
//                   onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex gap-3 pt-2">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 text-sm"
//                 >
//                   {submitting ? 'Menyimpan...' : 'Simpan Kelas'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* Modal Custom Konfirmasi Hapus */}
//       {deleteModal.isOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 text-center">
//             <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
//               <Trash2 className="w-7 h-7" />
//             </div>

//             <h3 className="text-xl font-bold text-slate-800">Konfirmasi Hapus Kelas</h3>
//             <p className="text-slate-500 text-sm mt-2">
//               Apakah Anda yakin ingin menghapus kelas{' '}
//               <strong className="text-slate-800">{deleteModal.targetName}</strong>?
//             </p>
//             <p className="text-xs text-red-500 mt-1 font-medium">
//               Pastikan tidak ada data siswa yang masih terikat di kelas ini.
//             </p>

//             <div className="flex gap-3 mt-6">
//               <button
//                 type="button"
//                 onClick={() => setDeleteModal({ isOpen: false })}
//                 className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-sm"
//               >
//                 Batal
//               </button>
//               <button
//                 type="button"
//                 onClick={handleConfirmDelete}
//                 className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm text-sm"
//               >
//                 Ya, Hapus
//               </button>
//             </div>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }


'use client';

import * as XLSX from 'xlsx';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Plus,
  BookOpen,
  UserCheck,
  RefreshCw,
  X,
  Edit2,
  Trash2,
  Users,
  Eye,
  Phone,
  AlertTriangle,
  FileSpreadsheet, 
  FileText
} from 'lucide-react';

interface Teacher {
  id: number;
  full_name?: string;
  user?: {
    first_name: string;
    last_name: string;
  };
}

interface StudentClass {
  id: number;
  name: string;
  grade_level: number;
  academic_year?: string;
  homeroom_teacher?: number | null;
  homeroom_teacher_name?: string;
  total_students?: number;
}

interface Student {
  id: number;
  nisn: string;
  full_name: string;
  gender: 'L' | 'P';
  parent_phone_number?: string;
  status: string;
}

// Interface Jadwal Pelajaran
interface ScheduleItem {
  id: number;
  day: 'SENIN' | 'SELASA' | 'RABU' | 'KAMIS' | 'JUMAT' | 'SABTU';
  time_slot: string;
  subject_name: string;
  teacher_name?: string;
}

export default function ClassesPage() {
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState<StudentClass | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // State Modal Broadcast WA
  const [isBroadcastModalOpen, setIsBroadcastModalOpen] = useState(false);
  const [broadcastMessage, setBroadcastMessage] = useState('');

  // Di dalam komponen ClassesPage:
  // State Switch Tab di Drawer
  const [drawerTab, setDrawerTab] = useState<'students' | 'schedule'>('students');

  // State Data Jadwal
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);
  const [loadingSchedule, setLoadingSchedule] = useState(false);

  // Drawer Detail Kelas State
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [selectedClass, setSelectedClass] = useState<StudentClass | null>(null);
  const [classStudents, setClassStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    targetId?: number;
    targetName?: string;
    totalStudents?: number;
  }>({
    isOpen: false,
  });

  // Form State
  const [formData, setFormData] = useState({
    name: '',
    grade_level: 10,
    academic_year: '2026/2027',
    homeroom_teacher: '',
  });

  // State Modal Form Jadwal Baru
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [subjects, setSubjects] = useState<Array<{ id: number; name: string }>>([]);
  const [scheduleForm, setScheduleForm] = useState({
    subject: '',
    teacher: '',
    day: 'SENIN',
    start_time: '07:00',
    end_time: '08:30',
  });


  const applyTemplate = (type: 'ujian' | 'rapat' | 'libur') => {
    const className = selectedClass?.name || 'Kelas';
    if (type === 'ujian') {
      setBroadcastMessage(
        `Yth. Bapak/Ibu Orang Tua/Wali Siswa ${className},\n\nDiinformasikan bahwa Ujian Akhir Semester (UAS) akan dilaksanakan mulai minggu depan. Mohon mendampingi putera/puterinya dalam belajar di rumah.\n\nTerima kasih.\n- Wali Kelas ${className}`
      );
    } else if (type === 'rapat') {
      setBroadcastMessage(
        `Yth. Bapak/Ibu Orang Tua/Wali Siswa ${className},\n\nKami mengundang Bapak/Ibu untuk hadir pada Rapat Pembagian Rapor & Evaluasi Belajar yang akan dilaksanakan pada:\n\nHari/Tgl: Sabtu\nWaktu: 08.00 WIB - Selesai\nTempat: Ruang Kelas ${className}\n\nTerima kasih.\n- Wali Kelas ${className}`
      );
    } else if (type === 'libur') {
      setBroadcastMessage(
        `Yth. Bapak/Ibu Orang Tua/Wali Siswa ${className},\n\nDiinformasikan bahwa kegiatan belajar mengajar akan diliburkan sehubungan dengan Hari Libur Nasional. Pembelajaran akan kembali efektif pada hari Senin.\n\nTerima kasih.\n- Wali Kelas ${className}`
      );
    }
  };

  const fetchClassSchedule = async (classId: number) => {
    setLoadingSchedule(true);
    try {
      const res = await api.get(`/academics/schedules/?class_id=${classId}`);
      setSchedules(res.data.results || res.data || []);
    } catch (err) {
      toast.error('Gagal memuat jadwal pelajaran kelas.');
      setSchedules([]);
    } finally {
      setLoadingSchedule(false);
    }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resClasses, resTeachers] = await Promise.all([
        api.get('/students/classes/'),
        api.get('/users/teachers/').catch(() => ({ data: [] })),
      ]);
      setClasses(resClasses.data.results || resClasses.data);
      setTeachers(resTeachers.data.results || resTeachers.data || []);
    } catch (err) {
      toast.error('Gagal memuat data kelas dari server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getWhatsAppLink = (phone: string, message: string) => {
    // Clean phone number (Ubah 08xxx jadi 628xxx)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.startsWith('0')) {
      cleanPhone = '62' + cleanPhone.slice(1);
    }
    const encodedMsg = encodeURIComponent(message);
    return `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMsg}`;
  };

  // Open Drawer Detail Kelas & Fetch Seluruh Siswa (Hindari Paginasi Terpotong)
  const handleOpenDrawer = async (cls: StudentClass) => {
    setSelectedClass(cls);
    setIsDrawerOpen(true);
    setLoadingStudents(true);
    try {
      // Set page_size=1000 agar mengambil seluruh anggota kelas tanpa terpotong
      const res = await api.get(`/students/students/?class_id=${cls.id}&page_size=1000`);
      const studentList = res.data.results || res.data || [];
      setClassStudents(studentList);
    } catch (err) {
      toast.error('Gagal memuat daftar siswa di kelas ini.');
    } finally {
      setLoadingStudents(false);
    }
  };

  const handleOpenModal = (cls?: StudentClass) => {
    if (cls) {
      setEditingClass(cls);
      setFormData({
        name: cls.name || '',
        grade_level: cls.grade_level || 10,
        academic_year: cls.academic_year || '2026/2027',
        homeroom_teacher: cls.homeroom_teacher ? String(cls.homeroom_teacher) : '',
      });
    } else {
      setEditingClass(null);
      setFormData({
        name: '',
        grade_level: 10,
        academic_year: '2026/2027',
        homeroom_teacher: '',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      homeroom_teacher: formData.homeroom_teacher ? Number(formData.homeroom_teacher) : null,
    };

    const toastId = toast.loading(
      editingClass ? 'Memperbarui data kelas...' : 'Menambahkan kelas baru...'
    );

    try {
      if (editingClass) {
        await api.patch(`/students/classes/${editingClass.id}/`, payload);
        toast.success('Data kelas berhasil diperbarui!', { id: toastId });
      } else {
        await api.post('/students/classes/', payload);
        toast.success('Kelas baru berhasil ditambahkan!', { id: toastId });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp) {
        const firstKey = Object.keys(resp)[0];
        toast.error(`${firstKey}: ${JSON.stringify(resp[firstKey])}`, { id: toastId });
      } else {
        toast.error('Gagal menyimpan data kelas.', { id: toastId });
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Validasi sebelum memicu Modal Hapus
  const triggerDelete = (cls: StudentClass) => {
    if ((cls.total_students || 0) > 0) {
      toast.error(`Tidak dapat menghapus ${cls.name}. Pindahkan atau kosongkan ${cls.total_students} siswa di dalamnya terlebih dahulu.`);
      return;
    }

    setDeleteModal({
      isOpen: true,
      targetId: cls.id,
      targetName: cls.name,
      totalStudents: cls.total_students || 0,
    });
  };

  // Handler 1: Export Form Absensi Kosong ke Excel (.xlsx)
  const handleExportClassExcel = () => {
    if (!selectedClass || classStudents.length === 0) {
      toast.error('Tidak ada siswa di kelas ini untuk diexport.');
      return;
    }

    const titleRow = [[`LEMBAR PRESENSI SISWA - KELAS ${selectedClass.name.toUpperCase()}`]];
    const infoRow1 = [[`Wali Kelas: ${selectedClass.homeroom_teacher_name || 'Belum diatur'} | Tahun Ajaran: ${selectedClass.academic_year || '2026/2027'}`]];
    const emptyRow = [[]];

    // Header Tanggal (1 - 31)
    const dateHeaders = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const headers = ['No', 'NISN', 'Nama Lengkap', 'L/P', ...dateHeaders, 'H', 'S', 'I', 'A'];

    const dataRows = classStudents.map((s, idx) => [
      idx + 1,
      s.nisn,
      s.full_name,
      s.gender,
      ...Array(31).fill(''), // Kolom tanggal kosong untuk diisi cetak
      '', '', '', ''
    ]);

    const sheetData = [...titleRow, ...infoRow1, ...emptyRow, headers, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // Auto Column Widths
    worksheet['!cols'] = [
      { wch: 5 }, { wch: 14 }, { wch: 25 }, { wch: 5 },
      ...Array(31).fill({ wch: 3.5 }),
      { wch: 4 }, { wch: 4 }, { wch: 4 }, { wch: 4 }
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, `Absensi_${selectedClass.name}`);
    XLSX.writeFile(workbook, `Form_Absensi_Kelas_${selectedClass.name.replace(/\s+/g, '_')}.xlsx`);
    toast.success('Berhasil mengunduh Form Absensi Excel!');
  };

  // Handler 2: Export Form Absensi Kosong Siap Cetak ke PDF (.pdf)
  const handleExportClassPDF = () => {
    if (!selectedClass || classStudents.length === 0) {
      toast.error('Tidak ada siswa di kelas ini untuk diexport.');
      return;
    }

    const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' });

    // Header Laporan PDF
    doc.setFontSize(14);
    doc.text(`DAFTAR HADIR SISWA - KELAS ${selectedClass.name.toUpperCase()}`, 14, 12);
    doc.setFontSize(10);
    doc.text(`Wali Kelas: ${selectedClass.homeroom_teacher_name || '-'} | Tahun Ajaran: ${selectedClass.academic_year || '2026/2027'}`, 14, 18);

    const dateHeaders = Array.from({ length: 31 }, (_, i) => String(i + 1));
    const tableHeaders = [['No', 'NISN', 'Nama Siswa', 'L/P', ...dateHeaders]];

    const tableBody = classStudents.map((s, idx) => [
      idx + 1,
      s.nisn,
      s.full_name,
      s.gender,
      ...Array(31).fill('')
    ]);

    autoTable(doc, {
      startY: 22,
      head: tableHeaders,
      body: tableBody,
      styles: { fontSize: 7, cellPadding: 1, halign: 'center' },
      columnStyles: {
        0: { cellWidth: 8 },
        1: { cellWidth: 22 },
        2: { cellWidth: 45, halign: 'left' },
        3: { cellWidth: 8 },
      },
      headStyles: { fillColor: [37, 99, 235] },
    });

    doc.save(`Form_Absensi_Kelas_${selectedClass.name.replace(/\s+/g, '_')}.pdf`);
    toast.success('Berhasil mengunduh Form Absensi PDF Siap Cetak!');
  };

  const handleConfirmDelete = async () => {
    if (!deleteModal.targetId) return;

    const toastId = toast.loading('Menghapus data kelas...');

    try {
      await api.delete(`/students/classes/${deleteModal.targetId}/`);
      toast.success(`Kelas ${deleteModal.targetName} berhasil dihapus.`, { id: toastId });
      fetchData();
    } catch (err: any) {
      toast.error('Gagal menghapus kelas. Pastikan tidak ada data siswa terkait.', { id: toastId });
    } finally {
      setDeleteModal({ isOpen: false });
    }
  };

  // Fetch Daftar Mapel & Guru saat Modal Tambah Jadwal Dibuka
  const handleOpenAddScheduleModal = async () => {
    try {
      const resSubjects = await api.get('/academics/subjects/');
      setSubjects(resSubjects.data.results || resSubjects.data || []);
      setIsScheduleModalOpen(true);
    } catch (err) {
      toast.error('Gagal memuat daftar mata pelajaran.');
    }
  };

  // Handler Simpan Jadwal Baru
  const handleSaveSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass) return;

    const payload = {
      student_class: selectedClass.id,
      subject: Number(scheduleForm.subject),
      teacher: scheduleForm.teacher ? Number(scheduleForm.teacher) : null,
      day: scheduleForm.day,
      start_time: scheduleForm.start_time,
      end_time: scheduleForm.end_time,
    };

    const toastId = toast.loading('Menambahkan jadwal...');
    try {
      await api.post('/academics/schedules/', payload);
      toast.success('Jadwal pelajaran berhasil ditambahkan!', { id: toastId });
      setIsScheduleModalOpen(false);
      fetchClassSchedule(selectedClass.id); // Refresh daftar jadwal di drawer
    } catch (err) {
      toast.error('Gagal menambahkan jadwal pelajaran.', { id: toastId });
    }
  };

  // Hitung Laki-laki / Perempuan di Drawer
  const countL = classStudents.filter((s) => s.gender === 'L').length;
  const countP = classStudents.filter((s) => s.gender === 'P').length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Kelas</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola daftar kelas, wali kelas, dan tingkat pendidikan aktif di sekolah Anda.
          </p>
        </div>
        <button
          onClick={() => handleOpenModal()}
          className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm text-sm"
        >
          <Plus className="w-5 h-5" />
          Tambah Kelas Baru
        </button>
      </div>

      {/* Grid List Kelas */}
      {loading ? (
        <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
          <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
          <span className="ml-2 text-sm text-slate-600">Memuat data kelas dari server...</span>
        </div>
      ) : classes.length === 0 ? (
        <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <p className="text-slate-600 font-medium">Belum ada data kelas terdaftar.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {classes.map((cls) => {
            const hasStudents = (cls.total_students || 0) > 0;
            return (
              <div
                key={cls.id}
                className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition relative flex flex-col justify-between"
              >
                <div>
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-xs font-semibold px-2.5 py-1 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                      Tingkat {cls.grade_level}
                    </span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleOpenDrawer(cls)}
                        className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition"
                        title="Lihat Detail Siswa"
                      >
                        <Eye className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleOpenModal(cls)}
                        className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                        title="Edit Kelas"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>

                      {/* Validasi Tombol Hapus: Disabled jika masih ada siswa */}
                      <button
                        onClick={() => triggerDelete(cls)}
                        disabled={hasStudents}
                        className={`p-1.5 rounded-lg transition ${
                          hasStudents
                            ? 'text-slate-300 cursor-not-allowed'
                            : 'text-slate-500 hover:text-red-600 hover:bg-red-50'
                        }`}
                        title={
                          hasStudents
                            ? `Tidak dapat dihapus: Masih ada ${cls.total_students} siswa di kelas ini`
                            : 'Hapus Kelas'
                        }
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <h3 className="text-lg font-bold text-slate-800">{cls.name}</h3>
                </div>

                <div className="border-t border-slate-100 pt-3 mt-4 space-y-2 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-blue-600" />
                    <span>
                      Wali Kelas:{' '}
                      <strong className="text-slate-800 font-medium">
                        {cls.homeroom_teacher_name || 'Belum diatur'}
                      </strong>
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-xs text-slate-500 pt-1 border-t border-slate-50">
                    <span>Tahun Ajaran: {cls.academic_year || '2026/2027'}</span>
                    <button
                      onClick={() => handleOpenDrawer(cls)}
                      className="flex items-center gap-1 font-semibold text-blue-600 hover:underline"
                    >
                      <Users className="w-3.5 h-3.5" />
                      <span>{cls.total_students || 0} Siswa</span>
                    </button>
                    {/* Tombol Buka Modal Broadcast di Drawer */}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Drawer Detail Kelas (Slide-over) */}
      {isDrawerOpen && selectedClass && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header Drawer */}
              <div className="flex justify-between items-center pb-3 border-b border-slate-100">
                <div>
                  <span className="text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-700 rounded-full border border-blue-100">
                    Tingkat {selectedClass.grade_level}
                  </span>
                  <h2 className="text-xl font-bold text-slate-800 mt-1">{selectedClass.name}</h2>
                </div>
                <button
                  type="button"
                  onClick={() => setIsDrawerOpen(false)}
                  className="text-slate-400 hover:text-slate-600 p-1 rounded-lg hover:bg-slate-100 transition"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Sub-Header Info Kelas */}
              <div className="text-xs text-slate-500 my-3 pb-3 border-b border-slate-100 flex items-center justify-between">
                <span>
                  Wali Kelas: <strong className="text-slate-800">{selectedClass.homeroom_teacher_name || 'Belum diatur'}</strong>
                </span>
                <span>
                  Thn Ajaran: <strong className="text-slate-800">{selectedClass.academic_year || '2026/2027'}</strong>
                </span>
              </div>

              {/* TAB SWITCHER: ANGGOTA KELAS VS JADWAL PELAJARAN */}
              <div className="flex border-b border-slate-200 mb-4">
                <button
                  type="button"
                  onClick={() => setDrawerTab('students')}
                  className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
                    drawerTab === 'students'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Anggota Kelas ({classStudents.length})
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setDrawerTab('schedule');
                    if (selectedClass) fetchClassSchedule(selectedClass.id);
                  }}
                  className={`flex-1 py-2 text-xs font-bold text-center border-b-2 transition ${
                    drawerTab === 'schedule'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Jadwal Pelajaran 📅
                </button>
              </div>

              {/* CONTENT TAB 1: ANGGOTA KELAS */}
              {drawerTab === 'students' && (
                <div>
                  {/* Ringkasan Jumlah & Gender Siswa */}
                  <div className="grid grid-cols-3 gap-3 mb-4">
                    <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-center">
                      <span className="text-xs text-slate-500">Total Siswa</span>
                      <div className="text-lg font-bold text-slate-800">
                        {loadingStudents ? '...' : classStudents.length}
                      </div>
                    </div>
                    <div className="bg-blue-50/50 p-3 rounded-lg border border-blue-100 text-center">
                      <span className="text-xs text-blue-600">Laki-laki</span>
                      <div className="text-lg font-bold text-blue-700">
                        {loadingStudents ? '...' : countL}
                      </div>
                    </div>
                    <div className="bg-pink-50/50 p-3 rounded-lg border border-pink-100 text-center">
                      <span className="text-xs text-pink-600">Perempuan</span>
                      <div className="text-lg font-bold text-pink-700">
                        {loadingStudents ? '...' : countP}
                      </div>
                    </div>
                  </div>

                  {/* Tombol Action: Export & Broadcast WA */}
                  <div className="space-y-2 mb-4">
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={handleExportClassExcel}
                        disabled={classStudents.length === 0}
                        className="flex-1 py-2 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <FileSpreadsheet className="w-3.5 h-3.5" /> Export Excel
                      </button>
                      <button
                        type="button"
                        onClick={handleExportClassPDF}
                        disabled={classStudents.length === 0}
                        className="flex-1 py-2 px-3 bg-rose-600 hover:bg-rose-700 text-white rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition disabled:opacity-50"
                      >
                        <FileText className="w-3.5 h-3.5" /> Export PDF
                      </button>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsBroadcastModalOpen(true)}
                      disabled={classStudents.length === 0}
                      className="w-full py-2.5 px-3 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-2 transition disabled:opacity-50 shadow-sm"
                    >
                      <Phone className="w-4 h-4" /> Broadcast WhatsApp OrtU
                    </button>
                  </div>

                  {/* Daftar Siswa */}
                  <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-2">
                    Daftar Anggota Kelas
                  </h3>

                  {loadingStudents ? (
                    <div className="p-8 text-center text-slate-500 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-600" />
                      <span className="text-xs">Memuat anggota kelas...</span>
                    </div>
                  ) : classStudents.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200">
                      Belum ada siswa yang terdaftar di kelas ini.
                    </div>
                  ) : (
                    <div className="space-y-2 max-h-[42vh] overflow-y-auto pr-1">
                      {classStudents.map((student, idx) => (
                        <div
                          key={student.id}
                          className="p-3 bg-white border border-slate-200 rounded-lg flex items-center justify-between text-xs hover:border-blue-300 transition"
                        >
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-mono text-slate-400 w-5">{idx + 1}.</span>
                            <div>
                              <div className="font-semibold text-slate-800">{student.full_name}</div>
                              <div className="text-[11px] text-slate-400 font-mono">
                                NISN: {student.nisn} | {student.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                              </div>
                            </div>
                          </div>
                          {student.parent_phone_number && (
                            <a
                              href={`https://wa.me/${student.parent_phone_number.replace(/^0/, '62')}`}
                              target="_blank"
                              rel="noreferrer"
                              className="p-1.5 text-emerald-600 hover:bg-emerald-50 rounded-lg transition"
                              title="Hubungi OrtU via WA"
                            >
                              <Phone className="w-4 h-4" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* CONTENT TAB 2: JADWAL PELAJARAN */}
              {drawerTab === 'schedule' && (
                <div className="space-y-4">
                  {/* Header & Tombol Tambah Jadwal */}
                  <div className="flex justify-between items-center">
                    <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                      Jadwal Pelajaran Kelas
                    </h3>
                    <button
                      type="button"
                      onClick={handleOpenAddScheduleModal}
                      className="px-2.5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1 transition"
                    >
                      + Tambah Slot
                    </button>
                  </div>

                  {loadingSchedule ? (
                    <div className="p-8 text-center text-slate-500 flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2 text-blue-600" />
                      <span className="text-xs">Memuat jadwal pelajaran...</span>
                    </div>
                  ) : schedules.length === 0 ? (
                    <div className="p-6 text-center text-slate-400 text-xs bg-slate-50 rounded-lg border border-dashed border-slate-200 space-y-2">
                      <p>Belum ada jadwal pelajaran yang diatur untuk kelas ini.</p>
                      <button
                        type="button"
                        onClick={handleOpenAddScheduleModal}
                        className="px-3 py-1.5 bg-blue-50 text-blue-600 hover:bg-blue-100 font-semibold rounded-lg text-xs transition"
                      >
                        + Tambah Slot Jadwal Pertama
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-3 max-h-[50vh] overflow-y-auto pr-1">
                      {['SENIN', 'SELASA', 'RABU', 'KAMIS', 'JUMAT', 'SABTU'].map((day) => {
                        const daySchedules = schedules.filter((s) => s.day === day);
                        if (daySchedules.length === 0) return null;

                        return (
                          <div key={day} className="bg-slate-50 p-3 rounded-xl border border-slate-200">
                            <span className="text-xs font-bold text-blue-700 uppercase tracking-wider block mb-2">
                              {day}
                            </span>
                            <div className="space-y-2">
                              {daySchedules.map((item) => (
                                <div
                                  key={item.id}
                                  className="p-2.5 bg-white rounded-lg border border-slate-100 flex justify-between items-center text-xs shadow-sm"
                                >
                                  <div>
                                    <div className="font-bold text-slate-800">{item.subject_name}</div>
                                    <div className="text-slate-500">{item.teacher_name || 'Guru Belum Diatur'}</div>
                                  </div>
                                  <span className="px-2 py-1 bg-slate-100 text-slate-600 font-mono rounded font-medium text-[11px]">
                                    {item.time_slot}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            <div className="pt-4 border-t border-slate-100 mt-4">
              <button
                type="button"
                onClick={() => setIsDrawerOpen(false)}
                className="w-full py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg transition text-xs"
              >
                Tutup Drawer
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editingClass ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Nama Kelas *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Contoh: X IPA 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tingkat Pendidikan *
                </label>
                <select
                  value={formData.grade_level}
                  onChange={(e) =>
                    setFormData({ ...formData, grade_level: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>Tingkat 10</option>
                  <option value={11}>Tingkat 11</option>
                  <option value={12}>Tingkat 12</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Wali Kelas
                </label>
                <select
                  value={formData.homeroom_teacher}
                  onChange={(e) =>
                    setFormData({ ...formData, homeroom_teacher: e.target.value })
                  }
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">-- Pilih Wali Kelas (Opsional) --</option>
                  {teachers.map((t) => {
                    const name =
                      t.full_name ||
                      (t.user ? `${t.user.first_name} ${t.user.last_name}`.trim() : `Guru #${t.id}`);
                    return (
                      <option key={t.id} value={t.id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                  Tahun Ajaran *
                </label>
                <input
                  type="text"
                  required
                  value={formData.academic_year}
                  onChange={(e) => setFormData({ ...formData, academic_year: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg text-sm"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 text-sm"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal Custom Konfirmasi Hapus */}
      {deleteModal.isOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100 text-center">
            <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
              <Trash2 className="w-7 h-7" />
            </div>

            <h3 className="text-xl font-bold text-slate-800">Konfirmasi Hapus Kelas</h3>
            <p className="text-slate-500 text-sm mt-2">
              Apakah Anda yakin ingin menghapus kelas{' '}
              <strong className="text-slate-800">{deleteModal.targetName}</strong>?
            </p>

            {deleteModal.totalStudents && deleteModal.totalStudents > 0 ? (
              <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-xl flex items-center gap-2 text-xs text-amber-800 text-left">
                <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                <span>
                  Kelas ini masih memiliki <strong>{deleteModal.totalStudents} siswa</strong>. Pindahkan siswa terlebih dahulu sebelum menghapus kelas.
                </span>
              </div>
            ) : (
              <p className="text-xs text-red-500 mt-1 font-medium">
                Tindakan ini permanen dan tidak dapat dibatalkan.
              </p>
            )}

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModal({ isOpen: false })}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={(deleteModal.totalStudents || 0) > 0}
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm text-sm disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}


      {/* Modal Broadcast WA Gratis */}
      {isBroadcastModalOpen && selectedClass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Broadcast WA Orang Tua</h3>
                <p className="text-xs text-slate-500">Kelas: {selectedClass.name}</p>
              </div>
              <button
                onClick={() => setIsBroadcastModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-4 space-y-3">
              {/* Quick Template Buttons */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1.5">
                  Template Pesan Cepat:
                </label>
                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => applyTemplate('ujian')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-medium transition"
                  >
                    + Pengumuman Ujian
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('rapat')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-medium transition"
                  >
                    + Undangan Rapat
                  </button>
                  <button
                    type="button"
                    onClick={() => applyTemplate('libur')}
                    className="px-2.5 py-1 bg-slate-100 hover:bg-blue-50 hover:text-blue-600 text-slate-600 rounded-lg text-xs font-medium transition"
                  >
                    + Info Libur
                  </button>
                </div>
              </div>

              {/* Input Pesan */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  Isi Pesan Pengumuman *
                </label>
                <textarea
                  rows={4}
                  value={broadcastMessage}
                  onChange={(e) => setBroadcastMessage(e.target.value)}
                  placeholder="Tulis pesan pengumuman di sini..."
                  className="w-full p-3 border border-slate-300 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              {/* Daftar Siswa & Direct Link Kirim WA */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Kirim per Orang Tua Siswa ({classStudents.length} Siswa):
                </label>
                <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                  {classStudents.map((student) => {
                    const hasPhone = Boolean(student.parent_phone_number);
                    return (
                      <div
                        key={student.id}
                        className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl flex items-center justify-between text-xs"
                      >
                        <div>
                          <span className="font-bold text-slate-800 block">{student.full_name}</span>
                          <span className="text-slate-400 font-mono">
                            OrtU: {student.parent_phone_number || 'Tidak ada No. HP'}
                          </span>
                        </div>

                        {hasPhone ? (
                          <a
                            href={getWhatsAppLink(student.parent_phone_number!, broadcastMessage)}
                            target="_blank"
                            rel="noreferrer"
                            className={`px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-bold flex items-center gap-1 transition shadow-sm ${
                              !broadcastMessage.trim() ? 'opacity-50 pointer-events-none' : ''
                            }`}
                          >
                            <Phone className="w-3 h-3" /> Kirim WA
                          </a>
                        ) : (
                          <span className="text-slate-400 italic">No HP Kosong</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsBroadcastModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Tambah Slot Jadwal Pelajaran */}
      {isScheduleModalOpen && selectedClass && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Tambah Jadwal Pelajaran</h3>
                <p className="text-xs text-slate-500">Kelas: {selectedClass.name}</p>
              </div>
              <button
                onClick={() => setIsScheduleModalOpen(false)}
                className="text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSchedule} className="space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Mata Pelajaran *</label>
                <select
                  required
                  value={scheduleForm.subject}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, subject: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Mata Pelajaran --</option>
                  {subjects.map((sub) => (
                    <option key={sub.id} value={sub.id}>
                      {sub.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Guru Pengampu</label>
                <select
                  value={scheduleForm.teacher}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, teacher: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Guru (Opsional) --</option>
                  {teachers.map((t) => {
                    const name =
                      t.full_name ||
                      (t.user ? `${t.user.first_name} ${t.user.last_name}`.trim() : `Guru #${t.id}`);
                    return (
                      <option key={t.id} value={t.id}>
                        {name}
                      </option>
                    );
                  })}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Hari *</label>
                <select
                  value={scheduleForm.day}
                  onChange={(e) => setScheduleForm({ ...scheduleForm, day: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="SENIN">Senin</option>
                  <option value="SELASA">Selasa</option>
                  <option value="RABU">Rabu</option>
                  <option value="KAMIS">Kamis</option>
                  <option value="JUMAT">Jumat</option>
                  <option value="SABTU">Sabtu</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Mulai *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.start_time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, start_time: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Selesai *</label>
                  <input
                    type="time"
                    required
                    value={scheduleForm.end_time}
                    onChange={(e) => setScheduleForm({ ...scheduleForm, end_time: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsScheduleModalOpen(false)}
                  className="w-1/2 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="w-1/2 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
                >
                  Simpan Slot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}