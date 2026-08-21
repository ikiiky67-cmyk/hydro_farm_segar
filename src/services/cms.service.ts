import { z } from "zod";
import { CmsRepository } from "@/repositories/cms.repository";

export const profileSchema = z.object({
  farmName: z.string().min(2),
  tagline: z.string().optional(),
  description: z.string().optional(),
  vision: z.string().optional(),
  logoUrl: z.string().optional(),
  bannerUrl: z.string().optional(),
  phone: z.string().optional(),
  email: z.string().email().optional().or(z.literal("")),
  address: z.string().optional(),
  instagram: z.string().optional(),
  whatsapp: z.string().optional(),
  
  // Profil Pemilik
  ownerName: z.string().optional(),
  ownerRole: z.string().optional(),
  ownerBio: z.string().optional(),
  ownerImageUrl: z.string().optional(),
  // Teks Hero Dinamis
  heroHomeTitle: z.string().optional(),
  heroHomeSubtitle: z.string().optional(),
  heroHomeTitle2: z.string().optional(),
  heroHomeSubtitle2: z.string().optional(),
  heroHomeTitle3: z.string().optional(),
  heroHomeSubtitle3: z.string().optional(),
  heroProductsTitle: z.string().optional(),
  heroProductsSubtitle: z.string().optional(),
  heroAboutTitle: z.string().optional(),
  heroAboutSubtitle: z.string().optional(),

  // Section Kenapa Pilih Kami
  whyChooseUsTitle: z.string().optional(),
  whyChooseUsSubtitle: z.string().optional(),
});

export const promoSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  imageUrl: z.string().optional(),
  badgeText: z.string().optional(),
  status: z.enum(["AKTIF", "NONAKTIF"]).default("AKTIF"),
  startDate: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  endDate: z.coerce.date().optional().or(z.literal("").transform(() => undefined)),
  sortOrder: z.coerce.number().default(0),
});

export const testimonialSchema = z.object({
  name: z.string().min(2),
  role: z.string().optional(),
  content: z.string().min(5),
  rating: z.coerce.number().min(1).max(5).default(5),
});

export const farmFeatureSchema = z.object({
  title: z.string().min(2, { message: "Judul minimal 2 karakter" }),
  description: z.string().min(3, { message: "Deskripsi minimal 3 karakter" }),
  icon: z.string().optional(),
  sortOrder: z.coerce.number().default(0),
  isActive: z.boolean().default(true),
});

export class CmsService {
  static async upsertBusinessProfile(data: Record<string, unknown>) {
    const parsed = profileSchema.safeParse(data);
    if (!parsed.success) throw new Error("Periksa isian form.");
    
    return CmsRepository.upsertBusinessProfile(parsed.data);
  }

  static async createPromo(data: Record<string, unknown>) {
    const parsed = promoSchema.safeParse(data);
    if (!parsed.success) throw new Error("Periksa isian form.");

    return CmsRepository.createPromo(parsed.data);
  }

  static async updatePromoStatus(id: string, status: "AKTIF" | "NONAKTIF") {
    return CmsRepository.updatePromoStatus(id, status);
  }

  static async deletePromo(id: string) {
    return CmsRepository.deletePromo(id);
  }

  static async createTestimonial(data: Record<string, unknown>) {
    const parsed = testimonialSchema.safeParse(data);
    if (!parsed.success) throw new Error("Periksa isian form.");

    return CmsRepository.createTestimonial(parsed.data);
  }

  static async updateTestimonialStatus(id: string, isActive: boolean) {
    return CmsRepository.updateTestimonialStatus(id, isActive);
  }

  static async deleteTestimonial(id: string) {
    return CmsRepository.deleteTestimonial(id);
  }

  // --- Farm Feature (Kenapa Pilih Kami) ---
  static async getFarmFeatures() {
    return CmsRepository.getFarmFeatures();
  }

  static async createFarmFeature(data: Record<string, unknown>) {
    const parsed = farmFeatureSchema.safeParse(data);
    if (!parsed.success) throw new Error("Periksa isian form: " + parsed.error.issues[0]?.message);

    return CmsRepository.createFarmFeature(parsed.data);
  }

  static async updateFarmFeature(id: string, data: Record<string, unknown>) {
    const parsed = farmFeatureSchema.safeParse(data);
    if (!parsed.success) throw new Error("Periksa isian form: " + parsed.error.issues[0]?.message);

    return CmsRepository.updateFarmFeature(id, parsed.data);
  }

  static async updateFarmFeatureStatus(id: string, isActive: boolean) {
    return CmsRepository.updateFarmFeatureStatus(id, isActive);
  }

  static async deleteFarmFeature(id: string) {
    return CmsRepository.deleteFarmFeature(id);
  }
}
