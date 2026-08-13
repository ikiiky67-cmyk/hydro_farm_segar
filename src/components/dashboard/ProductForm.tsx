"use client";

import { useTransition, useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { createProduct, updateProduct } from "@/actions/product.actions";
import { Button } from "@/components/ui/button";
import { ImageUploader } from "@/components/ui/ImageUploader";
import { Save, ArrowLeft, Image as ImageIcon, Link as LinkIcon } from "lucide-react";
import Link from "next/link";

// Serialized product — pricePerKg sebagai number bukan Decimal
type SerializedProduct = {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  pricePerKg: number;
  unit: string;
  category: string | null;
  isActive: boolean;
  isFeatured: boolean;
};

const inputStyle = {
  background: "var(--t-input-bg)",
  borderColor: "var(--t-input-border)",
  color: "var(--t-text-primary)",
} as React.CSSProperties;

const inputClass =
  "w-full border rounded-xl px-4 py-3 text-sm outline-none focus:ring-2 focus:ring-emerald-500/30 transition-all";

const labelClass = "text-xs font-semibold uppercase tracking-wide mb-2 block";

/** Konversi nama produk → slug URL-friendly */
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // hapus aksen
    .replace(/[^a-z0-9\s-]/g, "")   // hapus karakter non-alphanumeric
    .trim()
    .replace(/\s+/g, "-")            // spasi → tanda -
    .replace(/-+/g, "-")             // double --- → -
    .slice(0, 80);                    // batasi panjang
}

