// src/lib/auth.config.ts
// Konfigurasi NextAuth yang KOMPATIBEL dengan Edge Runtime
// (tidak boleh mengimport Prisma atau library Node.js di sini)
import type { NextAuthConfig } from "next-auth";

export const authConfig: NextAuthConfig = {
  session: { strategy: "jwt" },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const protectedPrefixes = ["/dashboard", "/stok", "/transaksi", "/laporan", "/cms"];
      const isProtected = protectedPrefixes.some((p) => nextUrl.pathname.startsWith(p));

      if (isProtected && !isLoggedIn) return false; // Redirect ke /login
      if (nextUrl.pathname === "/login" && isLoggedIn) {
        return Response.redirect(new URL("/dashboard", nextUrl));
      }
      return true;
    },
    jwt({ token, user }) {
      if (user) token.id = user.id;
      return token;
    },
    session({ session, token }) {
      if (token) session.user.id = token.id as string;
      return session;
    },
  },
  providers: [], // Provider ditambahkan di auth.ts (bukan edge)
};
