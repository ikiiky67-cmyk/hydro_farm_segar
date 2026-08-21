"use client";

import { useRef, useState, useCallback } from "react";
import { Upload, X, ImageIcon, Loader2, CheckCircle } from "lucide-react";
import Image from "next/image";

interface ImageUploaderProps {
  name?: string;               // hidden input name — default "imageUrl"
  defaultValue?: string | null; // URL foto yang sudah ada (edit mode)
  onUploadSuccess?: (url: string) => void;
  folder?: string;             // folder untuk menyimpan gambar
}

export function ImageUploader({
  name = "imageUrl",
  defaultValue,
  onUploadSuccess,
  folder = "products",
}: ImageUploaderProps) {
  const [preview, setPreview] = useState<string | null>(defaultValue ?? null);
  const [uploading, setUploading] = useState(false);
  const [uploadedUrl, setUploadedUrl] = useState<string | null>(defaultValue ?? null);
  const [error, setError] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);

  const inputRef = useRef<HTMLInputElement>(null);

  const handleUpload = useCallback(async (file: File) => {
    setError(null);
    setUploading(true);

    // Preview lokal instan
    const localPreview = URL.createObjectURL(file);
    setPreview(localPreview);

    const formData = new FormData();
    formData.append("file", file);
    formData.append("folder", folder);

    try {
      const res = await fetch("/api/upload", { method: "POST", body: formData });
      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error ?? "Upload gagal.");
        setPreview(null);
        setUploadedUrl(null);
        return;
      }

      setUploadedUrl(data.url);
      setPreview(data.url);
      onUploadSuccess?.(data.url);
    } catch {
      setError("Koneksi gagal. Coba lagi.");
      setPreview(null);
    } finally {
      setUploading(false);
    }
  }, [onUploadSuccess]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleUpload(file);
  };

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleUpload(file);
  }, [handleUpload]);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => setIsDragging(false);

  const handleRemove = () => {
    setPreview(null);
    setUploadedUrl(null);
    setError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  return (
    <div className="space-y-2">
      {/* Hidden input untuk menyimpan URL ke form */}
      <input type="hidden" name={name} value={uploadedUrl ?? ""} />

      {/* Upload Zone */}
      {!preview ? (
        <div
          onClick={() => inputRef.current?.click()}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          className="relative flex flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed cursor-pointer transition-all duration-200 py-10 px-6"
          style={{
            borderColor: isDragging ? "#10b981" : "var(--t-input-border)",
            background: isDragging
              ? "rgba(16,185,129,0.05)"
              : "var(--t-input-bg)",
          }}
        >
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-colors"
            style={{
              background: isDragging
                ? "rgba(16,185,129,0.15)"
                : "rgba(16,185,129,0.08)",
            }}
          >
            <Upload className="w-6 h-6 text-emerald-500" />
          </div>
          <div className="text-center">
            <p className="text-sm font-semibold" style={{ color: "var(--t-text-primary)" }}>
              {isDragging ? "Lepaskan untuk mengunggah" : "Klik atau seret foto ke sini"}
            </p>
            <p className="text-xs mt-1" style={{ color: "var(--t-text-muted)" }}>
              JPG, PNG, WebP — Maks. 5 MB
            </p>
          </div>
        </div>
      ) : (
        /* Preview */
        <div className="relative rounded-2xl overflow-hidden border group" style={{ borderColor: "var(--t-card-border)" }}>
          <div className="relative w-full h-56 bg-black/5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={preview}
              alt="Preview produk"
              className="w-full h-full object-cover"
            />
            {/* Overlay loading */}
            {uploading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/40 backdrop-blur-sm">
                <div className="flex flex-col items-center gap-2 text-white">
                  <Loader2 className="w-8 h-8 animate-spin" />
                  <span className="text-sm font-medium">Mengunggah...</span>
                </div>
              </div>
            )}
            {/* Overlay success */}
            {!uploading && uploadedUrl && (
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold bg-emerald-500 text-white px-2.5 py-1 rounded-lg shadow-lg">
                  <CheckCircle className="w-3.5 h-3.5" />
                  Terunggah
                </span>
              </div>
            )}
          </div>
          {/* Actions */}
          <div
            className="flex items-center gap-2 px-4 py-3 transition-theme"
            style={{ background: "var(--t-card-bg)", borderTop: "1px solid var(--t-divider)" }}
          >
            <ImageIcon className="w-4 h-4 flex-shrink-0" style={{ color: "var(--t-text-muted)" }} />
            <p className="text-xs flex-1 truncate" style={{ color: "var(--t-text-secondary)" }}>
              {uploadedUrl ? uploadedUrl.split("/").pop() : "Mengunggah..."}
            </p>
            <button
              type="button"
              onClick={handleRemove}
              className="ml-auto w-7 h-7 rounded-lg flex items-center justify-center hover:bg-rose-500/15 hover:text-rose-500 transition-colors"
              style={{ color: "var(--t-text-muted)" }}
              title="Hapus foto"
            >
              <X className="w-4 h-4" />
            </button>
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="text-xs font-medium px-3 py-1.5 rounded-lg transition-colors hover:opacity-80"
              style={{
                background: "rgba(16,185,129,0.12)",
                color: "#10b981",
                border: "1px solid rgba(16,185,129,0.25)",
              }}
            >
              Ganti Foto
            </button>
          </div>
        </div>
      )}

      {/* Error */}
      {error && (
        <p className="text-rose-500 text-xs bg-rose-500/10 border border-rose-500/20 rounded-lg px-3 py-2">
          {error}
        </p>
      )}

      {/* Hidden real file input */}
      <input
        ref={inputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png,image/webp,image/gif"
        className="hidden"
        onChange={handleFileChange}
      />
    </div>
  );
}
