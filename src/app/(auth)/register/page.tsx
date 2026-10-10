'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    // Step 1: Profil Sekolah
    school_name: '',
    school_npsn: '',
    school_address: '',
    school_phone: '',

    // Step 2: Akun Admin Sekolah
    admin_username: '',
    admin_email: '',
    password: '',
    admin_first_name: '',
    admin_last_name: '',
    admin_phone: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.school_name || !formData.school_npsn) {
      setError('Nama Sekolah dan NPSN wajib diisi.');
      return;
    }
    setError('');
    setStep(2);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await api.post("/auth/register/", formData);
      alert('Registrasi Sekolah Berhasil! Silakan Login menggunakan akun admin Anda.');
      router.push('/login');
    } catch (err: any) {
      const resp = err.response?.data;
      if (resp) {
        const firstKey = Object.keys(resp)[0];
        const msg = Array.isArray(resp[firstKey]) ? resp[firstKey][0] : resp[firstKey];
        setError(`${firstKey}: ${msg}`);
      } else {
        setError('Registrasi gagal. Periksa koneksi internet atau inputan Anda.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-8">
      <div className="max-w-lg w-full bg-white rounded-xl shadow-lg p-8 border border-slate-100">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-slate-800">Registrasi Sekolah Baru</h1>
          <p className="text-sm text-slate-500 mt-1">Langkah {step} dari 2</p>
        </div>

        {/* Stepper Header */}
        <div className="flex items-center mb-8">
          <div
            className={`flex-1 text-center py-2 border-b-2 font-medium text-sm ${
              step === 1 ? 'border-blue-600 text-blue-600 font-bold' : 'border-slate-200 text-slate-400'
            }`}
          >
            1. Profil Sekolah
          </div>
          <div
            className={`flex-1 text-center py-2 border-b-2 font-medium text-sm ${
              step === 2 ? 'border-blue-600 text-blue-600 font-bold' : 'border-slate-200 text-slate-400'
            }`}
          >
            2. Akun Admin
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
            {error}
          </div>
        )}

        {step === 1 ? (
          <form onSubmit={handleNext} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Sekolah *</label>
              <input
                type="text"
                name="school_name"
                required
                value={formData.school_name}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="SMA Negeri 1 Jakarta"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">NPSN *</label>
              <input
                type="text"
                name="school_npsn"
                required
                value={formData.school_npsn}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="20103040"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. Telepon Sekolah</label>
              <input
                type="text"
                name="school_phone"
                value={formData.school_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="0213840123"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Alamat Sekolah</label>
              <textarea
                name="school_address"
                rows={2}
                value={formData.school_address}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Jl. Budi Utomo No. 7, Jakarta Pusat"
              />
            </div>

            <button
              type="submit"
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200"
            >
              Lanjut ke Langkah 2 →
            </button>
          </form>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Depan</label>
                <input
                  type="text"
                  name="admin_first_name"
                  value={formData.admin_first_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Ahmad"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nama Belakang</label>
                <input
                  type="text"
                  name="admin_last_name"
                  value={formData.admin_last_name}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Subarjo"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Username Admin *</label>
              <input
                type="text"
                name="admin_username"
                required
                value={formData.admin_username}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin_sman1"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Email Admin *</label>
              <input
                type="email"
                name="admin_email"
                required
                value={formData.admin_email}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="admin@sman1.sch.id"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Password *</label>
              <input
                type="password"
                name="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="Minimal 8 karakter"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No. HP Admin</label>
              <input
                type="text"
                name="admin_phone"
                value={formData.admin_phone}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                placeholder="081234567890"
              />
            </div>

            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={() => setStep(1)}
                className="w-1/3 py-2.5 bg-slate-200 hover:bg-slate-300 text-slate-700 font-medium rounded-lg transition duration-200"
              >
                ← Kembali
              </button>
              <button
                type="submit"
                disabled={loading}
                className="w-2/3 py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-lg transition duration-200 disabled:opacity-50"
              >
                {loading ? 'Daftar...' : 'Selesaikan Pendaftaran'}
              </button>
            </div>
          </form>
        )}

        <p className="text-center text-sm text-slate-600 mt-6">
          Sudah mendaftarkan sekolah?{' '}
          <Link href="/login" className="text-blue-600 font-medium hover:underline">
            Login di sini
          </Link>
        </p>
      </div>
    </div>
  );
}