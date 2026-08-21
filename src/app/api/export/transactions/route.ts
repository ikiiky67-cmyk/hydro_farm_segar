import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { startOfMonth, endOfMonth, parseISO, isValid } from "date-fns";
import { formatRupiah, formatDate } from "@/lib/utils";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const preset = searchParams.get("preset");
  const startParam = searchParams.get("start");
  const endParam = searchParams.get("end");

  let startDate: Date | undefined;
  let endDate: Date | undefined;

  // Preset filter logic
  if (preset === "this_month") {
    const now = new Date();
    startDate = startOfMonth(now);
    endDate = endOfMonth(now);
  } else if (startParam && endParam) {
    const s = parseISO(startParam);
    const e = parseISO(endParam);
    if (isValid(s) && isValid(e)) {
      startDate = s;
      endDate = e;
    }
  }

  const where: any = { isDeleted: false };
  if (startDate || endDate) {
    where.occurredAt = {};
    if (startDate) where.occurredAt.gte = startDate;
    if (endDate) where.occurredAt.lte = endDate;
  }

  const transactions = await prisma.transaction.findMany({
    where,
    orderBy: { occurredAt: "desc" },
    include: {
      items: { include: { product: { select: { name: true } } } },
    },
  });

  // Buat isi CSV
  const csvRows = [];
  
  // Header
  csvRows.push(["Tanggal", "Jenis", "Kategori", "Keterangan", "Total (Rp)"]);

  // Rows
  transactions.forEach((tx) => {
    const date = new Date(tx.occurredAt).toLocaleDateString("id-ID");
    const type = tx.type;
    const category = tx.channel || "-";
    let note = tx.note || "-";
    
    if (tx.buyerName) note = `${tx.buyerName} - ${note}`;
    
    // Hilangkan koma dan newline dari note agar tidak merusak CSV format
    note = note.replace(/,/g, " ").replace(/\n/g, " ");

    const total = parseFloat(tx.totalAmount.toString());

    csvRows.push([date, type, category, note, total]);
  });

  const csvContent = csvRows.map((e) => e.join(",")).join("\n");

  const filename = `Laporan_Transaksi_${startDate ? startDate.toLocaleDateString('id-ID') : 'Semua_Waktu'}.csv`;

  return new NextResponse(csvContent, {
    status: 200,
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": `attachment; filename="${filename}"`,
    },
  });
}
