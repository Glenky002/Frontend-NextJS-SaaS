// // 'use client';

// // import { useState, useEffect } from 'react';
// // import { api } from '@/lib/api';
// // import {
// //   Plus,
// //   Edit2,
// //   Trash2,
// //   Search,
// //   RefreshCw,
// //   X,
// //   Eye,
// //   ChevronLeft,
// //   ChevronRight,
// //   User,
// //   Phone,
// //   MapPin,
// //   Calendar,
// //   BookOpen,
// // } from 'lucide-react';

// // interface StudentClass {
// //   id: number;
// //   name: string;
// // }

// // interface Student {
// //   id: number;
// //   nisn: string;
// //   nis?: string;
// //   full_name: string;
// //   gender: 'L' | 'P';
// //   student_class?: number;
// //   class_name?: string;
// //   birth_place?: string;
// //   birth_date?: string;
// //   address?: string;
// //   parent_phone_number?: string;
// //   status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED_OUT';
// //   created_at?: string;
// // }

// // export default function StudentsPage() {
// //   const [students, setStudents] = useState<Student[]>([]);
// //   const [classes, setClasses] = useState<StudentClass[]>([]);
// //   const [loading, setLoading] = useState(true);

// //   // Pagination State (Backend)
// //   const [currentPage, setCurrentPage] = useState(1);
// //   const [totalCount, setTotalCount] = useState(0);
// //   const [pageSize] = useState(10);

// //   // Filter State
// //   const [searchQuery, setSearchQuery] = useState('');
// //   const [selectedClassFilter, setSelectedClassFilter] = useState('');

// //   // Modal & Drawer State
// //   const [isModalOpen, setIsModalOpen] = useState(false);
// //   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
// //   const [editingStudent, setEditingStudent] = useState<Student | null>(null);
// //   const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);

// //   const [submitting, setSubmitting] = useState(false);
// //   const [error, setError] = useState('');

// //   // Form State
// //   const [formData, setFormData] = useState({
// //     nisn: '',
// //     nis: '',
// //     full_name: '',
// //     gender: 'L',
// //     student_class: '',
// //     birth_place: '',
// //     birth_date: '',
// //     address: '',
// //     parent_phone_number: '',
// //     status: 'ACTIVE',
// //   });

// //   useEffect(() => {
// //     const delayDebounceFn = setTimeout(() => {
// //       fetchData();
// //     }, 400); // Debounce 400ms agar server tidak kebanjiran request saat mengetik cepat

// //     return () => clearTimeout(delayDebounceFn);
// //   }, [currentPage, selectedClassFilter, searchQuery]);

// //   const fetchData = async () => {
// //       setLoading(true);
// //       try {
// //         const queryParams = new URLSearchParams({
// //           page: String(currentPage),
// //           page_size: String(pageSize),
// //         });

// //         if (selectedClassFilter) queryParams.append('class_id', selectedClassFilter);
// //         if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

// //         const [resStudents, resClasses] = await Promise.all([
// //           api.get(`/students/students/?${queryParams.toString()}`),
// //           api.get('/students/classes/'),
// //         ]);

// //         if (resStudents.data.results) {
// //           setStudents(resStudents.data.results);
// //           setTotalCount(resStudents.data.count || 0);
// //         } else {
// //           setStudents(resStudents.data);
// //           setTotalCount(resStudents.data.length || 0);
// //         }

// //         setClasses(resClasses.data.results || resClasses.data);
// //       } catch (err) {
// //         console.error('Gagal memuat data:', err);
// //       } finally {
// //         setLoading(false);
// //       }
// //     };

// //   useEffect(() => {
// //     fetchData();
// //   }, [currentPage, selectedClassFilter]);

// //   const handleSearchSubmit = (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setCurrentPage(1);
// //     fetchData();
// //   };

// //   const handleOpenDetailDrawer = (student: Student) => {
// //     setSelectedDetailStudent(student);
// //     setIsDrawerOpen(true);
// //   };

// //   const handleOpenModal = (student?: Student) => {
// //     setError('');
// //     if (student) {
// //       setEditingStudent(student);
// //       setFormData({
// //         nisn: student.nisn || '',
// //         nis: student.nis || '',
// //         full_name: student.full_name || '',
// //         gender: student.gender || 'L',
// //         student_class: student.student_class ? String(student.student_class) : '',
// //         birth_place: student.birth_place || '',
// //         birth_date: student.birth_date || '',
// //         address: student.address || '',
// //         parent_phone_number: student.parent_phone_number || '',
// //         status: student.status || 'ACTIVE',
// //       });
// //     } else {
// //       setEditingStudent(null);
// //       setFormData({
// //         nisn: '',
// //         nis: '',
// //         full_name: '',
// //         gender: 'L',
// //         student_class: '',
// //         birth_place: '',
// //         birth_date: '',
// //         address: '',
// //         parent_phone_number: '',
// //         status: 'ACTIVE',
// //       });
// //     }
// //     setIsModalOpen(true);
// //   };

// //   const handleSubmit = async (e: React.FormEvent) => {
// //     e.preventDefault();
// //     setSubmitting(true);
// //     setError('');

// //     const payload = {
// //       ...formData,
// //       student_class: formData.student_class ? Number(formData.student_class) : null,
// //       birth_date: formData.birth_date || null,
// //     };

// //     try {
// //       if (editingStudent) {
// //         await api.patch(`/students/students/${editingStudent.id}/`, payload);
// //       } else {
// //         await api.post('/students/students/', payload);
// //       }
// //       setIsModalOpen(false);
// //       fetchData();
// //     } catch (err: any) {
// //       const resp = err.response?.data;
// //       if (resp) {
// //         const firstKey = Object.keys(resp)[0];
// //         const msg = Array.isArray(resp[firstKey]) ? resp[firstKey][0] : resp[firstKey];
// //         setError(`${firstKey}: ${msg}`);
// //       } else {
// //         setError('Gagal menyimpan data siswa.');
// //       }
// //     } finally {
// //       setSubmitting(false);
// //     }
// //   };

// //   const handleDelete = async (id: number, name: string) => {
// //     if (!confirm(`Apakah Anda yakin ingin menghapus data siswa ${name}?`)) return;

// //     try {
// //       await api.delete(`/students/students/${id}/`);
// //       fetchData();
// //     } catch (err) {
// //       alert('Gagal menghapus data siswa.');
// //     }
// //   };

// //   const totalPages = Math.ceil(totalCount / pageSize);

// //   return (
// //     <div className="space-y-6">
// //       {/* Header */}
// //       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
// //         <div>
// //           <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Siswa</h1>
// //           <p className="text-slate-500 text-sm mt-1">Kelola data seluruh siswa aktif di sekolah Anda.</p>
// //         </div>
// //         <button
// //           onClick={() => handleOpenModal()}
// //           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition"
// //         >
// //           <Plus className="w-5 h-5" />
// //           Tambah Siswa
// //         </button>
// //       </div>

// //       {/* Filter & Search Bar */}
// //       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
// //         <form onSubmit={handleSearchSubmit} className="relative flex-1">
// //           <input
// //             type="text"
// //             placeholder="Cari NISN atau Nama Siswa... (Tekan Enter)"
// //             value={searchQuery}
// //             onChange={(e) => setSearchQuery(e.target.value)}
// //             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //           />
// //           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
// //         </form>

// //         <select
// //           value={selectedClassFilter}
// //           onChange={(e) => {
// //             setSelectedClassFilter(e.target.value);
// //             setCurrentPage(1);
// //           }}
// //           className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// //         >
// //           <option value="">Semua Kelas</option>
// //           {classes.map((c) => (
// //             <option key={c.id} value={c.id}>
// //               {c.name}
// //             </option>
// //           ))}
// //         </select>
// //       </div>

