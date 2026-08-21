import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Izinkan gambar dari domain eksternal (untuk URL yang sudah ada)
  // dan gambar lokal dari /public/uploads/
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
      {
        protocol: "http",
        hostname: "**",
      },
    ],
    // Aktifkan unoptimized untuk gambar lokal dari /public
    // (Next.js <Image> dengan src lokal tidak butuh ini, tapi
    //  ProductCard menggunakan <img> biasa sehingga ini opsional)
  },
  // Batas ukuran body request untuk upload (default 1MB, naikkan ke 10MB)
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  // Nonaktifkan dev indicator overlay
  devIndicators: false,
  output: "standalone",
};

export default nextConfig;

