// 'use client';

// import { useState, useEffect, useMemo } from 'react';
// import { api } from '@/lib/api';
// import { 
//   Save, RefreshCw, Layers, FileSpreadsheet, 
//   Lock, Unlock, Edit3, CheckCircle2, Zap, TrendingUp, Award, AlertCircle
// } from 'lucide-react';
// import toast from 'react-hot-toast';
// import XLSX from 'xlsx-js-style';

// interface StudentClass {
//   id: number;
//   name: string;
// }

// interface Subject {
//   id: number;
//   name: string;
//   code?: string;
// }

// interface Student {
//   id: number;
//   nisn: string;
//   full_name?: string;
// }

// interface AssessmentItem {
//   id: number;
//   title: string;
//   category: string;
//   date: string;
//   subject: number;
//   student_class: number;
//   grades: {
//     student_id: number;
//     score: number;
//     notes?: string;
//   }[];
// }

// export default function GradesPage() {
//   const [activeTab, setActiveTab] = useState<'input' | 'summary'>('input');

//   // Master Data
//   const [classes, setClasses] = useState<StudentClass[]>([]);
//   const [subjects, setSubjects] = useState<Subject[]>([]);
//   const [selectedClass, setSelectedClass] = useState<string>('');
//   const [selectedSubject, setSelectedSubject] = useState<string>('');

//   // Form Input State
//   const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('NEW');
//   const [assessmentTitle, setAssessmentTitle] = useState('Ulangan Harian 1');
//   const [assessmentCategory, setAssessmentCategory] = useState('DAILY_EXAM');
//   const [assessmentDate, setAssessmentDate] = useState('');

//   // Locking & Editing State
//   const [isLocked, setIsLocked] = useState(false);

//   // Data State
//   const [students, setStudents] = useState<Student[]>([]);
//   const [studentScores, setStudentScores] = useState<Record<number, number>>({});
//   const [assessmentsHistory, setAssessmentsHistory] = useState<AssessmentItem[]>([]);

//   // Loading States
//   const [loadingMaster, setLoadingMaster] = useState(true);
//   const [loadingStudents, setLoadingStudents] = useState(false);
//   const [submitting, setSubmitting] = useState(false);

//   // 1. Initial Load Master Data
//   useEffect(() => {
//     const fetchMasterData = async () => {
//       try {
//         const [resClasses, resSubjects] = await Promise.all([
//           api.get('/students/classes/'),
//           api.get('/academics/subjects/'),
//         ]);

//         const classList = resClasses.data.results || resClasses.data;
//         const subjectList = resSubjects.data.results || resSubjects.data;

//         setClasses(classList);
//         setSubjects(subjectList);

//         if (classList.length > 0) setSelectedClass(String(classList[0].id));
//         if (subjectList.length > 0) setSelectedSubject(String(subjectList[0].id));

//         setAssessmentDate(new Date().toISOString().split('T')[0]);
//       } catch (err) {
//         toast.error('Gagal memuat master data kelas/mapel');
//       } finally {
//         setLoadingMaster(false);
//       }
//     };

//     fetchMasterData();
//   }, []);

//   // 2. Fetch Siswa & Assessment History saat Kelas / Mapel Berubah
//   useEffect(() => {
//     if (!selectedClass || !selectedSubject) return;

//     const fetchData = async () => {
//       setLoadingStudents(true);
//       try {
//         const resStudents = await api.get(`/students/students/?class_id=${selectedClass}`);
//         const studentList: Student[] = resStudents.data.results || resStudents.data;
//         setStudents(studentList);

//         const resAssessments = await api.get(
//           `/grades/assessments/?class_id=${selectedClass}&subject_id=${selectedSubject}`
//         );
//         const history: AssessmentItem[] = resAssessments.data.results || resAssessments.data;
//         setAssessmentsHistory(history);

//         // Reset Form ke Ujian Baru
//         setSelectedAssessmentId('NEW');
//         setAssessmentTitle(`Ulangan Harian ${history.length + 1}`);
//         setIsLocked(false);

//         const initialScores: Record<number, number> = {};
//         studentList.forEach((s) => {
//           initialScores[s.id] = 80;
//         });
//         setStudentScores(initialScores);
//       } catch (err) {
//         toast.error('Gagal memuat data siswa/nilai');
//       } finally {
//         setLoadingStudents(false);
//       }
//     };

//     fetchData();
//   }, [selectedClass, selectedSubject]);

//   // 3. Handler saat Memilih Ujian Eksisting dari Dropdown / Pilih Ujian Baru
//   const handleSelectAssessment = (id: string) => {
//     setSelectedAssessmentId(id);
//     if (id === 'NEW') {
//       setAssessmentTitle(`Ulangan Harian ${assessmentsHistory.length + 1}`);
//       setAssessmentCategory('DAILY_EXAM');
//       setIsLocked(false);
//       // Reset default scores
//       const initialScores: Record<number, number> = {};
//       students.forEach((s) => {
//         initialScores[s.id] = 80;
//       });
//       setStudentScores(initialScores);
//     } else {
//       const selected = assessmentsHistory.find((a) => String(a.id) === id);
//       if (selected) {
//         setAssessmentTitle(selected.title);
//         setAssessmentCategory(selected.category);
//         setAssessmentDate(selected.date);
//         setIsLocked(true); // OOTOMATIS DIKUNCI JIKA DATA SUDAH ADA

//         // Map Nilai Siswa
//         const scoreMap: Record<number, number> = {};
//         students.forEach((s) => {
//           const found = selected.grades?.find((g) => g.student_id === s.id);
//           scoreMap[s.id] = found ? Number(found.score) : 0;
//         });
//         setStudentScores(scoreMap);
//       }
//     }
//   };

//   const handleScoreChange = (studentId: number, value: number) => {
//     if (isLocked) return;
//     const safeVal = Math.min(100, Math.max(0, value || 0));
//     setStudentScores((prev) => ({ ...prev, [studentId]: safeVal }));
//   };

//   // Preset Fast Input
//   const handlePresetAll = (score: number) => {
//     if (isLocked) return;
//     const updated: Record<number, number> = {};
//     students.forEach((s) => {
//       updated[s.id] = score;
//     });
//     setStudentScores(updated);
//     toast.success(`Seluruh nilai diset ke ${score}`);
//   };

