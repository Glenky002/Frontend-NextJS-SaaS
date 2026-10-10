// 'use client';

// import { useState, useEffect } from 'react';
// import { api } from '@/lib/api';
// import toast from 'react-hot-toast';
// import XLSX from 'xlsx-js-style';
// import {
//   Calendar as CalendarIcon,
//   CheckCircle2,
//   Save,
//   RefreshCw,
//   Search,
//   BookOpen,
//   BarChart2,
//   ClipboardList,
//   UserCheck,
//   UserX,
//   AlertCircle,
//   HelpCircle,
//   Download,
//   Phone,
//   AlertTriangle,
//   History, 
//   Lock, 
//   ShieldCheck
// } from 'lucide-react';

// interface StudentClass {
//   id: number;
//   name: string;
// }

// interface Student {
//   id: number;
//   nisn: string;
//   full_name: string;
//   gender: 'L' | 'P';
//   parent_phone_number?: string;
// }

// interface AttendanceItem {
//   student_id: number;
//   status: 'PRESENT' | 'SICK' | 'PERMIT' | 'ABSENT';
//   notes: string;
// }

// // Interface untuk Card Monitoring Kelas
// interface ClassAttendanceMonitor {
//   class_id: number;
//   class_name: string;
//   homeroom_teacher: string;
//   total_students: number;
//   recorded_students: number;
//   status: 'COMPLETED' | 'PARTIAL' | 'NOT_STARTED';
//   present_count: number;
//   sick_count: number;
//   permit_count: number;
//   absent_count: number;
//   updated_at?: string;
// }

// interface AttendanceSummaryItem {
//   student_id: number;
//   student_name: string;
//   nisn: string;
//   total_days: number;
//   hadir: number;
//   sakit: number;
//   izin: number;
//   alpa: number;
//   attendance_percentage: number;
//   parent_phone_number?: string;
// }

// export default function AttendancePage() {
//   const [activeTab, setActiveTab] = useState<'daily' | 'summary' | 'monitoring'>('daily');

//   // Master Data State
//   const [classes, setClasses] = useState<StudentClass[]>([]);
//   const [selectedClassId, setSelectedClassId] = useState<string>('');
//   const [students, setStudents] = useState<Student[]>([]);
//   const [loadingStudents, setLoadingStudents] = useState(false);

//   // Daily Attendance State
//   const [date, setDate] = useState<string>('');
//   const [attendances, setAttendances] = useState<Record<number, AttendanceItem>>({});
//   const [submitting, setSubmitting] = useState(false);
//   const [isSaved, setIsSaved] = useState<boolean>(false);

//   // Summary State
//   const [summaryMonth, setSummaryMonth] = useState<number>(0);
//   const [summaryYear, setSummaryYear] = useState<number>(0);
//   const [summaryData, setSummaryData] = useState<AttendanceSummaryItem[]>([]);
//   const [loadingSummary, setLoadingSummary] = useState(false);
//   const [filterLowAttendance, setFilterLowAttendance] = useState<boolean>(false);

//   // Filter Search Nama
//   const [searchQuery, setSearchQuery] = useState('');

//   // State untuk menyimpan info wali kelas dari API
//   const [homeroomTeacher, setHomeroomTeacher] = useState<string>('-');

//   // Update State Active Tab

//   const [monitoringData, setMonitoringData] = useState<ClassAttendanceMonitor[]>([]);
//   const [loadingMonitoring, setLoadingMonitoring] = useState(false);

//   // State Tambahan untuk Matriks
//   const [matrixData, setMatrixData] = useState<any[]>([]);
//   const [daysInMonth, setDaysInMonth] = useState<number>(31);
//   const [loadingMatrix, setLoadingMatrix] = useState(false);

//   // State Audit Log
//   const [isLogModalOpen, setIsLogModalOpen] = useState(false);
//   const [selectedStudentLogs, setSelectedStudentLogs] = useState<{
//     studentName: string;
//     recordedBy: string;
//     createdAt: string;
//   } | null>(null);

//   useEffect(() => {
//     const now = new Date();
//     setDate(now.toISOString().split('T')[0]);
//     setSummaryMonth(now.getMonth() + 1);
//     setSummaryYear(now.getFullYear());
//   }, []);

//   // Fetch Daftar Kelas
//   useEffect(() => {
//     const fetchClasses = async () => {
//       try {
//         const res = await api.get('/students/classes/?page_size=100');
//         const classList = res.data.results || res.data || [];
//         setClasses(classList);
//         if (classList.length > 0) {
//           setSelectedClassId(String(classList[0].id));
//         }
//       } catch (err) {
//         toast.error('Gagal memuat daftar kelas.');
//       }
//     };
//     fetchClasses();
//   }, []);

//   // Fetch Siswa & Data Absensi Eksisting
//   useEffect(() => {
//     if (!selectedClassId || !date) return;

//     const fetchStudentsAndExistingAttendance = async () => {
//       setLoadingStudents(true);
//       try {
//         const resStudents = await api.get(`/students/students/?class_id=${selectedClassId}&page_size=200`);
//         const studentList: Student[] = resStudents.data.results || resStudents.data || [];
//         setStudents(studentList);

//         const resAttendance = await api.get(
//           `/attendance/attendances/?class_id=${selectedClassId}&date=${date}`
//         );
//         const existingData: any[] = resAttendance.data.results || resAttendance.data || [];

//         setIsSaved(existingData.length > 0);

//         const attendanceMap: Record<number, AttendanceItem> = {};
//         studentList.forEach((s) => {
//           const found = existingData.find((a) => a.student === s.id);
//           attendanceMap[s.id] = {
//             student_id: s.id,
//             status: found ? found.status : 'PRESENT',
//             notes: found ? found.notes || '' : '',
//           };
//         });

//         setAttendances(attendanceMap);
//       } catch (err) {
//         toast.error('Gagal memuat data siswa/absensi.');
//       } finally {
//         setLoadingStudents(false);
//       }
//     };

//     if (activeTab === 'daily') {
//       fetchStudentsAndExistingAttendance();
//     }
//   }, [selectedClassId, date, activeTab]);

//   // Fetch Summary Bulanan
//   const fetchSummary = async () => {
//     if (!selectedClassId || !summaryMonth || !summaryYear) return;
//     setLoadingSummary(true);
//     try {
//       const res = await api.get(
//         `/attendance/attendances/summary/?class_id=${selectedClassId}&month=${summaryMonth}&year=${summaryYear}`
//       );
//       setSummaryData(res.data.students_summary || []);
//     } catch (err: any) {
//       toast.error(err.response?.data?.error || 'Gagal memuat rekapitulasi absensi.');
//     } finally {
//       setLoadingSummary(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'summary' && summaryMonth > 0 && summaryYear > 0) {
//       fetchSummary();
//     }
//   }, [selectedClassId, summaryMonth, summaryYear, activeTab]);


//   const fetchMonitoringData = async () => {
//     if (!date) return;
//     setLoadingMonitoring(true);
//     try {
//       const res = await api.get(`/attendance/attendances/monitoring/?date=${date}`);
//       setMonitoringData(res.data.classes_monitoring || res.data || []);
//     } catch (err) {
//       toast.error('Gagal memuat status monitoring presensi kelas.');
//     } finally {
//       setLoadingMonitoring(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'monitoring' && date) {
//       fetchMonitoringData();
//     }
//   }, [activeTab, date]);

//   const fetchMatrixData = async () => {
//     if (!selectedClassId || !summaryMonth || !summaryYear) return;
//     setLoadingMatrix(true);
//     try {
//       const res = await api.get(
//         `/attendance/attendances/matrix/?class_id=${selectedClassId}&month=${summaryMonth}&year=${summaryYear}`
//       );
//       setMatrixData(res.data.matrix || []);
//       setDaysInMonth(res.data.days_in_month || 31);
//       setHomeroomTeacher(res.data.homeroom_teacher || '-');
//     } catch (err: any) {
//       console.error('Error Matrix:', err);
//       toast.error('Gagal memuat matriks presensi.');
//     } finally {
//       setLoadingMatrix(false);
//     }
//   };

//   useEffect(() => {
//     if (activeTab === 'monitoring') {
//       fetchMatrixData();
//     }
//   }, [selectedClassId, summaryMonth, summaryYear, activeTab]);

//   // Handler Status Change
//   const handleStatusChange = (studentId: number, status: 'PRESENT' | 'SICK' | 'PERMIT' | 'ABSENT') => {
//     setIsSaved(false);
//     setAttendances((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         status,
//       },
//     }));
//   };

//   // Handler Notes Change
//   const handleNotesChange = (studentId: number, notes: string) => {
//     setIsSaved(false);
//     setAttendances((prev) => ({
//       ...prev,
//       [studentId]: {
//         ...prev[studentId],
//         notes,
//       },
//     }));
//   };

//   // Handler Buka History Log per Siswa
//   const handleShowLog = (student: Student) => {
//     const currentAtt = attendances[student.id];
//     setSelectedStudentLogs({
//       studentName: student.full_name,
//       recordedBy: currentAtt ? 'Guru / Wali Kelas' : 'Belum diisi', // Otomatis terhubung ke recorded_by backend
//       createdAt: date,
//     });
//     setIsLogModalOpen(true);
//   };

//   // Handler "Tandai Semua Hadir"
//   const handleMarkAllPresent = () => {
//     setIsSaved(false);
//     setAttendances((prev) => {
//       const updated = { ...prev };
//       Object.keys(updated).forEach((id) => {
//         updated[Number(id)] = {
//           ...updated[Number(id)],
//           status: 'PRESENT',
//         };
//       });
//       return updated;
//     });
//     toast.success('Semua siswa ditandai HADIR.');
//   };

//   // Handler Simpan Bulk Attendance
//   const handleSaveAttendance = async () => {
//     if (!selectedClassId || !date) {
//       toast.error('Pilih kelas dan tanggal terlebih dahulu.');
//       return;
//     }

