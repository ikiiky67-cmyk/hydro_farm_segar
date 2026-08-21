import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class CmsRepository {
  // --- Profil Bisnis ---
  static async upsertBusinessProfile(data: Prisma.BusinessProfileCreateInput | Prisma.BusinessProfileUpdateInput) {
    return prisma.businessProfile.upsert({
      where: { id: "default-profile" },
      update: data,
      create: { id: "default-profile", ...data } as Prisma.BusinessProfileCreateInput,
    });
  }

  // --- Promo ---
  static async createPromo(data: Prisma.PromoContentCreateInput) {
    return prisma.promoContent.create({ data });
  }

  static async updatePromoStatus(id: string, status: "AKTIF" | "NONAKTIF") {
    return prisma.promoContent.update({ where: { id }, data: { status } });
  }

  static async deletePromo(id: string) {
    return prisma.promoContent.delete({ where: { id } });
  }

  // --- Testimoni ---
  static async createTestimonial(data: Prisma.TestimonialCreateInput) {
    return prisma.testimonial.create({ data });
  }

  static async updateTestimonialStatus(id: string, isActive: boolean) {
    return prisma.testimonial.update({ where: { id }, data: { isActive } });
  }

  static async deleteTestimonial(id: string) {
    return prisma.testimonial.delete({ where: { id } });
  }

  // --- Farm Feature (Kenapa Pilih Kami) ---
  static async getFarmFeatures() {
    return prisma.farmFeature.findMany({
      orderBy: { sortOrder: 'asc' }
    });
  }

  static async getActiveFarmFeatures() {
    return prisma.farmFeature.findMany({
      where: { isActive: true },
      orderBy: { sortOrder: 'asc' }
    });
  }

  static async createFarmFeature(data: Prisma.FarmFeatureCreateInput) {
    return prisma.farmFeature.create({ data });
  }

  static async updateFarmFeature(id: string, data: Prisma.FarmFeatureUpdateInput) {
    return prisma.farmFeature.update({ where: { id }, data });
  }

  static async updateFarmFeatureStatus(id: string, isActive: boolean) {
    return prisma.farmFeature.update({ where: { id }, data: { isActive } });
  }

  static async deleteFarmFeature(id: string) {
    return prisma.farmFeature.delete({ where: { id } });
  }
}