//   // Computed Live Stats
//   const liveStats = useMemo(() => {
//     const scores = Object.values(studentScores);
//     if (scores.length === 0) return { avg: 0, max: 0, min: 0 };
//     const sum = scores.reduce((a, b) => a + b, 0);
//     return {
//       avg: Math.round((sum / scores.length) * 10) / 10,
//       max: Math.max(...scores),
//       min: Math.min(...scores),
//     };
//   }, [studentScores]);

//   // Submit Bulk Create / Update
//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
//     if (!selectedClass || !selectedSubject || isLocked) return;

//     setSubmitting(true);
//     const formattedGrades = Object.entries(studentScores).map(([studentId, score]) => ({
//       student_id: Number(studentId),
//       score: Number(score),
//     }));

//     const payload = {
//       class_id: Number(selectedClass),
//       subject_id: Number(selectedSubject),
//       title: assessmentTitle,
//       category: assessmentCategory,
//       date: assessmentDate,
//       grades: formattedGrades,
//     };

//     try {
//       await api.post('/grades/assessments/bulk-create/', payload);
//       toast.success('Nilai ujian berhasil disimpan!');
//       setIsLocked(true); // Otomatis Kunci Setelah Simpan Berhasil!

//       // Refresh Assessment History
//       const resAssessments = await api.get(
//         `/grades/assessments/?class_id=${selectedClass}&subject_id=${selectedSubject}`
//       );
//       setAssessmentsHistory(resAssessments.data.results || resAssessments.data);
//     } catch (err: any) {
//       toast.error('Gagal menyimpan nilai ujian');
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Export Excel
//   const handleExportExcel = () => {
//     if (students.length === 0 || assessmentsHistory.length === 0) {
//       toast.error('Tidak ada data nilai untuk diexport.');
//       return;
//     }

//     const className = classes.find((c) => String(c.id) === selectedClass)?.name || 'Kelas';
//     const subjectName = subjects.find((s) => String(s.id) === selectedSubject)?.name || 'Mapel';

//     const titleRow = [[`REKAPITULASI NILAI - KELAS ${className.toUpperCase()}`]];
//     const subTitleRow = [[`MATA PELAJARAN: ${subjectName.toUpperCase()}`]];
//     const emptyRow = [[]];

//     const dynamicHeaders = assessmentsHistory.map((a) => a.title);
//     const headers = ['No', 'NISN', 'Nama Siswa', ...dynamicHeaders, 'Rata-Rata'];

//     const dataRows = students.map((student, idx) => {
//       const scores = assessmentsHistory.map((a) => {
//         const found = a.grades?.find((g) => g.student_id === student.id);
//         return found ? Number(found.score) : 0;
//       });

//       const avg =
//         scores.length > 0
//           ? Math.round((scores.reduce((acc, curr) => acc + curr, 0) / scores.length) * 10) / 10
//           : 0;

//       return [idx + 1, student.nisn || '-', student.full_name || 'Tanpa Nama', ...scores, avg];
//     });

//     const sheetData = [...titleRow, ...subTitleRow, ...emptyRow, headers, ...dataRows];
//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     const borderThin = {
//       top: { style: 'thin', color: { rgb: 'E2E8F0' } },
//       bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
//       left: { style: 'thin', color: { rgb: 'E2E8F0' } },
//       right: { style: 'thin', color: { rgb: 'E2E8F0' } },
//     };

//     const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellAddress = XLSX.utils.encode_cell({ r: 3, c: C });
//       if (!worksheet[cellAddress]) continue;
//       worksheet[cellAddress].s = {
//         font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
//         fill: { fgColor: { rgb: C === range.e.c ? '0F766E' : '1E293B' } },
//         alignment: { horizontal: 'center', vertical: 'center' },
//         border: borderThin,
//       };
//     }

//     for (let R = 4; R <= range.e.r; ++R) {
//       for (let C = 0; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         const cell = worksheet[cellAddress];
//         if (!cell) continue;

//         let cellStyle: any = {
//           alignment: { horizontal: C === 2 ? 'left' : 'center', vertical: 'center' },
//           border: borderThin,
//           font: { sz: 10 },
//         };

//         if (C === range.e.c) {
//           const val = Number(cell.v || 0);
//           if (val >= 85) {
//             cellStyle.fill = { fgColor: { rgb: 'DCFCE7' } };
//             cellStyle.font = { bold: true, color: { rgb: '15803D' } };
//           } else if (val < 75) {
//             cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } };
//             cellStyle.font = { bold: true, color: { rgb: 'B91C1C' } };
//           } else {
//             cellStyle.font = { bold: true };
//           }
//         }

//         cell.s = cellStyle;
//       }
//     }

//     worksheet['!cols'] = [
//       { wch: 4 },
//       { wch: 14 },
//       { wch: 28 },
//       ...assessmentsHistory.map(() => ({ wch: 16 })),
//       { wch: 12 },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Nilai');
//     XLSX.writeFile(workbook, `Rekap_Nilai_${className}_${subjectName}.xlsx`);

//     toast.success('Berhasil mengunduh Rekap Nilai Excel Berwarna!');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header Page */}
//       <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Manajemen Nilai & Ujian</h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Input nilai harian, UTS, dan UAS secara transparan tanpa batasan jumlah ujian.
//           </p>
//         </div>

//         {/* Tab Switcher */}
//         <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
//           <button
//             onClick={() => setActiveTab('input')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === 'input'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <Save className="w-4 h-4" />
//             Input Ujian Harian
//           </button>
//           <button
//             onClick={() => setActiveTab('summary')}
//             className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
//               activeTab === 'summary'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <Layers className="w-4 h-4" />
//             Matriks Rekap Rapor
//           </button>
//         </div>
//       </div>

//       {/* Filter Header Kelas & Mapel */}
//       <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
//           <select
//             value={selectedClass}
//             onChange={(e) => setSelectedClass(e.target.value)}
//             disabled={loadingMaster}
//             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//           >
//             {classes.map((c) => (
//               <option key={c.id} value={c.id}>
//                 {c.name}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div>
//           <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
//           <select
//             value={selectedSubject}
//             onChange={(e) => setSelectedSubject(e.target.value)}
//             disabled={loadingMaster}
//             className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
//           >
//             {subjects.map((s) => (
//               <option key={s.id} value={s.id}>
//                 {s.name} {s.code ? `(${s.code})` : ''}
//               </option>
//             ))}
//           </select>
//         </div>
//       </div>