//     const payload = {
//       class_id: Number(selectedClassId),
//       date: date,
//       attendances: Object.values(attendances),
//     };

//     setSubmitting(true);
//     const toastId = toast.loading('Menyimpan data absensi...');

//     try {
//       const res = await api.post('/attendance/attendances/bulk-create/', payload);
//       toast.success(res.data.message || 'Absensi berhasil disimpan!', { id: toastId });
//       setIsSaved(true);
//     } catch (err: any) {
//       const errorMsg = err.response?.data?.error || 'Gagal menyimpan absensi.';
//       toast.error(errorMsg, { id: toastId });
//     } finally {
//       setSubmitting(false);
//     }
//   };

//   // Export Excel Rekap Bulanan
// // Export Excel Rekap Bulanan
//   const handleExportSummaryExcel = () => {
//     if (summaryData.length === 0) {
//       toast.error('Tidak ada data rekapitulasi untuk diexport.');
//       return;
//     }

//     const selectedClassName = classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas';
//     const monthNames = [
//       'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
//     ];
//     const monthLabel = monthNames[summaryMonth - 1] || summaryMonth;

//     // Perbaikan TypeScript: String(...).toUpperCase()
//     const titleRow = [[`REKAPITULASI PRESENSI SISWA - KELAS ${String(selectedClassName).toUpperCase()}`]];
//     const subTitleRow = [[`PERIODE: ${String(monthLabel).toUpperCase()} ${summaryYear}`]];
//     const emptyRow = [[]];
//     const headers = [
//       'No',
//       'NISN',
//       'Nama Siswa',
//       'Total Hari',
//       'Hadir',
//       'Izin',
//       'Sakit',
//       'Alpa',
//       'Persentase Kehadiran (%)',
//     ];

//     const dataRows = summaryData.map((item, index) => [
//       index + 1,
//       item.nisn || '-',
//       item.student_name || '-',
//       item.total_days || 0,
//       item.hadir || 0,
//       item.izin || 0,
//       item.sakit || 0,
//       item.alpa || 0,
//       `${item.attendance_percentage}%`,
//     ]);

//     const sheetData = [...titleRow, ...subTitleRow, ...emptyRow, headers, ...dataRows];
//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     worksheet['!cols'] = [
//       { wch: 5 },  // No
//       { wch: 15 }, // NISN
//       { wch: 28 }, // Nama Siswa
//       { wch: 12 }, // Total Hari
//       { wch: 8 },  // Hadir
//       { wch: 8 },  // Izin
//       { wch: 8 },  // Sakit
//       { wch: 8 },  // Alpa
//       { wch: 22 }, // Persentase
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Absensi');
//     XLSX.writeFile(
//       workbook,
//       `Rekap_Absensi_${String(selectedClassName).replace(/\s+/g, '_')}_${monthLabel}_${summaryYear}.xlsx`
//     );

//     toast.success('Berhasil mengunduh rekap absensi!');
//   };

//   // Calculations
//   const attendanceList = Object.values(attendances);
//   const countPresent = attendanceList.filter((a) => a.status === 'PRESENT').length;
//   const countPermit = attendanceList.filter((a) => a.status === 'PERMIT').length;
//   const countSick = attendanceList.filter((a) => a.status === 'SICK').length;
//   const countAbsent = attendanceList.filter((a) => a.status === 'ABSENT').length;

//   const filteredStudents = students.filter(
//     (s) =>
//       s.full_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       s.nisn.includes(searchQuery)
//   );

//   const filteredSummary = summaryData
//     .filter(
//       (item) =>
//         item.student_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
//         item.nisn.includes(searchQuery)
//     )
//     .filter((item) => (filterLowAttendance ? item.attendance_percentage < 85 : true));


//   // Export Excel khusus Grid Matriks Kalender (1 - 31)
//   const handleExportMatrixExcel = () => {
//     if (matrixData.length === 0) {
//       toast.error('Tidak ada data matriks untuk diexport.');
//       return;
//     }

//     const selectedClassName = classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas';
//     const monthNames = [
//       'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//       'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
//     ];
//     const monthLabel = monthNames[summaryMonth - 1] || summaryMonth;

//     // 1. Title & Metadata
//     const titleRow = [[`MATRIKS PRESENSI SISWA - KELAS ${String(selectedClassName).toUpperCase()}`]];
//     const subTitleRow1 = [[`WALI KELAS: ${String(homeroomTeacher || 'BELUM DIATUR').toUpperCase()}`]];
//     const subTitleRow2 = [[`PERIODE: ${String(monthLabel).toUpperCase()} ${summaryYear}`]];
//     const emptyRow = [[]];

//     // 2. Header Tanggal 1 s/d N
//     const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
//     const headers = ['No', 'NISN', 'Nama Siswa', 'L/P', ...dayHeaders, 'H', 'S', 'I', 'A', 'Total'];

//     // 3. Data Baris Siswa (Hilangkan '-')
//     const dataRows = matrixData.map((row, idx) => {
//       const dailyCells = Array.from({ length: daysInMonth }, (_, i) => {
//         const status = row.daily[String(i + 1)];
//         return status && status !== '-' ? status : '';
//       });
      
//       const totalAll = (row.total_hadir || 0) + (row.total_sakit || 0) + (row.total_izin || 0) + (row.total_alpa || 0);

//       return [
//         idx + 1,
//         row.nisn || '-',
//         row.full_name,
//         row.gender,
//         ...dailyCells,
//         row.total_hadir,
//         row.total_sakit,
//         row.total_izin,
//         row.total_alpa,
//         totalAll,
//       ];
//     });

//     const sheetData = [...titleRow, ...subTitleRow1, ...subTitleRow2, ...emptyRow, headers, ...dataRows];
//     const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

//     // 4. Palette Warna Pastel (Hex tanpa '#')
//     const colors = {
//       headerBg: "1E293B",     // Slate Gelap
//       headerText: "FFFFFF",
//       rekapHeaderBg: "0F766E",// Teal Gelap
//       hBg: "DCFCE7", hText: "15803D", // Hijau Hadir
//       sBg: "FEF3C7", sText: "B45309", // Amber Sakit
//       iBg: "DBEAFE", iText: "1D4ED8", // Biru Izin
//       aBg: "FEE2E2", aText: "B91C1C", // Merah Alpa
//       rekapBg: "F1F5F9"       // Grey Netral
//     };

//     const borderThin = {
//       top: { style: "thin", color: { rgb: "E2E8F0" } },
//       bottom: { style: "thin", color: { rgb: "E2E8F0" } },
//       left: { style: "thin", color: { rgb: "E2E8F0" } },
//       right: { style: "thin", color: { rgb: "E2E8F0" } }
//     };

//     // Style Header (Baris Index 4 / Ke-5 Excel)
//     const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
//     for (let C = range.s.c; C <= range.e.c; ++C) {
//       const cellAddress = XLSX.utils.encode_cell({ r: 4, c: C });
//       if (!worksheet[cellAddress]) continue;
      
//       const isRekap = C >= range.e.c - 4;
//       worksheet[cellAddress].s = {
//         font: { bold: true, color: { rgb: colors.headerText }, sz: 10 },
//         fill: { fgColor: { rgb: isRekap ? colors.rekapHeaderBg : colors.headerBg } },
//         alignment: { horizontal: "center", vertical: "center" },
//         border: borderThin
//       };
//     }

//     // Style Data Cells & Pewarnaan Otomatis Status
//     for (let R = 5; R <= range.e.r; ++R) {
//       for (let C = 0; C <= range.e.c; ++C) {
//         const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
//         const cell = worksheet[cellAddress];
//         if (!cell) continue;

//         let cellStyle: any = {
//           alignment: { horizontal: C === 2 ? "left" : "center", vertical: "center" },
//           border: borderThin,
//           font: { sz: 10 }
//         };

//         // Warnai Sel Status Tanggal
//         if (C >= 4 && C < 4 + daysInMonth) {
//           const val = String(cell.v || '').toUpperCase();
//           if (val === 'H') {
//             cellStyle.fill = { fgColor: { rgb: colors.hBg } };
//             cellStyle.font = { bold: true, color: { rgb: colors.hText } };
//           } else if (val === 'S') {
//             cellStyle.fill = { fgColor: { rgb: colors.sBg } };
//             cellStyle.font = { bold: true, color: { rgb: colors.sText } };
//           } else if (val === 'I') {
//             cellStyle.fill = { fgColor: { rgb: colors.iBg } };
//             cellStyle.font = { bold: true, color: { rgb: colors.iText } };
//           } else if (val === 'A') {
//             cellStyle.fill = { fgColor: { rgb: colors.aBg } };
//             cellStyle.font = { bold: true, color: { rgb: colors.aText } };
//           }
//         }

//         // Warnai Kolom Rekap Ujung Kanan
//         if (C >= range.e.c - 4) {
//           cellStyle.font = { bold: true };
//           cellStyle.fill = { fgColor: { rgb: colors.rekapBg } };
//         }

//         cell.s = cellStyle;
//       }
//     }

//     // 5. Column Widths
//     worksheet['!cols'] = [
//       { wch: 4 },  // No
//       { wch: 14 }, // NISN
//       { wch: 28 }, // Nama
//       { wch: 5 },  // L/P
//       ...Array.from({ length: daysInMonth }, () => ({ wch: 3.2 })),
//       { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 7 },
//     ];

//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriks Presensi');
//     XLSX.writeFile(
//       workbook,
//       `Matriks_Presensi_${String(selectedClassName).replace(/\s+/g, '_')}_${monthLabel}_${summaryYear}.xlsx`
//     );

//     toast.success('Berhasil mengunduh Matriks Presensi Excel!');
//   };

//   return (
//     <div className="space-y-6">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-slate-800">Presensi & Absensi Siswa</h1>
//           <p className="text-slate-500 text-sm mt-1">
//             Catat Kehadiran Harian dan Pantau Rekapitulasi Presensi Kelas.
//           </p>
//         </div>

