"use server";

import { prisma } from "@/lib/prisma";
import { revalidatePath } from "next/cache";
import { z } from "zod";

/** Hasilkan slug URL-friendly dari nama produk */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, "")
    .trim()
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .slice(0, 80);
}

const productSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  // Slug bersifat opsional di form — akan di-generate dari name jika kosong
  slug: z.string().optional().default(""),
  description: z.string().optional(),
  // Accept full URL atau local path seperti /uploads/products/...
  imageUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === "" || v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
      { message: "imageUrl harus berupa URL atau path lokal" }
    ),
  pricePerKg: z.coerce.number().positive("Harga harus lebih dari 0"),
  unit: z.string().default("kg"),
  category: z.string().optional(),
  isFeatured: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Auto-generate slug jika kosong
  const slug = parsed.data.slug || generateSlug(parsed.data.name);

  await prisma.product.create({ data: { ...parsed.data, slug } });
  revalidatePath("/dashboard/produk");
  return { success: true };
}

export async function updateProduct(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  const parsed = productSchema.safeParse(raw);

  if (!parsed.success) {
    return { error: parsed.error.flatten().fieldErrors };
  }

  // Pertahankan slug lama jika slug baru kosong
  const existing = await prisma.product.findUnique({ where: { id }, select: { slug: true } });
  const slug = parsed.data.slug || existing?.slug || generateSlug(parsed.data.name);

  await prisma.product.update({ where: { id }, data: { ...parsed.data, slug } });
  revalidatePath("/dashboard/produk");
  return { success: true };
}

export async function deleteProduct(id: string) {
  await prisma.product.update({
    where: { id },
    data: { isActive: false },
  });
  revalidatePath("/dashboard/produk");
  return { success: true };
}

export async function getProducts() {
  return prisma.product.findMany({
    orderBy: { createdAt: "desc" },
  });
}

export async function getProductBySlug(slug: string) {
  return prisma.product.findUnique({ where: { slug } });
}

// Calculate current stock for a product
export async function getProductStock(productId: string) {
  const movements = await prisma.stockMovement.groupBy({
    by: ["type"],
    where: { productId },
    _sum: { quantity: true },
  });

  let stock = 0;
  for (const m of movements) {
    const qty = parseFloat((m._sum.quantity ?? 0).toString());
    if (m.type === "PANEN_MASUK" || m.type === "PENYESUAIAN") stock += qty;
    else stock -= qty;
  }
  return Math.max(0, stock);
}