//       {/* TAB 1: INPUT UJIAN HARIAN */}
//       {activeTab === 'input' && (
//         <div className="space-y-4">
//           {/* Selector Pelaksanaan Ujian / Tambah Baru */}
//           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="flex items-center gap-3 w-full md:w-auto">
//               <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Pilih Ujian:</span>
//               <select
//                 value={selectedAssessmentId}
//                 onChange={(e) => handleSelectAssessment(e.target.value)}
//                 className="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
//               >
//                 <option value="NEW">+ Buat Pelaksanaan Ujian Baru</option>
//                 {assessmentsHistory.map((a) => (
//                   <option key={a.id} value={a.id}>
//                     {a.title} ({a.date})
//                   </option>
//                 ))}
//               </select>
//             </div>

//             {/* Indicator Status Lock / Unlock & Mode Edit Action */}
//             <div className="flex items-center gap-3 w-full md:w-auto justify-end">
//               {isLocked ? (
//                 <div className="flex items-center gap-3">
//                   <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
//                     <Lock className="w-3.5 h-3.5 text-slate-500" />
//                     Data Terkunci (Read-Only)
//                   </span>
//                   <button
//                     type="button"
//                     onClick={() => setIsLocked(false)}
//                     className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm"
//                   >
//                     <Edit3 className="w-3.5 h-3.5" />
//                     Buka Kunci untuk Edit
//                   </button>
//                 </div>
//               ) : (
//                 <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
//                   <Unlock className="w-3.5 h-3.5 text-emerald-600" />
//                   Mode Input / Edit Aktif
//                 </span>
//               )}
//             </div>
//           </div>

//           {/* Form Core */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <form onSubmit={handleSubmit}>
//               {/* Meta Informasi Ujian */}
//               <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-4">
//                 <div>
//                   <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
//                     Judul Ujian / Tugas
//                   </label>
//                   <input
//                     type="text"
//                     value={assessmentTitle}
//                     onChange={(e) => setAssessmentTitle(e.target.value)}
//                     disabled={isLocked}
//                     placeholder="Contoh: UH 1 Trigonometri"
//                     required
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
//                   />
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
//                     Kategori
//                   </label>
//                   <select
//                     value={assessmentCategory}
//                     onChange={(e) => setAssessmentCategory(e.target.value)}
//                     disabled={isLocked}
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
//                   >
//                     <option value="ASSIGNMENT">Tugas / PR / Kuis</option>
//                     <option value="DAILY_EXAM">Ulangan Harian</option>
//                     <option value="UTS">Ujian Tengah Semester (UTS)</option>
//                     <option value="UAS">Ujian Akhir Semester (UAS)</option>
//                   </select>
//                 </div>

//                 <div>
//                   <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
//                     Tanggal Execution
//                   </label>
//                   <input
//                     type="date"
//                     value={assessmentDate}
//                     onChange={(e) => setAssessmentDate(e.target.value)}
//                     disabled={isLocked}
//                     required
//                     className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
//                   />
//                 </div>
//               </div>

//               {/* Toolbar Quick Preset & Live Stats */}
//               <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
//                 {/* Live Stats */}
//                 <div className="flex items-center gap-6 text-xs text-slate-600">
//                   <div className="flex items-center gap-1.5">
//                     <TrendingUp className="w-4 h-4 text-blue-600" />
//                     <span>Rata-Rata: <strong className="text-slate-800 text-sm">{liveStats.avg}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <Award className="w-4 h-4 text-emerald-600" />
//                     <span>Tertinggi: <strong className="text-slate-800 text-sm">{liveStats.max}</strong></span>
//                   </div>
//                   <div className="flex items-center gap-1.5">
//                     <AlertCircle className="w-4 h-4 text-red-500" />
//                     <span>Terendah: <strong className="text-slate-800 text-sm">{liveStats.min}</strong></span>
//                   </div>
//                 </div>

//                 {/* Preset Fast Actions */}
//                 {!isLocked && (
//                   <div className="flex items-center gap-2">
//                     <span className="text-xs font-medium text-slate-500">Quick Fill:</span>
//                     <button
//                       type="button"
//                       onClick={() => handlePresetAll(80)}
//                       className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
//                     >
//                       Set Semua 80
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handlePresetAll(75)}
//                       className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
//                     >
//                       Set KKM (75)
//                     </button>
//                     <button
//                       type="button"
//                       onClick={() => handlePresetAll(100)}
//                       className="px-2.5 py-1 bg-emerald-50 hover:bg-emerald-100 text-emerald-700 text-xs font-medium rounded-md transition"
//                     >
//                       Set Semua 100
//                     </button>
//                   </div>
//                 )}
//               </div>

//               {/* Table Input Nilai Siswa */}
//               {loadingStudents ? (
//                 <div className="flex items-center justify-center p-12">
//                   <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
//                   <span className="ml-2 text-sm text-slate-600">Memuat data siswa...</span>
//                 </div>
//               ) : (
//                 <div className="overflow-x-auto">
//                   <table className="w-full text-left border-collapse">
//                     <thead>
//                       <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
//                         <th className="px-6 py-3.5">NISN</th>
//                         <th className="px-6 py-3.5">Nama Siswa</th>
//                         <th className="px-6 py-3.5 text-center w-40">Nilai (0-100)</th>
//                         <th className="px-6 py-3.5 text-center w-32">Status KKM</th>
//                       </tr>
//                     </thead>
//                     <tbody className="divide-y divide-slate-100 text-sm">
//                       {students.map((student) => {
//                         const score = studentScores[student.id] ?? 0;
//                         const isPassing = score >= 75;

