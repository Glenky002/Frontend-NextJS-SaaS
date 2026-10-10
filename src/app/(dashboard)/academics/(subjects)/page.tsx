// 'use client';

// import { useState, useEffect } from 'react';
// import { api } from '@/lib/api';
// import toast from 'react-hot-toast';
// import {
//   Plus,
//   BookOpen,
//   RefreshCw,
//   X,
//   Edit2,
//   Trash2,
//   Search,
//   Code,
// } from 'lucide-react';

// interface Subject {
//   id: number;
//   name: string;
//   code?: string;
// }

// export default function SubjectsPage() {
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [loading, setLoading] = useState(true);
//   const [searchQuery, setSearchQuery] = useState('');

//   // Modal State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
//   const [submitting, setSubmitting] = useState(false);

//   // Form State
//   const [formData, setFormData] = useState({
//     name: '',
//     code: '',
//   });

//   // Custom Delete Modal State
//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     targetId?: number;
//     targetName?: string;
//   }>({
//     isOpen: false,
//   });

//   const fetchSubjects = async () => {
//     setLoading(true);
//     try {
//       const res = await api.get('/academics/subjects/');
//       setSubjects(res.data.results || res.data || []);
//     } catch (err) {
//       toast.error('Gagal memuat daftar mata pelajaran.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchSubjects();
//   }, []);

