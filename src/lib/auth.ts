// src/lib/auth.ts
// File ini bisa mengimport Prisma karena hanya digunakan di Server Components/Actions
// JANGAN import file ini di middleware.ts
import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { authConfig } from "./auth.config";

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
});

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        const admin = await prisma.admin.findUnique({ where: { email } });
        if (!admin) return null;

        const passwordMatch = await bcrypt.compare(password, admin.password);
        if (!passwordMatch) return null;

        return {
          id: admin.id,
          name: admin.name,
          email: admin.email,
        };
      },
    }),
  ],
});
