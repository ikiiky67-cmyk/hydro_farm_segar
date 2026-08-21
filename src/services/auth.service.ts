import bcrypt from "bcryptjs";
import { AuthRepository } from "@/repositories/auth.repository";

export class AuthService {
  static async changePassword(email: string, currentPassword: string, newPassword: string) {
    const admin = await AuthRepository.getAdminByEmail(email);

    if (!admin) {
      throw new Error("Admin tidak ditemukan.");
    }

    const isValid = await bcrypt.compare(currentPassword, admin.password);
    if (!isValid) {
      throw new Error("Password saat ini salah.");
    }

    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await AuthRepository.updateAdminPassword(admin.id, hashedNewPassword);
  }
}