// //       {/* Tabel Data Siswa */}
// //       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
// //         {loading ? (
// //           <div className="p-12 text-center text-slate-500 flex items-center justify-center">
// //             <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" />
// //             <span>Memuat data siswa dari server...</span>
// //           </div>
// //         ) : students.length === 0 ? (
// //           <div className="p-8 text-center text-slate-500">Data siswa tidak ditemukan.</div>
// //         ) : (
// //           <>
// //             <div className="overflow-x-auto">
// //               <table className="w-full text-left border-collapse">
// //                 <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
// //                   <tr>
// //                     <th className="px-6 py-3.5">NISN / NIS</th>
// //                     <th className="px-6 py-3.5">Nama Lengkap</th>
// //                     <th className="px-6 py-3.5">L/P</th>
// //                     <th className="px-6 py-3.5">Kelas</th>
// //                     <th className="px-6 py-3.5">No. HP Orang Tua</th>
// //                     <th className="px-6 py-3.5 text-center">Aksi</th>
// //                   </tr>
// //                 </thead>
// //                 <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
// //                   {students.map((student) => (
// //                     <tr key={student.id} className="hover:bg-slate-50 transition">
// //                       <td className="px-6 py-4 font-mono text-slate-500">
// //                         <div>{student.nisn}</div>
// //                         {student.nis && <div className="text-xs text-slate-400">NIS: {student.nis}</div>}
// //                       </td>
// //                       <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
// //                       <td className="px-6 py-4">{student.gender}</td>
// //                       <td className="px-6 py-4">
// //                         <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
// //                           {student.class_name || 'Belum diatur'}
// //                         </span>
// //                       </td>
// //                       <td className="px-6 py-4">{student.parent_phone_number || '-'}</td>
// //                       <td className="px-6 py-4">
// //                         <div className="flex justify-center items-center gap-1">
// //                           <button
// //                             onClick={() => handleOpenDetailDrawer(student)}
// //                             className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
// //                             title="Lihat Detail"
// //                           >
// //                             <Eye className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleOpenModal(student)}
// //                             className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
// //                             title="Edit"
// //                           >
// //                             <Edit2 className="w-4 h-4" />
// //                           </button>
// //                           <button
// //                             onClick={() => handleDelete(student.id, student.full_name)}
// //                             className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
// //                             title="Hapus"
// //                           >
// //                             <Trash2 className="w-4 h-4" />
// //                           </button>
// //                         </div>
// //                       </td>
// //                     </tr>
// //                   ))}
// //                 </tbody>
// //               </table>
// //             </div>

// //             {/* Pagination Controls */}
// //             <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-600">
// //               <div>
// //                 Menampilkan <strong>{students.length}</strong> dari <strong>{totalCount}</strong> siswa
// //               </div>
// //               <div className="flex items-center gap-2">
// //                 <button
// //                   disabled={currentPage === 1}
// //                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
// //                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
// //                 >
// //                   <ChevronLeft className="w-4 h-4" />
// //                 </button>
// //                 <span className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-lg">
// //                   Halaman {currentPage} dari {totalPages || 1}
// //                 </span>
// //                 <button
// //                   disabled={currentPage >= totalPages}
// //                   onClick={() => setCurrentPage((prev) => prev + 1)}
// //                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
// //                 >
// //                   <ChevronRight className="w-4 h-4" />
// //                 </button>
// //               </div>
// //             </div>
// //           </>
// //         )}
// //       </div>

// //       {/* Slide-over Drawer Detail Siswa */}
// //       {isDrawerOpen && selectedDetailStudent && (
// //         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
// //           <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
// //             <div>
// //               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
// //                 <h2 className="text-lg font-bold text-slate-800">Profil Detail Siswa</h2>
// //                 <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
// //                   <X className="w-5 h-5" />
// //                 </button>
// //               </div>

// //               <div className="mt-6 space-y-6">
// //                 <div className="flex items-center gap-4">
// //                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
// //                     {selectedDetailStudent.full_name.charAt(0)}
// //                   </div>
// //                   <div>
// //                     <h3 className="text-lg font-bold text-slate-900">{selectedDetailStudent.full_name}</h3>
// //                     <p className="text-xs text-slate-500 font-mono">NISN: {selectedDetailStudent.nisn}</p>
// //                     <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
// //                       Status: {selectedDetailStudent.status}
// //                     </span>
// //                   </div>
// //                 </div>

// //                 <div className="space-y-3 text-sm text-slate-600 pt-2">
// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
// //                     <BookOpen className="w-4 h-4 text-blue-600" />
// //                     <span>Kelas: <strong>{selectedDetailStudent.class_name || 'Belum diatur'}</strong></span>
// //                   </div>
// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
// //                     <User className="w-4 h-4 text-blue-600" />
// //                     <span>Jenis Kelamin: <strong>{selectedDetailStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></span>
// //                   </div>
// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
// //                     <Calendar className="w-4 h-4 text-blue-600" />
// //                     <span>Tempat, Tgl Lahir: <strong>{selectedDetailStudent.birth_place || '-'}, {selectedDetailStudent.birth_date || '-'}</strong></span>
// //                   </div>
// //                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
// //                     <Phone className="w-4 h-4 text-blue-600" />
// //                     <span>HP Orang Tua: <strong>{selectedDetailStudent.parent_phone_number || '-'}</strong></span>
// //                   </div>
// //                   <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
// //                     <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
// //                     <span>Alamat: <strong>{selectedDetailStudent.address || '-'}</strong></span>
// //                   </div>
// //                 </div>
// //               </div>
// //             </div>

// //             <div className="pt-6 border-t border-slate-100">
// //               <button
// //                 onClick={() => {
// //                   setIsDrawerOpen(false);
// //                   handleOpenModal(selectedDetailStudent);
// //                 }}
// //                 className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
// //               >
// //                 <Edit2 className="w-4 h-4" /> Edit Data Siswa Ini
// //               </button>
// //             </div>
// //           </div>
// //         </div>
// //       )}

// //       {/* Modal Form Create & Edit */}
// //       {isModalOpen && (
// //         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
// //           <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
// //             <div className="flex justify-between items-center mb-4">
// //               <h2 className="text-xl font-bold text-slate-800">
// //                 {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
// //               </h2>
// //               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
// //                 <X className="w-5 h-5" />
// //               </button>
// //             </div>

// //             {error && <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg">{error}</div>}

// //             <form onSubmit={handleSubmit} className="space-y-4">
// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">NISN *</label>
// //                   <input
// //                     type="text"
// //                     required
// //                     value={formData.nisn}
// //                     onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">NIS</label>
// //                   <input
// //                     type="text"
// //                     value={formData.nis}
// //                     onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
// //                 <input
// //                   type="text"
// //                   required
// //                   value={formData.full_name}
// //                   onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
// //                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
// //                   <select
// //                     value={formData.gender}
// //                     onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     <option value="L">Laki-laki</option>
// //                     <option value="P">Perempuan</option>
// //                   </select>
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
// //                   <select
// //                     value={formData.student_class}
// //                     onChange={(e) => setFormData({ ...formData, student_class: e.target.value })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   >
// //                     <option value="">-- Pilih Kelas --</option>
// //                     {classes.map((c) => (
// //                       <option key={c.id} value={c.id}>
// //                         {c.name}
// //                       </option>
// //                     ))}
// //                   </select>
// //                 </div>
// //               </div>

// //               <div className="grid grid-cols-2 gap-3">
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
// //                   <input
// //                     type="text"
// //                     value={formData.birth_place}
// //                     onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //                 <div>
// //                   <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
// //                   <input
// //                     type="date"
// //                     value={formData.birth_date}
// //                     onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
// //                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                   />
// //                 </div>
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1">No. HP Orang Tua</label>
// //                 <input
// //                   type="text"
// //                   value={formData.parent_phone_number}
// //                   onChange={(e) => setFormData({ ...formData, parent_phone_number: e.target.value })}
// //                   placeholder="081234567890"
// //                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>

// //               <div>
// //                 <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
// //                 <textarea
// //                   rows={2}
// //                   value={formData.address}
// //                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
// //                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
// //                 />
// //               </div>

// //               <div className="flex gap-3 pt-3">
// //                 <button
// //                   type="button"
// //                   onClick={() => setIsModalOpen(false)}
// //                   className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
// //                 >
// //                   Batal
// //                 </button>
// //                 <button
// //                   type="submit"
// //                   disabled={submitting}
// //                   className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
// //                 >
// //                   {submitting ? 'Menyimpan...' : 'Simpan Data'}
// //                 </button>
// //               </div>
// //             </form>
// //           </div>
// //         </div>
// //       )}
// //     </div>
// //   );
// // }

// 'use client';

// import { useState, useEffect } from 'react';
// import { api } from '@/lib/api';
// import toast from 'react-hot-toast';
// import {
//   Plus,
//   Edit2,
//   Trash2,
//   Search,
//   RefreshCw,
//   X,
//   Eye,
//   ChevronLeft,
//   ChevronRight,
//   User,
//   Phone,
//   MapPin,
//   Calendar,
//   BookOpen,
//   CheckSquare,
// } from 'lucide-react';

// interface StudentClass {
//   id: number;
//   name: string;
// }

