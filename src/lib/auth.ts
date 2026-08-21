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

// Simple in-memory rate limiter for login
const MAX_LOGIN_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 15 * 60 * 1000; // 15 minutes
const loginAttempts = new Map<string, { count: number; lockoutUntil: number }>();

export const { handlers, signIn, signOut, auth } = NextAuth({
  ...authConfig,
  providers: [
    Credentials({
      async authorize(credentials) {
        const parsed = loginSchema.safeParse(credentials);
        if (!parsed.success) return null;

        const { email, password } = parsed.data;

        // Rate Limiting Check
        const attemptRecord = loginAttempts.get(email);
        if (attemptRecord && attemptRecord.lockoutUntil > Date.now()) {
          throw new Error("RATE_LIMIT_EXCEEDED");
        }

        const admin = await prisma.admin.findUnique({ where: { email } });
        
        let isValid = false;
        if (admin) {
          isValid = await bcrypt.compare(password, admin.password);
        }

        if (!isValid) {
          // Increment failed attempts
          if (attemptRecord) {
            attemptRecord.count += 1;
            if (attemptRecord.count >= MAX_LOGIN_ATTEMPTS) {
              attemptRecord.lockoutUntil = Date.now() + LOCKOUT_DURATION_MS;
            }
          } else {
            loginAttempts.set(email, { count: 1, lockoutUntil: 0 });
          }
          return null; // Invalid credentials
        }

        // Reset attempts on successful login
        loginAttempts.delete(email);

        return {
          id: admin!.id,
          name: admin!.name,
          email: admin!.email,
        };
      },
    }),
  ],
});