//   const handleOpenModal = (sub?: Subject) => {
//     if (sub) {
//       setEditingSubject(sub);
//       setFormData({
//         name: sub.name || '',
//         code: sub.code || '',
//       });
//     } else {
//       setEditingSubject(null);
//       setFormData({
//         name: '',
//         code: '',
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const toastId = toast.loading(
//       editingSubject ? 'Memperbarui mata pelajaran...' : 'Menambahkan mata pelajaran baru...'
//     );

//     try {
//       if (editingSubject) {
//         await api.patch(`/academics/subjects/${editingSubject.id}/`, formData);
//         toast.success('Mata pelajaran berhasil diperbarui!', { id: toastId });
//       } else {
//         await api.post('/academics/subjects/', formData);
//         toast.success('Mata pelajaran baru berhasil ditambahkan!', { id: toastId });
//       }
//       setIsModalOpen(false);
//       fetchSubjects();
//     } catch (err: any) {
//       toast.error('Gagal menyimpan mata pelajaran.', { id: toastId });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const handleConfirmDelete = async () => {
//     if (!deleteModal.targetId) return;

//     const toastId = toast.loading('Menghapus mata pelajaran...');

//     try {
//       await api.delete(`/academics/subjects/${deleteModal.targetId}/`);
//       toast.success(`Mata pelajaran ${deleteModal.targetName} berhasil dihapus.`, { id: toastId });
//       fetchSubjects();
//     } catch (err) {
//       toast.error('Gagal menghapus mata pelajaran. Pastikan tidak terkait dengan jadwal.', { id: toastId });
//     } finally {
//       setDeleteModal({ isOpen: false });
//     }
//   };

//   // Filter Search
//   const filteredSubjects = subjects.filter((sub) =>
//     sub.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//     (sub.code && sub.code.toLowerCase().includes(searchQuery.toLowerCase()))
//   );

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Manajemen Mata Pelajaran</h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Kelola daftar mata pelajaran (Mapel) dan kode kurikulum sekolah Anda.
//           </p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm text-sm"
//         >
//           <Plus className="w-5 h-5" />
//           Tambah Mapel Baru
//         </button>
//       </div>

//       {/* Filter & Search Bar */}
//       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex items-center gap-3">
//         <div className="relative flex-1">
//           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
//           <input
//             type="text"
//             placeholder="Cari mata pelajaran atau kode mapel..."
//             value={searchQuery}
//             onChange={(e) => setSearchQuery(e.target.value)}
//             className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//         </div>
//       </div>

//       {/* Grid List Mapel */}
//       {loading ? (
//         <div className="flex items-center justify-center p-12 bg-white rounded-xl border border-slate-200">
//           <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
//           <span className="ml-2 text-sm text-slate-600">Memuat mata pelajaran dari server...</span>
//         </div>
//       ) : filteredSubjects.length === 0 ? (
//         <div className="bg-white rounded-xl p-8 text-center border border-slate-200 shadow-sm">
//           <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
//           <p className="text-slate-600 font-medium">Belum ada data mata pelajaran terdaftar.</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
//           {filteredSubjects.map((sub) => (
//             <div
//               key={sub.id}
//               className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition flex flex-col justify-between"
//             >
//               <div>
//                 <div className="flex justify-between items-start mb-2">
//                   <span className="text-xs font-mono font-bold px-2.5 py-1 bg-slate-100 text-slate-700 rounded-md border border-slate-200 flex items-center gap-1">
//                     <Code className="w-3 h-3 text-slate-500" />
//                     {sub.code || 'NO-CODE'}
//                   </span>
//                   <div className="flex items-center gap-1">
//                     <button
//                       onClick={() => handleOpenModal(sub)}
//                       className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                       title="Edit Mapel"
//                     >
//                       <Edit2 className="w-4 h-4" />
//                     </button>
//                     <button
//                       onClick={() =>
//                         setDeleteModal({
//                           isOpen: true,
//                           targetId: sub.id,
//                           targetName: sub.name,
//                         })
//                       }
//                       className="p-1.5 text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-lg transition"
//                       title="Hapus Mapel"
//                     >
//                       <Trash2 className="w-4 h-4" />
//                     </button>
//                   </div>
//                 </div>

//                 <h3 className="text-base font-bold text-slate-800 mt-2">{sub.name}</h3>
//               </div>
//             </div>
//           ))}
//         </div>
//       )}

//       {/* Modal Form Create & Edit */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6 border border-slate-100">
//             <div className="flex justify-between items-center mb-4 pb-2 border-b border-slate-100">
//               <h2 className="text-lg font-bold text-slate-800">
//                 {editingSubject ? 'Edit Mata Pelajaran' : 'Tambah Mapel Baru'}
//               </h2>
//               <button
//                 onClick={() => setIsModalOpen(false)}
//                 className="text-slate-400 hover:text-slate-600"
//               >
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4 text-xs">
//               <div>
//                 <label className="block font-semibold text-slate-700 mb-1">
//                   Nama Mata Pelajaran *
//                 </label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.name}
//                   onChange={(e) => setFormData({ ...formData, name: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Contoh: Matematika Wajib"
//                 />
//               </div>

//               <div>
//                 <label className="block font-semibold text-slate-700 mb-1">
//                   Kode Mapel (Opsional)
//                 </label>
//                 <input
//                   type="text"
//                   value={formData.code}
//                   onChange={(e) => setFormData({ ...formData, code: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   placeholder="Contoh: MTK-10"
//                 />
//               </div>

//               <div className="flex gap-3 pt-3 border-t border-slate-100">
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
//                   {submitting ? 'Menyimpan...' : 'Simpan Mapel'}
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

//             <h3 className="text-xl font-bold text-slate-800">Konfirmasi Hapus Mapel</h3>
//             <p className="text-slate-500 text-sm mt-2">
//               Apakah Anda yakin ingin menghapus mata pelajaran{' '}
//               <strong className="text-slate-800">{deleteModal.targetName}</strong>?
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

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import { 
  BookOpen, Award, Calendar, Plus, Trash2, Edit3, 
  Save, RefreshCw, CheckCircle2, Clock, Users 
} from 'lucide-react';
import toast from 'react-hot-toast';

interface StudentClass {
  id: number;
  name: string;
}

interface TeacherProfile {
  id: number;
  user_full_name?: string;
  user?: { first_name: string; last_name: string };
}

interface Subject {
  id: number;
  name: string;
  code: string;
}

interface SubjectPassingGrade {
  id: number;
  subject: number;
  subject_name?: string;
  student_class: number;
  class_name?: string;
  kkm: number;
}

interface ScheduleItem {
  id: number;
  subject: number;
  subject_name?: string;
  student_class: number;
  class_name?: string;
  teacher?: number;
  teacher_name?: string;
  day: string;
  start_time: string;
  end_time: string;
}

export default function AcademicsPage() {
  const [activeTab, setActiveTab] = useState<'subjects' | 'kkm' | 'schedules'>('subjects');

  // Master Data State
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [teachers, setTeachers] = useState<TeacherProfile[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [passingGrades, setPassingGrades] = useState<SubjectPassingGrade[]>([]);
  const [schedules, setSchedules] = useState<ScheduleItem[]>([]);

  // Selection & Loading States
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // Form States (Subject)
  const [newSubjectName, setNewSubjectName] = useState('');
  const [newSubjectCode, setNewSubjectCode] = useState('');

  // Form States (KKM Input State per Subject)
  const [kkmInputs, setKkmInputs] = useState<Record<number, number>>({});

  // Form States (Schedule)
  const [schedSubject, setSchedSubject] = useState('');
  const [schedTeacher, setSchedTeacher] = useState('');
  const [schedDay, setSchedDay] = useState('SENIN');
  const [schedStartTime, setSchedStartTime] = useState('07:30');
  const [schedEndTime, setSchedEndTime] = useState('09:00');

  // 1. Fetch Master Data Initial
  useEffect(() => {
    const fetchAllData = async () => {
      setLoading(true);
      try {
        const [resClasses, resTeachers, resSubjects, resSchedules] = await Promise.all([
          api.get('/students/classes/'),
          api.get('/users/teachers/').catch(() => ({ data: [] })),
          api.get('/academics/subjects/'),
          api.get('/academics/schedules/').catch(() => ({ data: [] })),
        ]);

        const classList = resClasses.data.results || resClasses.data;
        const teacherList = resTeachers.data.results || resTeachers.data || [];
        const subjectList = resSubjects.data.results || resSubjects.data;
        const scheduleList = resSchedules.data.results || resSchedules.data || [];

        setClasses(classList);
        setTeachers(teacherList);
        setSubjects(subjectList);
        setSchedules(scheduleList);

        if (classList.length > 0) setSelectedClass(String(classList[0].id));
      } catch (err) {
        toast.error('Gagal memuat data akademik.');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // 2. Fetch KKM ketika Kelas Aktif Berubah
  useEffect(() => {
    if (!selectedClass) return;

    const fetchPassingGrades = async () => {
      try {
        const res = await api.get(`/academics/passing-grades/?student_class=${selectedClass}`);
        const data: SubjectPassingGrade[] = res.data.results || res.data;
        setPassingGrades(data);

        // Map ke Input Form State
        const kkmMap: Record<number, number> = {};
        subjects.forEach((subj) => {
          const found = data.find((item) => item.subject === subj.id);
          kkmMap[subj.id] = found ? found.kkm : 75;
        });
        setKkmInputs(kkmMap);
      } catch (err) {
        console.error('Gagal memuat KKM:', err);
      }
    };

    fetchPassingGrades();
  }, [selectedClass, subjects]);

  // Handler: Tambah Mata Pelajaran Baru
  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newSubjectName) return;

    setSubmitting(true);
    try {
      const response = await api.post('/academics/subjects/', {
        name: newSubjectName,
        code: newSubjectCode,
      });

      toast.success('Mata pelajaran berhasil ditambahkan!');
      setSubjects((prev) => [...prev, response.data]);
      setNewSubjectName('');
      setNewSubjectCode('');
    } catch (err) {
      toast.error('Gagal menambahkan mata pelajaran.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler: Hapus Mata Pelajaran
  const handleDeleteSubject = async (id: number) => {
    if (!confirm('Apakah Anda yakin ingin menghapus mata pelajaran ini?')) return;

    try {
      await api.delete(`/academics/subjects/${id}/`);
      toast.success('Mata pelajaran dihapus.');
      setSubjects((prev) => prev.filter((s) => s.id !== id));
    } catch (err) {
      toast.error('Gagal menghapus mata pelajaran.');
    }
  };

  // Handler: Simpan KKM Dinamis per Kelas
  const handleSaveKKM = async (subjectId: number) => {
    if (!selectedClass) return;

    const kkmValue = kkmInputs[subjectId] || 75;
    try {
      await api.post('/academics/passing-grades/', {
        student_class: Number(selectedClass),
        subject: subjectId,
        kkm: kkmValue,
      });
      toast.success('KKM berhasil diperbarui!');
    } catch (err) {
      toast.error('Gagal menyimpan KKM.');
    }
  };

  // Handler: Tambah Jadwal Pelajaran
  const handleAddSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !schedSubject) {
      toast.error('Pilih kelas dan mata pelajaran terlebih dahulu.');
      return;
    }

    setSubmitting(true);
    try {
      const response = await api.post('/academics/schedules/', {
        student_class: Number(selectedClass),
        subject: Number(schedSubject),
        teacher: schedTeacher ? Number(schedTeacher) : null,
        day: schedDay,
        start_time: schedStartTime,
        end_time: schedEndTime,
      });

      toast.success('Jadwal pelajaran berhasil ditambahkan!');
      setSchedules((prev) => [...prev, response.data]);
    } catch (err) {
      toast.error('Gagal menambahkan jadwal.');
    } finally {
      setSubmitting(false);
    }
  };

  // Filter Schedule berdasarkan Kelas
  const filteredSchedules = schedules.filter(
    (s) => String(s.student_class) === selectedClass
  );

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Akademik</h1>
          <p className="text-slate-500 text-sm mt-1">
            Kelola data Master Mata Pelajaran, standar KKM per kelas, dan Jadwal Pelajaran.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('subjects')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'subjects'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-4 h-4" />
            Mata Pelajaran
          </button>
          <button
            onClick={() => setActiveTab('kkm')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'kkm'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-4 h-4" />
            Setting KKM
          </button>
          <button
            onClick={() => setActiveTab('schedules')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'schedules'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Calendar className="w-4 h-4" />
            Jadwal Pelajaran
          </button>
        </div>
      </div>

      {/* TAB 1: MASTER MATA PELAJARAN */}
      {activeTab === 'subjects' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Tambah Mapel */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Tambah Mata Pelajaran
            </h2>
            <form onSubmit={handleAddSubject} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Nama Mata Pelajaran
                </label>
                <input
                  type="text"
                  value={newSubjectName}
                  onChange={(e) => setNewSubjectName(e.target.value)}
                  placeholder="Contoh: Matematika Wajib"
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Kode Mapel (Opsional)
                </label>
                <input
                  type="text"
                  value={newSubjectCode}
                  onChange={(e) => setNewSubjectCode(e.target.value)}
                  placeholder="Contoh: MTK-W"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg text-sm transition disabled:opacity-50"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Mapel'}
              </button>
            </form>
          </div>

          {/* Table List Mapel */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">Daftar Mata Pelajaran</h2>
              <span className="text-xs px-2.5 py-1 bg-slate-100 text-slate-600 rounded-full font-medium">
                Total: {subjects.length} Mapel
              </span>
            </div>

            {loading ? (
              <div className="p-8 text-center text-slate-500 flex justify-center items-center gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600" />
                Memuat data mapel...
              </div>
            ) : subjects.length === 0 ? (
              <div className="p-8 text-center text-slate-500 text-sm">
                Belum ada mata pelajaran. Silakan tambah mapel baru.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-sm">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                      <th className="px-6 py-3.5">Kode</th>
                      <th className="px-6 py-3.5">Nama Mata Pelajaran</th>
                      <th className="px-6 py-3.5 text-center w-24">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {subjects.map((subj) => (
                      <tr key={subj.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-mono text-slate-500 font-medium">
                          {subj.code || '-'}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{subj.name}</td>
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={() => handleDeleteSubject(subj.id)}
                            className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                            title="Hapus Mapel"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* TAB 2: SETTING KKM DINAMIS */}
      {activeTab === 'kkm' && (
        <div className="space-y-4">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Pilih Kelas untuk Set KKM
              </label>
              <select
                value={selectedClass}
                onChange={(e) => setSelectedClass(e.target.value)}
                className="w-64 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white font-medium focus:ring-2 focus:ring-blue-500"
              >
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <p className="text-xs text-slate-500 max-w-sm text-right">
              KKM (Kriteria Ketuntasan Minimal) digunakan sebagai acuan batas lulus/remedial pada modul nilai.
            </p>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 font-semibold text-slate-800">
              Pengaturan Nilai KKM Mata Pelajaran
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                    <th className="px-6 py-3.5">Mata Pelajaran</th>
                    <th className="px-6 py-3.5 text-center w-48">Batas KKM (0 - 100)</th>
                    <th className="px-6 py-3.5 text-center w-32">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {subjects.map((subj) => (
                    <tr key={subj.id} className="hover:bg-slate-50">
                      <td className="px-6 py-4 font-medium text-slate-900">
                        {subj.name} {subj.code ? `(${subj.code})` : ''}
                      </td>
                      <td className="px-6 py-4">
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={kkmInputs[subj.id] ?? 75}
                          onChange={(e) =>
                            setKkmInputs((prev) => ({
                              ...prev,
                              [subj.id]: Number(e.target.value),
                            }))
                          }
                          className="w-full px-3 py-1.5 text-center font-bold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </td>
                      <td className="px-6 py-4 text-center">
                        <button
                          onClick={() => handleSaveKKM(subj.id)}
                          className="flex items-center justify-center gap-1.5 w-full py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold rounded-lg transition"
                        >
                          <Save className="w-3.5 h-3.5" />
                          Simpan
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: JADWAL PELAJARAN */}
      {activeTab === 'schedules' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Form Tambah Jadwal */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm space-y-4 h-fit">
            <h2 className="font-semibold text-slate-800 flex items-center gap-2">
              <Plus className="w-5 h-5 text-blue-600" />
              Tambah Jadwal Pelajaran
            </h2>

            <form onSubmit={handleAddSchedule} className="space-y-3 text-sm">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Kelas
                </label>
                <select
                  value={selectedClass}
                  onChange={(e) => setSelectedClass(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  {classes.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Mata Pelajaran
                </label>
                <select
                  value={schedSubject}
                  onChange={(e) => setSchedSubject(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Mapel --</option>
                  {subjects.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Guru Pengampu
                </label>
                <select
                  value={schedTeacher}
                  onChange={(e) => setSchedTeacher(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
                >
                  <option value="">-- Pilih Guru (Opsional) --</option>
                  {teachers.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.user_full_name || `${t.user?.first_name} ${t.user?.last_name}`}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                  Hari
                </label>
                <select
                  value={schedDay}
                  onChange={(e) => setSchedDay(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg bg-white"
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
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Jam Mulai
                  </label>
                  <input
                    type="time"
                    value={schedStartTime}
                    onChange={(e) => setSchedStartTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Jam Selesai
                  </label>
                  <input
                    type="time"
                    value={schedEndTime}
                    onChange={(e) => setSchedEndTime(e.target.value)}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50 mt-2"
              >
                {submitting ? 'Menyimpan...' : 'Simpan Jadwal'}
              </button>
            </form>
          </div>

          {/* Table List Jadwal */}
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-5 border-b border-slate-100 flex items-center justify-between">
              <h2 className="font-semibold text-slate-800">
                Jadwal Pelajaran Kelas {classes.find((c) => String(c.id) === selectedClass)?.name}
              </h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs uppercase font-semibold">
                    <th className="px-6 py-3.5">Hari</th>
                    <th className="px-6 py-3.5">Jam</th>
                    <th className="px-6 py-3.5">Mata Pelajaran</th>
                    <th className="px-6 py-3.5">Guru Pengampu</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSchedules.length === 0 ? (
                    <tr>
                      <td colSpan={4} className="text-center py-8 text-slate-500">
                        Belum ada jadwal pelajaran untuk kelas ini.
                      </td>
                    </tr>
                  ) : (
                    filteredSchedules.map((s) => (
                      <tr key={s.id} className="hover:bg-slate-50">
                        <td className="px-6 py-4 font-bold text-slate-700">{s.day}</td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          {s.start_time} - {s.end_time}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">
                          {s.subject_name || 'Mapel'}
                        </td>
                        <td className="px-6 py-4 text-slate-600">
                          {s.teacher_name || '-'}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}