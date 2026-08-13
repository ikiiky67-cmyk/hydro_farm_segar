import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "HydroFarm Segar — Sayuran Hidroponik Segar & Sehat",
    template: "%s | HydroFarm Segar",
  },
  description:
    "Dapatkan sayuran hidroponik segar berkualitas tinggi, bebas pestisida, langsung dari kebun kami. Pesan sekarang melalui WhatsApp.",
  keywords: ["hidroponik", "sayuran segar", "organik", "pertanian hidroponik", "sayuran bebas pestisida"],
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48" },
      { url: "/icon.png", type: "image/png", sizes: "512x512" },
    ],
    apple: "/apple-icon.png",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    siteName: "HydroFarm Segar",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
