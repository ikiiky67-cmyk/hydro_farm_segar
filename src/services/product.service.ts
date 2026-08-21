import { z } from "zod";
import { ProductRepository } from "@/repositories/product.repository";
import { generateSlug } from "@/utils/slug";

export const productSchema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  slug: z.string().optional().default(""),
  description: z.string().optional(),
  imageUrl: z
    .string()
    .optional()
    .refine(
      (v) => !v || v === "" || v.startsWith("/") || v.startsWith("http://") || v.startsWith("https://"),
      { message: "imageUrl harus berupa URL atau path lokal" }
    ),
  pricePerKg: z.coerce.number().positive("Harga harus lebih dari 0"),
  unit: z.string().default("kg"),
  minStock: z.coerce.number().min(0, "Minimal stok tidak boleh negatif").default(5),
  category: z.string().optional(),
  isFeatured: z.coerce.boolean().default(false),
  isActive: z.coerce.boolean().default(true),
});

export class ProductService {
  static async createProduct(data: Record<string, unknown>) {
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      throw { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const existingName = await ProductRepository.getProductByName(parsed.data.name);
    if (existingName) {
      throw { fieldErrors: { name: ["Nama produk sudah digunakan. Silakan gunakan nama lain."] } };
    }

    const slug = parsed.data.slug || generateSlug(parsed.data.name);
    const existingSlug = await ProductRepository.getProductBySlug(slug);
    if (existingSlug) {
      throw { fieldErrors: { slug: ["Slug (URL) ini sudah terpakai."] } };
    }

    return ProductRepository.createProduct({ ...parsed.data, slug });
  }

  static async updateProduct(id: string, data: Record<string, unknown>) {
    const parsed = productSchema.safeParse(data);
    if (!parsed.success) {
      throw { fieldErrors: parsed.error.flatten().fieldErrors };
    }

    const existingName = await ProductRepository.getProductByName(parsed.data.name, id);
    if (existingName) {
      throw { fieldErrors: { name: ["Nama produk sudah digunakan. Silakan gunakan nama lain."] } };
    }

    const existing = await ProductRepository.getProductById(id);
    const slug = parsed.data.slug || existing?.slug || generateSlug(parsed.data.name);

    const existingSlug = await ProductRepository.getProductBySlugWithExclude(slug, id);
    if (existingSlug) {
      throw { fieldErrors: { slug: ["Slug (URL) ini sudah terpakai."] } };
    }

    return ProductRepository.updateProduct(id, { ...parsed.data, slug });
  }

  static async checkProductHistory(id: string) {
    const stockCount = await ProductRepository.countStockMovementsByProductId(id);
    const txCount = await ProductRepository.countTransactionItemsByProductId(id);
    return stockCount > 0 || txCount > 0;
  }

  static async deleteProduct(id: string) {
    const hasHistory = await this.checkProductHistory(id);

    if (hasHistory) {
      await ProductRepository.softDeleteProduct(id);
      return { type: "SOFT_DELETE" };
    } else {
      await ProductRepository.deleteProduct(id);
      return { type: "HARD_DELETE" };
    }
  }

  static async bulkUpdateProductStatus(ids: string[], isActive: boolean) {
    return ProductRepository.updateManyProductStatus(ids, isActive);
  }

  static async getProducts() {
    return ProductRepository.getAllProducts();
  }

  static async getProductBySlug(slug: string) {
    return ProductRepository.getProductBySlug(slug);
  }

  static async getProductStock(productId: string) {
    const movements = await ProductRepository.getStockMovementsGroupByProductId(productId);
    
    let stock = 0;
    for (const m of movements) {
      const qty = parseFloat((m._sum.quantity ?? 0).toString());
      if (m.type === "PANEN_MASUK" || m.type === "PENYESUAIAN") stock += qty;
      else stock -= qty;
    }
    return Math.max(0, stock);
  }
}