//         {/* Tab Navigation */}
//         <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
//           <button
//             onClick={() => setActiveTab('daily')}
//             className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
//               activeTab === 'daily'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <ClipboardList className="w-4 h-4" />
//             Input Absensi
//           </button>

//           <button
//             onClick={() => setActiveTab('summary')}
//             className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
//               activeTab === 'summary'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <BarChart2 className="w-4 h-4" />
//             Rekap Bulanan
//           </button>

//           <button
//             onClick={() => setActiveTab('monitoring')}
//             className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
//               activeTab === 'monitoring'
//                 ? 'bg-white text-blue-600 shadow-sm'
//                 : 'text-slate-600 hover:text-slate-900'
//             }`}
//           >
//             <span className="relative flex h-2 w-2">
//               <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
//               <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
//             </span>
//             Monitoring Live
//           </button>
//         </div>
//       </div>

//       {/* Filter Bar Global */}
//       <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
//         <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          
//           {/* Dropdown Pilih Kelas (Muncul di semua tab) */}
//           <div className="flex items-center gap-2 w-full md:w-auto">
//             <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
//             <select
//               value={selectedClassId}
//               onChange={(e) => setSelectedClassId(e.target.value)}
//               className="w-full md:w-56 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//             >
//               {classes.length === 0 && <option value="">Tidak ada kelas</option>}
//               {classes.map((cls) => (
//                 <option key={cls.id} value={cls.id}>
//                   {cls.name}
//                 </option>
//               ))}
//             </select>
//           </div>

//           {/* Controls Khusus TAB 1: Daily (Input Tanggal) */}
//           {activeTab === 'daily' && (
//             <div className="flex items-center gap-2 w-full md:w-auto">
//               <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
//               <input
//                 type="date"
//                 value={date}
//                 onChange={(e) => setDate(e.target.value)}
//                 className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//               />
//             </div>
//           )}

//           {/* Controls Khusus TAB 2 & 3: Summary & Monitoring Matriks (Bulan & Tahun) */}
//           {(activeTab === 'summary' || activeTab === 'monitoring') && (
//             <div className="flex items-center gap-2 w-full md:w-auto">
//               <select
//                 value={summaryMonth}
//                 onChange={(e) => setSummaryMonth(Number(e.target.value))}
//                 className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//               >
//                 {[
//                   'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
//                   'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
//                 ].map((m, idx) => (
//                   <option key={idx + 1} value={idx + 1}>
//                     {m}
//                   </option>
//                 ))}
//               </select>
//               <input
//                 type="number"
//                 value={summaryYear}
//                 onChange={(e) => setSummaryYear(Number(e.target.value))}
//                 className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
//               />
//             </div>
//           )}
//         </div>

//         {/* Tombol Aksi Kanan Sesuai Tab */}
//         <div className="flex items-center gap-2 w-full md:w-auto justify-end">
//           {activeTab === 'daily' && (
//             <>
//               <button
//                 onClick={handleMarkAllPresent}
//                 disabled={loadingStudents || students.length === 0}
//                 className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition disabled:opacity-50"
//               >
//                 <CheckCircle2 className="w-4 h-4 text-emerald-600" />
//                 Set Semua Hadir
//               </button>
//               <button
//                 onClick={handleSaveAttendance}
//                 disabled={submitting || loadingStudents || students.length === 0}
//                 className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
//               >
//                 <Save className="w-4 h-4" />
//                 {submitting ? 'Menyimpan...' : 'Simpan Absensi'}
//               </button>
//             </>
//           )}

//           {activeTab === 'summary' && (
//             <button
//               onClick={handleExportSummaryExcel}
//               disabled={loadingSummary || summaryData.length === 0}
//               className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50 w-full md:w-auto justify-center"
//             >
//               <Download className="w-4 h-4" />
//               Export Rekap Excel
//             </button>
//           )}

//           {activeTab === 'monitoring' && (
//             <div className="flex items-center gap-2 text-[11px] font-bold">
//               <button
//                 onClick={handleExportMatrixExcel}
//                 disabled={loadingMatrix || matrixData.length === 0}
//                 className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
//               >
//                 <Download className="w-4 h-4" />
//                 Export Matriks Excel
//               </button>
//             </div>

//           )}
//         </div>
//       </div>

//       {/* TAB 1: INPUT ABSENSI HARIAN */}
//       {activeTab === 'daily' && (
//         <div className="space-y-4">
//           {/* Widget Counter Stats */}
//           <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
//             <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-slate-500 block">Total Siswa</span>
//                 <span className="text-lg font-bold text-slate-800">{students.length}</span>
//               </div>
//               <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
//                 <BookOpen className="w-4 h-4" />
//               </div>
//             </div>

//             <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-emerald-600 font-semibold block">Hadir</span>
//                 <span className="text-lg font-bold text-emerald-700">{countPresent}</span>
//               </div>
//               <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
//                 <UserCheck className="w-4 h-4" />
//               </div>
//             </div>

//             <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-blue-600 font-semibold block">Izin</span>
//                 <span className="text-lg font-bold text-blue-700">{countPermit}</span>
//               </div>
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
//                 <HelpCircle className="w-4 h-4" />
//               </div>
//             </div>

//             <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
//               <div>
//                 <span className="text-xs text-amber-600 font-semibold block">Sakit</span>
//                 <span className="text-lg font-bold text-amber-700">{countSick}</span>
//               </div>
//               <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
//                 <AlertCircle className="w-4 h-4" />
//               </div>
//             </div>

//             <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between col-span-2 md:col-span-1">
//               <div>
//                 <span className="text-xs text-rose-600 font-semibold block">Alpa</span>
//                 <span className="text-lg font-bold text-rose-700">{countAbsent}</span>
//               </div>
//               <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
//                 <UserX className="w-4 h-4" />
//               </div>
//             </div>
//           </div>

//           {/* Tabel Input Absensi */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
//               <div className="relative flex-1 max-w-sm">
//                 <input
//                   type="text"
//                   placeholder="Cari Nama atau NISN..."
//                   value={searchQuery}
//                   onChange={(e) => setSearchQuery(e.target.value)}
//                   className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//                 />
//                 <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
//               </div>

//               <div>
//                 {isSaved ? (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
//                     <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
//                     Sudah Disimpan
//                   </span>
//                 ) : (
//                   <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
//                     <span className="w-2 h-2 rounded-full bg-amber-500"></span>
//                     Belum Disimpan
//                   </span>
//                 )}
//               </div>
//             </div>

//             {loadingStudents ? (
//               <div className="p-12 text-center text-slate-500 flex items-center justify-center">
//                 <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
//                 <span>Memuat data siswa & presensi...</span>
//               </div>
//             ) : filteredStudents.length === 0 ? (
//               <div className="p-8 text-center text-slate-400 text-sm">
//                 Tidak ada data siswa ditemukan.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
//                     <tr>
//                       <th className="px-4 py-3.5 w-12 text-center">No</th>
//                       <th className="px-6 py-3.5">NISN / Nama Siswa</th>
//                       <th className="px-6 py-3.5 text-center">Status Kehadiran</th>
//                       <th className="px-6 py-3.5">Catatan / Keterangan</th>
//                       <th className="px-4 py-3.5 text-center">Audit Log</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
//                     {filteredStudents.map((student, idx) => {
//                       const currentAtt = attendances[student.id] || {
//                         status: 'PRESENT',
//                         notes: '',
//                       };

//                       return (
//                         <tr key={student.id} className="hover:bg-slate-50/80 transition">
//                           <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400">
//                             {idx + 1}
//                           </td>
//                           <td className="px-6 py-3.5">
//                             <div className="font-semibold text-slate-900">{student.full_name}</div>
//                             <div className="text-xs text-slate-400 font-mono">
//                               NISN: {student.nisn} • {student.gender}
//                             </div>
//                           </td>
//                           <td className="px-6 py-3.5">
//                             <div className="flex items-center justify-center gap-1.5">


//                               {/* Di bagian <tbody> per baris siswa */}

//                               <button
//                                 type="button"
//                                 onClick={() => handleStatusChange(student.id, 'PRESENT')}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
//                                   currentAtt.status === 'PRESENT'
//                                     ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
//                                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                                 }`}
//                               >
//                                 Hadir
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => handleStatusChange(student.id, 'PERMIT')}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
//                                   currentAtt.status === 'PERMIT'
//                                     ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
//                                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                                 }`}
//                               >
//                                 Izin
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => handleStatusChange(student.id, 'SICK')}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
//                                   currentAtt.status === 'SICK'
//                                     ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30'
//                                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                                 }`}
//                               >
//                                 Sakit
//                               </button>

//                               <button
//                                 type="button"
//                                 onClick={() => handleStatusChange(student.id, 'ABSENT')}
//                                 className={`px-3 py-1.5 rounded-lg text-xs font-bold transition ${
//                                   currentAtt.status === 'ABSENT'
//                                     ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30'
//                                     : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
//                                 }`}
//                               >
//                                 Alpa
//                               </button>
//                             </div>
//                           </td>
//                           <td className="px-6 py-3.5">
//                             <input
//                               type="text"
//                               placeholder="Alasan / Catatan (Opsional)"
//                               value={currentAtt.notes}
//                               onChange={(e) => handleNotesChange(student.id, e.target.value)}
//                               className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
//                             />
//                           </td>
//                           {/* Di bagian <tbody> per baris siswa */}
//                           <td className="px-4 py-3.5 text-center">
//                             <button
//                               type="button"
//                               onClick={() => handleShowLog(student)}
//                               className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
//                               title="Lihat Riwayat Pengisian"
//                             >
//                               <History className="w-4 h-4" />
//                             </button>
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}

//       {/* Modal Audit Log */}
//       {isLogModalOpen && selectedStudentLogs && (
//         <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
//           <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100">
//             <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
//               <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
//                 <ShieldCheck className="w-5 h-5" />
//               </div>
//               <div>
//                 <h3 className="text-sm font-bold text-slate-800">Audit Log Presensi</h3>
//                 <p className="text-xs text-slate-500">{selectedStudentLogs.studentName}</p>
//               </div>
//             </div>

