import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export class ProductRepository {
  static async createProduct(data: Prisma.ProductCreateInput) {
    return prisma.product.create({ data });
  }

  static async updateProduct(id: string, data: Prisma.ProductUpdateInput) {
    return prisma.product.update({ where: { id }, data });
  }

  static async deleteProduct(id: string) {
    return prisma.product.delete({ where: { id } });
  }

  static async softDeleteProduct(id: string) {
    return prisma.product.update({
      where: { id },
      data: { isActive: false },
    });
  }

  static async updateManyProductStatus(ids: string[], isActive: boolean) {
    return prisma.product.updateMany({
      where: { id: { in: ids } },
      data: { isActive },
    });
  }

  static async getAllProducts() {
    return prisma.product.findMany({
      orderBy: { createdAt: "desc" },
    });
  }

  static async getProductById(id: string) {
    return prisma.product.findUnique({ where: { id } });
  }

  static async getProductBySlug(slug: string) {
    return prisma.product.findUnique({ where: { slug } });
  }

  static async getProductByName(name: string, excludeId?: string) {
    return prisma.product.findFirst({
      where: {
        name: { equals: name, mode: "insensitive" },
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  static async getProductBySlugWithExclude(slug: string, excludeId?: string) {
    return prisma.product.findFirst({
      where: {
        slug,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  static async countStockMovementsByProductId(productId: string) {
    return prisma.stockMovement.count({ where: { productId } });
  }

  static async countTransactionItemsByProductId(productId: string) {
    return prisma.transactionItem.count({ where: { productId } });
  }

  static async getStockMovementsGroupByProductId(productId: string) {
    return prisma.stockMovement.groupBy({
      by: ["type"],
      where: { productId },
      _sum: { quantity: true },
    });
  }
}