//                         return (
//                           <tr key={student.id} className="hover:bg-slate-50">
//                             <td className="px-6 py-4 font-mono text-slate-500">{student.nisn || '-'}</td>
//                             <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
//                             <td className="px-6 py-4">
//                               <input
//                                 type="number"
//                                 min="0"
//                                 max="100"
//                                 value={score}
//                                 disabled={isLocked}
//                                 onChange={(e) => handleScoreChange(student.id, Number(e.target.value))}
//                                 className="w-full px-3 py-1.5 text-center font-semibold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
//                               />
//                             </td>
//                             <td className="px-6 py-4 text-center">
//                               <span
//                                 className={`px-2.5 py-1 rounded-md text-xs font-bold ${
//                                   isPassing
//                                     ? 'bg-emerald-100 text-emerald-800'
//                                     : 'bg-red-100 text-red-800'
//                                 }`}
//                               >
//                                 {isPassing ? 'Tuntas' : 'Remedial'}
//                               </span>
//                             </td>
//                           </tr>
//                         );
//                       })}
//                     </tbody>
//                   </table>
//                 </div>
//               )}

//               {/* Submit Action Bar */}
//               <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
//                 <button
//                   type="submit"
//                   disabled={submitting || isLocked}
//                   className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
//                 >
//                   <Save className="w-5 h-5" />
//                   {submitting ? 'Menyimpan...' : 'Simpan Nilai Ujian'}
//                 </button>
//               </div>
//             </form>
//           </div>
//         </div>
//       )}

//       {/* TAB 2: MATRIKS REKAP RAPOR */}
//       {activeTab === 'summary' && (
//         <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//           <div className="p-5 border-b border-slate-200 flex items-center justify-between">
//             <div>
//               <h2 className="font-semibold text-slate-800">Matriks Rekapitulasi Ujian</h2>
//               <p className="text-xs text-slate-500 mt-0.5">
//                 Total {assessmentsHistory.length} pelaksanaan ujian tercatat di kelas ini.
//               </p>
//             </div>

//             <button
//               onClick={handleExportExcel}
//               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
//             >
//               <FileSpreadsheet className="w-4 h-4" />
//               Export Excel Berwarna
//             </button>
//           </div>

//           <div className="overflow-x-auto">
//             <table className="w-full text-left border-collapse text-sm">
//               <thead>
//                 <tr className="bg-slate-800 text-white text-xs uppercase font-semibold">
//                   <th className="px-4 py-3">No</th>
//                   <th className="px-4 py-3">NISN</th>
//                   <th className="px-6 py-3">Nama Siswa</th>
//                   {assessmentsHistory.map((a) => (
//                     <th key={a.id} className="px-4 py-3 text-center min-w-[120px]">
//                       {a.title}
//                     </th>
//                   ))}
//                   <th className="px-6 py-3 text-center bg-teal-700">Rata-Rata</th>
//                 </tr>
//               </thead>
//               <tbody className="divide-y divide-slate-100">
//                 {students.map((student, idx) => {
//                   const scores = assessmentsHistory.map((a) => {
//                     const found = a.grades?.find((g) => g.student_id === student.id);
//                     return found ? Number(found.score) : 0;
//                   });

//                   const avg =
//                     scores.length > 0
//                       ? Math.round(
//                           (scores.reduce((acc, curr) => acc + curr, 0) / scores.length) * 10
//                         ) / 10
//                       : 0;

//                   return (
//                     <tr key={student.id} className="hover:bg-slate-50">
//                       <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
//                       <td className="px-4 py-3 font-mono text-slate-500">{student.nisn || '-'}</td>
//                       <td className="px-6 py-3 font-medium text-slate-900">{student.full_name}</td>
//                       {scores.map((s, scoreIdx) => (
//                         <td key={scoreIdx} className="px-4 py-3 text-center font-medium text-slate-700">
//                           {s}
//                         </td>
//                       ))}
//                       <td className="px-6 py-3 text-center font-bold bg-slate-50">
//                         <span
//                           className={`px-2.5 py-1 rounded-md text-xs ${
//                             avg >= 85
//                               ? 'bg-emerald-100 text-emerald-800'
//                               : avg < 75
//                               ? 'bg-red-100 text-red-800'
//                               : 'bg-slate-200 text-slate-800'
//                           }`}
//                         >
//                           {avg}
//                         </span>
//                       </td>
//                     </tr>
//                   );
//                 })}
//               </tbody>
//             </table>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// }











'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import { 
  Save, RefreshCw, Layers, FileSpreadsheet, 
  Lock, Unlock, Edit3, TrendingUp, Award, AlertCircle,
  FileText, Filter, X
} from 'lucide-react';
import toast from 'react-hot-toast';
import XLSX from 'xlsx-js-style';

interface StudentClass {
  id: number;
  name: string;
}

interface Subject {
  id: number;
  name: string;
  code?: string;
}

interface Student {
  id: number;
  nisn: string;
  full_name?: string;
}

interface AssessmentItem {
  id: number;
  title: string;
  category: string;
  date: string;
  subject: number;
  student_class: number;
  grades: {
    student_id: number;
    score: number;
    notes?: string;
  }[];
}

