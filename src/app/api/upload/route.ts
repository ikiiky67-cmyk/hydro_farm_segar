import { NextRequest, NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { auth } from "@/lib/auth";

const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"];
const MAX_SIZE_MB = 5;

export async function POST(request: NextRequest) {
  try {
    // Cek autentikasi — hanya admin yang boleh upload
    const session = await auth();
    if (!session) {
      return NextResponse.json({ error: "Unauthorized — silakan login terlebih dahulu." }, { status: 401 });
    }

    const formData = await request.formData();
    const file = formData.get("file") as File | null;

    if (!file) {
      return NextResponse.json({ error: "Tidak ada file yang dipilih." }, { status: 400 });
    }

    // Validasi tipe file
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        { error: "Format file tidak didukung. Gunakan JPG, PNG, atau WebP." },
        { status: 400 }
      );
    }

    // Validasi ukuran file (max 5MB)
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      return NextResponse.json(
        { error: `Ukuran file maksimal ${MAX_SIZE_MB}MB.` },
        { status: 400 }
      );
    }

    const folder = (formData.get("folder") as string) || "products";
    
    // Sanitize folder to prevent path traversal
    const safeFolder = folder.replace(/[^a-zA-Z0-9_\-\/]/g, "").replace(/\.\./g, "");

    // Buat nama file unik dengan timestamp
    const ext = file.name.split(".").pop() || "jpg";
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).slice(2, 8);
    const filename = `${safeFolder.replace(/\//g, "_")}_${timestamp}_${randomStr}.${ext}`;

    // Pastikan direktori upload ada
    const uploadDir = path.join(process.cwd(), "public", "uploads", safeFolder);
    await mkdir(uploadDir, { recursive: true });

    // Simpan file
    const buffer = Buffer.from(await file.arrayBuffer());
    const filePath = path.join(uploadDir, filename);
    await writeFile(filePath, buffer);

    // Return URL publik
    const publicUrl = `/uploads/${safeFolder}/${filename}`;
    return NextResponse.json({ url: publicUrl });
  } catch (err) {
    console.error("[UPLOAD ERROR]", err);
    return NextResponse.json({ error: "Gagal mengunggah gambar." }, { status: 500 });
  }
}
