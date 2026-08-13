import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { MapPin, Phone, Globe2, Mail, Info } from "lucide-react";

export const metadata: Metadata = {
  title: "Tentang Kami | HydroFarm",
  description: "Kenali lebih dekat perjalanan kebun hidroponik kami.",
};

export default async function TentangPage() {
  const profile = await prisma.businessProfile.findFirst();
  const farmName = profile?.farmName ?? "HydroFarm Segar";

  const contacts = [
    profile?.address   && { icon: MapPin,  label: "Lokasi Kebun",  value: profile.address },
    profile?.phone     && { icon: Phone,   label: "Telepon",       value: profile.phone },
    profile?.email     && { icon: Mail,    label: "Email",         value: profile.email },
    profile?.instagram && { icon: Globe2,  label: "Sosial Media",  value: profile.instagram },
  ].filter(Boolean) as { icon: typeof MapPin; label: string; value: string }[];

  return (
    <div
      className="t-pub-bg min-h-screen text-white pt-24 pb-16 transition-theme"
      style={{ background: "var(--t-pub-bg)", color: "var(--t-text-primary)" }}
    >
      <PublicNavbar farmName={farmName} />

      <main className="max-w-4xl mx-auto px-6">
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 mb-6">
            <Info className="w-3.5 h-3.5 text-emerald-500" />
            <span className="text-emerald-500 text-sm font-medium">Cerita Kami</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6" style={{ color: "var(--t-text-primary)" }}>
            Tentang {farmName}
          </h1>
        </div>

        <div className="grid md:grid-cols-2 gap-10">
          {/* Visi */}
          <div
            className="rounded-3xl p-8 border transition-theme"
            style={{ background: "var(--t-card-bg)", borderColor: "var(--t-card-border)" }}
          >
            <h2 className="text-2xl font-semibold mb-4 text-emerald-500">Visi Kami</h2>
            <p className="leading-relaxed mb-6" style={{ color: "var(--t-text-secondary)" }}>
              {profile?.description || "Kami berkomitmen untuk menyediakan sayuran berkualitas terbaik, ditanam dengan metode hidroponik modern yang ramah lingkungan dan 100% bebas pestisida."}
            </p>
            <p className="leading-relaxed" style={{ color: "var(--t-text-secondary)" }}>
              Ditanam di dalam greenhouse khusus, setiap sayuran dijaga nutrisinya agar menghasilkan cita rasa dan kesegaran yang maksimal untuk meja makan keluarga Anda.
            </p>
          </div>

          {/* Kontak */}
          <div
            className="rounded-3xl p-8 border transition-theme"
            style={{ background: "var(--t-card-bg)", borderColor: "rgba(16,185,129,0.2)" }}
          >
            <h2 className="text-2xl font-semibold mb-6" style={{ color: "var(--t-text-primary)" }}>Hubungi Kami</h2>
            <div className="space-y-6">
              {contacts.length === 0 && (
                <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>
                  Informasi kontak belum diisi. Admin dapat mengisi melalui CMS.
                </p>
              )}
              {contacts.map(({ icon: Icon, label, value }) => (
                <div key={label} className="flex items-start gap-4">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center shrink-0">
                    <Icon className="w-5 h-5 text-emerald-500" />
                  </div>
                  <div>
                    <p className="text-sm mb-1" style={{ color: "var(--t-text-muted)" }}>{label}</p>
                    <p className="font-medium" style={{ color: "var(--t-text-primary)" }}>{value}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <footer
        className="t-footer border-t mt-16 py-8 px-6 text-center transition-theme"
        style={{ borderColor: "var(--t-divider)" }}
      >
        <p className="text-sm" style={{ color: "var(--t-text-muted)" }}>
          © {new Date().getFullYear()} {farmName}. Semua hak dilindungi.
        </p>
      </footer>
    </div>
  );
}
