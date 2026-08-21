"use client";

import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Calendar } from "lucide-react";

export function LaporanMonthPicker({ currentMonth }: { currentMonth: string }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Jika currentMonth kosong, pakai bulan dan tahun saat ini format YYYY-MM
  const defaultValue = currentMonth || new Date().toISOString().slice(0, 7);

  const handleMonthChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value;
    const params = new URLSearchParams(searchParams.toString());
    
    if (val) {
      params.set("month", val);
    } else {
      params.delete("month");
    }

    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-2 relative print-hide">
      <Calendar className="w-4 h-4 absolute left-3 pointer-events-none" style={{ color: "var(--t-text-muted)" }} />
      <input
        type="month"
        defaultValue={defaultValue}
        onChange={handleMonthChange}
        className="pl-9 pr-4 py-2 text-sm rounded-xl border outline-none transition-all focus:ring-2 focus:ring-indigo-500/30"
        style={{
          background: "var(--t-input-bg)",
          borderColor: "var(--t-input-border)",
          color: "var(--t-text-primary)",
        }}
      />
    </div>
  );
}
