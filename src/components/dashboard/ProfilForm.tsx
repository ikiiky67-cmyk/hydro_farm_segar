"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { upsertBusinessProfile } from "@/actions/cms.actions";
import { Button } from "@/components/ui/button";
import type { BusinessProfile } from "@prisma/client";
import { useState } from "react";
import { Save, CheckCircle } from "lucide-react";
import { ImageUploader } from "@/components/ui/ImageUploader";

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

const inputClass = "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-indigo-500/30 transition-all";

export function ProfilForm({ profile }: { profile: BusinessProfile | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [saved, setSaved] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(async () => {
      await upsertBusinessProfile(formData);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
      router.refresh();
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Banner */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Banner Website</label>
          <ImageUploader name="bannerUrl" defaultValue={profile?.bannerUrl} folder="cms/profil" />
          <p className="text-xs mt-2" style={{ color: "var(--t-text-muted)" }}>Gambar besar untuk latar belakang halaman utama (Disarankan 1920x1080).</p>
        </div>
        {/* Logo */}
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Logo Usaha</label>
          <ImageUploader name="logoUrl" defaultValue={profile?.logoUrl} folder="cms/profil" />
          <p className="text-xs mt-2" style={{ color: "var(--t-text-muted)" }}>Logo untuk navbar dan footer (Disarankan 512x512, format transparan PNG).</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nama Usaha *</label>
          <input name="farmName" required defaultValue={profile?.farmName ?? ""} placeholder="HydroFarm Segar" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Tagline</label>
          <input name="tagline" defaultValue={profile?.tagline ?? ""} placeholder="Slogan singkat..." className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Deskripsi</label>
        <textarea name="description" rows={3} defaultValue={profile?.description ?? ""} placeholder="Ceritakan tentang usaha Anda..." className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Visi / Misi</label>
        <textarea name="vision" rows={3} defaultValue={profile?.vision ?? ""} placeholder="Tulis visi atau misi usaha Anda untuk halaman Tentang Kami..." className={`${inputClass} resize-none`} style={inputStyle} />
        <p className="text-xs mt-1.5" style={{ color: "var(--t-text-muted)" }}>Ditampilkan di halaman Tentang Kami sebagai paragraf kedua.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nomor Telepon</label>
          <input name="phone" defaultValue={profile?.phone ?? ""} placeholder="0812-xxxx-xxxx" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Email</label>
          <input name="email" type="email" defaultValue={profile?.email ?? ""} placeholder="info@hydrofarm.id" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>WhatsApp</label>
          <input name="whatsapp" defaultValue={profile?.whatsapp ?? ""} placeholder="6281234567890" className={inputClass} style={inputStyle} />
        </div>
        <div>
          <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Instagram</label>
          <input name="instagram" defaultValue={profile?.instagram ?? ""} placeholder="@hydrofarm_segar" className={inputClass} style={inputStyle} />
        </div>
      </div>

      <div>
        <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Alamat</label>
        <textarea name="address" rows={2} defaultValue={profile?.address ?? ""} placeholder="Jl. Pertanian No. 12..." className={`${inputClass} resize-none`} style={inputStyle} />
      </div>

      <div className="pt-6 mt-6 border-t border-dashed" style={{ borderColor: "var(--t-divider)" }}>
        <h3 className="font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Teks Halaman (Hero & Section)</h3>
        <p className="text-xs mb-6" style={{ color: "var(--t-text-muted)" }}>Sesuaikan teks utama di berbagai halaman publik.</p>
        
        <div className="space-y-6">
          {/* Hero Beranda */}
          <div className="p-4 rounded-xl border border-indigo-500/20 bg-indigo-500/5">
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Hero Beranda (Slide 1)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Utama</label>
                <input name="heroHomeTitle" defaultValue={profile?.heroHomeTitle ?? ""} placeholder="Contoh: Panen Langsung dari..." className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul</label>
                <input name="heroHomeSubtitle" defaultValue={profile?.heroHomeSubtitle ?? ""} placeholder="Sayuran segar bebas pestisida..." className={inputClass} style={inputStyle} />
              </div>
            </div>
            <h4 className="text-sm font-semibold mb-4 border-t pt-4 border-indigo-500/20" style={{ color: "var(--t-text-primary)" }}>Hero Beranda (Slide 2)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Utama</label>
                <input name="heroHomeTitle2" defaultValue={profile?.heroHomeTitle2 ?? ""} placeholder="Contoh: Kualitas Hidroponik Terbaik" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul</label>
                <input name="heroHomeSubtitle2" defaultValue={profile?.heroHomeSubtitle2 ?? ""} placeholder="Sayuran segar bebas pestisida..." className={inputClass} style={inputStyle} />
              </div>
            </div>
            <h4 className="text-sm font-semibold mb-4 border-t pt-4 border-indigo-500/20" style={{ color: "var(--t-text-primary)" }}>Hero Beranda (Slide 3)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Utama</label>
                <input name="heroHomeTitle3" defaultValue={profile?.heroHomeTitle3 ?? ""} placeholder="Contoh: Siap Dikirim ke..." className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul</label>
                <input name="heroHomeSubtitle3" defaultValue={profile?.heroHomeSubtitle3 ?? ""} placeholder="Pesan sekarang dan nikmati..." className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Hero Produk */}
          <div className="p-4 rounded-xl border border-emerald-500/20 bg-emerald-500/5">
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Hero Halaman Produk</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Utama</label>
                <input name="heroProductsTitle" defaultValue={profile?.heroProductsTitle ?? ""} placeholder="Katalog Produk Kami" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul</label>
                <input name="heroProductsSubtitle" defaultValue={profile?.heroProductsSubtitle ?? ""} placeholder="Pilih hasil panen terbaik..." className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Hero Tentang */}
          <div className="p-4 rounded-xl border border-amber-500/20 bg-amber-500/5">
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Hero Halaman Tentang Kami</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Utama</label>
                <input name="heroAboutTitle" defaultValue={profile?.heroAboutTitle ?? ""} placeholder="Kisah Perjalanan Kami" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul</label>
                <input name="heroAboutSubtitle" defaultValue={profile?.heroAboutSubtitle ?? ""} placeholder="Berawal dari lahan kecil..." className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>

          {/* Kenapa Pilih Kami */}
          <div className="p-4 rounded-xl border border-blue-500/20 bg-blue-500/5">
            <h4 className="text-sm font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Section: Kenapa Pilih Kami (Beranda)</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Judul Section</label>
                <input name="whyChooseUsTitle" defaultValue={profile?.whyChooseUsTitle ?? ""} placeholder="Kenapa Harus Memilih Kami?" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Sub-judul Section</label>
                <input name="whyChooseUsSubtitle" defaultValue={profile?.whyChooseUsSubtitle ?? ""} placeholder="Kami menawarkan kualitas..." className={inputClass} style={inputStyle} />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-6 mt-6 border-t border-dashed" style={{ borderColor: "var(--t-divider)" }}>
        <h3 className="font-semibold mb-4" style={{ color: "var(--t-text-primary)" }}>Profil Pemilik (Owner)</h3>
        <p className="text-xs mb-6" style={{ color: "var(--t-text-muted)" }}>Ditampilkan khusus di halaman Tentang Kami.</p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Foto Pemilik</label>
            <ImageUploader name="ownerImageUrl" defaultValue={profile?.ownerImageUrl} folder="cms/profil" />
            <p className="text-xs mt-2" style={{ color: "var(--t-text-muted)" }}>Gunakan foto vertikal (portrait).</p>
          </div>
          <div className="md:col-span-2 space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Nama Lengkap</label>
                <input name="ownerName" defaultValue={profile?.ownerName ?? ""} placeholder="Contoh: Budi Santoso" className={inputClass} style={inputStyle} />
              </div>
              <div>
                <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Jabatan / Peran</label>
                <input name="ownerRole" defaultValue={profile?.ownerRole ?? ""} placeholder="Contoh: Founder & CEO" className={inputClass} style={inputStyle} />
              </div>
            </div>
            <div>
              <label className="text-xs font-semibold uppercase tracking-wide mb-2 block" style={{ color: "var(--t-text-muted)" }}>Biografi / Pesan</label>
              <textarea name="ownerBio" rows={4} defaultValue={profile?.ownerBio ?? ""} placeholder="Tulis sedikit profil, perjalanan, atau pesan inspiratif dari pemilik..." className={`${inputClass} resize-none`} style={inputStyle} />
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={pending} className="bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl font-semibold gap-2 shadow-[0_0_20px_rgba(99,102,241,0.2)]">
          {pending ? "Menyimpan..." : saved ? (
            <><CheckCircle className="w-4 h-4" /> Tersimpan!</>
          ) : (
            <><Save className="w-4 h-4" /> Simpan Perubahan</>
          )}
        </Button>
      </div>
    </form>
  );
}