// interface Student {
//   id: number;
//   nisn: string;
//   nis?: string;
//   full_name: string;
//   gender: 'L' | 'P';
//   student_class?: number;
//   class_name?: string;
//   birth_place?: string;
//   birth_date?: string;
//   address?: string;
//   parent_phone_number?: string;
//   status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED_OUT';
// }

// export default function StudentsPage() {
//   const [students, setStudents] = useState<Student[]>([]);
//   const [classes, setClasses] = useState<StudentClass[]>([]);
//   const [loading, setLoading] = useState(true);

//   // Bulk Selection State
//   const [selectedIds, setSelectedIds] = useState<number[]>([]);

//   // Pagination State
//   const [currentPage, setCurrentPage] = useState(1);
//   const [totalCount, setTotalCount] = useState(0);
//   const [pageSize] = useState(10);

//   // Filter State
//   const [searchQuery, setSearchQuery] = useState('');
//   const [selectedClassFilter, setSelectedClassFilter] = useState('');

//   // Modal & Drawer State
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isDrawerOpen, setIsDrawerOpen] = useState(false);
//   const [editingStudent, setEditingStudent] = useState<Student | null>(null);
//   const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);

//   const [submitting, setSubmitting] = useState(false);

//   const [deleteModal, setDeleteModal] = useState<{
//     isOpen: boolean;
//     type: 'single' | 'bulk';
//     targetId?: number;
//     targetName?: string;
//   }>({
//     isOpen: false,
//     type: 'single',
//   });

//   // Trigger Hapus Tunggal
//   const triggerDeleteSingle = (id: number, name: string) => {
//     setDeleteModal({
//       isOpen: true,
//       type: 'single',
//       targetId: id,
//       targetName: name,
//     });
//   };

//   // Trigger Hapus Massal
//   const triggerDeleteBulk = () => {
//     if (selectedIds.length === 0) return;
//     setDeleteModal({
//       isOpen: true,
//       type: 'bulk',
//     });
//   };

//   // Form State
//   const [formData, setFormData] = useState({
//     nisn: '',
//     nis: '',
//     full_name: '',
//     gender: 'L',
//     student_class: '',
//     birth_place: '',
//     birth_date: '',
//     address: '',
//     parent_phone_number: '',
//     status: 'ACTIVE',
//   });

//   const fetchData = async () => {
//     setLoading(true);
//     try {
//       const queryParams = new URLSearchParams({
//         page: String(currentPage),
//         page_size: String(pageSize),
//       });

//       if (selectedClassFilter) queryParams.append('class_id', selectedClassFilter);
//       if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

//       const [resStudents, resClasses] = await Promise.all([
//         api.get(`/students/students/?${queryParams.toString()}`),
//         api.get('/students/classes/'),
//       ]);

//       if (resStudents.data.results) {
//         setStudents(resStudents.data.results);
//         setTotalCount(resStudents.data.count || 0);
//       } else {
//         setStudents(resStudents.data);
//         setTotalCount(resStudents.data.length || 0);
//       }

