"use server";

import { AuthService } from "@/services/auth.service";
import { auth } from "@/lib/auth";
import { revalidatePath } from "next/cache";

export async function changePassword(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { success: false, error: "Tidak terotorisasi." };
    }

    const currentPassword = formData.get("currentPassword") as string;
    const newPassword = formData.get("newPassword") as string;
    const confirmPassword = formData.get("confirmPassword") as string;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return { success: false, error: "Semua kolom harus diisi." };
    }

    if (newPassword !== confirmPassword) {
      return { success: false, error: "Password baru dan konfirmasi tidak cocok." };
    }

    if (newPassword.length < 6) {
      return { success: false, error: "Password baru minimal 6 karakter." };
    }

    await AuthService.changePassword(session.user.email, currentPassword, newPassword);

    revalidatePath("/dashboard");
    return { success: true, message: "Password berhasil diubah." };
  } catch (error: any) {
    console.error("Change password error:", error);
    return { success: false, error: error.message || "Gagal mengubah password." };
  }
}
