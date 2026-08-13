import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatDate(date: Date | string, opts?: Intl.DateTimeFormatOptions): string {
  return new Date(date).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
    ...opts,
  });
}

export function formatNumber(n: number, decimals = 2): string {
  return n.toLocaleString("id-ID", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}
