"use client";

import { useState } from "react";
import { Printer, Loader2 } from "lucide-react";
import { getTransactionsForReport, getLaporanLabaRugi } from "@/actions/transaction.actions";
import { formatRupiah, formatDate } from "@/lib/utils";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

export function PrintButton({ targetDate }: { targetDate?: Date }) {
  const [isGenerating, setIsGenerating] = useState(false);

  const generatePDF = async () => {
    setIsGenerating(true);
    try {
      const target = targetDate || new Date();
      const [laporan, raw] = await Promise.all([
        getLaporanLabaRugi(target),
        getTransactionsForReport(target),
      ]);

      const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "a4" });

      // --- KOP SURAT ---
      doc.setFontSize(18);
      doc.setFont("helvetica", "bold");
      doc.text("LAPORAN LABA RUGI ANDANAFARM HIDROPONIK", 14, 20);

      doc.setFontSize(10);
      doc.setFont("helvetica", "normal");
      doc.setTextColor(100);
      doc.text(`Periode: ${formatDate(laporan.period.start)} - ${formatDate(laporan.period.end)}`, 14, 27);
      doc.text(`Dicetak pada: ${formatDate(new Date())}`, 14, 32);

      // --- RINGKASAN ---
      let currentY = 42;

      autoTable(doc, {
        startY: currentY,
        head: [["Ringkasan Keuangan", "Jumlah"]],
        body: [
          ["Total Penjualan", formatRupiah(laporan.totalPenjualan)],
          ["Total Pemasukan Lain", formatRupiah(laporan.totalPemasukanLain)],
          ["Total Pengeluaran", formatRupiah(laporan.totalPengeluaran)],
          ["Laba Bersih", formatRupiah(laporan.labaRugi)],
        ],
        theme: "grid",
        headStyles: { fillColor: [99, 102, 241] }, // Indigo
        styles: { fontSize: 10 },
      });

      // @ts-ignore - jspdf-autotable adds lastAutoTable to doc
      currentY = doc.lastAutoTable.finalY + 10;

      // --- TABEL TRANSAKSI ---
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(0);
      doc.text("Rincian Transaksi", 14, currentY);

      currentY += 6;

      const tableData = raw.transactions.map((tx) => [
        formatDate(tx.occurredAt),
        tx.type,
        tx.note || "-",
        tx.channel || "-",
        formatRupiah(parseFloat(tx.totalAmount.toString())),
      ]);

      autoTable(doc, {
        startY: currentY,
        head: [["Tanggal", "Jenis", "Keterangan", "Kategori", "Total"]],
        body: tableData,
        theme: "striped",
        headStyles: { fillColor: [71, 85, 105] }, // Slate
        styles: { fontSize: 9 },
      });

      // --- SAVE PDF ---
      doc.save(`Laporan_Keuangan_${formatDate(laporan.period.start).replace(/ /g, "_")}.pdf`);
    } catch (error) {
      console.error("Gagal membuat PDF:", error);
      alert("Terjadi kesalahan saat memuat laporan.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <button
      onClick={generatePDF}
      disabled={isGenerating}
      className="inline-flex items-center justify-center gap-2 px-4 py-2 bg-indigo-500 hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white font-semibold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(99,102,241,0.3)] hover:shadow-[0_0_20px_rgba(99,102,241,0.4)]"
    >
      {isGenerating ? (
        <Loader2 className="w-4 h-4 animate-spin" />
      ) : (
        <Printer className="w-4 h-4" />
      )}
      <span>Export PDF</span>
    </button>
  );
}
