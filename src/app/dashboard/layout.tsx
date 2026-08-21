// src/app/dashboard/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";
import { getLowStockProducts } from "@/actions/stock.actions";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  // Fetch notifications
  let isDefaultPassword = false;
  try {
    if (session?.user?.email) {
      const admin = await prisma.admin.findUnique({
        where: { email: session.user.email },
        select: { password: true },
      });
      if (admin) {
        isDefaultPassword = await bcrypt.compare("admin123", admin.password);
      }
    }
  } catch {}

  const lowStockProducts = await getLowStockProducts();
  const profile = await prisma.businessProfile.findFirst();

  return (
    <div className="t-page2 flex h-screen text-zinc-100 overflow-hidden transition-theme">
      <Sidebar farmName={profile?.farmName || "HydroFarm"} logoUrl={profile?.logoUrl || null} />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader 
          user={session.user ?? {}} 
          isDefaultPassword={isDefaultPassword} 
          lowStockProducts={lowStockProducts}
        />
        <main className="t-page flex-1 overflow-y-auto p-4 md:p-6 transition-theme">
          {children}
        </main>
      </div>
    </div>
  );
}
