import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { formatRupiah } from "@/lib/utils";
import { ProductDetailClient } from "@/components/produk/ProductDetailClient";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const resolvedParams = await params;
  const product = await prisma.product.findUnique({
    where: { slug: resolvedParams.slug },
  });
  if (!product) return { title: "Produk Tidak Ditemukan" };

  return {
    title: product.name,
    description: product.description || `Beli ${product.name} hidroponik segar bebas pestisida.`,
  };
}

export default async function ProductDetailPage({
  params,
  searchParams
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const resolvedParams = await params;
  const resolvedSearchParams = await searchParams;
  const from = resolvedSearchParams.from as string | undefined;

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

  const backHref = from === "home" ? "/#produk-unggulan" : "/produk#katalog";

  return (
    <div
      className="min-h-screen transition-colors duration-500 flex flex-col"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <ProductDetailClient 
        product={{
          ...product,
          pricePerKg: price,
          minStock: parseFloat(product.minStock.toString()),
        }}
        farmName={farmName}
        waLink={waLink}
        backHref={backHref}
        logoUrl={profile?.logoUrl}
      />
    </div>
  );
}