export default function GradesPage() {
  const [activeTab, setActiveTab] = useState<'input' | 'summary'>('input');

  // Master Data
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [selectedClass, setSelectedClass] = useState<string>('');
  const [selectedSubject, setSelectedSubject] = useState<string>('');
  const [dynamicKKM, setDynamicKKM] = useState<number>(75);

  // Form Input State
  const [selectedAssessmentId, setSelectedAssessmentId] = useState<string>('NEW');
  const [assessmentTitle, setAssessmentTitle] = useState('Ulangan Harian 1');
  const [assessmentCategory, setAssessmentCategory] = useState('DAILY_EXAM');
  const [assessmentDate, setAssessmentDate] = useState('');

  // Locking & Filter State
  const [isLocked, setIsLocked] = useState(false);
  const [showOnlyRemedial, setShowOnlyRemedial] = useState(false);

  // Notes Modal State
  const [activeNoteStudent, setActiveNoteStudent] = useState<Student | null>(null);

  // Data State
  const [students, setStudents] = useState<Student[]>([]);
  const [studentScores, setStudentScores] = useState<Record<number, number>>({});
  const [studentNotes, setStudentNotes] = useState<Record<number, string>>({});
  const [assessmentsHistory, setAssessmentsHistory] = useState<AssessmentItem[]>([]);

  // Loading States
  const [loadingMaster, setLoadingMaster] = useState(true);
  const [loadingStudents, setLoadingStudents] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // 1. Initial Load Master Data
  useEffect(() => {
    const fetchMasterData = async () => {
      try {
        const [resClasses, resSubjects] = await Promise.all([
          api.get('/students/classes/'),
          api.get('/academics/subjects/'),
        ]);

        const classList = resClasses.data.results || resClasses.data;
        const subjectList = resSubjects.data.results || resSubjects.data;

        setClasses(classList);
        setSubjects(subjectList);

        if (classList.length > 0) setSelectedClass(String(classList[0].id));
        if (subjectList.length > 0) setSelectedSubject(String(subjectList[0].id));

        setAssessmentDate(new Date().toISOString().split('T')[0]);
      } catch (err) {
        toast.error('Gagal memuat master data kelas/mapel');
      } finally {
        setLoadingMaster(false);
      }
    };

    fetchMasterData();
  }, []);

  // 2. Fetch Siswa, KKM Dinamis, & Assessment History
  useEffect(() => {
    if (!selectedClass || !selectedSubject) return;

    const fetchData = async () => {
      setLoadingStudents(true);
      try {
        const [resStudents, resAssessments, resKKM] = await Promise.all([
          api.get(`/students/students/?class_id=${selectedClass}`),
          api.get(`/grades/assessments/?class_id=${selectedClass}&subject_id=${selectedSubject}`),
          api.get(`/academics/passing-grades/?student_class=${selectedClass}&subject=${selectedSubject}`).catch(() => null),
        ]);

        const studentList: Student[] = resStudents.data.results || resStudents.data;
        setStudents(studentList);

        const history: AssessmentItem[] = resAssessments.data.results || resAssessments.data;
        setAssessmentsHistory(history);

        // Fetch Nilai KKM Dinamis
        if (resKKM && resKKM.data) {
          const kkmData = resKKM.data.results || resKKM.data;
          if (kkmData.length > 0 && kkmData[0].kkm) {
            setDynamicKKM(kkmData[0].kkm);
          } else {
            setDynamicKKM(75);
          }
        }

        // Reset Form ke Ujian Baru
        setSelectedAssessmentId('NEW');
        setAssessmentTitle(`Ulangan Harian ${history.length + 1}`);
        setIsLocked(false);

        const initialScores: Record<number, number> = {};
        const initialNotes: Record<number, string> = {};
        studentList.forEach((s) => {
          initialScores[s.id] = 80;
          initialNotes[s.id] = '';
        });
        setStudentScores(initialScores);
        setStudentNotes(initialNotes);
      } catch (err) {
        toast.error('Gagal memuat data siswa/nilai');
      } finally {
        setLoadingStudents(false);
      }
    };

    fetchData();
  }, [selectedClass, selectedSubject]);

  // Handle Ujian Selected
  const handleSelectAssessment = (id: string) => {
    setSelectedAssessmentId(id);
    if (id === 'NEW') {
      setAssessmentTitle(`Ulangan Harian ${assessmentsHistory.length + 1}`);
      setAssessmentCategory('DAILY_EXAM');
      setIsLocked(false);
      const initialScores: Record<number, number> = {};
      const initialNotes: Record<number, string> = {};
      students.forEach((s) => {
        initialScores[s.id] = 80;
        initialNotes[s.id] = '';
      });
      setStudentScores(initialScores);
      setStudentNotes(initialNotes);
    } else {
      const selected = assessmentsHistory.find((a) => String(a.id) === id);
      if (selected) {
        setAssessmentTitle(selected.title);
        setAssessmentCategory(selected.category);
        setAssessmentDate(selected.date);
        setIsLocked(true);

        const scoreMap: Record<number, number> = {};
        const noteMap: Record<number, string> = {};
        students.forEach((s) => {
          const found = selected.grades?.find((g) => g.student_id === s.id);
          scoreMap[s.id] = found ? Number(found.score) : 0;
          noteMap[s.id] = found?.notes || '';
        });
        setStudentScores(scoreMap);
        setStudentNotes(noteMap);
      }
    }
  };

  const handleScoreChange = (studentId: number, value: number) => {
    if (isLocked) return;
    const safeVal = Math.min(100, Math.max(0, value || 0));
    setStudentScores((prev) => ({ ...prev, [studentId]: safeVal }));
  };

  const handlePresetAll = (score: number) => {
    if (isLocked) return;
    const updated: Record<number, number> = {};
    students.forEach((s) => {
      updated[s.id] = score;
    });
    setStudentScores(updated);
    toast.success(`Seluruh nilai diset ke ${score}`);
  };

  // Filter List Siswa (Semua vs Remedial)
  const filteredStudents = useMemo(() => {
    if (!showOnlyRemedial) return students;
    return students.filter((s) => (studentScores[s.id] ?? 0) < dynamicKKM);
  }, [students, studentScores, showOnlyRemedial, dynamicKKM]);

  const liveStats = useMemo(() => {
    const scores = Object.values(studentScores);
    if (scores.length === 0) return { avg: 0, max: 0, min: 0 };
    const sum = scores.reduce((a, b) => a + b, 0);
    return {
      avg: Math.round((sum / scores.length) * 10) / 10,
      max: Math.max(...scores),
      min: Math.min(...scores),
    };
  }, [studentScores]);

  // Submit Bulk Create/Update
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedClass || !selectedSubject || isLocked) return;

    setSubmitting(true);
    const formattedGrades = Object.entries(studentScores).map(([studentId, score]) => ({
      student_id: Number(studentId),
      score: Number(score),
      notes: studentNotes[Number(studentId)] || '',
    }));

    const payload = {
      class_id: Number(selectedClass),
      subject_id: Number(selectedSubject),
      title: assessmentTitle,
      category: assessmentCategory,
      date: assessmentDate,
      grades: formattedGrades,
    };

    try {
      await api.post('/grades/assessments/bulk-create/', payload);
      toast.success('Nilai ujian berhasil disimpan!');
      setIsLocked(true);

      const resAssessments = await api.get(
        `/grades/assessments/?class_id=${selectedClass}&subject_id=${selectedSubject}`
      );
      setAssessmentsHistory(resAssessments.data.results || resAssessments.data);
    } catch (err: any) {
      toast.error('Gagal menyimpan nilai ujian');
    } finally {
      setSubmitting(false);
    }
  };

  // Export Excel Berwarna via xlsx-js-style (Diselaraskan dengan Tanggal & KKM Dinamis)
  const handleExportExcel = () => {
    if (students.length === 0 || assessmentsHistory.length === 0) {
      toast.error('Tidak ada data nilai untuk diexport.');
      return;
    }

    const className = classes.find((c) => String(c.id) === selectedClass)?.name || 'Kelas';
    const subjectName = subjects.find((s) => String(s.id) === selectedSubject)?.name || 'Mapel';

    // 1. Title Rows
    const titleRow = [[`REKAPITULASI NILAI - KELAS ${className.toUpperCase()}`]];
    const subTitleRow = [[`MATA PELAJARAN: ${subjectName.toUpperCase()} (KKM: ${dynamicKKM})`]];
    const emptyRow = [[]];

    // 2. Double Level Header: Judul Ujian & Sub-Header Tanggal
    const dynamicHeaders = assessmentsHistory.map((a) => a.title);
    const dynamicDates = assessmentsHistory.map((a) => a.date || '-');

    const headersMain = ['No', 'NISN', 'Nama Siswa', ...dynamicHeaders, 'Rata-Rata'];
    const headersSub = ['', '', '', ...dynamicDates, ''];

    // 3. Data Rows
    const dataRows = students.map((student, idx) => {
      const scores = assessmentsHistory.map((a) => {
        const found = a.grades?.find((g) => g.student_id === student.id);
        return found ? Number(found.score) : 0;
      });

      const avg =
        scores.length > 0
          ? Math.round((scores.reduce((acc, curr) => acc + curr, 0) / scores.length) * 10) / 10
          : 0;

      return [idx + 1, student.nisn || '-', student.full_name || 'Tanpa Nama', ...scores, avg];
    });

    const sheetData = [
      ...titleRow, 
      ...subTitleRow, 
      ...emptyRow, 
      headersMain, 
      headersSub, 
      ...dataRows
    ];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    // 4. Styling Borders & Fills
    const borderThin = {
      top: { style: 'thin', color: { rgb: 'E2E8F0' } },
      bottom: { style: 'thin', color: { rgb: 'E2E8F0' } },
      left: { style: 'thin', color: { rgb: 'E2E8F0' } },
      right: { style: 'thin', color: { rgb: 'E2E8F0' } },
    };

    const mainHeaderStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
      fill: { fgColor: { rgb: '1E293B' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderThin,
    };

    const subHeaderStyle = {
      font: { italic: true, color: { rgb: '94A3B8' }, sz: 8 },
      fill: { fgColor: { rgb: '0F172A' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderThin,
    };

    const avgHeaderStyle = {
      font: { bold: true, color: { rgb: 'FFFFFF' }, sz: 10 },
      fill: { fgColor: { rgb: '0F766E' } },
      alignment: { horizontal: 'center', vertical: 'center' },
      border: borderThin,
    };

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');

    // Styling Header Main (Baris index 3) & Sub Tanggal (Baris index 4)
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellMain = XLSX.utils.encode_cell({ r: 3, c: C });
      const cellSub = XLSX.utils.encode_cell({ r: 4, c: C });

      if (worksheet[cellMain]) {
        worksheet[cellMain].s = C === range.e.c ? avgHeaderStyle : mainHeaderStyle;
      }
      if (worksheet[cellSub]) {
        worksheet[cellSub].s = subHeaderStyle;
      }
    }

    // Styling Cells Data & Highlighting KKM (Mulai Baris Index 5)
    for (let R = 5; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        let cellStyle: any = {
          alignment: { horizontal: C === 2 ? 'left' : 'center', vertical: 'center' },
          border: borderThin,
          font: { sz: 10 },
        };

        // Highlight Nilai Rata-Rata Akhir terhadap KKM
        if (C === range.e.c) {
          const val = Number(cell.v || 0);
          if (val >= dynamicKKM) {
            cellStyle.fill = { fgColor: { rgb: 'DCFCE7' } }; // Hijau Pastel Tuntas
            cellStyle.font = { bold: true, color: { rgb: '15803D' } };
          } else {
            cellStyle.fill = { fgColor: { rgb: 'FEE2E2' } }; // Merah Pastel Remedial
            cellStyle.font = { bold: true, color: { rgb: 'B91C1C' } };
          }
        }

        cell.s = cellStyle;
      }
    }

    // Auto Column Widths
    worksheet['!cols'] = [
      { wch: 4 },
      { wch: 14 },
      { wch: 28 },
      ...assessmentsHistory.map(() => ({ wch: 16 })),
      { wch: 12 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Nilai');
    XLSX.writeFile(workbook, `Rekap_Nilai_${className}_${subjectName}.xlsx`);

    toast.success('Berhasil mengunduh Rekap Nilai Excel Berwarna!');
  };

  return (
    <div className="space-y-6">
      {/* Header Page */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Manajemen Nilai & Ujian</h1>
          <p className="text-slate-500 text-sm mt-1">
            Input nilai harian, UTS, dan UAS secara transparan tanpa batasan jumlah ujian.
          </p>
        </div>

        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200 self-start">
          <button
            onClick={() => setActiveTab('input')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'input'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Save className="w-4 h-4" />
            Input Ujian Harian
          </button>
          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Layers className="w-4 h-4" />
            Matriks Rekap Rapor
          </button>
        </div>
      </div>

      {/* Filter Header Kelas & Mapel */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-sm grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kelas</label>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            disabled={loadingMaster}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {classes.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Mata Pelajaran</label>
          <select
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            disabled={loadingMaster}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
          >
            {subjects.map((s) => (
              <option key={s.id} value={s.id}>
                {s.name} {s.code ? `(${s.code})` : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* TAB 1: INPUT UJIAN HARIAN */}
      {activeTab === 'input' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3 w-full md:w-auto">
              <span className="text-sm font-semibold text-slate-700 whitespace-nowrap">Pilih Ujian:</span>
              <select
                value={selectedAssessmentId}
                onChange={(e) => handleSelectAssessment(e.target.value)}
                className="w-full md:w-72 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:ring-2 focus:ring-blue-500 font-medium"
              >
                <option value="NEW">+ Buat Pelaksanaan Ujian Baru</option>
                {assessmentsHistory.map((a) => (
                  <option key={a.id} value={a.id}>
                    {a.title} ({a.date})
                  </option>
                ))}
              </select>
            </div>

            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
              {isLocked ? (
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Data Terkunci (Read-Only)
                  </span>
                  <button
                    type="button"
                    onClick={() => setIsLocked(false)}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-xs font-semibold transition shadow-sm"
                  >
                    <Edit3 className="w-3.5 h-3.5" />
                    Buka Kunci untuk Edit
                  </button>
                </div>
              ) : (
                <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-lg text-xs font-bold border border-emerald-200">
                  <Unlock className="w-3.5 h-3.5 text-emerald-600" />
                  Mode Input / Edit Aktif
                </span>
              )}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <form onSubmit={handleSubmit}>
              <div className="p-5 border-b border-slate-100 bg-slate-50/50 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Judul Ujian / Tugas
                  </label>
                  <input
                    type="text"
                    value={assessmentTitle}
                    onChange={(e) => setAssessmentTitle(e.target.value)}
                    disabled={isLocked}
                    placeholder="Contoh: UH 1 Trigonometri"
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Kategori
                  </label>
                  <select
                    value={assessmentCategory}
                    onChange={(e) => setAssessmentCategory(e.target.value)}
                    disabled={isLocked}
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
                  >
                    <option value="ASSIGNMENT">Tugas / PR / Kuis</option>
                    <option value="DAILY_EXAM">Ulangan Harian</option>
                    <option value="UTS">Ujian Tengah Semester (UTS)</option>
                    <option value="UAS">Ujian Akhir Semester (UAS)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                    Tanggal Execution
                  </label>
                  <input
                    type="date"
                    value={assessmentDate}
                    onChange={(e) => setAssessmentDate(e.target.value)}
                    disabled={isLocked}
                    required
                    className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 bg-white text-sm disabled:bg-slate-100 disabled:text-slate-500"
                  />
                </div>
              </div>

              {/* Toolbar Stats, Filter & Presets */}
              <div className="p-4 bg-white border-b border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-5 text-xs text-slate-600 flex-wrap">
                  <div className="flex items-center gap-1.5">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                    <span>Rata-Rata: <strong className="text-slate-800 text-sm">{liveStats.avg}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-emerald-600" />
                    <span>Tertinggi: <strong className="text-slate-800 text-sm">{liveStats.max}</strong></span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <AlertCircle className="w-4 h-4 text-red-500" />
                    <span>Terendah: <strong className="text-slate-800 text-sm">{liveStats.min}</strong></span>
                  </div>
                  <div className="px-2 py-0.5 bg-blue-50 text-blue-700 font-bold rounded border border-blue-200">
                    KKM Mapel: {dynamicKKM}
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setShowOnlyRemedial(!showOnlyRemedial)}
                    className={`flex items-center gap-1.5 px-3 py-1 text-xs font-medium rounded-lg border transition ${
                      showOnlyRemedial
                        ? 'bg-red-50 text-red-700 border-red-300 font-bold'
                        : 'bg-white text-slate-600 border-slate-300 hover:bg-slate-50'
                    }`}
                  >
                    <Filter className="w-3.5 h-3.5" />
                    {showOnlyRemedial ? 'Menampilkan: Remedial Saja' : 'Filter Remedial'}
                  </button>

                  {!isLocked && (
                    <div className="flex items-center gap-1.5 border-l pl-2 border-slate-200">
                      <button
                        type="button"
                        onClick={() => handlePresetAll(80)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
                      >
                        Set 80
                      </button>
                      <button
                        type="button"
                        onClick={() => handlePresetAll(dynamicKKM)}
                        className="px-2 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-medium rounded-md transition"
                      >
                        Set KKM ({dynamicKKM})
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Table Student Grade Input */}
              {loadingStudents ? (
                <div className="flex items-center justify-center p-12">
                  <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
                  <span className="ml-2 text-sm text-slate-600">Memuat data siswa...</span>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase">
                        <th className="px-6 py-3.5">NISN</th>
                        <th className="px-6 py-3.5">Nama Siswa</th>
                        <th className="px-6 py-3.5 text-center w-40">Nilai (0-100)</th>
                        <th className="px-6 py-3.5 text-center w-32">Status KKM</th>
                        <th className="px-4 py-3.5 text-center w-24">Catatan</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-sm">
                      {filteredStudents.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="text-center py-8 text-slate-500 font-medium">
                            {showOnlyRemedial ? 'Tidak ada siswa yang remedial!' : 'Tidak ada siswa ditemukan.'}
                          </td>
                        </tr>
                      ) : (
                        filteredStudents.map((student) => {
                          const score = studentScores[student.id] ?? 0;
                          const isPassing = score >= dynamicKKM;
                          const hasNote = Boolean(studentNotes[student.id]);

                          return (
                            <tr key={student.id} className="hover:bg-slate-50">
                              <td className="px-6 py-4 font-mono text-slate-500">{student.nisn || '-'}</td>
                              <td className="px-6 py-4 font-medium text-slate-900">{student.full_name}</td>
                              <td className="px-6 py-4">
                                <input
                                  type="number"
                                  min="0"
                                  max="100"
                                  value={score}
                                  disabled={isLocked}
                                  onChange={(e) => handleScoreChange(student.id, Number(e.target.value))}
                                  className="w-full px-3 py-1.5 text-center font-semibold border border-slate-200 rounded-lg focus:ring-2 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-600"
                                />
                              </td>
                              <td className="px-6 py-4 text-center">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                                    isPassing
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : 'bg-red-100 text-red-800'
                                  }`}
                                >
                                  {isPassing ? 'Tuntas' : 'Remedial'}
                                </span>
                              </td>
                              <td className="px-4 py-4 text-center">
                                <button
                                  type="button"
                                  onClick={() => setActiveNoteStudent(student)}
                                  className={`p-1.5 rounded-lg border transition ${
                                    hasNote
                                      ? 'bg-blue-50 text-blue-600 border-blue-200'
                                      : 'bg-slate-50 text-slate-400 border-slate-200 hover:text-slate-600'
                                  }`}
                                  title="Tambah Catatan Guru"
                                >
                                  <FileText className="w-4 h-4" />
                                </button>
                              </td>
                            </tr>
                          );
                        })
                      )}
                    </tbody>
                  </table>
                </div>
              )}

              <div className="p-4 bg-slate-50 border-t border-slate-200 flex justify-end">
                <button
                  type="submit"
                  disabled={submitting || isLocked}
                  className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition disabled:opacity-50"
                >
                  <Save className="w-5 h-5" />
                  {submitting ? 'Menyimpan...' : 'Simpan Nilai Ujian'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* TAB 2: MATRIKS REKAP RAPOR
      {activeTab === 'summary' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Matriks Rekapitulasi Ujian</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {assessmentsHistory.length} pelaksanaan ujian tercatat di kelas ini (KKM Mapel: {dynamicKKM}).
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel Berwarna
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-xs uppercase font-semibold">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">NISN</th>
                  <th className="px-6 py-3">Nama Siswa</th>
                  {assessmentsHistory.map((a) => (
                    <th key={a.id} className="px-4 py-3 text-center min-w-[120px]">
                      {a.title}
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center bg-teal-700">Rata-Rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => {
                  const scores = assessmentsHistory.map((a) => {
                    const found = a.grades?.find((g) => g.student_id === student.id);
                    return found ? Number(found.score) : 0;
                  });

                  const avg =
                    scores.length > 0
                      ? Math.round(
                          (scores.reduce((acc, curr) => acc + curr, 0) / scores.length) * 10
                        ) / 10
                      : 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{student.nisn || '-'}</td>
                      <td className="px-6 py-3 font-medium text-slate-900">{student.full_name}</td>
                      {scores.map((s, scoreIdx) => (
                        <td key={scoreIdx} className="px-4 py-3 text-center font-medium text-slate-700">
                          {s}
                        </td>
                      ))}
                      <td className="px-6 py-3 text-center font-bold bg-slate-50">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs ${
                            avg >= dynamicKKM
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {avg}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )} */}


      {/* TAB 2: MATRIKS REKAP RAPOR */}
      {activeTab === 'summary' && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-slate-200 flex items-center justify-between">
            <div>
              <h2 className="font-semibold text-slate-800">Matriks Rekapitulasi Ujian</h2>
              <p className="text-xs text-slate-500 mt-0.5">
                Total {assessmentsHistory.length} pelaksanaan ujian tercatat di kelas ini (KKM Mapel: {dynamicKKM}).
              </p>
            </div>

            <button
              onClick={handleExportExcel}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-medium rounded-lg transition shadow-sm"
            >
              <FileSpreadsheet className="w-4 h-4" />
              Export Excel Berwarna
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-800 text-white text-xs uppercase font-semibold">
                  <th className="px-4 py-3">No</th>
                  <th className="px-4 py-3">NISN</th>
                  <th className="px-6 py-3">Nama Siswa</th>
                  {assessmentsHistory.map((a) => (
                    <th
                      key={a.id}
                      onClick={() => {
                        handleSelectAssessment(String(a.id));
                        setActiveTab('input');
                        toast.success(`Membuka mode detail: ${a.title}`);
                      }}
                      className="px-4 py-3 text-center min-w-[130px] cursor-pointer hover:bg-slate-700 transition group"
                      title="Klik untuk lihat / edit ujian ini di Tab Input"
                    >
                      <div className="font-bold text-white group-hover:text-blue-300 transition flex items-center justify-center gap-1">
                        {a.title}
                      </div>
                      <div className="text-[10px] font-normal text-slate-400 group-hover:text-slate-200">
                        {a.date || 'Tanpa Tanggal'}
                      </div>
                    </th>
                  ))}
                  <th className="px-6 py-3 text-center bg-teal-700">Rata-Rata</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.map((student, idx) => {
                  const scores = assessmentsHistory.map((a) => {
                    const found = a.grades?.find((g) => g.student_id === student.id);
                    return {
                      assessmentId: a.id,
                      score: found ? Number(found.score) : 0,
                    };
                  });

                  const numericScores = scores.map((s) => s.score);
                  const avg =
                    numericScores.length > 0
                      ? Math.round(
                          (numericScores.reduce((acc, curr) => acc + curr, 0) / numericScores.length) * 10
                        ) / 10
                      : 0;

                  return (
                    <tr key={student.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-500">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono text-slate-500">{student.nisn || '-'}</td>
                      <td className="px-6 py-3 font-medium text-slate-900">{student.full_name}</td>
                      {scores.map((s, scoreIdx) => (
                        <td
                          key={scoreIdx}
                          onClick={() => {
                            handleSelectAssessment(String(s.assessmentId));
                            setActiveTab('input');
                            toast.success(`Membuka mode detail ujian.`);
                          }}
                          className="px-4 py-3 text-center font-medium text-slate-700 cursor-pointer hover:bg-blue-50/80 hover:text-blue-700 transition"
                          title="Klik sel nilai ini untuk lompat ke Tab Input"
                        >
                          {s.score}
                        </td>
                      ))}
                      <td className="px-6 py-3 text-center font-bold bg-slate-50">
                        <span
                          className={`px-2.5 py-1 rounded-md text-xs ${
                            avg >= dynamicKKM
                              ? 'bg-emerald-100 text-emerald-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {avg}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}


      {/* MODAL CATATAN EVALUASI GURU */}
      {activeNoteStudent && (
        <div className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-xl max-w-md w-full p-6 shadow-xl border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-bold text-slate-800">Catatan Evaluasi Siswa</h3>
                <p className="text-xs text-slate-500">{activeNoteStudent.full_name}</p>
              </div>
              <button
                onClick={() => setActiveNoteStudent(null)}
                className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-500 mb-1">
                Catatan Guru / Evaluasi
              </label>
              <textarea
                rows={4}
                value={studentNotes[activeNoteStudent.id] || ''}
                onChange={(e) =>
                  setStudentNotes((prev) => ({
                    ...prev,
                    [activeNoteStudent.id]: e.target.value,
                  }))
                }
                disabled={isLocked}
                placeholder="Misal: Perlu tambahan bimbingan di materi Trigonometri..."
                className="w-full p-3 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 bg-white"
              />
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setActiveNoteStudent(null)}
                className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
              >
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}