//             <div className="my-4 space-y-3 text-xs">
//               <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
//                 <div className="flex justify-between text-slate-500">
//                   <span>Tanggal Presensi:</span>
//                   <span className="font-semibold text-slate-700">{selectedStudentLogs.createdAt}</span>
//                 </div>
//                 <div className="flex justify-between text-slate-500">
//                   <span>Dicatat / Diperbarui Oleh:</span>
//                   <span className="font-semibold text-blue-600">{selectedStudentLogs.recordedBy}</span>
//                 </div>
//                 <div className="flex justify-between text-slate-500">
//                   <span>Status Keamanan:</span>
//                   <span className="font-semibold text-emerald-600 flex items-center gap-1">
//                     <Lock className="w-3 h-3" /> Validated
//                   </span>
//                 </div>
//               </div>
//             </div>

//             <div className="pt-2 flex justify-end">
//               <button
//                 type="button"
//                 onClick={() => setIsLogModalOpen(false)}
//                 className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition"
//               >
//                 Tutup
//               </button>
//             </div>
//           </div>
//         </div>
//       )}

//       {/* TAB 2: REKAPITULASI BULANAN */}
//       {activeTab === 'summary' && (
//         <div className="space-y-4">
//           {/* Sub Header / Filter Bar Rekap */}
//           <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
//             <div className="relative flex-1 max-w-sm w-full">
//               <input
//                 type="text"
//                 placeholder="Cari Nama atau NISN..."
//                 value={searchQuery}
//                 onChange={(e) => setSearchQuery(e.target.value)}
//                 className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
//               />
//               <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
//             </div>

//             {/* Filter Toggle Alert Kehadiran Rendah */}
//             <button
//               onClick={() => setFilterLowAttendance(!filterLowAttendance)}
//               className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
//                 filterLowAttendance
//                   ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
//                   : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
//               }`}
//             >
//               <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
//               <span>Hanya Kehadiran &lt; 85%</span>
//             </button>
//           </div>

//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             {loadingSummary ? (
//               <div className="p-12 text-center text-slate-500 flex items-center justify-center">
//                 <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
//                 <span>Memuat rekapitulasi absensi...</span>
//               </div>
//             ) : filteredSummary.length === 0 ? (
//               <div className="p-8 text-center text-slate-400 text-sm">
//                 Tidak ada data rekapitulasi absensi ditemukan.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse">
//                   <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
//                     <tr>
//                       <th className="px-4 py-3.5 w-12 text-center">No</th>
//                       <th className="px-6 py-3.5">NISN / Nama Siswa</th>
//                       <th className="px-4 py-3.5 text-center bg-emerald-50 text-emerald-700">Hadir</th>
//                       <th className="px-4 py-3.5 text-center bg-blue-50 text-blue-700">Izin</th>
//                       <th className="px-4 py-3.5 text-center bg-amber-50 text-amber-700">Sakit</th>
//                       <th className="px-4 py-3.5 text-center bg-rose-50 text-rose-700">Alpa</th>
//                       <th className="px-6 py-3.5 text-center">Persentase (%)</th>
//                       <th className="px-4 py-3.5 text-center">Aksi OrtU</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
//                     {filteredSummary.map((item, idx) => (
//                       <tr
//                         key={item.student_id}
//                         className={`hover:bg-slate-50 transition ${
//                           item.attendance_percentage < 85 ? 'bg-rose-50/20' : ''
//                         }`}
//                       >
//                         <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400">
//                           {idx + 1}
//                         </td>
//                         <td className="px-6 py-3.5">
//                           <div className="font-semibold text-slate-900">{item.student_name}</div>
//                           <div className="text-xs text-slate-400 font-mono">NISN: {item.nisn}</div>
//                         </td>
//                         <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
//                           {item.hadir}
//                         </td>
//                         <td className="px-4 py-3.5 text-center font-bold text-blue-600">
//                           {item.izin}
//                         </td>
//                         <td className="px-4 py-3.5 text-center font-bold text-amber-600">
//                           {item.sakit}
//                         </td>
//                         <td className="px-4 py-3.5 text-center font-bold text-rose-600">
//                           {item.alpa}
//                         </td>
//                         <td className="px-6 py-3.5 text-center">
//                           <span
//                             className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
//                               item.attendance_percentage >= 85
//                                 ? 'bg-emerald-100 text-emerald-800'
//                                 : item.attendance_percentage >= 70
//                                 ? 'bg-amber-100 text-amber-800'
//                                 : 'bg-rose-100 text-rose-800'
//                             }`}
//                           >
//                             {item.attendance_percentage}%
//                           </span>
//                         </td>
//                         <td className="px-4 py-3.5 text-center">
//                           {item.parent_phone_number ? (
//                             <a
//                               href={`https://wa.me/${item.parent_phone_number.replace(
//                                 /^0/,
//                                 '62'
//                               )}?text=${encodeURIComponent(
//                                 `Halo Bpk/Ibu, menginfokan rekap presensi ananda ${item.student_name} pada bulan ini: Hadir:${item.hadir}, Sakit: ${item.sakit}, Izin:${item.izin}, Alpa: ${item.alpa} (${item.attendance_percentage}%). Terima kasih.`
//                               )}`}
//                               target="_blank"
//                               rel="noreferrer"
//                               className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition"
//                               title="Kirim Lap. Presensi via WA"
//                             >
//                               <Phone className="w-3.5 h-3.5 text-emerald-600" />
//                               <span>WA OrtU</span>
//                             </a>
//                           ) : (
//                             <span className="text-xs text-slate-400 italic">-</span>
//                           )}
//                         </td>
//                       </tr>
//                     ))}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}



//       {/* TAB 3: MONITORING REAL-TIME SELURUH KELAS (TABLE VIEW) */}
//       {/* TAB 3: MATRIKS PRESENSI BULANAN (COMPACT GRID WITH HOMEROOM HEADER) */}
//       {activeTab === 'monitoring' && (
//         <div className="space-y-3">
          
//           {/* Banner Informasi Kelas & Legend */}
//           <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
//             <div className="flex items-center gap-2 text-xs">
//               <span className="font-bold text-slate-800 uppercase tracking-wide">
//                 {classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas'}
//               </span>
//               {homeroomTeacher && homeroomTeacher !== '-' && (
//                 <>
//                   <span className="text-slate-300">|</span>
//                   <span className="text-slate-600 font-medium">
//                     Wali Kelas: <strong className="text-slate-800">{homeroomTeacher}</strong>
//                   </span>
//                 </>
//               )}
//             </div>

//             <div className="flex items-center gap-2 text-[11px] font-bold">
//               <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">H: Hadir</span>
//               <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">S: Sakit</span>
//               <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">I: Izin</span>
//               <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded">A: Alpa</span>
//             </div>
//           </div>

//           {/* Tabel Grid Matriks */}
//           <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
//             {loadingMatrix ? (
//               <div className="p-10 text-center text-slate-500 flex items-center justify-center">
//                 <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
//                 <span className="text-xs font-semibold">Memuat matriks presensi...</span>
//               </div>
//             ) : matrixData.length === 0 ? (
//               <div className="p-8 text-center text-slate-400 text-xs font-medium">
//                 Tidak ada data presensi untuk kelas dan periode ini.
//               </div>
//             ) : (
//               <div className="overflow-x-auto">
//                 <table className="w-full text-left border-collapse text-[10px]">
//                   <thead>
//                     <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
//                       <th className="p-1.5 w-6 text-center border-r border-slate-200">No</th>
//                       <th className="p-1.5 w-24 border-r border-slate-200">NISN</th>
//                       <th className="p-1.5 w-40 border-r border-slate-200">Nama Siswa</th>
//                       <th className="p-1.5 w-6 text-center border-r border-slate-200">L/P</th>

//                       {/* Grid Tanggal 1 s/d N */}
//                       {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
//                         <th
//                           key={d}
//                           className="p-1 w-6 text-center border-r border-slate-200 font-mono bg-slate-50 text-slate-800"
//                         >
//                           {d}
//                         </th>
//                       ))}

//                       {/* Rekapitulasi di Ujung Kanan */}
//                       <th className="p-1.5 w-6 text-center bg-emerald-100 text-emerald-900 border-r border-slate-200 font-black">H</th>
//                       <th className="p-1.5 w-6 text-center bg-amber-100 text-amber-900 border-r border-slate-200 font-black">S</th>
//                       <th className="p-1.5 w-6 text-center bg-blue-100 text-blue-900 border-r border-slate-200 font-black">I</th>
//                       <th className="p-1.5 w-6 text-center bg-rose-100 text-rose-900 border-r border-slate-200 font-black">A</th>
//                       <th className="p-1.5 w-8 text-center bg-slate-200 text-slate-800 font-black">TOTAL</th>
//                     </tr>
//                   </thead>
//                   <tbody className="divide-y divide-slate-200 text-slate-700">
//                     {matrixData.map((row, idx) => {
//                       const totalAll = (row.total_hadir || 0) + (row.total_sakit || 0) + (row.total_izin || 0) + (row.total_alpa || 0);

//                       return (
//                         <tr key={row.student_id} className="hover:bg-slate-50 transition">
//                           <td className="p-1.5 text-center font-mono text-slate-400 border-r border-slate-200">
//                             {idx + 1}
//                           </td>
//                           <td className="p-1.5 font-mono text-slate-600 border-r border-slate-200">
//                             {row.nisn || '-'}
//                           </td>
//                           <td className="p-1.5 font-bold text-slate-800 border-r border-slate-200 truncate max-w-[160px]">
//                             {row.full_name}
//                           </td>
//                           <td className="p-1.5 text-center font-semibold border-r border-slate-200">
//                             {row.gender}
//                           </td>

