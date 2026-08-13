// src/middleware.ts
// Gunakan authConfig (TANPA Prisma) agar kompatibel dengan Edge Runtime
import NextAuth from "next-auth";
import { authConfig } from "@/lib/auth.config";

export const { auth: middleware } = NextAuth(authConfig);
export default middleware;

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/stok/:path*",
    "/transaksi/:path*",
    "/laporan/:path*",
    "/cms/:path*",
    "/login",
  ],
};
