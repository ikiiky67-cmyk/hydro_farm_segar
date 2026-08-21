"use server";

import { revalidatePath } from "next/cache";
import { CmsService } from "@/services/cms.service";

export async function upsertBusinessProfile(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  try {
    await CmsService.upsertBusinessProfile(raw);
    revalidatePath("/dashboard/cms/profil");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createPromo(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  try {
    await CmsService.createPromo(raw);
    revalidatePath("/dashboard/cms/promo");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updatePromoStatus(id: string, status: "AKTIF" | "NONAKTIF") {
  try {
    await CmsService.updatePromoStatus(id, status);
    revalidatePath("/dashboard/cms/promo");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deletePromo(id: string) {
  try {
    await CmsService.deletePromo(id);
    revalidatePath("/dashboard/cms/promo");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createTestimonial(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  try {
    await CmsService.createTestimonial(raw);
    revalidatePath("/dashboard/cms/testimoni");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateTestimonialStatus(id: string, isActive: boolean) {
  try {
    await CmsService.updateTestimonialStatus(id, isActive);
    revalidatePath("/dashboard/cms/testimoni");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteTestimonial(id: string) {
  try {
    await CmsService.deleteTestimonial(id);
    revalidatePath("/dashboard/cms/testimoni");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function createFarmFeature(formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  try {
    await CmsService.createFarmFeature(raw);
    revalidatePath("/dashboard/cms/keunggulan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateFarmFeature(id: string, formData: FormData) {
  const raw = Object.fromEntries(formData.entries());
  try {
    await CmsService.updateFarmFeature(id, raw);
    revalidatePath("/dashboard/cms/keunggulan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function updateFarmFeatureStatus(id: string, isActive: boolean) {
  try {
    await CmsService.updateFarmFeatureStatus(id, isActive);
    revalidatePath("/dashboard/cms/keunggulan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

export async function deleteFarmFeature(id: string) {
  try {
    await CmsService.deleteFarmFeature(id);
    revalidatePath("/dashboard/cms/keunggulan");
    revalidatePath("/");
    return { success: true };
  } catch (error: any) {
    return { error: error.message };
  }
}