//                           {/* Isi Status Per Tanggal */}
//                           {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
//                             const st = row.daily[String(d)] || '-';
//                             return (
//                               <td
//                                 key={d}
//                                 className={`p-1 text-center font-bold border-r border-slate-100 font-mono ${
//                                   st === 'H'
//                                     ? 'text-emerald-700 bg-emerald-50/50'
//                                     : st === 'S'
//                                     ? 'text-amber-700 bg-amber-100/60'
//                                     : st === 'I'
//                                     ? 'text-blue-700 bg-blue-100/60'
//                                     : st === 'A'
//                                     ? 'text-rose-700 bg-rose-200/80'
//                                     : 'text-slate-300'
//                                 }`}
//                               >
//                                 {st}
//                               </td>
//                             );
//                           })}

//                           {/* Total Rekapitulasi di Ujung Kanan */}
//                           <td className="p-1.5 text-center font-extrabold text-emerald-700 bg-emerald-50 border-r border-slate-200">
//                             {row.total_hadir}
//                           </td>
//                           <td className="p-1.5 text-center font-extrabold text-amber-700 bg-amber-50 border-r border-slate-200">
//                             {row.total_sakit}
//                           </td>
//                           <td className="p-1.5 text-center font-extrabold text-blue-700 bg-blue-50 border-r border-slate-200">
//                             {row.total_izin}
//                           </td>
//                           <td className="p-1.5 text-center font-extrabold text-rose-700 bg-rose-50 border-r border-slate-200">
//                             {row.total_alpa}
//                           </td>
//                           <td className="p-1.5 text-center font-black text-slate-800 bg-slate-100">
//                             {totalAll}
//                           </td>
//                         </tr>
//                       );
//                     })}
//                   </tbody>
//                 </table>
//               </div>
//             )}
//           </div>
//         </div>
//       )}







//     </div>
//   );
// }




'use client';

import { useState, useEffect, useMemo } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import XLSX from 'xlsx-js-style';
import {
  Calendar as CalendarIcon,
  CheckCircle2,
  Save,
  RefreshCw,
  Search,
  BookOpen,
  BarChart2,
  ClipboardList,
  UserCheck,
  UserX,
  AlertCircle,
  HelpCircle,
  Download,
  Phone,
  AlertTriangle,
  History, 
  Lock, 
  Unlock,
  Edit3,
  ShieldCheck
} from 'lucide-react';

interface StudentClass {
  id: number;
  name: string;
}

interface Student {
  id: number;
  nisn: string;
  full_name: string;
  gender: 'L' | 'P';
  parent_phone_number?: string;
}

interface AttendanceItem {
  student_id: number;
  status: 'PRESENT' | 'SICK' | 'PERMIT' | 'ABSENT';
  notes: string;
}

interface ClassAttendanceMonitor {
  class_id: number;
  class_name: string;
  homeroom_teacher: string;
  total_students: number;
  recorded_students: number;
  status: 'COMPLETED' | 'PARTIAL' | 'NOT_STARTED';
  present_count: number;
  sick_count: number;
  permit_count: number;
  absent_count: number;
  updated_at?: string;
}

interface AttendanceSummaryItem {
  student_id: number;
  student_name: string;
  nisn: string;
  total_days: number;
  hadir: number;
  sakit: number;
  izin: number;
  alpa: number;
  attendance_percentage: number;
  parent_phone_number?: string;
}

