"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const profileSchema = z.object({
  farmName: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
});

const promoSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  badgeText: z.string().optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).default("AKTIF"),
  sortOrder: z.coerce.number().default(0),
});

export async function upsertBusinessProfile(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = profileSchema.safeParse(raw);
  if (!parsed.success) return { error: "Periksa isian form." };

  await prisma.businessProfile.upsert({
    where: { id: "default-profile" },
    update: parsed.data,
    create: { id: "default-profile", ...parsed.data },
  });

  revalidatePath("/dashboard/cms/profil");
  revalidatePath("/");
  return { success: true };
}

export async function createPromo(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = promoSchema.safeParse(raw);
  if (!parsed.success) return { error: "Periksa isian form." };

  await prisma.promoContent.create({ data: parsed.data });
  revalidatePath("/dashboard/cms/promo");
  revalidatePath("/");
  return { success: true };
}

export async function updatePromoStatus(id: string, status: "AKTIF" | "NONAKTIF") {
  await prisma.promoContent.update({ where: { id }, data: { status } });
  revalidatePath("/dashboard/cms/promo");
  revalidatePath("/");
  return { success: true };
}

export async function deletePromo(id: string) {
  await prisma.promoContent.delete({ where: { id } });
  revalidatePath("/dashboard/cms/promo");
  revalidatePath("/");
  return { success: true };
}
