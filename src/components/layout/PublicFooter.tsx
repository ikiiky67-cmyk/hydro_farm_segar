"use client";

import Link from "next/link";
import { Leaf, MapPin, Phone, Camera, MessageCircle } from "lucide-react";
import { usePathname } from "next/navigation";

type Profile = {
  farmName: string;
  description: string | null;
  address: string | null;
  phone: string | null;
  instagram: string | null;
  whatsapp: string | null;
  logoUrl: string | null;
};

export function PublicFooter({ profile, copyrightOnly = false }: { profile: Profile | null, copyrightOnly?: boolean }) {
  const pathname = usePathname();

  // Navigasi dinamis berdasarkan halaman aktif
  const links = [];
  if (pathname !== "/") links.push({ name: "Beranda", href: "/" });
  if (pathname !== "/produk") links.push({ name: "Produk", href: "/produk" });
  if (pathname !== "/tentang") links.push({ name: "Tentang", href: "/tentang" });

  return (
    <footer className={`pb-4 px-6 ${copyrightOnly ? "pt-4" : "pt-8"}`} style={{ background: "var(--pub-bg)" }}>
      <div className={`max-w-7xl mx-auto flex flex-col ${copyrightOnly ? "gap-0" : "gap-8"}`}>
        
        {!copyrightOnly && (
          <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-4 text-xs" style={{ color: "var(--pub-text-subtle)" }}>
            {/* Top Row: Responsive Layout */}
            
            {/* Left Column: Brand (Takes up more space on md/lg to push others right) */}
            <div className="md:col-span-4 lg:col-span-5 flex items-start gap-2.5">
              {profile?.logoUrl ? (
                <img src={profile.logoUrl} alt="Logo" className="w-8 h-8 object-contain rounded bg-white/5" />
              ) : (
                <div className="w-8 h-8 rounded flex items-center justify-center bg-white/5">
                  <Leaf className="w-5 h-5 text-emerald-500" />
                </div>
              )}
              <span className="font-bold text-sm tracking-tight pt-1.5" style={{ color: "var(--pub-text)" }}>
                {profile?.farmName ?? "HydroFarm"}
              </span>
            </div>

            {/* Middle Column: Links & Address (Positioned just left of Contact) */}
            <div className="md:col-span-5 lg:col-span-4 flex flex-col items-start gap-5 font-medium">
              {/* Dynamic Links */}
              <div className="flex flex-col gap-2.5">
                {links.map(link => (
                  <Link key={link.href} href={link.href} className="hover:text-emerald-500 transition-colors">
                    {link.name}
                  </Link>
                ))}
              </div>
              
              {/* Address */}
              {profile?.address && (
                <div className="flex items-start gap-2 w-full">
                  <MapPin className="w-3.5 h-3.5 shrink-0 opacity-60 mt-0.5 text-emerald-500" />
                  <span className="leading-relaxed font-normal">{profile.address}</span>
                </div>
              )}
            </div>

            {/* Right Column: Contact (At the far right) */}
            <div className="md:col-span-3 lg:col-span-3 flex flex-col items-start md:items-end gap-3.5 font-normal">
              {profile?.phone && (
                <div className="flex items-center gap-2">
                  <span>{profile.phone}</span>
                  <Phone className="w-3.5 h-3.5 opacity-60 text-emerald-500 hidden md:block" />
                  <Phone className="w-3.5 h-3.5 opacity-60 text-emerald-500 md:hidden" />
                </div>
              )}
              {profile?.whatsapp && (
                <a 
                  href={`https://wa.me/${profile.whatsapp.replace(/\D/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
                >
                  <span>WhatsApp</span>
                  <MessageCircle className="w-3.5 h-3.5 opacity-60 text-emerald-500 hidden md:block" />
                  <MessageCircle className="w-3.5 h-3.5 opacity-60 text-emerald-500 md:hidden" />
                </a>
              )}
              {profile?.instagram && (
                <a 
                  href={`https://instagram.com/${profile.instagram.replace("@", "")}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 hover:text-emerald-500 transition-colors"
                >
                  <span>@{profile.instagram.replace("@", "")}</span>
                  <Camera className="w-3.5 h-3.5 opacity-60 text-emerald-500 hidden md:block" />
                  <Camera className="w-3.5 h-3.5 opacity-60 text-emerald-500 md:hidden" />
                </a>
              )}
            </div>
            
          </div>
        )}

        {/* Bottom Row: Copyright */}
        <div className={`flex justify-center items-center ${copyrightOnly ? "" : "pt-2"}`}>
          <span className="text-[10px] opacity-40 font-mono tracking-wide" style={{ color: "var(--pub-text-subtle)" }}>
            © {new Date().getFullYear()} {profile?.farmName ?? "HydroFarm"}. Hak Cipta Dilindungi.
          </span>
        </div>

      </div>
    </footer>
  );
}
