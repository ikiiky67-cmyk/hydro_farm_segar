import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Leaf, ArrowLeft, CheckCircle2, ShoppingBag, Phone, Droplets, ShieldCheck, Truck } from "lucide-react";
import { formatRupiah } from "@/lib/utils";
import { PublicNavbar } from "@/components/layout/PublicNavbar";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });
  if (!product) return { title: "Produk Tidak Ditemukan | HydroFarm" };
  
  return {
    title: `${product.name} | HydroFarm Segar`,
    description: product.description || `Beli ${product.name} hidroponik segar bebas pestisida.`,
  };
}

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  
  const [product, profile] = await Promise.all([
    prisma.product.findUnique({
      where: { slug: resolvedParams.slug },
    }),
    prisma.businessProfile.findFirst(),
  ]);

  if (!product || !product.isActive) {
    notFound();
  }

  const farmName = profile?.farmName ?? "HydroFarm Segar";
  const whatsapp = profile?.whatsapp ?? "";
  const price = parseFloat(product.pricePerKg.toString());

  // Buat pesan template WA
  const waMessage = encodeURIComponent(`Halo ${farmName}, saya ingin pesan produk:\n\nProduk: ${product.name}\nHarga: ${formatRupiah(price)}/${product.unit}\n\nApakah stoknya tersedia?`);
  const waLink = whatsapp ? `https://wa.me/${whatsapp.replace(/\D/g, "")}?text=${waMessage}` : "#";

  return (
    <div
      className="min-h-screen transition-colors duration-500 flex flex-col"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <PublicNavbar farmName={farmName} />

      <main className="flex-grow pt-28 pb-20 px-6">
        <div className="max-w-6xl mx-auto">
          {/* Breadcrumb / Back */}
          <Link
            href="/produk"
            className="inline-flex items-center gap-2 mb-8 text-sm font-medium hover:text-emerald-500 transition-colors"
            style={{ color: "var(--pub-text-muted)" }}
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali ke Katalog Produk
          </Link>

          <div className="bg-white/5 border rounded-3xl overflow-hidden pub-card-glow transition-all duration-300"
               style={{ background: "var(--pub-card-bg)", borderColor: "var(--pub-card-border)" }}>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-0">
              
              {/* Product Image Gallery */}
              <div className="relative aspect-square lg:aspect-auto lg:h-full bg-emerald-500/5 flex items-center justify-center p-8 border-r"
                   style={{ borderColor: "var(--pub-divider)" }}>
                {product.isFeatured && (
                  <div className="absolute top-6 left-6 z-10 bg-amber-500 text-white text-xs font-bold px-3 py-1.5 rounded-full shadow-lg">
                    ★ Produk Unggulan
                  </div>
                )}
                {product.imageUrl ? (
                  /* eslint-disable-next-line @next/next/no-img-element */
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="w-full h-full object-contain filter drop-shadow-2xl hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center gap-4 text-emerald-500/20">
                    <Leaf className="w-32 h-32" />
                    <span className="font-medium">Foto Belum Tersedia</span>
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="p-8 lg:p-12 flex flex-col justify-center">
                <div className="mb-4">
                  {product.category && (
                    <span className="inline-block px-3 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-xs font-bold rounded-full mb-4">
                      {product.category}
                    </span>
                  )}
                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4"
                      style={{ color: "var(--pub-text)" }}>
                    {product.name}
                  </h1>
                  <div className="flex items-end gap-2 mb-6">
                    <span className="text-3xl font-extrabold text-emerald-500">
                      {formatRupiah(price)}
                    </span>
                    <span className="text-lg font-medium mb-1" style={{ color: "var(--pub-text-muted)" }}>
                      / {product.unit}
                    </span>
                  </div>
                </div>

                <div className="prose prose-emerald dark:prose-invert max-w-none mb-8"
                     style={{ color: "var(--pub-text-muted)" }}>
                  <p className="text-base leading-relaxed">
                    {product.description || "Sayuran hidroponik segar, ditanam dengan penuh perawatan dan standar kualitas tinggi untuk menjamin kesehatan keluarga Anda."}
                  </p>
                </div>

                {/* Features list */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-10">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-emerald-500/10 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5 text-emerald-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--pub-text)" }}>100% Organik</h4>
                      <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>Bebas pestisida kimia</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center">
                      <Droplets className="w-5 h-5 text-blue-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--pub-text)" }}>Hidroponik</h4>
                      <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>Nutrisi terstandarisasi</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-amber-500/10 flex items-center justify-center">
                      <CheckCircle2 className="w-5 h-5 text-amber-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--pub-text)" }}>Panen Harian</h4>
                      <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>Kesegaran terjamin</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center">
                      <Truck className="w-5 h-5 text-purple-500" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold" style={{ color: "var(--pub-text)" }}>Siap Kirim</h4>
                      <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>Langsung ke pintu Anda</p>
                    </div>
                  </div>
                </div>

                {/* Call to action */}
                <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t"
                     style={{ borderColor: "var(--pub-divider)" }}>
                  <a
                    href={waLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 text-white font-semibold px-6 py-4 rounded-xl transition-all duration-300 shadow-[0_0_30px_-5px_rgba(16,185,129,0.5)] hover:shadow-[0_0_40px_0px_rgba(16,185,129,0.6)] hover:-translate-y-1"
                  >
                    <ShoppingBag className="w-5 h-5" />
                    Beli via WhatsApp
                  </a>
                  {whatsapp && (
                    <a
                      href={`https://wa.me/${whatsapp.replace(/\D/g, "")}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center gap-2 border px-6 py-4 rounded-xl font-semibold transition-all duration-300 hover:-translate-y-1"
                      style={{
                        background: "var(--pub-section-alt)",
                        borderColor: "var(--pub-card-border)",
                        color: "var(--pub-text)",
                      }}
                    >
                      <Phone className="w-5 h-5 text-emerald-500" />
                      Konsultasi
                    </a>
                  )}
                </div>

              </div>
            </div>
          </div>
        </div>
      </main>

      {/* FOOTER */}
      <footer
        className="border-t py-8 px-6 mt-auto"
        style={{ borderColor: "var(--pub-divider)", background: "var(--pub-section-alt)" }}
      >
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <Leaf className="w-5 h-5 text-emerald-500" />
            <span className="font-bold text-sm" style={{ color: "var(--pub-text)" }}>
              {farmName}
            </span>
          </div>
          <p className="text-xs" style={{ color: "var(--pub-text-subtle)" }}>
            © {new Date().getFullYear()} {farmName}. Semua hak dilindungi.
          </p>
        </div>
      </footer>
    </div>
  );
}
