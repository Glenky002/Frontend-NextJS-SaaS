'use client';

import { useState, useEffect } from 'react';
import { api } from '@/lib/api';
import toast from 'react-hot-toast';
import { useAuthStore } from '@/store/authStore';
import { 
  Plus, Search, Shield, X, Edit2, Trash2, AlertOctagon, 
  Users, UserCheck, Briefcase, Download, Phone, MapPin, Mail, 
  KeyRound, ChevronLeft, ChevronRight, Filter, User, Lock
} from 'lucide-react';

interface Teacher {
  id: number;
  username: string;
  email: string;
  full_name: string;
  nip: string;
  role: 'ADMIN' | 'TEACHER' | 'STAFF';
  gender: 'L' | 'P';
  main_subject: string;
  phone_number: string;
  address: string;
}

export default function TeachersPage() {
  const user = useAuthStore((state) => state.user);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [mounted, setMounted] = useState(false);

  // Filters State
  const [roleFilter, setRoleFilter] = useState<string>('ALL');
  const [genderFilter, setGenderFilter] = useState<string>('ALL');
  const [completenessFilter, setCompletenessFilter] = useState<string>('ALL');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  useEffect(() => {
    setMounted(true);
  }, []);

  // Modals & Drawers State
  const [selectedTeacher, setSelectedTeacher] = useState<Teacher | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isResetPasswordModalOpen, setIsResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  // Form States
  const [editForm, setEditForm] = useState<Partial<Teacher>>({});
  const [addForm, setAddForm] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'TEACHER',
    nip: '',
    gender: 'L',
    main_subject: '',
    phone_number: '',
    address: '',
  });

  // Evaluasi Role Aktif
  const getCurrentRole = () => {
    if (!mounted) return '';
    if (user?.role) return user.role.toUpperCase();
    if (typeof window !== 'undefined') {
      const rawUser = localStorage.getItem('user_data');
      if (rawUser) {
        try {
          const parsed = JSON.parse(rawUser);
          if (parsed.role) return parsed.role.toUpperCase();
        } catch (e) {}
      }
    }
    return '';
  };

  const currentRole = getCurrentRole();
  const isAdmin = currentRole === 'ADMIN' || currentRole === 'SUPERUSER';

  const fetchTeachers = async () => {
    try {
      setLoading(true);
      const res = await api.get('/users/teachers/');
      setTeachers(res.data);
    } catch (err: any) {
      toast.error('Gagal memuat data guru.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeachers();
  }, []);

  // Filter Data Multi-Kriteria
  const filteredTeachers = teachers.filter((t) => {
    const matchesSearch = 
      t.full_name?.toLowerCase().includes(search.toLowerCase()) ||
      t.username?.toLowerCase().includes(search.toLowerCase()) ||
      t.nip?.includes(search) ||
      t.main_subject?.toLowerCase().includes(search.toLowerCase());
    
    const matchesRole = roleFilter === 'ALL' || t.role === roleFilter;
    const matchesGender = genderFilter === 'ALL' || t.gender === genderFilter;
    
    const isComplete = t.full_name && t.nip && t.phone_number;
    const matchesCompleteness = 
      completenessFilter === 'ALL' || 
      (completenessFilter === 'COMPLETE' && isComplete) || 
      (completenessFilter === 'INCOMPLETE' && !isComplete);

    return matchesSearch && matchesRole && matchesGender && matchesCompleteness;
  });

  // Reset Halaman Saat Filter Berubah
  useEffect(() => {
    setCurrentPage(1);
  }, [search, roleFilter, genderFilter, completenessFilter]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredTeachers.length / itemsPerPage) || 1;
  const paginatedTeachers = filteredTeachers.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Export CSV
  const handleExportCSV = () => {
    if (filteredTeachers.length === 0) {
      toast.error('Tidak ada data untuk diexport.');
      return;
    }

    const headers = ['ID,Username,Nama Lengkap,NIP,Role,Jenis Kelamin,Mata Pelajaran,Email,No HP,Alamat\n'];
    const rows = filteredTeachers.map((t) => 
      `"${t.id}","${t.username}","${t.full_name || '-'}","${t.nip || '-'}","${t.role}","${t.gender === 'L' ? 'Laki-Laki' : 'Perempuan'}","${t.main_subject || '-'}","${t.email || '-'}","${t.phone_number || '-'}","${t.address || '-'}"`
    );

    const blob = new Blob([headers.concat(rows.join('\n')).join('')], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `Data_Guru_Staf_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('File CSV berhasil diunduh!');
  };

  // Handler Edit (PATCH)
  const handleEditSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher) return;

    setSubmitting(true);
    const toastId = toast.loading('Memperbarui data...');

    try {
      const payload: Record<string, any> = {};
      if (editForm.full_name !== undefined) payload.full_name = editForm.full_name;
      if (editForm.main_subject !== undefined) payload.main_subject = editForm.main_subject;
      if (editForm.phone_number !== undefined) payload.phone_number = editForm.phone_number;
      if (editForm.nip !== undefined) payload.nip = editForm.nip;
      if (editForm.gender !== undefined) payload.gender = editForm.gender;
      if (editForm.address !== undefined) payload.address = editForm.address;
      
      if (selectedTeacher.role !== 'ADMIN' && editForm.role) {
        payload.role = editForm.role;
      }

      const res = await api.patch(`/users/teachers/${selectedTeacher.id}/`, payload);
      toast.success('Data berhasil diperbarui!', { id: toastId });
      setSelectedTeacher(res.data);
      setIsEditing(false);
      fetchTeachers();
    } catch (err: any) {
      toast.dismiss(toastId);
      const data = err.response?.data;
      if (data) {
        if (typeof data === 'string') toast.error(data);
        else if (data.detail) toast.error(String(data.detail));
        else {
          const firstKey = Object.keys(data)[0];
          const firstVal = data[firstKey];
          const msg = Array.isArray(firstVal) ? firstVal[0] : firstVal;
          toast.error(`${firstKey}: ${msg}`);
        }
      } else {
        toast.error('Gagal memperbarui data.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Create (POST)
  const handleAddSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const toastId = toast.loading('Mendaftarkan akun baru...');

    try {
      await api.post('/users/teachers/', addForm);
      toast.success('Akun berhasil ditambahkan!', { id: toastId });
      setIsAddModalOpen(false);
      setAddForm({
        username: '', email: '', password: '', full_name: '',
        role: 'TEACHER', nip: '', gender: 'L', main_subject: '',
        phone_number: '', address: '',
      });
      fetchTeachers();
    } catch (err: any) {
      toast.dismiss(toastId);
      const data = err.response?.data;
      if (data) {
        if (data.username) toast.error(`Username: ${data.username[0]}`);
        else if (data.email) toast.error(`Email: ${data.email[0]}`);
        else if (data.password) toast.error(`Password: ${data.password[0]}`);
        else toast.error(data.detail || 'Gagal mendaftarkan akun.');
      } else {
        toast.error('Terjadi kesalahan sistem.');
      }
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Delete (DELETE)
  const handleDeleteSubmit = async () => {
    if (!selectedTeacher) return;
    setSubmitting(true);
    const toastId = toast.loading('Menghapus akun...');

    try {
      await api.delete(`/users/teachers/${selectedTeacher.id}/`);
      toast.success('Akun berhasil dihapus!', { id: toastId });
      setIsDeleteModalOpen(false);
      setIsDrawerOpen(false);
      setSelectedTeacher(null);
      fetchTeachers();
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.detail || 'Gagal menghapus akun.');
    } finally {
      setSubmitting(false);
    }
  };

  // Handler Reset Password (Khusus Admin)
  const handleResetPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTeacher || !newPassword) return;

    setSubmitting(true);
    const toastId = toast.loading('Memperbarui password...');

    try {
      await api.patch(`/users/teachers/${selectedTeacher.id}/`, { password: newPassword });
      toast.success('Password berhasil diperbarui!', { id: toastId });
      setIsResetPasswordModalOpen(false);
      setNewPassword('');
    } catch (err: any) {
      toast.dismiss(toastId);
      toast.error(err.response?.data?.detail || 'Gagal memperbarui password.');
    } finally {
      setSubmitting(false);
    }
  };

  // Hitung Statistik
  const totalCount = teachers.length;
  const adminCount = teachers.filter((t) => t.role === 'ADMIN').length;
  const teacherCount = teachers.filter((t) => t.role === 'TEACHER').length;
  const staffCount = teachers.filter((t) => t.role === 'STAFF').length;

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Info Akses */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl font-bold text-slate-800">Manajemen Guru & Staf</h1>
            {mounted && (
              <span className={`px-2.5 py-0.5 text-xs font-bold rounded-md border ${
                isAdmin ? 'bg-amber-50 text-amber-700 border-amber-200' : 'bg-slate-100 text-slate-600 border-slate-200'
              }`}>
                Akses: {currentRole || 'GUEST'}
              </span>
            )}
          </div>
          <p className="text-sm text-slate-500 mt-1">Kelola data tenaga pengajar dan staf operasional sekolah.</p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-2 px-3.5 py-2.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/80 rounded-xl text-sm font-semibold transition shadow-xs"
          >
            <Download className="w-4 h-4 text-slate-500" />
            Export CSV
          </button>

          {isAdmin && (
            <button
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold shadow-md shadow-indigo-600/20 transition"
            >
              <Plus className="w-4 h-4" />
              Tambah Guru Baru
            </button>
          )}
        </div>
      </div>

      {/* STAT CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Total Akun</span>
            <span className="text-lg font-bold text-slate-800">{totalCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl">
            <UserCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Guru Pengajar</span>
            <span className="text-lg font-bold text-slate-800">{teacherCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl">
            <Briefcase className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Staf Tata Usaha</span>
            <span className="text-lg font-bold text-slate-800">{staffCount}</span>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
          <div className="p-3 bg-amber-50 text-amber-600 rounded-xl">
            <Shield className="w-5 h-5" />
          </div>
          <div>
            <span className="text-xs font-semibold text-slate-400 block">Admin Sekolah</span>
            <span className="text-lg font-bold text-slate-800">{adminCount}</span>
          </div>
        </div>
      </div>

      {/* SEARCH BAR & MULTI-FILTER BAR */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
        <div className="flex items-center gap-2 bg-slate-50 p-2.5 rounded-xl border border-slate-200/60">
          <Search className="w-5 h-5 text-slate-400 ml-1" />
          <input
            type="text"
            placeholder="Cari berdasarkan nama, username, NIP, atau mata pelajaran..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full text-sm outline-none bg-transparent text-slate-700 placeholder-slate-400"
          />
        </div>

        {/* Dropdowns & Tabs Filter */}
        <div className="flex flex-wrap items-center justify-between gap-3 pt-1 text-xs">
          {/* Filter Role Tabs */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl font-semibold">
            {['ALL', 'TEACHER', 'STAFF', 'ADMIN'].map((role) => (
              <button
                key={role}
                onClick={() => setRoleFilter(role)}
                className={`px-3 py-1.5 rounded-lg transition ${
                  roleFilter === role
                    ? 'bg-white text-indigo-600 shadow-xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                {role === 'ALL' ? 'Semua Role' : role}
              </button>
            ))}
          </div>

          <div className="flex items-center gap-2">
            <Filter className="w-3.5 h-3.5 text-slate-400" />
            
            {/* Filter Gender */}
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value)}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium outline-none"
            >
              <option value="ALL">Semua Gender</option>
              <option value="L">Laki-Laki (L)</option>
              <option value="P">Perempuan (P)</option>
            </select>

            {/* Filter Kelengkapan Profil */}
            <select
              value={completenessFilter}
              onChange={(e) => setCompletenessFilter(e.target.value)}
              className="p-2 border border-slate-200 rounded-xl bg-white text-slate-700 font-medium outline-none"
            >
              <option value="ALL">Semua Profil</option>
              <option value="COMPLETE">Profil Lengkap</option>
              <option value="INCOMPLETE">Belum Lengkap</option>
            </select>
          </div>
        </div>
      </div>

      {/* TABEL UTAMA */}
      <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-8 text-center text-slate-500 text-sm">Memuat data guru...</div>
        ) : paginatedTeachers.length === 0 ? (
          <div className="p-8 text-center text-slate-500 text-sm">Tidak ada data guru yang cocok.</div>
        ) : (
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200 text-slate-600 text-xs font-semibold uppercase tracking-wider">
                <th className="py-3.5 px-4">Nama Lengkap & NIP</th>
                <th className="py-3.5 px-4">Role</th>
                <th className="py-3.5 px-4">Mata Pelajaran</th>
                <th className="py-3.5 px-4">Kelengkapan</th>
                <th className="py-3.5 px-4">Kontak</th>
                {isAdmin && <th className="py-3.5 px-4 text-right">Aksi</th>}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {paginatedTeachers.map((t) => {
                const isComplete = t.full_name && t.nip && t.phone_number;

                return (
                  <tr
                    key={t.id}
                    onClick={() => {
                      setSelectedTeacher(t);
                      setEditForm(t);
                      setIsEditing(false);
                      setIsDrawerOpen(true);
                    }}
                    className="hover:bg-indigo-50/40 cursor-pointer transition"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-slate-800">{t.full_name || t.username}</div>
                      <div className="text-xs text-slate-400">@{t.username} | NIP: {t.nip || '-'}</div>
                    </td>
                    <td className="py-3.5 px-4">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-bold ${
                        t.role === 'ADMIN' ? 'bg-amber-100 text-amber-800' :
                        t.role === 'TEACHER' ? 'bg-indigo-100 text-indigo-800' :
                        'bg-emerald-100 text-emerald-800'
                      }`}>
                        <Shield className="w-3 h-3" />
                        {t.role}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-slate-600 font-medium">{t.main_subject || '-'}</td>
                    <td className="py-3.5 px-4">
                      <span className={`px-2 py-0.5 rounded-md text-[11px] font-semibold ${
                        isComplete ? 'bg-slate-100 text-slate-600' : 'bg-rose-50 text-rose-600'
                      }`}>
                        {isComplete ? 'Lengkap' : 'Belum Lengkap'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-xs text-slate-500">
                      <div>{t.email || '-'}</div>
                      <div>{t.phone_number || '-'}</div>
                    </td>
                    {isAdmin && (
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1" onClick={(e) => e.stopPropagation()}>
                          <button
                            title="Reset Password"
                            onClick={() => {
                              setSelectedTeacher(t);
                              setIsResetPasswordModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-amber-100 text-slate-400 hover:text-amber-600 rounded-lg transition"
                          >
                            <KeyRound className="w-4 h-4" />
                          </button>
                          <button
                            title="Edit Profil"
                            onClick={() => {
                              setSelectedTeacher(t);
                              setEditForm(t);
                              setIsEditing(true);
                              setIsDrawerOpen(true);
                            }}
                            className="p-1.5 hover:bg-indigo-100 text-slate-400 hover:text-indigo-600 rounded-lg transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            title="Hapus Guru"
                            onClick={() => {
                              setSelectedTeacher(t);
                              setIsDeleteModalOpen(true);
                            }}
                            className="p-1.5 hover:bg-rose-100 text-slate-400 hover:text-rose-600 rounded-lg transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    )}
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}

        {/* PAGINATION FOOTER */}
        <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between text-xs text-slate-500">
          <div>
            Menampilkan <span className="font-semibold text-slate-700">{paginatedTeachers.length}</span> dari <span className="font-semibold text-slate-700">{filteredTeachers.length}</span> data
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="font-semibold text-slate-700">Halaman {currentPage} dari {totalPages}</span>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="p-1.5 rounded-lg border border-slate-200 bg-white text-slate-600 disabled:opacity-40 hover:bg-slate-50 transition"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {/* DRAWER EDIT & DETAIL GURU */}
      {isDrawerOpen && selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-slate-900/40 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col justify-between p-6 overflow-y-auto">
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-100">
                <h2 className="text-lg font-bold text-slate-800">{isEditing ? 'Edit Profil Guru' : 'Detail Profil Lengkap'}</h2>
                <button onClick={() => setIsDrawerOpen(false)} className="p-1 text-slate-500 hover:bg-slate-100 rounded-lg"><X className="w-5 h-5" /></button>
              </div>

              {!isEditing ? (
                <div className="mt-6 space-y-4 text-sm text-slate-700">
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase">Nama Lengkap</span>
                    <p className="font-semibold text-slate-800 text-base">{selectedTeacher.full_name || '-'}</p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase">Username</span>
                      <p>@{selectedTeacher.username}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase">Role</span>
                      <p className="font-bold text-indigo-600">{selectedTeacher.role}</p>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase">NIP</span>
                      <p>{selectedTeacher.nip || '-'}</p>
                    </div>
                    <div>
                      <span className="text-xs text-slate-400 font-bold block uppercase">Jenis Kelamin</span>
                      <p>{selectedTeacher.gender === 'L' ? 'Laki-Laki (L)' : 'Perempuan (P)'}</p>
                    </div>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase">Mata Pelajaran Utama</span>
                    <p>{selectedTeacher.main_subject || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase">Email</span>
                    <p className="flex items-center gap-1.5"><Mail className="w-3.5 h-3.5 text-slate-400" />{selectedTeacher.email || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase">Nomor HP / WA</span>
                    <p className="flex items-center gap-1.5"><Phone className="w-3.5 h-3.5 text-slate-400" />{selectedTeacher.phone_number || '-'}</p>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-bold block uppercase">Alamat Rumah</span>
                    <p className="flex items-start gap-1.5"><MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />{selectedTeacher.address || '-'}</p>
                  </div>
                </div>
              ) : (
                <form id="edit-form" onSubmit={handleEditSubmit} className="mt-6 space-y-4">
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      value={editForm.full_name || ''}
                      onChange={(e) => setEditForm({ ...editForm, full_name: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                      required
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Role Akun</label>
                      <select
                        value={editForm.role || 'TEACHER'}
                        onChange={(e) => setEditForm({ ...editForm, role: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                        disabled={selectedTeacher.role === 'ADMIN'}
                      >
                        <option value="TEACHER">TEACHER</option>
                        <option value="STAFF">STAFF</option>
                        <option value="ADMIN">ADMIN</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-xs font-bold text-slate-600 block mb-1">Jenis Kelamin</label>
                      <select
                        value={editForm.gender || 'L'}
                        onChange={(e) => setEditForm({ ...editForm, gender: e.target.value as any })}
                        className="w-full p-2.5 border border-slate-200 rounded-xl text-sm bg-white"
                      >
                        <option value="L">Laki-Laki</option>
                        <option value="P">Perempuan</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">NIP</label>
                    <input
                      type="text"
                      value={editForm.nip || ''}
                      onChange={(e) => setEditForm({ ...editForm, nip: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Mata Pelajaran</label>
                    <input
                      type="text"
                      value={editForm.main_subject || ''}
                      onChange={(e) => setEditForm({ ...editForm, main_subject: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Nomor HP</label>
                    <input
                      type="text"
                      value={editForm.phone_number || ''}
                      onChange={(e) => setEditForm({ ...editForm, phone_number: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-slate-600 block mb-1">Alamat Rumah</label>
                    <textarea
                      value={editForm.address || ''}
                      onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-sm h-20"
                    />
                  </div>
                </form>
              )}
            </div>

            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {isAdmin && !isEditing && (
                <button onClick={() => setIsDeleteModalOpen(true)} className="px-3 py-2 bg-rose-50 text-rose-700 text-xs font-bold rounded-xl hover:bg-rose-100 transition">Hapus Akun</button>
              )}
              {isAdmin && (!isEditing ? (
                <button onClick={() => setIsEditing(true)} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl ml-auto hover:bg-indigo-700 transition">Edit Profil</button>
              ) : (
                <div className="flex gap-2 ml-auto">
                  <button type="button" onClick={() => setIsEditing(false)} className="px-3 py-2 bg-slate-100 text-xs font-bold rounded-xl hover:bg-slate-200 transition">Batal</button>
                  <button type="submit" form="edit-form" disabled={submitting} className="px-4 py-2 bg-indigo-600 text-white text-xs font-bold rounded-xl hover:bg-indigo-700 transition">{submitting ? 'Simpan...' : 'Simpan'}</button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* CANVAS / MODAL TAMBAH GURU BARU (GRID 2 KOLOM TERSTRUKTUR) */}
      {isAddModalOpen && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-800">Mendaftarkan Akun Guru & Staf Baru</h3>
                <p className="text-xs text-slate-400 mt-0.5">Isi data akun autentikasi dan profil personal guru.</p>
              </div>
              <button onClick={() => setIsAddModalOpen(false)} className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4 overflow-y-auto pr-1 flex-1 text-xs">
              {/* SECTION 1: KREDENSIAL AKUN */}
              <div className="space-y-3">
                <span className="font-bold text-indigo-600 block tracking-wider uppercase flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5" /> 1. Kredensial Login
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Username *</label>
                    <input
                      type="text"
                      placeholder="Username unik"
                      required
                      value={addForm.username}
                      onChange={(e) => setAddForm({ ...addForm, username: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Email *</label>
                    <input
                      type="email"
                      placeholder="Email aktif"
                      required
                      value={addForm.email}
                      onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-600 block mb-1">Password *</label>
                    <input
                      type="password"
                      placeholder="Minimal 6 karakter"
                      required
                      value={addForm.password}
                      onChange={(e) => setAddForm({ ...addForm, password: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-100 pt-3" />

              {/* SECTION 2: PROFIL PERSONAL */}
              <div className="space-y-3">
                <span className="font-bold text-indigo-600 block tracking-wider uppercase flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5" /> 2. Profil Personal & Jabatan
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-600 block mb-1">Nama Lengkap</label>
                    <input
                      type="text"
                      placeholder="Contoh: Dr. Budi Santoso, M.Pd"
                      value={addForm.full_name}
                      onChange={(e) => setAddForm({ ...addForm, full_name: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Role Akun</label>
                    <select
                      value={addForm.role}
                      onChange={(e) => setAddForm({ ...addForm, role: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="TEACHER">TEACHER (Guru)</option>
                      <option value="STAFF">STAFF (Tata Usaha)</option>
                      <option value="ADMIN">ADMIN (Pengelola)</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Jenis Kelamin</label>
                    <select
                      value={addForm.gender}
                      onChange={(e) => setAddForm({ ...addForm, gender: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs bg-white outline-none focus:border-indigo-500 font-medium"
                    >
                      <option value="L">Laki-Laki</option>
                      <option value="P">Perempuan</option>
                    </select>
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">NIP (Nomor Induk Pegawai)</label>
                    <input
                      type="text"
                      placeholder="Contoh: 198501152010011002"
                      value={addForm.nip}
                      onChange={(e) => setAddForm({ ...addForm, nip: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-slate-600 block mb-1">Mata Pelajaran Utama</label>
                    <input
                      type="text"
                      placeholder="Contoh: Matematika"
                      value={addForm.main_subject}
                      onChange={(e) => setAddForm({ ...addForm, main_subject: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-600 block mb-1">Nomor HP / WhatsApp</label>
                    <input
                      type="text"
                      placeholder="Contoh: 081234567890"
                      value={addForm.phone_number}
                      onChange={(e) => setAddForm({ ...addForm, phone_number: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500"
                    />
                  </div>
                  <div className="sm:col-span-2">
                    <label className="font-bold text-slate-600 block mb-1">Alamat Rumah</label>
                    <textarea
                      placeholder="Alamat domisili lengkap..."
                      value={addForm.address}
                      onChange={(e) => setAddForm({ ...addForm, address: e.target.value })}
                      className="w-full p-2.5 border border-slate-200 rounded-xl text-xs outline-none focus:border-indigo-500 h-16"
                    />
                  </div>
                </div>
              </div>

              {/* FOOTER ACTION */}
              <div className="pt-3 border-t border-slate-100 flex items-center justify-end gap-2 font-bold">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 transition"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 shadow-md shadow-indigo-600/20 transition disabled:opacity-50"
                >
                  {submitting ? 'Memproses...' : 'Daftarkan Guru'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL RESET PASSWORD */}
      {isResetPasswordModalOpen && selectedTeacher && isAdmin && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 shadow-2xl">
            <div className="flex items-center gap-2 border-b pb-3 border-slate-100">
              <KeyRound className="w-5 h-5 text-amber-600" />
              <h3 className="text-base font-bold text-slate-800">Reset Password Guru</h3>
            </div>
            <form onSubmit={handleResetPasswordSubmit} className="mt-4 space-y-3 text-xs">
              <p className="text-slate-500">
                Masukkan password baru untuk akun <span className="font-bold text-slate-800">@{selectedTeacher.username}</span>.
              </p>
              <input
                type="password"
                placeholder="Password Baru (min 6 karakter)"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="w-full p-2.5 border border-slate-200 rounded-xl outline-none focus:border-indigo-500"
              />
              <div className="flex justify-end gap-2 pt-2">
                <button type="button" onClick={() => setIsResetPasswordModalOpen(false)} className="px-3 py-2 bg-slate-100 font-bold text-slate-700 rounded-xl">Batal</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 bg-amber-600 text-white font-bold rounded-xl">{submitting ? 'Memproses...' : 'Reset Password'}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL HAPUS */}
      {isDeleteModalOpen && selectedTeacher && isAdmin && (
        <div className="fixed inset-0 z-[9999] bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full p-6 text-center shadow-2xl">
            <AlertOctagon className="w-8 h-8 text-rose-600 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">Konfirmasi Hapus Akun</h3>
            <p className="text-xs text-slate-500 mt-1">Yakin ingin menghapus akun @{selectedTeacher.username}? Action ini tidak dapat dibatalkan.</p>
            <div className="mt-6 flex gap-2">
              <button onClick={() => setIsDeleteModalOpen(false)} className="w-1/2 py-2 bg-slate-100 rounded-xl text-xs font-bold hover:bg-slate-200 transition">Batal</button>
              <button onClick={handleDeleteSubmit} disabled={submitting} className="w-1/2 py-2 bg-rose-600 text-white rounded-xl text-xs font-bold hover:bg-rose-700 transition">{submitting ? 'Menghapus...' : 'Ya, Hapus'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}