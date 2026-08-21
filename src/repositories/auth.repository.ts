import { prisma } from "@/lib/prisma";

export class AuthRepository {
  static async getAdminByEmail(email: string) {
    return prisma.admin.findUnique({
      where: { email },
    });
  }

  static async updateAdminPassword(id: string, hashedNewPassword: string) {
    return prisma.admin.update({
      where: { id },
      data: { password: hashedNewPassword },
    });
  }
}