export function ProductForm({ product }: { product?: SerializedProduct | null }) {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [slug, setSlug] = useState<string>(product?.slug ?? "");
  const [nameValue, setNameValue] = useState<string>(product?.name ?? "");
  const isEdit = !!product;
  // Tandai apakah slug sudah pernah diedit manual (hanya untuk mode tambah)
  const slugManuallyEdited = useRef(false);

  // Saat mode tambah: auto-generate slug dari nama
  useEffect(() => {
    if (!isEdit && !slugManuallyEdited.current) {
      setSlug(generateSlug(nameValue));
    }
  }, [nameValue, isEdit]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const formData = new FormData(e.currentTarget);

    // Pastikan slug terisi (dari state)
    formData.set("slug", slug || generateSlug(formData.get("name") as string));

    // Validasi: nama wajib ada
    if (!formData.get("name")) {
      setError("Nama produk wajib diisi.");
      return;
    }

    startTransition(async () => {
      const result = isEdit
        ? await updateProduct(product.id, formData)
        : await createProduct(formData);

      if (result?.error) {
        setError("Periksa kembali isian form Anda.");
      } else {
        router.push("/dashboard/produk");
        router.refresh();
      }
    });
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* ── Informasi Dasar ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div>
          <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
            Nama Produk *
          </label>
          <input
            name="name"
            required
            value={nameValue}
            onChange={(e) => setNameValue(e.target.value)}
            placeholder="Selada Keriting"
            className={inputClass}
            style={inputStyle}
          />
        </div>

        {/* Slug — read-only preview dengan hidden input */}
        <div>
          <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
            <span className="flex items-center gap-1.5">
              <LinkIcon className="w-3 h-3" />
              URL Slug
            </span>
          </label>
          <div
            className="w-full border rounded-xl px-4 py-3 text-sm flex items-center gap-2"
            style={{
              background: "var(--t-input-bg)",
              borderColor: "var(--t-input-border)",
              opacity: 0.8,
            }}
          >
            <span style={{ color: "var(--t-text-muted)" }} className="text-xs shrink-0">
              /produk/
            </span>
            <span
              className="font-mono text-emerald-500 text-xs truncate"
              title={slug}
            >
              {slug || <span style={{ color: "var(--t-text-muted)" }}>akan-terisi-otomatis</span>}
            </span>
          </div>
          <p className="text-xs mt-1" style={{ color: "var(--t-text-muted)" }}>
            {isEdit
              ? "Slug tidak dapat diubah setelah produk dibuat."
              : "Dibuat otomatis dari nama produk."}
          </p>
          {/* Hidden input untuk dikirim ke server */}
          <input type="hidden" name="slug" value={slug} readOnly />
        </div>
      </div>

      <div>
        <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
          Deskripsi
        </label>
        <textarea
          name="description"
          rows={3}
          defaultValue={product?.description ?? ""}
          placeholder="Deskripsi produk..."
          className={`${inputClass} resize-none`}
          style={inputStyle}
        />
      </div>

      {/* ── Harga, Satuan, Kategori ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
            Harga per Satuan (Rp) *
          </label>
          <input
            name="pricePerKg"
            type="number"
            required
            min="0"
            step="500"
            defaultValue={product?.pricePerKg?.toString() ?? ""}
            placeholder="25000"
            className={inputClass}
            style={inputStyle}
          />
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
            Satuan *
          </label>
          <select
            name="unit"
            defaultValue={product?.unit ?? "kg"}
            className={`${inputClass} cursor-pointer`}
            style={inputStyle}
          >
            <option value="kg">kg</option>
            <option value="ikat">ikat</option>
            <option value="gram">gram</option>
            <option value="pcs">pcs</option>
            <option value="pack">pack</option>
          </select>
        </div>
        <div>
          <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
            Kategori
          </label>
          <input
            name="category"
            defaultValue={product?.category ?? ""}
            placeholder="Sayuran Daun"
            className={inputClass}
            style={inputStyle}
          />
        </div>
      </div>

      {/* ── Upload Foto ── */}
      <div>
        <label className={labelClass} style={{ color: "var(--t-text-muted)" }}>
          <span className="flex items-center gap-1.5">
            <ImageIcon className="w-3.5 h-3.5" />
            Foto Produk
          </span>
        </label>
        <ImageUploader
          name="imageUrl"
          defaultValue={product?.imageUrl ?? null}
        />
      </div>

      {/* ── Toggle Unggulan & Aktif ── */}
      <div className="flex flex-col sm:flex-row gap-4">
        {[
          {
            name: "isFeatured",
            label: "Tampilkan sebagai Produk Unggulan",
            desc: "Muncul di bagian featured landing page",
            checked: product?.isFeatured ?? false,
            color: "#f59e0b",
          },
          {
            name: "isActive",
            label: "Produk Aktif",
            desc: "Ditampilkan di katalog publik",
            checked: product?.isActive ?? true,
            color: "#10b981",
          },
        ].map((toggle) => (
          <label
            key={toggle.name}
            className="flex items-start gap-3 cursor-pointer rounded-xl border p-4 flex-1 transition-all hover:opacity-90"
            style={{ background: "var(--t-input-bg)", borderColor: "var(--t-input-border)" }}
          >
            <div className="relative mt-0.5 flex-shrink-0">
              <input
                name={toggle.name}
                type="checkbox"
                defaultChecked={toggle.checked}
                className="peer sr-only"
                value="true"
              />
              <div
                className="w-10 h-6 rounded-full transition-colors duration-200 peer-checked:bg-emerald-500"
                style={{ background: "var(--t-input-border)" }}
              />
              <div className="absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200 peer-checked:translate-x-4" />
            </div>
            <div>
              <p className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
                {toggle.label}
              </p>
              <p className="text-xs mt-0.5" style={{ color: "var(--t-text-muted)" }}>
                {toggle.desc}
              </p>
            </div>
          </label>
        ))}
      </div>

      {/* ── Error ── */}
      {error && (
        <p className="text-rose-500 text-xs bg-rose-500/10 border border-rose-500/25 rounded-xl px-4 py-3">
          {error}
        </p>
      )}

      {/* ── Aksi ── */}
      <div
        className="flex items-center gap-3 pt-4"
        style={{ borderTop: "1px solid var(--t-divider)" }}
      >
        <Button
          asChild
          variant="ghost"
          className="rounded-xl"
          style={{
            border: "1px solid var(--t-input-border)",
            color: "var(--t-text-secondary)",
          }}
        >
          <Link href="/dashboard/produk">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Batal
          </Link>
        </Button>
        <Button
          type="submit"
          disabled={pending}
          className="bg-emerald-500 hover:bg-emerald-400 text-white rounded-xl font-semibold gap-2 shadow-[0_0_20px_rgba(16,185,129,0.2)] disabled:opacity-60"
        >
          <Save className="w-4 h-4" />
          {pending ? "Menyimpan..." : isEdit ? "Simpan Perubahan" : "Tambah Produk"}
        </Button>
      </div>
    </form>
  );
}