//       setClasses(resClasses.data.results || resClasses.data);
//       setSelectedIds([]);
//     } catch (err) {
//       toast.error('Gagal memuat data siswa dari server.');
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     const delayDebounce = setTimeout(() => {
//       fetchData();
//     }, 400);

//     return () => clearTimeout(delayDebounce);
//   }, [currentPage, selectedClassFilter, searchQuery]);

//   // Handle Select All Checkbox
//   // const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
//   //   if (e.target.checked) {
//   //     setSelectedIds(students.map((s) => s.id));
//   //   } else {
//   //     setSelectedIds([]);
//   //   }
//   // };

//   // // Handle Individual Checkbox
//   // const handleSelectOne = (id: number) => {
//   //   setSelectedIds((prev) =>
//   //     prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
//   //   );
//   // };

//   // // Bulk Delete Handler
//   // const handleBulkDelete = async () => {
//   //   if (selectedIds.length === 0) return;

//   //   if (!confirm(`Apakah Anda yakin ingin menghapus ${selectedIds.length} siswa terpilih?`)) {
//   //     return;
//   //   }

//   //   const toastId = toast.loading('Menghapus data siswa terpilih...');

//   //   try {
//   //     await api.post('/students/students/bulk-delete/', { ids: selectedIds });
//   //     toast.success(`Berhasil menghapus ${selectedIds.length} data siswa.`, { id: toastId });
//   //     setSelectedIds([]);
//   //     fetchData();
//   //   } catch (err) {
//   //     toast.error('Gagal menghapus beberapa data siswa.', { id: toastId });
//   //   }
//   // };

//   // // Delete Single Handler
//   // const handleDeleteSingle = async (id: number, name: string) => {
//   //   if (!confirm(`Hapus data siswa ${name}?`)) return;

//   //   const toastId = toast.loading('Menghapus data...');
//   //   try {
//   //     await api.delete(`/students/students/${id}/`);
//   //     toast.success(`Data siswa ${name} berhasil dihapus.`, { id: toastId });
//   //     fetchData();
//   //   } catch (err) {
//   //     toast.error('Gagal menghapus data siswa.', { id: toastId });
//   //   }
//   // };

//   const handleConfirmDelete = async () => {
//     if (deleteModal.type === 'single' && deleteModal.targetId) {
//       const toastId = toast.loading('Menghapus data...');
//       try {
//         await api.delete(`/students/students/${deleteModal.targetId}/`);
//         toast.success(`Data siswa ${deleteModal.targetName} berhasil dihapus.`, { id: toastId });
//         fetchData();
//       } catch (err) {
//         toast.error('Gagal menghapus data siswa.', { id: toastId });
//       }
//     } else if (deleteModal.type === 'bulk') {
//       const toastId = toast.loading('Menghapus data siswa terpilih...');
//       try {
//         await api.post('/students/students/bulk-delete/', { ids: selectedIds });
//         toast.success(`Berhasil menghapus ${selectedIds.length} data siswa.`, { id: toastId });
//         setSelectedIds([]);
//         fetchData();
//       } catch (err) {
//         toast.error('Gagal menghapus beberapa data siswa.', { id: toastId });
//       }
//     }
    
//     // Tutup Modal
//     setDeleteModal({ isOpen: false, type: 'single' });
//   };

//   const handleOpenDetailDrawer = (student: Student) => {
//     setSelectedDetailStudent(student);
//     setIsDrawerOpen(true);
//   };

//   const handleOpenModal = (student?: Student) => {
//     if (student) {
//       setEditingStudent(student);
//       setFormData({
//         nisn: student.nisn || '',
//         nis: student.nis || '',
//         full_name: student.full_name || '',
//         gender: student.gender || 'L',
//         student_class: student.student_class ? String(student.student_class) : '',
//         birth_place: student.birth_place || '',
//         birth_date: student.birth_date || '',
//         address: student.address || '',
//         parent_phone_number: student.parent_phone_number || '',
//         status: student.status || 'ACTIVE',
//       });
//     } else {
//       setEditingStudent(null);
//       setFormData({
//         nisn: '',
//         nis: '',
//         full_name: '',
//         gender: 'L',
//         student_class: '',
//         birth_place: '',
//         birth_date: '',
//         address: '',
//         parent_phone_number: '',
//         status: 'ACTIVE',
//       });
//     }
//     setIsModalOpen(true);
//   };

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     setSubmitting(true);

//     const payload = {
//       ...formData,
//       student_class: formData.student_class ? Number(formData.student_class) : null,
//       birth_date: formData.birth_date || null,
//     };

//     const toastId = toast.loading(editingStudent ? 'Memperbarui data...' : 'Menambahkan data...');

//     try {
//       if (editingStudent) {
//         await api.patch(`/students/students/${editingStudent.id}/`, payload);
//         toast.success('Data siswa berhasil diperbarui!', { id: toastId });
//       } else {
//         await api.post('/students/students/', payload);
//         toast.success('Siswa baru berhasil ditambahkan!', { id: toastId });
//       }
//       setIsModalOpen(false);
//       fetchData();
//     } catch (err: any) {
//       const resp = err.response?.data;
//       if (resp) {
//         const firstKey = Object.keys(resp)[0];
//         toast.error(`${firstKey}: ${JSON.stringify(resp[firstKey])}`, { id: toastId });
//       } else {
//         toast.error('Gagal menyimpan data siswa.', { id: toastId });
//       }
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   const totalPages = Math.ceil(totalCount / pageSize);

//   return (
//     <div className="space-y-6 relative">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Siswa</h1>
//           <p className="text-slate-500 text-sm mt-1">Kelola data seluruh siswa aktif di sekolah Anda.</p>
//         </div>
//         <button
//           onClick={() => handleOpenModal()}
//           className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm"
//         >
//           <Plus className="w-5 h-5" />
//           Tambah Siswa
//         </button>
//       </div>

//       {/* Filter & Search Bar */}
//       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
//         <div className="relative flex-1">
//           <input
//             type="text"
//             placeholder="Cari NISN atau Nama Siswa..."
//             value={searchQuery}
//             onChange={(e) => {
//               setSearchQuery(e.target.value);
//               setCurrentPage(1);
//             }}
//             className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//           />
//           <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
//         </div>

//         <select
//           value={selectedClassFilter}
//           onChange={(e) => {
//             setSelectedClassFilter(e.target.value);
//             setCurrentPage(1);
//           }}
//           className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//         >
//           <option value="">Semua Kelas</option>
//           {classes.map((c) => (
//             <option key={c.id} value={c.id}>
//               {c.name}
//             </option>
//           ))}
//         </select>
//       </div>

//       {/* Tabel Data Siswa */}
//       <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
//         {loading ? (
//           <div className="p-12 text-center text-slate-500 flex items-center justify-center">
//             <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" />
//             <span>Memuat data siswa dari server...</span>
//           </div>
//         ) : students.length === 0 ? (
//           <div className="p-8 text-center text-slate-500">Data siswa tidak ditemukan.</div>
//         ) : (
//           <>
//             <div className="overflow-x-auto">
//               <table className="w-full text-left border-collapse">
//                 <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
//                   <tr>
//                     <th className="px-4 py-3.5 w-12 text-center">
//                       <input
//                         type="checkbox"
//                         checked={selectedIds.length === students.length && students.length > 0}
//                         onChange={handleSelectAll}
//                         className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
//                       />
//                     </th>
//                     <th className="px-6 py-3.5">NISN / NIS</th>
//                     <th className="px-6 py-3.5">Nama Lengkap</th>
//                     <th className="px-6 py-3.5">L/P</th>
//                     <th className="px-6 py-3.5">Kelas</th>
//                     <th className="px-6 py-3.5">No. HP Orang Tua</th>
//                     <th className="px-6 py-3.5 text-center">Aksi</th>
//                   </tr>
//                 </thead>
//                 <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
//                   {students.map((student) => {
//                     const isSelected = selectedIds.includes(student.id);
//                     return (
//                       <tr
//                         key={student.id}
//                         className={`transition ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
//                       >
//                         <td className="px-4 py-4 text-center">
//                           <input
//                             type="checkbox"
//                             checked={isSelected}
//                             onChange={() => handleSelectOne(student.id)}
//                             className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
//                           />
//                         </td>
//                         <td className="px-6 py-4 font-mono text-slate-500">
//                           <div>{student.nisn}</div>
//                           {student.nis && <div className="text-xs text-slate-400">NIS: {student.nis}</div>}
//                         </td>
//                         <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
//                         <td className="px-6 py-4">{student.gender}</td>
//                         <td className="px-6 py-4">
//                           <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
//                             {student.class_name || 'Belum diatur'}
//                           </span>
//                         </td>
//                         <td className="px-6 py-4">{student.parent_phone_number || '-'}</td>
//                         <td className="px-6 py-4">
//                           <div className="flex justify-center items-center gap-1">
//                             <button
//                               onClick={() => handleOpenDetailDrawer(student)}
//                               className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
//                               title="Lihat Detail"
//                             >
//                               <Eye className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleOpenModal(student)}
//                               className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                               title="Edit"
//                             >
//                               <Edit2 className="w-4 h-4" />
//                             </button>
//                             <button
//                               onClick={() => handleDeleteSingle(student.id, student.full_name)}
//                               className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
//                               title="Hapus"
//                             >
//                               <Trash2 className="w-4 h-4" />
//                             </button>
//                           </div>
//                         </td>
//                       </tr>
//                     );
//                   })}
//                 </tbody>
//               </table>
//             </div>

//             {/* Pagination Controls */}
//             <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-600">
//               <div>
//                 Menampilkan <strong>{students.length}</strong> dari <strong>{totalCount}</strong> siswa
//               </div>
//               <div className="flex items-center gap-2">
//                 <button
//                   disabled={currentPage === 1}
//                   onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
//                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   <ChevronLeft className="w-4 h-4" />
//                 </button>
//                 <span className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-lg">
//                   Halaman {currentPage} dari {totalPages || 1}
//                 </span>
//                 <button
//                   disabled={currentPage >= totalPages}
//                   onClick={() => setCurrentPage((prev) => prev + 1)}
//                   className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
//                 >
//                   <ChevronRight className="w-4 h-4" />
//                 </button>
//               </div>
//             </div>
//           </>
//         )}
//       </div>

//       {/* Floating Action Bar Hapus Massal */}
//       {selectedIds.length > 0 && (
//         <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
//           <div className="flex items-center gap-2 text-sm">
//             <CheckSquare className="w-4 h-4 text-blue-400" />
//             <span><strong>{selectedIds.length}</strong> siswa terpilih</span>
//           </div>
//           <div className="h-4 w-px bg-slate-700" />
//           <button
//             onClick={handleBulkDelete}
//             className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
//           >
//             <Trash2 className="w-4 h-4" /> Hapus Terpilih
//           </button>
//         </div>
//       )}

//       {/* Drawer Detail Siswa */}
//       {isDrawerOpen && selectedDetailStudent && (
//         <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
//           <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
//             <div>
//               <div className="flex justify-between items-center pb-4 border-b border-slate-100">
//                 <h2 className="text-lg font-bold text-slate-800">Profil Detail Siswa</h2>
//                 <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
//                   <X className="w-5 h-5" />
//                 </button>
//               </div>

//               <div className="mt-6 space-y-6">
//                 <div className="flex items-center gap-4">
//                   <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
//                     {selectedDetailStudent.full_name.charAt(0)}
//                   </div>
//                   <div>
//                     <h3 className="text-lg font-bold text-slate-900">{selectedDetailStudent.full_name}</h3>
//                     <p className="text-xs text-slate-500 font-mono">NISN: {selectedDetailStudent.nisn}</p>
//                     <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
//                       Status: {selectedDetailStudent.status}
//                     </span>
//                   </div>
//                 </div>

//                 <div className="space-y-3 text-sm text-slate-600 pt-2">
//                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                     <BookOpen className="w-4 h-4 text-blue-600" />
//                     <span>Kelas: <strong>{selectedDetailStudent.class_name || 'Belum diatur'}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                     <User className="w-4 h-4 text-blue-600" />
//                     <span>Jenis Kelamin: <strong>{selectedDetailStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                     <Calendar className="w-4 h-4 text-blue-600" />
//                     <span>Tempat, Tgl Lahir: <strong>{selectedDetailStudent.birth_place || '-'}, {selectedDetailStudent.birth_date || '-'}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                     <Phone className="w-4 h-4 text-blue-600" />
//                     <span>HP Orang Tua: <strong>{selectedDetailStudent.parent_phone_number || '-'}</strong></span>
//                   </div>
//                   <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
//                     <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
//                     <span>Alamat: <strong>{selectedDetailStudent.address || '-'}</strong></span>
//                   </div>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-6 border-t border-slate-100">
//               <button
//                 onClick={() => {
//                   setIsDrawerOpen(false);
//                   handleOpenModal(selectedDetailStudent);
//                 }}
//                 className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
//               >
//                 <Edit2 className="w-4 h-4" /> Edit Data Siswa Ini
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* Modal Form Create & Edit */}
//       {isModalOpen && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
//           <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
//             <div className="flex justify-between items-center mb-4">
//               <h2 className="text-xl font-bold text-slate-800">
//                 {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
//               </h2>
//               <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
//                 <X className="w-5 h-5" />
//               </button>
//             </div>

//             <form onSubmit={handleSubmit} className="space-y-4">
//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">NISN *</label>
//                   <input
//                     type="text"
//                     required
//                     value={formData.nisn}
//                     onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">NIS</label>
//                   <input
//                     type="text"
//                     value={formData.nis}
//                     onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
//                 <input
//                   type="text"
//                   required
//                   value={formData.full_name}
//                   onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
//                   <select
//                     value={formData.gender}
//                     onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="L">Laki-laki</option>
//                     <option value="P">Perempuan</option>
//                   </select>
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
//                   <select
//                     value={formData.student_class}
//                     onChange={(e) => setFormData({ ...formData, student_class: e.target.value })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   >
//                     <option value="">-- Pilih Kelas --</option>
//                     {classes.map((c) => (
//                       <option key={c.id} value={c.id}>
//                         {c.name}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>

//               <div className="grid grid-cols-2 gap-3">
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
//                   <input
//                     type="text"
//                     value={formData.birth_place}
//                     onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//                 <div>
//                   <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
//                   <input
//                     type="date"
//                     value={formData.birth_date}
//                     onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                   />
//                 </div>
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1">No. HP Orang Tua</label>
//                 <input
//                   type="text"
//                   value={formData.parent_phone_number}
//                   onChange={(e) => setFormData({ ...formData, parent_phone_number: e.target.value })}
//                   placeholder="081234567890"
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div>
//                 <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
//                 <textarea
//                   rows={2}
//                   value={formData.address}
//                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
//                   className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//               </div>

//               <div className="flex gap-3 pt-3">
//                 <button
//                   type="button"
//                   onClick={() => setIsModalOpen(false)}
//                   className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
//                 >
//                   Batal
//                 </button>
//                 <button
//                   type="submit"
//                   disabled={submitting}
//                   className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
//                 >
//                   {submitting ? 'Menyimpan...' : 'Simpan Data'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }

// batasannnnnnnnnnnnnnnnnn

'use client';

import { Upload, FileSpreadsheet } from 'lucide-react';
import { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react'; // Tambahkan icon Download
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import {
  Plus,
  Edit2,
  Trash2,
  Search,
  RefreshCw,
  X,
  Eye,
  ChevronLeft,
  ChevronRight,
  User,
  Phone,
  MapPin,
  Calendar,
  BookOpen,
  CheckSquare,
} from 'lucide-react';

interface StudentClass {
  id: number;
  name: string;
}

interface Student {
  id: number;
  nisn: string;
  nis?: string;
  full_name: string;
  gender: 'L' | 'P';
  student_class?: number;
  class_name?: string;
  birth_place?: string;
  birth_date?: string;
  address?: string;
  parent_phone_number?: string;
  status: 'ACTIVE' | 'GRADUATED' | 'TRANSFERRED' | 'DROPPED_OUT';
}

interface StudentAttendanceSummary {
  summary: {
    HADIR: number;
    IZIN: number;
    SAKIT: number;
    ALPA: number;
    total: number;
  };
  recent_logs: Array<{
    date: string;
    status: 'HADIR' | 'IZIN' | 'SAKIT' | 'ALPA';
    notes?: string;
  }>;
}

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [loading, setLoading] = useState(true);

  // State Modal Import
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [importing, setImporting] = useState(false);

  // Bulk Selection State
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  // Pagination State (Backend)
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [pageSize] = useState(10);

  

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedClassFilter, setSelectedClassFilter] = useState('');

  // Modal & Drawer State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<Student | null>(null);
  const [selectedDetailStudent, setSelectedDetailStudent] = useState<Student | null>(null);

  // Custom Delete Modal State
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    type: 'single' | 'bulk';
    targetId?: number;
    targetName?: string;
  }>({
    isOpen: false,
    type: 'single',
  });

  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    nisn: '',
    nis: '',
    full_name: '',
    gender: 'L',
    student_class: '',
    birth_place: '',
    birth_date: '',
    address: '',
    parent_phone_number: '',
    status: 'ACTIVE',
  });

  // State Modal Bulk Edit Kelas
  const [isBulkClassModalOpen, setIsBulkClassModalOpen] = useState(false);
  const [selectedBulkClassId, setSelectedBulkClassId] = useState('');
  const [bulkAssigning, setBulkAssigning] = useState(false);

  // Tambahkan state tab di dalam StudentsPage
  const [drawerTab, setDrawerTab] = useState<'profile' | 'attendance'>('profile');
  const [studentAttendanceSummary, setStudentAttendanceSummary] = useState<StudentAttendanceSummary | null>(null);
  const [loadingAttendance, setLoadingAttendance] = useState(false);

  
  const fetchData = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: String(currentPage),
        page_size: String(pageSize),
      });

      if (selectedClassFilter) queryParams.append('class_id', selectedClassFilter);
      if (searchQuery.trim()) queryParams.append('search', searchQuery.trim());

      const [resStudents, resClasses] = await Promise.all([
        api.get(`/students/students/?${queryParams.toString()}`),
        api.get('/students/classes/'),
      ]);

      if (resStudents.data.results) {
        setStudents(resStudents.data.results);
        setTotalCount(resStudents.data.count || 0);
      } else {
        setStudents(resStudents.data);
        setTotalCount(resStudents.data.length || 0);
      }

      setClasses(resClasses.data.results || resClasses.data);
      setSelectedIds([]);
    } catch (err) {
      toast.error('Gagal memuat data siswa.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounce = setTimeout(() => {
      fetchData();
    }, 400);

    return () => clearTimeout(delayDebounce);
  }, [currentPage, selectedClassFilter, searchQuery]);

  // 1. Download Template Excel Resmi
  const handleDownloadTemplate = () => {
    const headers = [
      'nisn',
      'nis',
      'full_name',
      'gender',
      'birth_place',
      'birth_date',
      'parent_phone_number',
      'address',
    ];
    const sampleData = [
      [
        '0081234561',
        '24251001',
        'Aditya Pratama',
        'L',
        'Bandung',
        '2008-03-14',
        '081223344556',
        'Jl. Asia Afrika No. 12, Bandung',
      ],
      [
        '0081234562',
        '24251002',
        'Bintang Aulia',
        'P',
        'Jakarta',
        '2008-07-22',
        '081334455667',
        'Jl. Sudirman No. 45, Jakarta',
      ],
      [
        '0081234563',
        '24251003',
        'Cahya Ramadhan',
        'L',
        'Surabaya',
        '2008-11-05',
        '081445566778',
        'Jl. Pemuda No. 8, Surabaya',
      ],
      [
        '0081234564',
        '24251004',
        'Dinda Permata',
        'P',
        'Yogyakarta',
        '2008-01-19',
        '081556677889',
        'Jl. Malioboro No. 23, Yogyakarta',
      ],
      [
        '0081234565',
        '24251005',
        'Eko Wijaya',
        'L',
        'Semarang',
        '2008-09-30',
        '081667788990',
        'Jl. Pandanaran No. 17, Semarang',
      ],
    ];

    const worksheet = XLSX.utils.aoa_to_sheet([headers, ...sampleData]);
    worksheet['!cols'] = [
      { wch: 15 },
      { wch: 12 },
      { wch: 25 },
      { wch: 8 },
      { wch: 15 },
      { wch: 15 },
      { wch: 16 },
      { wch: 30 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Template Import');
    XLSX.writeFile(workbook, 'Template_Import_Siswa.xlsx');
  };

  // 2. Handle File Upload & Parsing Excel
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Ukuran file terlalu besar! Maksimal 5MB.');
      e.target.value = '';
      return;
    }

    setImporting(true);
    const toastId = toast.loading('Membaca file Excel...');

    const reader = new FileReader();
    reader.onload = async (evt) => {
      try {
        const bstr = evt.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];

        // Convert worksheet ke JSON
        const rawData: any[] = XLSX.utils.sheet_to_json(ws);

        if (rawData.length === 0) {
          toast.error('File Excel kosong.', { id: toastId });
          setImporting(false);
          return;
        }

        // Format data agar sesuai serializer backend
        const formattedStudents = rawData.map((row) => ({
          nisn: String(row.nisn || '').trim(),
          nis: row.nis ? String(row.nis).trim() : null,
          full_name: String(row.full_name || row['Nama Lengkap'] || '').trim(),
          gender: String(row.gender || row['L/P'] || 'L').toUpperCase().startsWith('P') ? 'P' : 'L',
          birth_place: row.birth_place || null,
          birth_date: row.birth_date || null,
          parent_phone_number: row.parent_phone_number ? String(row.parent_phone_number) : null,
          address: row.address || null,
          student_class: selectedClassFilter ? Number(selectedClassFilter) : null,
        }));

        toast.loading(`Mengunggah ${formattedStudents.length} siswa ke server...`, { id: toastId });

        // Kirim ke Backend
        const res = await api.post('/students/students/bulk-create/', {
          students: formattedStudents,
        });

        toast.success(res.data.message || 'Berhasil mengimpor data siswa!', { id: toastId });
        setIsImportModalOpen(false);
        fetchData();
      } catch (err: any) {
        toast.error('Gagal mengimpor file. Pastikan format kolom sesuai template.', { id: toastId });
      } finally {
        setImporting(false);
        e.target.value = ''; // Reset input file
      }
    };

    reader.readAsBinaryString(file);
  };



  const handleConfirmBulkAssignClass = async () => {
    if (!selectedBulkClassId) {
      toast.error('Pilih kelas terlebih dahulu.');
      return;
    }

    setBulkAssigning(true);
    const toastId = toast.loading(`Memindahkan ${selectedIds.length} siswa ke kelas...`);

    try {
      await api.post('/students/students/bulk-update-class/', {
        student_ids: selectedIds,
        class_id: Number(selectedBulkClassId),
      });

      toast.success(`Berhasil mengatur kelas untuk ${selectedIds.length} siswa!`, { id: toastId });
      setIsBulkClassModalOpen(false);
      setSelectedBulkClassId('');
      setSelectedIds([]); // Reset seleksi
      fetchData(); // Reload data
    } catch (err: any) {
      toast.error('Gagal memperbarui kelas siswa.', { id: toastId });
    } finally {
      setBulkAssigning(false);
    }
  };


  // Handle Select All Checkbox
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(students.map((s) => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  // Handle Individual Checkbox
  const handleSelectOne = (id: number) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  // Trigger Modal Delete Single
  const triggerDeleteSingle = (id: number, name: string) => {
    setDeleteModal({
      isOpen: true,
      type: 'single',
      targetId: id,
      targetName: name,
    });
  };

  // Trigger Modal Delete Bulk
  const triggerDeleteBulk = () => {
    if (selectedIds.length === 0) return;
    setDeleteModal({
      isOpen: true,
      type: 'bulk',
    });
  };

// Handler Export Excel Resmi
  const handleExportExcel = () => {
    if (students.length === 0) {
      toast.error('Tidak ada data siswa untuk diexport.');
      return;
    }

    const toastId = toast.loading('Menyiapkan file Excel...');

    try {
      // 1. Format Judul & Header Resmi
      const titleRow = [['DAFTAR DATA SISWA SEKOLAH']];
      const subTitleRow = [['TAHUN AJARAN 2026/2027']];
      const emptyRow = [[]];
      const headers = [
        'No',
        'NISN',
        'NIS',
        'Nama Lengkap',
        'L/P',
        'Kelas',
        'Tempat Lahir',
        'Tanggal Lahir',
        'No. HP OrtU',
        'Alamat',
        'Status',
      ];

      // 2. Format Isian Data
      const dataRows = students.map((student, index) => [
        index + 1,
        student.nisn || '-',
        student.nis || '-',
        student.full_name || '-',
        student.gender || '-',
        student.class_name || 'Belum diatur',
        student.birth_place || '-',
        student.birth_date || '-',
        student.parent_phone_number || '-',
        student.address || '-',
        student.status || 'ACTIVE',
      ]);

      // 3. Gabungkan Semua Baris
      const sheetData = [...titleRow, ...subTitleRow, ...emptyRow, headers, ...dataRows];

      // 4. Buat Worksheet & Workbook
      const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

      // Set Lebar Kolom Otomatis
      worksheet['!cols'] = [
        { wch: 5 },  // No
        { wch: 15 }, // NISN
        { wch: 12 }, // NIS
        { wch: 28 }, // Nama Lengkap
        { wch: 6 },  // L/P
        { wch: 14 }, // Kelas
        { wch: 16 }, // Tempat Lahir
        { wch: 14 }, // Tgl Lahir
        { wch: 16 }, // No HP OrtU
        { wch: 30 }, // Alamat
        { wch: 12 }, // Status
      ];

      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Data Siswa');

      // 5. Download File Excel
      const dateStr = new Date().toISOString().split('T')[0];
      XLSX.writeFile(workbook, `Data_Siswa_Sekolah_${dateStr}.xlsx`);

      toast.success('Berhasil mengunduh data siswa!', { id: toastId });
    } catch (err) {
      toast.error('Gagal mengunduh file Excel.', { id: toastId });
    }
  };

  // Eksekutor Hapus dari Modal Custom
  const handleConfirmDelete = async () => {
    if (deleteModal.type === 'single' && deleteModal.targetId) {
      const toastId = toast.loading('Menghapus data...');
      try {
        await api.delete(`/students/students/${deleteModal.targetId}/`);
        toast.success(`Data siswa ${deleteModal.targetName} berhasil dihapus.`, { id: toastId });
        fetchData();
      } catch (err) {
        toast.error('Gagal menghapus data siswa.', { id: toastId });
      }
    } else if (deleteModal.type === 'bulk') {
      const toastId = toast.loading('Menghapus data siswa terpilih...');
      try {
        await api.post('/students/students/bulk-delete/', { ids: selectedIds });
        toast.success(`Berhasil menghapus ${selectedIds.length} data siswa.`, { id: toastId });
        setSelectedIds([]);
        fetchData();
      } catch (err) {
        toast.error('Gagal menghapus beberapa data siswa.', { id: toastId });
      }
    }

    setDeleteModal({ ...deleteModal, isOpen: false });
  };

  // const handleOpenDetailDrawer = (student: Student) => {
  //   setSelectedDetailStudent(student);
  //   setIsDrawerOpen(true);
  // };

  // Handler saat Drawer dibuka
  const handleOpenDetailDrawer = async (student: Student) => {
    setSelectedDetailStudent(student);
    setDrawerTab('profile'); // Default ke tab profil
    setIsDrawerOpen(true);

    // Fetch Ringkasan Absensi Siswa Ini
    setLoadingAttendance(true);
    try {
      // Panggilan API di Next.js sesuai endpoint detail DRF
    const res = await api.get(`/attendance/attendances/${student.id}/summary/`);
      setStudentAttendanceSummary(res.data);
    } catch (err) {
      // Handling error jika endpoint belum siap/kosong
      setStudentAttendanceSummary(null);
    } finally {
      setLoadingAttendance(false);
    }
  };

  const handleOpenModal = (student?: Student) => {
    if (student) {
      setEditingStudent(student);
      setFormData({
        nisn: student.nisn || '',
        nis: student.nis || '',
        full_name: student.full_name || '',
        gender: student.gender || 'L',
        student_class: student.student_class ? String(student.student_class) : '',
        birth_place: student.birth_place || '',
        birth_date: student.birth_date || '',
        address: student.address || '',
        parent_phone_number: student.parent_phone_number || '',
        status: student.status || 'ACTIVE',
      });
    } else {
      setEditingStudent(null);
      setFormData({
        nisn: '',
        nis: '',
        full_name: '',
        gender: 'L',
        student_class: '',
        birth_place: '',
        birth_date: '',
        address: '',
        parent_phone_number: '',
        status: 'ACTIVE',
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const payload = {
      ...formData,
      student_class: formData.student_class ? Number(formData.student_class) : null,
      birth_date: formData.birth_date || null,
    };

    const toastId = toast.loading(editingStudent ? 'Memperbarui data...' : 'Menambahkan data...');

    try {
      if (editingStudent) {
        await api.patch(`/students/students/${editingStudent.id}/`, payload);
        toast.success('Data siswa berhasil diperbarui!', { id: toastId });
      } else {
        await api.post('/students/students/', payload);
        toast.success('Siswa baru berhasil ditambahkan!', { id: toastId });
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp) {
        const firstKey = Object.keys(resp)[0];
        toast.error(`${firstKey}: ${JSON.stringify(resp[firstKey])}`, { id: toastId });
      } else {
        toast.error('Gagal menyimpan data siswa.', { id: toastId });
      }
    } finally {
      setSubmitting(false);
    }
  };



  const totalPages = Math.ceil(totalCount / pageSize);

  return (
    <div className="space-y-6 relative">
      {/* Header */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Manajemen Data Siswa</h1>
        <p className="text-slate-500 text-sm mt-1">Kelola data seluruh siswa aktif di sekolah Anda.</p>
      </div>
    <div className="flex items-center gap-2">
      {/* Tombol Import (Tema Purple / Violet) */}
      <button
        onClick={() => setIsImportModalOpen(true)}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-rose-600 hover:bg-rose-700 text-white font-medium rounded-lg transition shadow-sm text-sm"
      >
        <Upload className="w-4 h-4" />
        Import
      </button>

      {/* Tombol Export (Tema Emerald) */}
      <button
        onClick={handleExportExcel}
        className="flex items-center justify-center gap-2 px-3.5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition shadow-sm text-sm"
      >
        <Download className="w-4 h-4" />
        Export
      </button>

      {/* Tombol Tambah Siswa (Tema Blue) */}
      <button
        onClick={() => handleOpenModal()}
        className="flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition shadow-sm text-sm"
      >
        <Plus className="w-4 h-4" />
        Tambah Siswa
      </button>
    </div>
    </div>

      {/* Filter & Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <input
            type="text"
            placeholder="Cari NISN atau Nama Siswa..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1);
              setSelectedIds([]);
            }}
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
        </div>

        <select
          value={selectedClassFilter}
          onChange={(e) => {
            setSelectedClassFilter(e.target.value);
            setCurrentPage(1);
          }}
          className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="">Semua Kelas</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
      </div>

      {/* Tabel Data Siswa */}
      <div className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex items-center justify-center">
            <RefreshCw className="w-5 h-5 animate-spin mr-2 text-blue-600" />
            <span>Memuat data siswa dari server...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-8 text-center text-slate-500">Data siswa tidak ditemukan.</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                  <tr>
                    <th className="px-4 py-3.5 w-12 text-center">
                      <input
                        type="checkbox"
                        checked={selectedIds.length === students.length && students.length > 0}
                        onChange={handleSelectAll}
                        className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                      />
                    </th>
                    <th className="px-6 py-3.5">NISN / NIS</th>
                    <th className="px-6 py-3.5">Nama Lengkap</th>
                    <th className="px-6 py-3.5">L/P</th>
                    <th className="px-6 py-3.5">Kelas</th>
                    <th className="px-6 py-3.5">No. HP Orang Tua</th>
                    <th className="px-6 py-3.5 text-center">Aksi</th>
                    <th className="px-6 py-3.5 text-center">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                  {students.map((student) => {
                    const isSelected = selectedIds.includes(student.id);
                    return (
                      <tr
                        key={student.id}
                        className={`transition ${isSelected ? 'bg-blue-50/60' : 'hover:bg-slate-50'}`}
                      >
                        <td className="px-4 py-4 text-center">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(student.id)}
                            className="rounded border-slate-300 text-blue-600 focus:ring-blue-500 w-4 h-4 cursor-pointer"
                          />
                        </td>
                        <td className="px-6 py-4 font-mono text-slate-500">
                          <div>{student.nisn}</div>
                          {student.nis && <div className="text-xs text-slate-400">NIS: {student.nis}</div>}
                        </td>
                        <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
                        <td className="px-6 py-4">{student.gender}</td>
                        <td className="px-6 py-4">
                          <span className="px-2.5 py-1 bg-slate-100 rounded-md text-xs font-medium text-slate-700">
                            {student.class_name || 'Belum diatur'}
                          </span>
                        </td>
                        <td className="px-6 py-4">{student.parent_phone_number || '-'}</td>
                        <td className="px-6 py-4">
                          <div className="flex justify-center items-center gap-1">
                            <button
                              onClick={() => handleOpenDetailDrawer(student)}
                              className="p-1.5 text-slate-600 hover:bg-slate-100 rounded-lg transition"
                              title="Lihat Detail"
                            >
                              <Eye className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleOpenModal(student)}
                              className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Edit"
                            >
                              <Edit2 className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => triggerDeleteSingle(student.id, student.full_name)}
                              className="p-1.5 text-red-600 hover:bg-red-50 rounded-lg transition"
                              title="Hapus"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                            student.status === 'ACTIVE' ? 'bg-emerald-100 text-emerald-800' :
                            student.status === 'GRADUATED' ? 'bg-blue-100 text-blue-800' :
                            student.status === 'TRANSFERRED' ? 'bg-amber-100 text-amber-800' :
                            'bg-rose-100 text-rose-800'
                          }`}>
                            {student.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Pagination Controls */}
            <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-sm text-slate-600">
              <div>
                Menampilkan <strong>{students.length}</strong> dari <strong>{totalCount}</strong> siswa
              </div>
              <div className="flex items-center gap-2">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <span className="text-xs font-semibold px-3 py-1 bg-white border border-slate-200 rounded-lg">
                  Halaman {currentPage} dari {totalPages || 1}
                </span>
                <button
                  disabled={currentPage >= totalPages}
                  onClick={() => setCurrentPage((prev) => prev + 1)}
                  className="p-2 border border-slate-300 rounded-lg hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Floating Action Bar Hapus Massal */}
      {selectedIds.length > 0 && (
        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-6 py-3 rounded-full shadow-2xl flex items-center gap-4 z-40 border border-slate-700 animate-in fade-in slide-in-from-bottom-3">
          <div className="flex items-center gap-2 text-sm">
            <CheckSquare className="w-4 h-4 text-blue-400" />
            <span><strong>{selectedIds.length}</strong> siswa terpilih</span>
          </div>
          <div className="h-4 w-px bg-slate-700" />

          {/* Tombol Atur Kelas Massal */}
          <button
            onClick={() => setIsBulkClassModalOpen(true)}
            className="flex items-center gap-1.5 text-xs font-bold text-blue-400 hover:text-blue-300 transition"
          >
            <BookOpen className="w-4 h-4" /> Atur Kelas
          </button>

          <div className="h-4 w-px bg-slate-700" />
          {/* tombol hapus massal */}
          <button
            onClick={triggerDeleteBulk}
            className="flex items-center gap-1.5 text-xs font-bold text-red-400 hover:text-red-300 transition"
          >
            <Trash2 className="w-4 h-4" /> Hapus Terpilih
          </button>
        </div>
      )}

      {/* Drawer Detail Siswa
      {isDrawerOpen && selectedDetailStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Profil Detail Siswa</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-2xl font-bold">
                    {selectedDetailStudent.full_name.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-slate-900">{selectedDetailStudent.full_name}</h3>
                    <p className="text-xs text-slate-500 font-mono">NISN: {selectedDetailStudent.nisn}</p>
                    <span className="inline-block mt-1 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
                      Status: {selectedDetailStudent.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 text-sm text-slate-600 pt-2">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <BookOpen className="w-4 h-4 text-blue-600" />
                    <span>Kelas: <strong>{selectedDetailStudent.class_name || 'Belum diatur'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Jenis Kelamin: <strong>{selectedDetailStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Tempat, Tgl Lahir: <strong>{selectedDetailStudent.birth_place || '-'}, {selectedDetailStudent.birth_date || '-'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>HP Orang Tua: <strong>{selectedDetailStudent.parent_phone_number || '-'}</strong></span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Alamat: <strong>{selectedDetailStudent.address || '-'}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleOpenModal(selectedDetailStudent);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition flex items-center justify-center gap-2"
              >
                <Edit2 className="w-4 h-4" /> Edit Data Siswa Ini
              </button>
            </div>
          </div>
        </div>
      )} */}

      {/* Drawer Detail Siswa */}
      {isDrawerOpen && selectedDetailStudent && (
        <div className="fixed inset-0 bg-black/40 z-50 flex justify-end animate-in fade-in">
          <div className="bg-white w-full max-w-lg h-full shadow-2xl p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              {/* Header Drawer */}
              <div className="flex justify-between items-center pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">Detail & Track Record Siswa</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="text-slate-400 hover:text-slate-600">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Header Profil Ringkas */}
              <div className="mt-4 flex items-center gap-4 bg-slate-50 p-3.5 rounded-xl border border-slate-100">
                <div className="w-12 h-12 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xl font-bold">
                  {selectedDetailStudent.full_name.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-slate-900">{selectedDetailStudent.full_name}</h3>
                  <p className="text-xs text-slate-500 font-mono">NISN: {selectedDetailStudent.nisn} | Kelas: {selectedDetailStudent.class_name || '-'}</p>
                </div>
              </div>

              {/* TAB BUTTONS */}
              <div className="flex border-b border-slate-200 mt-5">
                <button
                  onClick={() => setDrawerTab('profile')}
                  className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition ${
                    drawerTab === 'profile'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Biodata Lengkap
                </button>
                <button
                  onClick={() => setDrawerTab('attendance')}
                  className={`pb-2.5 px-4 text-sm font-semibold border-b-2 transition ${
                    drawerTab === 'attendance'
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Riwayat Presensi
                </button>
              </div>

              {/* CONTENT TAB 1: BIODATA */}
              {drawerTab === 'profile' && (
                <div className="mt-5 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <User className="w-4 h-4 text-blue-600" />
                    <span>Jenis Kelamin: <strong>{selectedDetailStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <Calendar className="w-4 h-4 text-blue-600" />
                    <span>Tempat, Tgl Lahir: <strong>{selectedDetailStudent.birth_place || '-'}, {selectedDetailStudent.birth_date || '-'}</strong></span>
                  </div>
                  <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <Phone className="w-4 h-4 text-blue-600" />
                    <span>HP Orang Tua: <strong>{selectedDetailStudent.parent_phone_number || '-'}</strong></span>
                  </div>
                  <div className="flex items-start gap-3 p-3 bg-slate-50 rounded-lg border border-slate-100">
                    <MapPin className="w-4 h-4 text-blue-600 mt-0.5" />
                    <span>Alamat: <strong>{selectedDetailStudent.address || '-'}</strong></span>
                  </div>
                </div>
              )}

              {/* CONTENT TAB 2: RIWAYAT PRESENSI */}
              {drawerTab === 'attendance' && (
                <div className="mt-5 space-y-4">
                  {loadingAttendance ? (
                    <div className="p-8 text-center text-slate-400 text-sm flex items-center justify-center">
                      <RefreshCw className="w-4 h-4 animate-spin mr-2" /> Memuat data presensi...
                    </div>
                  ) : studentAttendanceSummary ? (
                    <>
                      {/* Stats Card Ringkasan Presensi */}
                      <div className="grid grid-cols-4 gap-2 text-center">
                        <div className="p-2.5 bg-emerald-50 border border-emerald-100 rounded-xl">
                          <div className="text-lg font-bold text-emerald-700">
                            {studentAttendanceSummary.summary.HADIR || 0}
                          </div>
                          <div className="text-[10px] font-medium text-emerald-600">Hadir</div>
                        </div>

                        <div className="p-2.5 bg-blue-50 border border-blue-100 rounded-xl">
                          <div className="text-lg font-bold text-blue-700">
                            {studentAttendanceSummary.summary.IZIN || 0}
                          </div>
                          <div className="text-[10px] font-medium text-blue-600">Izin</div>
                        </div>

                        <div className="p-2.5 bg-amber-50 border border-amber-100 rounded-xl">
                          <div className="text-lg font-bold text-amber-700">
                            {studentAttendanceSummary.summary.SAKIT || 0}
                          </div>
                          <div className="text-[10px] font-medium text-amber-600">Sakit</div>
                        </div>

                        <div className="p-2.5 bg-rose-50 border border-rose-100 rounded-xl">
                          <div className="text-lg font-bold text-rose-700">
                            {studentAttendanceSummary.summary.ALPA || 0}
                          </div>
                          <div className="text-[10px] font-medium text-rose-600">Alpa</div>
                        </div>
                      </div>

                      {/* Tabel Log Presensi Terakhir */}
                      <div>
                        <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">10 Log Kehadiran Terakhir</h4>
                        <div className="border border-slate-100 rounded-xl overflow-hidden divide-y divide-slate-100 text-xs">
                          {studentAttendanceSummary.recent_logs.length === 0 ? (
                            <div className="p-4 text-center text-slate-400">Belum ada catatan presensi.</div>
                          ) : (
                            studentAttendanceSummary.recent_logs.map((log, index) => (
                              <div key={index} className="p-3 flex items-center justify-between hover:bg-slate-50">
                                <div>
                                  <span className="font-semibold text-slate-700 block">{log.date}</span>
                                  {log.notes && <span className="text-[11px] text-slate-400">{log.notes}</span>}
                                </div>
                                <span
                                  className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                                    log.status === 'HADIR' ? 'bg-emerald-100 text-emerald-800' :
                                    log.status === 'IZIN'  ? 'bg-blue-100 text-blue-800' :
                                    log.status === 'SAKIT' ? 'bg-amber-100 text-amber-800' :
                                    'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {log.status}
                                </span>
                              </div>
                            ))
                          )}
                        </div>
                      </div>
                    </>
                  ) : (
                    <div className="p-6 text-center text-slate-400 text-sm bg-slate-50 rounded-xl border border-slate-100">
                      Fitur absensi belum terhubung atau siswa ini belum memiliki riwayat presensi.
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Footer Drawer */}
            <div className="pt-6 border-t border-slate-100">
              <button
                onClick={() => {
                  setIsDrawerOpen(false);
                  handleOpenModal(selectedDetailStudent);
                }}
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl transition flex items-center justify-center gap-2 text-sm shadow-sm"
              >
                <Edit2 className="w-4 h-4" /> Edit Data Siswa Ini
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Form Create & Edit */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl shadow-xl max-w-lg w-full p-6 border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-slate-800">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NISN *</label>
                  <input
                    type="text"
                    required
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">NIS</label>
                  <input
                    type="text"
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Jenis Kelamin *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Kelas</label>
                  <select
                    value={formData.student_class}
                    onChange={(e) => setFormData({ ...formData, student_class: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">-- Pilih Kelas --</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tempat Lahir</label>
                  <input
                    type="text"
                    value={formData.birth_place}
                    onChange={(e) => setFormData({ ...formData, birth_place: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Lahir</label>
                  <input
                    type="date"
                    value={formData.birth_date}
                    onChange={(e) => setFormData({ ...formData, birth_date: e.target.value })}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">No. HP Orang Tua</label>
                <input
                  type="text"
                  value={formData.parent_phone_number}
                  onChange={(e) => setFormData({ ...formData, parent_phone_number: e.target.value })}
                  placeholder="081234567890"
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">Alamat Lengkap</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex gap-3 pt-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-lg"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  {submitting ? 'Menyimpan...' : 'Simpan Data'}
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

            <h3 className="text-xl font-bold text-slate-800">Konfirmasi Hapus</h3>
            <p className="text-slate-500 text-sm mt-2">
              {deleteModal.type === 'single' ? (
                <>
                  Apakah Anda yakin ingin menghapus data siswa{' '}
                  <strong className="text-slate-800">{deleteModal.targetName}</strong>?
                </>
              ) : (
                <>
                  Apakah Anda yakin ingin menghapus <strong className="text-slate-800">{selectedIds.length} siswa</strong> terpilih?
                </>
              )}
            </p>
            <p className="text-xs text-red-500 mt-1 font-medium">Tindakan ini tidak dapat dibatalkan.</p>

            <div className="flex gap-3 mt-6">
              <button
                type="button"
                onClick={() => setDeleteModal({ ...deleteModal, isOpen: false })}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition text-sm"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="w-1/2 py-2.5 bg-red-600 hover:bg-red-700 text-white font-medium rounded-xl transition shadow-sm text-sm"
              >
                Ya, Hapus
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Custom Bulk Assign Class */}
      {isBulkClassModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Atur Kelas Siswa Massal</h3>
              <button onClick={() => setIsBulkClassModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-3">
              <p className="text-sm text-slate-600">
                Pilih kelas tujuan untuk <strong className="text-slate-800">{selectedIds.length} siswa</strong> yang terpilih:
              </p>

              <select
                value={selectedBulkClassId}
                onChange={(e) => setSelectedBulkClassId(e.target.value)}
                className="w-full px-3 py-2.5 border border-slate-300 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">-- Pilih Kelas Tujuan --</option>
                {classes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex gap-3 pt-3 border-t border-slate-100">
              <button
                type="button"
                onClick={() => setIsBulkClassModalOpen(false)}
                className="w-1/2 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition"
              >
                Batal
              </button>
              <button
                type="button"
                disabled={bulkAssigning || !selectedBulkClassId}
                onClick={handleConfirmBulkAssignClass}
                className="w-1/2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm transition disabled:opacity-50 shadow-sm"
              >
                {bulkAssigning ? 'Memproses...' : 'Simpan Kelas'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Upload Excel */}
      {isImportModalOpen && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-100">
            <div className="flex justify-between items-center pb-3 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-800">Import Data Siswa</h3>
              <button onClick={() => setIsImportModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="my-5 space-y-4">
              <div className="p-4 bg-blue-50 border border-blue-100 rounded-xl flex items-start gap-3">
                <FileSpreadsheet className="w-6 h-6 text-blue-600 mt-0.5 shrink-0" />
                <div className="text-xs text-blue-900 leading-relaxed">
                  Unduh template Excel terlebih dahulu agar format kolom sesuai dengan sistem.
                  <button
                    onClick={handleDownloadTemplate}
                    className="block mt-2 font-bold text-blue-700 hover:underline flex items-center gap-1"
                  >
                    <Download className="w-3.5 h-3.5" /> Download Template (.xlsx)
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-2">
                  Pilih File Excel (.xlsx / .csv)
                </label>
                <input
                  type="file"
                  accept=".xlsx, .xls, .csv"
                  disabled={importing}
                  onChange={handleFileUpload}
                  className="w-full text-sm text-slate-500 file:mr-4 file:py-2.5 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 cursor-pointer border border-slate-200 rounded-xl p-1"
                />
              </div>
            </div>

            <div className="pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setIsImportModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}