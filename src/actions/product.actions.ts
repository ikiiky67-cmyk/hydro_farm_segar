"use server";

import { revalidatePath } from "next/cache";
import { ProductService } from "@/services/product.service";

export async function createProduct(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  try {
    await ProductService.createProduct(raw);
    revalidatePath("/dashboard/produk");
    return { success: true };
  } catch (error: any) {
    if (error.fieldErrors) {
      return { error: error.fieldErrors };
    }
    return { error: { name: ["Terjadi kesalahan tidak terduga."] } };
  }
}

export async function updateProduct(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());

  try {
    await ProductService.updateProduct(id, raw);
    revalidatePath("/dashboard/produk");
    return { success: true };
  } catch (error: any) {
    if (error.fieldErrors) {
      return { error: error.fieldErrors };
    }
    return { error: { name: ["Terjadi kesalahan tidak terduga."] } };
  }
}

export async function checkProductHistory(id: string) {
  return ProductService.checkProductHistory(id);
}

export async function deleteProduct(id: string) {
  try {
    const result = await ProductService.deleteProduct(id);
    revalidatePath("/dashboard/produk");
    return { success: true, type: result.type };
  } catch (error: any) {
    return { success: false, error: "Gagal menghapus produk." };
  }
}

export async function bulkUpdateProductStatus(ids: string[], isActive: boolean) {
  try {
    await ProductService.bulkUpdateProductStatus(ids, isActive);
    revalidatePath("/dashboard/produk");
    return { success: true };
  } catch (error: any) {
    return { success: false, error: "Gagal memperbarui status produk." };
  }
}

export async function getProducts() {
  return ProductService.getProducts();
}

export async function getProductBySlug(slug: string) {
  return ProductService.getProductBySlug(slug);
}

export async function getProductStock(productId: string) {
  return ProductService.getProductStock(productId);
}

