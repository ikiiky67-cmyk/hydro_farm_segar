// src/app/dashboard/layout.tsx
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Sidebar } from "@/components/layout/Sidebar";
import { DashboardHeader } from "@/components/layout/DashboardHeader";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();
  if (!session) redirect("/login");

  return (
    <div className="t-page2 flex h-screen text-zinc-100 overflow-hidden transition-theme">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        <DashboardHeader user={session.user ?? {}} />
        <main className="t-page flex-1 overflow-y-auto p-4 md:p-6 transition-theme">
          {children}
        </main>
      </div>
    </div>
  );
}