export default function AttendancePage() {
  const [activeTab, setActiveTab] = useState<'daily' | 'summary' | 'monitoring'>('daily');

  // Master Data State
  const [classes, setClasses] = useState<StudentClass[]>([]);
  const [selectedClassId, setSelectedClassId] = useState<string>('');
  const [students, setStudents] = useState<Student[]>([]);
  const [loadingStudents, setLoadingStudents] = useState(false);

  // Daily Attendance State
  const [date, setDate] = useState<string>('');
  const [attendances, setAttendances] = useState<Record<number, AttendanceItem>>({});
  const [submitting, setSubmitting] = useState(false);
  const [isSaved, setIsSaved] = useState<boolean>(false);
  const [isLocked, setIsLocked] = useState<boolean>(false); // LOCK STATE

  // Summary State
  const [summaryMonth, setSummaryMonth] = useState<number>(0);
  const [summaryYear, setSummaryYear] = useState<number>(0);
  const [summaryData, setSummaryData] = useState<AttendanceSummaryItem[]>([]);
  const [loadingSummary, setLoadingSummary] = useState(false);
  const [filterLowAttendance, setFilterLowAttendance] = useState<boolean>(false);

  // Filter Search Nama
  const [searchQuery, setSearchQuery] = useState('');

  // Info Wali Kelas
  const [homeroomTeacher, setHomeroomTeacher] = useState<string>('-');

  // Monitoring State
  const [monitoringData, setMonitoringData] = useState<ClassAttendanceMonitor[]>([]);
  const [loadingMonitoring, setLoadingMonitoring] = useState(false);

  // Matrix State
  const [matrixData, setMatrixData] = useState<any[]>([]);
  const [daysInMonth, setDaysInMonth] = useState<number>(31);
  const [loadingMatrix, setLoadingMatrix] = useState(false);

  // Audit Log State
  const [isLogModalOpen, setIsLogModalOpen] = useState(false);
  const [selectedStudentLogs, setSelectedStudentLogs] = useState<{
    studentName: string;
    recordedBy: string;
    createdAt: string;
  } | null>(null);

  useEffect(() => {
    const now = new Date();
    setDate(now.toISOString().split('T')[0]);
    setSummaryMonth(now.getMonth() + 1);
    setSummaryYear(now.getFullYear());
  }, []);

  // Fetch Daftar Kelas
  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/students/classes/?page_size=100');
        const classList = res.data.results || res.data || [];
        setClasses(classList);
        if (classList.length > 0) {
          setSelectedClassId(String(classList[0].id));
        }
      } catch (err) {
        toast.error('Gagal memuat daftar kelas.');
      }
    };
    fetchClasses();
  }, []);

  // Fetch Siswa & Data Absensi Eksisting
  useEffect(() => {
    if (!selectedClassId || !date) return;

    const fetchStudentsAndExistingAttendance = async () => {
      setLoadingStudents(true);
      try {
        const resStudents = await api.get(`/students/students/?class_id=${selectedClassId}&page_size=200`);
        const studentList: Student[] = resStudents.data.results || resStudents.data || [];
        setStudents(studentList);

        const resAttendance = await api.get(
          `/attendance/attendances/?class_id=${selectedClassId}&date=${date}`
        );
        const existingData: any[] = resAttendance.data.results || resAttendance.data || [];

        const hasExisting = existingData.length > 0;
        setIsSaved(hasExisting);
        setIsLocked(hasExisting); // Otomatis Kunci Jika Data Sudah Ada

        const attendanceMap: Record<number, AttendanceItem> = {};
        studentList.forEach((s) => {
          const found = existingData.find((a) => a.student === s.id);
          attendanceMap[s.id] = {
            student_id: s.id,
            status: found ? found.status : 'PRESENT',
            notes: found ? found.notes || '' : '',
          };
        });

        setAttendances(attendanceMap);
      } catch (err) {
        toast.error('Gagal memuat data siswa/absensi.');
      } finally {
        setLoadingStudents(false);
      }
    };

    if (activeTab === 'daily') {
      fetchStudentsAndExistingAttendance();
    }
  }, [selectedClassId, date, activeTab]);

  // Fetch Summary Bulanan
  const fetchSummary = async () => {
    if (!selectedClassId || !summaryMonth || !summaryYear) return;
    setLoadingSummary(true);
    try {
      const res = await api.get(
        `/attendance/attendances/summary/?class_id=${selectedClassId}&month=${summaryMonth}&year=${summaryYear}`
      );
      setSummaryData(res.data.students_summary || []);
    } catch (err: any) {
      toast.error(err.response?.data?.error || 'Gagal memuat rekapitulasi absensi.');
    } finally {
      setLoadingSummary(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'summary' && summaryMonth > 0 && summaryYear > 0) {
      fetchSummary();
    }
  }, [selectedClassId, summaryMonth, summaryYear, activeTab]);

  const fetchMonitoringData = async () => {
    if (!date) return;
    setLoadingMonitoring(true);
    try {
      const res = await api.get(`/attendance/attendances/monitoring/?date=${date}`);
      setMonitoringData(res.data.classes_monitoring || res.data || []);
    } catch (err) {
      toast.error('Gagal memuat status monitoring presensi kelas.');
    } finally {
      setLoadingMonitoring(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'monitoring' && date) {
      fetchMonitoringData();
    }
  }, [activeTab, date]);

  const fetchMatrixData = async () => {
    if (!selectedClassId || !summaryMonth || !summaryYear) return;
    setLoadingMatrix(true);
    try {
      const res = await api.get(
        `/attendance/attendances/matrix/?class_id=${selectedClassId}&month=${summaryMonth}&year=${summaryYear}`
      );
      setMatrixData(res.data.matrix || []);
      setDaysInMonth(res.data.days_in_month || 31);
      setHomeroomTeacher(res.data.homeroom_teacher || '-');
    } catch (err: any) {
      console.error('Error Matrix:', err);
      toast.error('Gagal memuat matriks presensi.');
    } finally {
      setLoadingMatrix(false);
    }
  };

  useEffect(() => {
    if (activeTab === 'monitoring') {
      fetchMatrixData();
    }
  }, [selectedClassId, summaryMonth, summaryYear, activeTab]);

  // Handlers Status & Notes Change
  const handleStatusChange = (studentId: number, status: 'PRESENT' | 'SICK' | 'PERMIT' | 'ABSENT') => {
    if (isLocked) return;
    setIsSaved(false);
    setAttendances((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], status },
    }));
  };

  const handleNotesChange = (studentId: number, notes: string) => {
    if (isLocked) return;
    setIsSaved(false);
    setAttendances((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], notes },
    }));
  };

  const handleShowLog = (student: Student) => {
    const currentAtt = attendances[student.id];
    setSelectedStudentLogs({
      studentName: student.full_name,
      recordedBy: currentAtt ? 'Guru / Wali Kelas' : 'Belum diisi',
      createdAt: date,
    });
    setIsLogModalOpen(true);
  };

  const handleMarkAllPresent = () => {
    if (isLocked) return;
    setIsSaved(false);
    setAttendances((prev) => {
      const updated = { ...prev };
      Object.keys(updated).forEach((id) => {
        updated[Number(id)] = {
          ...updated[Number(id)],
          status: 'PRESENT',
        };
      });
      return updated;
    });
    toast.success('Semua siswa ditandai HADIR.');
  };

  const handleSaveAttendance = async () => {
    if (!selectedClassId || !date || isLocked) return;

    const payload = {
      class_id: Number(selectedClassId),
      date: date,
      attendances: Object.values(attendances),
    };

    setSubmitting(true);
    const toastId = toast.loading('Menyimpan data absensi...');

    try {
      const res = await api.post('/attendance/attendances/bulk-create/', payload);
      toast.success(res.data.message || 'Absensi berhasil disimpan!', { id: toastId });
      setIsSaved(true);
      setIsLocked(true); // Otomatis Kunci Setelah Simpan
    } catch (err: any) {
      const errorMsg = err.response?.data?.error || 'Gagal menyimpan absensi.';
      toast.error(errorMsg, { id: toastId });
    } finally {
      setSubmitting(false);
    }
  };

  // Navigasi Lompat dari Matriks (Tab 3) ke Tab 1 (Input Absensi)
  const handleJumpToDaily = (dayNumber: number) => {
    const formattedDay = String(dayNumber).padStart(2, '0');
    const formattedMonth = String(summaryMonth).padStart(2, '0');
    const targetDate = `${summaryYear}-${formattedMonth}-${formattedDay}`;

    setDate(targetDate);
    setActiveTab('daily');
    toast.success(`Membuka absensi tanggal ${dayNumber}`);
  };

  // Export Excel Rekap Bulanan
  const handleExportSummaryExcel = () => {
    if (summaryData.length === 0) {
      toast.error('Tidak ada data rekapitulasi untuk diexport.');
      return;
    }

    const selectedClassName = classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas';
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthLabel = monthNames[summaryMonth - 1] || summaryMonth;

    const titleRow = [[`REKAPITULASI PRESENSI SISWA - KELAS ${String(selectedClassName).toUpperCase()}`]];
    const subTitleRow = [[`PERIODE: ${String(monthLabel).toUpperCase()} ${summaryYear}`]];
    const emptyRow = [[]];
    const headers = [
      'No',
      'NISN',
      'Nama Siswa',
      'Total Hari',
      'Hadir',
      'Izin',
      'Sakit',
      'Alpa',
      'Persentase Kehadiran (%)',
    ];

    const dataRows = summaryData.map((item, index) => [
      index + 1,
      item.nisn || '-',
      item.student_name || '-',
      item.total_days || 0,
      item.hadir || 0,
      item.izin || 0,
      item.sakit || 0,
      item.alpa || 0,
      `${item.attendance_percentage}%`,
    ]);

    const sheetData = [...titleRow, ...subTitleRow, ...emptyRow, headers, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    worksheet['!cols'] = [
      { wch: 5 },  // No
      { wch: 15 }, // NISN
      { wch: 28 }, // Nama Siswa
      { wch: 12 }, // Total Hari
      { wch: 8 },  // Hadir
      { wch: 8 },  // Izin
      { wch: 8 },  // Sakit
      { wch: 8 },  // Alpa
      { wch: 22 }, // Persentase
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Rekap Absensi');
    XLSX.writeFile(
      workbook,
      `Rekap_Absensi_${String(selectedClassName).replace(/\s+/g, '_')}_${monthLabel}_${summaryYear}.xlsx`
    );

    toast.success('Berhasil mengunduh rekap absensi!');
  };

  // Export Excel khusus Grid Matriks Kalender (1 - 31)
  const handleExportMatrixExcel = () => {
    if (matrixData.length === 0) {
      toast.error('Tidak ada data matriks untuk diexport.');
      return;
    }

    const selectedClassName = classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas';
    const monthNames = [
      'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
      'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
    ];
    const monthLabel = monthNames[summaryMonth - 1] || summaryMonth;

    const titleRow = [[`MATRIKS PRESENSI SISWA - KELAS ${String(selectedClassName).toUpperCase()}`]];
    const subTitleRow1 = [[`WALI KELAS: ${String(homeroomTeacher || 'BELUM DIATUR').toUpperCase()}`]];
    const subTitleRow2 = [[`PERIODE: ${String(monthLabel).toUpperCase()} ${summaryYear}`]];
    const emptyRow = [[]];

    const dayHeaders = Array.from({ length: daysInMonth }, (_, i) => String(i + 1));
    const headers = ['No', 'NISN', 'Nama Siswa', 'L/P', ...dayHeaders, 'H', 'S', 'I', 'A', 'Total'];

    const dataRows = matrixData.map((row, idx) => {
      const dailyCells = Array.from({ length: daysInMonth }, (_, i) => {
        const status = row.daily[String(i + 1)];
        return status && status !== '-' ? status : '';
      });
      
      const totalAll = (row.total_hadir || 0) + (row.total_sakit || 0) + (row.total_izin || 0) + (row.total_alpa || 0);

      return [
        idx + 1,
        row.nisn || '-',
        row.full_name,
        row.gender,
        ...dailyCells,
        row.total_hadir,
        row.total_sakit,
        row.total_izin,
        row.total_alpa,
        totalAll,
      ];
    });

    const sheetData = [...titleRow, ...subTitleRow1, ...subTitleRow2, ...emptyRow, headers, ...dataRows];
    const worksheet = XLSX.utils.aoa_to_sheet(sheetData);

    const colors = {
      headerBg: "1E293B",
      headerText: "FFFFFF",
      rekapHeaderBg: "0F766E",
      hBg: "DCFCE7", hText: "15803D",
      sBg: "FEF3C7", sText: "B45309",
      iBg: "DBEAFE", iText: "1D4ED8",
      aBg: "FEE2E2", aText: "B91C1C",
      rekapBg: "F1F5F9"
    };

    const borderThin = {
      top: { style: "thin", color: { rgb: "E2E8F0" } },
      bottom: { style: "thin", color: { rgb: "E2E8F0" } },
      left: { style: "thin", color: { rgb: "E2E8F0" } },
      right: { style: "thin", color: { rgb: "E2E8F0" } }
    };

    const range = XLSX.utils.decode_range(worksheet['!ref'] || 'A1:A1');
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 4, c: C });
      if (!worksheet[cellAddress]) continue;
      
      const isRekap = C >= range.e.c - 4;
      worksheet[cellAddress].s = {
        font: { bold: true, color: { rgb: colors.headerText }, sz: 10 },
        fill: { fgColor: { rgb: isRekap ? colors.rekapHeaderBg : colors.headerBg } },
        alignment: { horizontal: "center", vertical: "center" },
        border: borderThin
      };
    }

    for (let R = 5; R <= range.e.r; ++R) {
      for (let C = 0; C <= range.e.c; ++C) {
        const cellAddress = XLSX.utils.encode_cell({ r: R, c: C });
        const cell = worksheet[cellAddress];
        if (!cell) continue;

        let cellStyle: any = {
          alignment: { horizontal: C === 2 ? "left" : "center", vertical: "center" },
          border: borderThin,
          font: { sz: 10 }
        };

        if (C >= 4 && C < 4 + daysInMonth) {
          const val = String(cell.v || '').toUpperCase();
          if (val === 'H') {
            cellStyle.fill = { fgColor: { rgb: colors.hBg } };
            cellStyle.font = { bold: true, color: { rgb: colors.hText } };
          } else if (val === 'S') {
            cellStyle.fill = { fgColor: { rgb: colors.sBg } };
            cellStyle.font = { bold: true, color: { rgb: colors.sText } };
          } else if (val === 'I') {
            cellStyle.fill = { fgColor: { rgb: colors.iBg } };
            cellStyle.font = { bold: true, color: { rgb: colors.iText } };
          } else if (val === 'A') {
            cellStyle.fill = { fgColor: { rgb: colors.aBg } };
            cellStyle.font = { bold: true, color: { rgb: colors.aText } };
          }
        }

        if (C >= range.e.c - 4) {
          cellStyle.font = { bold: true };
          cellStyle.fill = { fgColor: { rgb: colors.rekapBg } };
        }

        cell.s = cellStyle;
      }
    }

    worksheet['!cols'] = [
      { wch: 4 },
      { wch: 14 },
      { wch: 28 },
      { wch: 5 },
      ...Array.from({ length: daysInMonth }, () => ({ wch: 3.2 })),
      { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 5 }, { wch: 7 },
    ];

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Matriks Presensi');
    XLSX.writeFile(
      workbook,
      `Matriks_Presensi_${String(selectedClassName).replace(/\s+/g, '_')}_${monthLabel}_${summaryYear}.xlsx`
    );

    toast.success('Berhasil mengunduh Matriks Presensi Excel!');
  };

  // Calculations
  const attendanceList = Object.values(attendances);
  const countPresent = attendanceList.filter((a) => a.status === 'PRESENT').length;
  const countPermit = attendanceList.filter((a) => a.status === 'PERMIT').length;
  const countSick = attendanceList.filter((a) => a.status === 'SICK').length;
  const countAbsent = attendanceList.filter((a) => a.status === 'ABSENT').length;

  const filteredStudents = students.filter(
    (s) =>
      s.full_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.nisn?.includes(searchQuery)
  );

  const filteredSummary = summaryData
    .filter(
      (item) =>
        item.student_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.nisn?.includes(searchQuery)
    )
    .filter((item) => (filterLowAttendance ? item.attendance_percentage < 85 : true));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Presensi & Absensi Siswa</h1>
          <p className="text-slate-500 text-sm mt-1">
            Catat Kehadiran Harian dan Pantau Rekapitulasi Presensi Kelas.
          </p>
        </div>

        {/* Tab Navigation */}
        <div className="flex bg-slate-100 p-1 rounded-xl border border-slate-200">
          <button
            onClick={() => setActiveTab('daily')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'daily'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <ClipboardList className="w-4 h-4" />
            Input Absensi
          </button>

          <button
            onClick={() => setActiveTab('summary')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'summary'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BarChart2 className="w-4 h-4" />
            Rekap Bulanan
          </button>

          <button
            onClick={() => setActiveTab('monitoring')}
            className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-semibold transition ${
              activeTab === 'monitoring'
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Monitoring Live
          </button>
        </div>
      </div>

      {/* Filter Bar Global */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="flex flex-col md:flex-row items-center gap-3 w-full md:w-auto">
          {/* Dropdown Pilih Kelas */}
          <div className="flex items-center gap-2 w-full md:w-auto">
            <BookOpen className="w-4 h-4 text-blue-600 shrink-0" />
            <select
              value={selectedClassId}
              onChange={(e) => setSelectedClassId(e.target.value)}
              className="w-full md:w-56 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
            >
              {classes.length === 0 && <option value="">Tidak ada kelas</option>}
              {classes.map((cls) => (
                <option key={cls.id} value={cls.id}>
                  {cls.name}
                </option>
              ))}
            </select>
          </div>

          {/* Controls TAB 1: Daily */}
          {activeTab === 'daily' && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <CalendarIcon className="w-4 h-4 text-blue-600 shrink-0" />
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full md:w-auto px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          )}

          {/* Controls TAB 2 & 3: Summary & Monitoring */}
          {(activeTab === 'summary' || activeTab === 'monitoring') && (
            <div className="flex items-center gap-2 w-full md:w-auto">
              <select
                value={summaryMonth}
                onChange={(e) => setSummaryMonth(Number(e.target.value))}
                className="px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              >
                {[
                  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
                  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'
                ].map((m, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {m}
                  </option>
                ))}
              </select>
              <input
                type="number"
                value={summaryYear}
                onChange={(e) => setSummaryYear(Number(e.target.value))}
                className="w-24 px-3 py-2 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-medium"
              />
            </div>
          )}
        </div>

{/* Tombol Aksi Kanan Sesuai Tab */}
        <div className="flex items-center gap-2 w-full md:w-auto justify-end">
          {activeTab === 'daily' && (
            <>
              {isLocked ? (
                <div className="flex items-center gap-2">
                  <span className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 text-slate-700 rounded-lg text-xs font-bold border border-slate-200">
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                    Data Terkunci (Read-Only)
                  </span>
                  <button
                    onClick={() => setIsLocked(false)}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-amber-500 hover:bg-amber-600 text-white text-xs font-bold rounded-lg transition shadow-sm"
                  >
                    <Edit3 className="w-4 h-4" />
                    Buka Kunci untuk Edit
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={handleMarkAllPresent}
                    disabled={loadingStudents || students.length === 0}
                    className="flex items-center gap-1.5 px-3.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-lg transition disabled:opacity-50"
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Set Semua Hadir
                  </button>
                  <button
                    onClick={handleSaveAttendance}
                    disabled={submitting || loadingStudents || students.length === 0}
                    className="flex items-center gap-1.5 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
                  >
                    <Save className="w-4 h-4" />
                    {submitting ? 'Menyimpan...' : 'Simpan Absensi'}
                  </button>
                </>
              )}
            </>
          )}

          {activeTab === 'summary' && (
            <button
              onClick={handleExportSummaryExcel}
              disabled={loadingSummary || summaryData.length === 0}
              className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50 w-full md:w-auto justify-center"
            >
              <Download className="w-4 h-4" />
              Export Rekap Excel
            </button>
          )}

          {activeTab === 'monitoring' && (
            <button
              onClick={handleExportMatrixExcel}
              disabled={loadingMatrix || matrixData.length === 0}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg transition shadow-sm disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              Export Matriks Excel
            </button>
          )}
        </div>
      </div>

      {/* TAB 1: INPUT ABSENSI HARIAN */}
      {activeTab === 'daily' && (
        <div className="space-y-4">
          {/* Counter Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
            <div className="bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-slate-500 block">Total Siswa</span>
                <span className="text-lg font-bold text-slate-800">{students.length}</span>
              </div>
              <div className="p-2 bg-slate-100 text-slate-600 rounded-lg">
                <BookOpen className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-emerald-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-emerald-600 font-semibold block">Hadir</span>
                <span className="text-lg font-bold text-emerald-700">{countPresent}</span>
              </div>
              <div className="p-2 bg-emerald-50 text-emerald-600 rounded-lg">
                <UserCheck className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-blue-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-blue-600 font-semibold block">Izin</span>
                <span className="text-lg font-bold text-blue-700">{countPermit}</span>
              </div>
              <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <HelpCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-amber-100 shadow-sm flex items-center justify-between">
              <div>
                <span className="text-xs text-amber-600 font-semibold block">Sakit</span>
                <span className="text-lg font-bold text-amber-700">{countSick}</span>
              </div>
              <div className="p-2 bg-amber-50 text-amber-600 rounded-lg">
                <AlertCircle className="w-4 h-4" />
              </div>
            </div>

            <div className="bg-white p-3.5 rounded-xl border border-rose-100 shadow-sm flex items-center justify-between col-span-2 md:col-span-1">
              <div>
                <span className="text-xs text-rose-600 font-semibold block">Alpa</span>
                <span className="text-lg font-bold text-rose-700">{countAbsent}</span>
              </div>
              <div className="p-2 bg-rose-50 text-rose-600 rounded-lg">
                <UserX className="w-4 h-4" />
              </div>
            </div>
          </div>

          {/* Tabel Input Absensi */}
          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="relative flex-1 max-w-sm">
                <input
                  type="text"
                  placeholder="Cari Nama atau NISN..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
              </div>

              <div>
                {isLocked ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                    <Lock className="w-3 h-3 text-slate-500" />
                    Data Terkunci (Read-Only)
                  </span>
                ) : isSaved ? (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                    <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                    Sudah Disimpan
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                    <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                    Belum Disimpan
                  </span>
                )}
              </div>
            </div>

            {loadingStudents ? (
              <div className="p-12 text-center text-slate-500 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                <span>Memuat data siswa & presensi...</span>
              </div>
            ) : filteredStudents.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Tidak ada data siswa ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-4 py-3.5 w-12 text-center">No</th>
                      <th className="px-6 py-3.5">NISN / Nama Siswa</th>
                      <th className="px-6 py-3.5 text-center">Status Kehadiran</th>
                      <th className="px-6 py-3.5">Catatan / Keterangan</th>
                      <th className="px-4 py-3.5 text-center">Audit Log</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {filteredStudents.map((student, idx) => {
                      const currentAtt = attendances[student.id] || {
                        status: 'PRESENT',
                        notes: '',
                      };

                      return (
                        <tr key={student.id} className="hover:bg-slate-50/80 transition">
                          <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400">
                            {idx + 1}
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="font-semibold text-slate-900">{student.full_name}</div>
                            <div className="text-xs text-slate-400 font-mono">
                              NISN: {student.nisn || '-'} {student.gender ? `(${student.gender})` : ''}
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <div className="flex items-center justify-center gap-1.5">
                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleStatusChange(student.id, 'PRESENT')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60 ${
                                  currentAtt.status === 'PRESENT'
                                    ? 'bg-emerald-600 text-white shadow-sm ring-2 ring-emerald-600/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Hadir
                              </button>

                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleStatusChange(student.id, 'PERMIT')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60 ${
                                  currentAtt.status === 'PERMIT'
                                    ? 'bg-blue-600 text-white shadow-sm ring-2 ring-blue-600/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Izin
                              </button>

                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleStatusChange(student.id, 'SICK')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60 ${
                                  currentAtt.status === 'SICK'
                                    ? 'bg-amber-500 text-white shadow-sm ring-2 ring-amber-500/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Sakit
                              </button>

                              <button
                                type="button"
                                disabled={isLocked}
                                onClick={() => handleStatusChange(student.id, 'ABSENT')}
                                className={`px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-60 ${
                                  currentAtt.status === 'ABSENT'
                                    ? 'bg-rose-600 text-white shadow-sm ring-2 ring-rose-600/30'
                                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                                }`}
                              >
                                Alpa
                              </button>
                            </div>
                          </td>
                          <td className="px-6 py-3.5">
                            <input
                              type="text"
                              disabled={isLocked}
                              placeholder="Alasan / Catatan (Opsional)"
                              value={currentAtt.notes}
                              onChange={(e) => handleNotesChange(student.id, e.target.value)}
                              className="w-full px-3 py-1.5 border border-slate-200 rounded-lg text-xs focus:outline-none focus:ring-1 focus:ring-blue-500 disabled:bg-slate-100 disabled:text-slate-500"
                            />
                          </td>
                          <td className="px-4 py-3.5 text-center">
                            <button
                              type="button"
                              onClick={() => handleShowLog(student)}
                              className="p-1.5 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition"
                              title="Lihat Riwayat Pengisian"
                            >
                              <History className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modal Audit Log */}
      {isLogModalOpen && selectedStudentLogs && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-2xl max-w-sm w-full p-6 border border-slate-100">
            <div className="flex items-center gap-3 pb-3 border-b border-slate-100">
              <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-slate-800">Audit Log Presensi</h3>
                <p className="text-xs text-slate-500">{selectedStudentLogs.studentName}</p>
              </div>
            </div>

            <div className="my-4 space-y-3 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl space-y-1.5 border border-slate-100">
                <div className="flex justify-between text-slate-500">
                  <span>Tanggal Presensi:</span>
                  <span className="font-semibold text-slate-700">{selectedStudentLogs.createdAt}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Dicatat / Diperbarui Oleh:</span>
                  <span className="font-semibold text-blue-600">{selectedStudentLogs.recordedBy}</span>
                </div>
                <div className="flex justify-between text-slate-500">
                  <span>Status Keamanan:</span>
                  <span className="font-semibold text-emerald-600 flex items-center gap-1">
                    <Lock className="w-3 h-3" /> Validated
                  </span>
                </div>
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="button"
                onClick={() => setIsLogModalOpen(false)}
                className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-xs transition"
              >
                Tutup
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: REKAPITULASI BULANAN */}
      {activeTab === 'summary' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="relative flex-1 max-w-sm w-full">
              <input
                type="text"
                placeholder="Cari Nama atau NISN..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-1.5 border border-slate-300 rounded-lg text-xs focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={() => setFilterLowAttendance(!filterLowAttendance)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-lg text-xs font-bold transition border ${
                filterLowAttendance
                  ? 'bg-rose-50 text-rose-700 border-rose-200 shadow-sm'
                  : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-600" />
              <span>Hanya Kehadiran &lt; 85%</span>
            </button>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingSummary ? (
              <div className="p-12 text-center text-slate-500 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                <span>Memuat rekapitulasi absensi...</span>
              </div>
            ) : filteredSummary.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-sm">
                Tidak ada data rekapitulasi absensi ditemukan.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-slate-50 border-b border-slate-200 text-xs font-semibold text-slate-600 uppercase">
                    <tr>
                      <th className="px-4 py-3.5 w-12 text-center">No</th>
                      <th className="px-6 py-3.5">NISN / Nama Siswa</th>
                      <th className="px-4 py-3.5 text-center bg-emerald-50 text-emerald-700">Hadir</th>
                      <th className="px-4 py-3.5 text-center bg-blue-50 text-blue-700">Izin</th>
                      <th className="px-4 py-3.5 text-center bg-amber-50 text-amber-700">Sakit</th>
                      <th className="px-4 py-3.5 text-center bg-rose-50 text-rose-700">Alpa</th>
                      <th className="px-6 py-3.5 text-center">Persentase (%)</th>
                      <th className="px-4 py-3.5 text-center">Aksi OrtU</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-sm text-slate-700">
                    {filteredSummary.map((item, idx) => (
                      <tr
                        key={item.student_id}
                        className={`hover:bg-slate-50 transition ${
                          item.attendance_percentage < 85 ? 'bg-rose-50/20' : ''
                        }`}
                      >
                        <td className="px-4 py-3.5 text-center font-mono text-xs text-slate-400">
                          {idx + 1}
                        </td>
                        <td className="px-6 py-3.5">
                          <div className="font-semibold text-slate-900">{item.student_name}</div>
                          <div className="text-xs text-slate-400 font-mono">NISN: {item.nisn}</div>
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-emerald-600">
                          {item.hadir}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-blue-600">
                          {item.izin}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-amber-600">
                          {item.sakit}
                        </td>
                        <td className="px-4 py-3.5 text-center font-bold text-rose-600">
                          {item.alpa}
                        </td>
                        <td className="px-6 py-3.5 text-center">
                          <span
                            className={`inline-block px-2.5 py-1 rounded-full text-xs font-extrabold ${
                              item.attendance_percentage >= 85
                                ? 'bg-emerald-100 text-emerald-800'
                                : item.attendance_percentage >= 70
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {item.attendance_percentage}%
                          </span>
                        </td>
                        <td className="px-4 py-3.5 text-center">
                          {item.parent_phone_number ? (
                            <a
                              href={`https://wa.me/${item.parent_phone_number.replace(
                                /^0/,
                                '62'
                              )}?text=${encodeURIComponent(
                                `Halo Bpk/Ibu, menginfokan rekap presensi ananda ${item.student_name} pada bulan ini: Hadir:${item.hadir}, Sakit: ${item.sakit}, Izin:${item.izin}, Alpa: ${item.alpa} (${item.attendance_percentage}%). Terima kasih.`
                              )}`}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg text-xs font-semibold transition"
                              title="Kirim Lap. Presensi via WA"
                            >
                              <Phone className="w-3.5 h-3.5 text-emerald-600" />
                              <span>WA OrtU</span>
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400 italic">-</span>
                          )}
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

      {/* TAB 3: MONITORING REAL-TIME / MATRIKS PRESENSI BULANAN */}
      {activeTab === 'monitoring' && (
        <div className="space-y-3">
          <div className="bg-white px-4 py-3 rounded-xl border border-slate-200 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div className="flex items-center gap-2 text-xs">
              <span className="font-bold text-slate-800 uppercase tracking-wide">
                {classes.find((c) => String(c.id) === selectedClassId)?.name || 'Kelas'}
              </span>
              {homeroomTeacher && homeroomTeacher !== '-' && (
                <>
                  <span className="text-slate-300">|</span>
                  <span className="text-slate-600 font-medium">
                    Wali Kelas: <strong className="text-slate-800">{homeroomTeacher}</strong>
                  </span>
                </>
              )}
            </div>

            <div className="flex items-center gap-2 text-[11px] font-bold">
              <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 rounded">H: Hadir</span>
              <span className="px-2 py-0.5 bg-amber-100 text-amber-800 rounded">S: Sakit</span>
              <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded">I: Izin</span>
              <span className="px-2 py-0.5 bg-rose-100 text-rose-800 rounded">A: Alpa</span>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
            {loadingMatrix ? (
              <div className="p-10 text-center text-slate-500 flex items-center justify-center">
                <RefreshCw className="w-5 h-5 animate-spin text-blue-600 mr-2" />
                <span className="text-xs font-semibold">Memuat matriks presensi...</span>
              </div>
            ) : matrixData.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs font-medium">
                Tidak ada data presensi untuk kelas dan periode ini.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse text-[10px]">
                  <thead>
                    <tr className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold uppercase">
                      <th className="p-1.5 w-6 text-center border-r border-slate-200">No</th>
                      <th className="p-1.5 w-24 border-r border-slate-200">NISN</th>
                      <th className="p-1.5 w-40 border-r border-slate-200">Nama Siswa</th>
                      <th className="p-1.5 w-6 text-center border-r border-slate-200">L/P</th>

                      {/* Header Tanggal 1 s/d N (KLIK UNTUK LOMPAT KE TAB 1) */}
                      {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => (
                        <th
                          key={d}
                          onClick={() => handleJumpToDaily(d)}
                          className="p-1 w-6 text-center border-r border-slate-200 font-mono bg-slate-50 text-slate-800 cursor-pointer hover:bg-blue-600 hover:text-white transition group"
                          title={`Klik untuk ubah / lihat absensi tanggal ${d}`}
                        >
                          {d}
                        </th>
                      ))}

                      <th className="p-1.5 w-6 text-center bg-emerald-100 text-emerald-900 border-r border-slate-200 font-black">H</th>
                      <th className="p-1.5 w-6 text-center bg-amber-100 text-amber-900 border-r border-slate-200 font-black">S</th>
                      <th className="p-1.5 w-6 text-center bg-blue-100 text-blue-900 border-r border-slate-200 font-black">I</th>
                      <th className="p-1.5 w-6 text-center bg-rose-100 text-rose-900 border-r border-slate-200 font-black">A</th>
                      <th className="p-1.5 w-8 text-center bg-slate-200 text-slate-800 font-black">TOTAL</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 text-slate-700">
                    {matrixData.map((row, idx) => {
                      const totalAll = (row.total_hadir || 0) + (row.total_sakit || 0) + (row.total_izin || 0) + (row.total_alpa || 0);

                      return (
                        <tr key={row.student_id} className="hover:bg-slate-50 transition">
                          <td className="p-1.5 text-center font-mono text-slate-400 border-r border-slate-200">
                            {idx + 1}
                          </td>
                          <td className="p-1.5 font-mono text-slate-600 border-r border-slate-200">
                            {row.nisn || '-'}
                          </td>
                          <td className="p-1.5 font-bold text-slate-800 border-r border-slate-200 truncate max-w-[160px]">
                            {row.full_name}
                          </td>
                          <td className="p-1.5 text-center font-semibold border-r border-slate-200">
                            {row.gender}
                          </td>

                          {/* Sel Status Per Tanggal (KLIK UNTUK LOMPAT KE TAB 1) */}
                          {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
                            const st = row.daily[String(d)] || '-';
                            return (
                              <td
                                key={d}
                                onClick={() => handleJumpToDaily(d)}
                                className={`p-1 text-center font-bold border-r border-slate-100 font-mono cursor-pointer hover:ring-2 hover:ring-blue-500 transition ${
                                  st === 'H'
                                    ? 'text-emerald-700 bg-emerald-50/50'
                                    : st === 'S'
                                    ? 'text-amber-700 bg-amber-100/60'
                                    : st === 'I'
                                    ? 'text-blue-700 bg-blue-100/60'
                                    : st === 'A'
                                    ? 'text-rose-700 bg-rose-200/80'
                                    : 'text-slate-300'
                                }`}
                                title={`Klik untuk ubah absensi tanggal ${d}`}
                              >
                                {st}
                              </td>
                            );
                          })}

                          <td className="p-1.5 text-center font-extrabold text-emerald-700 bg-emerald-50 border-r border-slate-200">
                            {row.total_hadir}
                          </td>
                          <td className="p-1.5 text-center font-extrabold text-amber-700 bg-amber-50 border-r border-slate-200">
                            {row.total_sakit}
                          </td>
                          <td className="p-1.5 text-center font-extrabold text-blue-700 bg-blue-50 border-r border-slate-200">
                            {row.total_izin}
                          </td>
                          <td className="p-1.5 text-center font-extrabold text-rose-700 bg-rose-50 border-r border-slate-200">
                            {row.total_alpa}
                          </td>
                          <td className="p-1.5 text-center font-black text-slate-800 bg-slate-100">
                            {totalAll}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}