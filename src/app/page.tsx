'use client';

import Link from 'next/link';
import { 
  School, ShieldCheck, Users, ClipboardCheck, GraduationCap, 
  BarChart3, ArrowRight, CheckCircle2, Sparkles, LogIn, UserPlus 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function HomePage() {
  const [year, setYear] = useState<number | null>(null);

  useEffect(() => {
    setYear(new Date().getFullYear());
  }, []);

  return (
    <div className="min-h-screen bg-slate-900 text-slate-100 flex flex-col font-sans selection:bg-indigo-500 selection:text-white">
      {/* NAVBAR */}
      <header className="sticky top-0 z-50 bg-slate-900/80 backdrop-blur-md border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-indigo-600 text-white rounded-xl shadow-lg shadow-indigo-600/30">
              <School className="w-6 h-6" />
            </div>
            <div>
              <span className="font-extrabold text-lg tracking-tight text-white block leading-none">
                EduSaaS
              </span>
              <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-wider">
                System Manajemen Sekolah
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-slate-300 hover:text-white hover:bg-slate-800 rounded-xl transition"
            >
              <LogIn className="w-4 h-4" />
              Masuk
            </Link>
            <Link
              href="/register"
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold rounded-xl shadow-lg shadow-indigo-600/30 transition"
            >
              <UserPlus className="w-4 h-4" />
              Daftar Sekolah
            </Link>
          </div>
        </div>
      </header>

      {/* HERO SECTION */}
      <main className="flex-1">
        <section className="relative overflow-hidden py-20 lg:py-28 px-6 text-center max-w-5xl mx-auto space-y-8">
          <div className="absolute inset-0 -z-10 flex items-center justify-center pointer-events-none">
            <div className="w-[600px] h-[600px] bg-indigo-600/15 rounded-full blur-[120px]" />
          </div>

          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-300">
            <Sparkles className="w-4 h-4 text-amber-300" />
            Platform Manajemen Sekolah Terintegrasi Multi-Tenant
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            Kelola Data Sekolah & Akademik <br />
            <span className="bg-gradient-to-r from-indigo-400 via-blue-400 to-emerald-400 bg-clip-text text-transparent">
              Lebih Cepat, Rapi, & Modern
            </span>
          </h1>

          <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto leading-relaxed">
            Solusi SaaS lengkap untuk tata kelola data Siswa, Guru, Absensi Harian dengan Rekap Matriks Bulanan, KKM Dinamis, serta Penilaian Evaluasi yang bisa di-export ke Excel Berwarna.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-sm rounded-xl shadow-xl shadow-indigo-600/30 transition flex items-center justify-center gap-2"
            >
              Daftarkan Sekolah Anda
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/login"
              className="w-full sm:w-auto px-8 py-3.5 bg-slate-800 hover:bg-slate-700 text-slate-200 font-bold text-sm rounded-xl border border-slate-700 transition flex items-center justify-center gap-2"
            >
              <LogIn className="w-4 h-4" />
              Masuk ke Dashboard
            </Link>
          </div>
        </section>

        {/* FITUR UNGGULAN */}
        <section className="max-w-7xl mx-auto px-6 py-16">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-xs uppercase font-extrabold text-indigo-400 tracking-wider">Modul Lengkap</h2>
            <p className="text-2xl sm:text-3xl font-extrabold text-white">Semua Kebutuhan Sekolah Dalam Satu Sistem</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* Card 1 */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 hover:border-indigo-500/50 transition group space-y-3">
              <div className="p-3 bg-indigo-500/10 text-indigo-400 rounded-xl w-fit group-hover:bg-indigo-600 group-hover:text-white transition">
                <Users className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Manajemen Siswa & Guru</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pengelolaan profil terpusat, penetapan wali kelas, hingga integrasi kontak WhatsApp orang tua siswa.
              </p>
            </div>

            {/* Card 2 */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 hover:border-emerald-500/50 transition group space-y-3">
              <div className="p-3 bg-emerald-500/10 text-emerald-400 rounded-xl w-fit group-hover:bg-emerald-600 group-hover:text-white transition">
                <ClipboardCheck className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Presensi & Matriks Live</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pencatatan absensi harian (H/S/I/A) interaktif lengkap dengan tampilan matriks kalender bulanan.
              </p>
            </div>

            {/* Card 3 */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 hover:border-purple-500/50 transition group space-y-3">
              <div className="p-3 bg-purple-500/10 text-purple-400 rounded-xl w-fit group-hover:bg-purple-600 group-hover:text-white transition">
                <GraduationCap className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Nilai & KKM Dinamis</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Pengaturan KKM per mapel/kelas, evaluasi ujian berkali-kali, serta fitur cetak & export Excel berwarna.
              </p>
            </div>

            {/* Card 4 */}
            <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700/60 hover:border-amber-500/50 transition group space-y-3">
              <div className="p-3 bg-amber-500/10 text-amber-400 rounded-xl w-fit group-hover:bg-amber-600 group-hover:text-white transition">
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-lg text-white">Dashboard Real-Time</h3>
              <p className="text-xs text-slate-400 leading-relaxed">
                Ringkasan statistik harian, persentase kelengkapan data, dan indikator progres secara real-time.
              </p>
            </div>
          </div>
        </section>

        {/* PROOF & ISOLASI DATA */}
        <section className="bg-slate-800/30 border-y border-slate-800 py-16 px-6">
          <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-emerald-500/10 text-emerald-400 text-xs font-bold border border-emerald-500/20">
                <ShieldCheck className="w-4 h-4" /> Keamanan Multi-Tenant
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Data Sekolah Anda Terisolasi & Aman Sempurna
              </h2>
              <p className="text-xs sm:text-sm text-slate-400 leading-relaxed">
                Setiap sekolah memiliki ruang data independen dengan enkripsi tingkat tinggi, memastikan kerahasiaan data siswa, guru, dan nilai ujian tidak akan saling bertabrakan antar instansi.
              </p>
            </div>

            <div className="space-y-3 w-full md:w-auto">
              {['Akses Berbasis Peran (Admin, Guru, Staf)', 'Export Excel Berwarna Otomatis', 'Audit Log & Locking Status Presensi', 'Dukungan Notifikasi WhatsApp Orang Tua'].map((item, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs font-semibold text-slate-200 bg-slate-800/80 px-4 py-2.5 rounded-xl border border-slate-700">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <footer className="border-t border-slate-800 py-8 px-6 text-center text-xs text-slate-500">
        <p>
          &copy; {year || '2026'} EduSaaS Platform. Hak Cipta Dilindungi Undang-Undang.
        </p>
      </footer>
    </div>
  );
}