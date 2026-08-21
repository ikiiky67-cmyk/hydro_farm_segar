import type { Metadata } from "next";
import { Outfit, JetBrains_Mono } from "next/font/google";
import { prisma } from "@/lib/prisma";
import "./globals.css";
import { ThemeProvider } from "@/components/theme/ThemeProvider";

const outfitFont = Outfit({
  variable: "--font-sans",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
});

export async function generateMetadata(): Promise<Metadata> {
  const profile = await prisma.businessProfile.findFirst();
  const siteName = profile?.farmName || "Hydro Farm Segar";

  return {
    title: {
      default: `${siteName} - Sayuran Hidroponik Segar & Sehat`,
      template: `%s | ${siteName}`,
    },
    description: profile?.description || "Dapatkan sayuran hidroponik segar berkualitas tinggi, bebas pestisida, langsung dari kebun kami. Pesan sekarang melalui WhatsApp.",
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
      siteName: siteName,
    },
  };
}

import { GlobalSplash } from "@/components/layout/GlobalSplash";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const profile = await prisma.businessProfile.findFirst();
  const farmName = profile?.farmName || "Hydro Farm Segar";
  
  return (
    <html lang="id" suppressHydrationWarning className="light-mode">
      <body className={`${outfitFont.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>
          <GlobalSplash farmName={farmName} logoUrl={profile?.logoUrl || null} />
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
