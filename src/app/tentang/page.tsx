import { prisma } from "@/lib/prisma";
import { Metadata } from "next";
import { PublicNavbar } from "@/components/layout/PublicNavbar";
import { PublicFooter } from "@/components/layout/PublicFooter";
import { TentangPageClient } from "@/components/tentang/TentangPageClient";

export const metadata: Metadata = {
  title: "Tentang Kami",
  description: "Kenali lebih dekat perjalanan kebun hidroponik kami.",
};

export default async function TentangPage() {
  const profile = await prisma.businessProfile.findFirst();
  const farmName = profile?.farmName ?? "HydroFarm Segar";

  return (
    <div
      className="min-h-screen flex flex-col transition-colors duration-500"
      style={{ background: "var(--pub-bg)", color: "var(--pub-text)" }}
    >
      <PublicNavbar farmName={farmName} logoUrl={profile?.logoUrl || null} />
      <TentangPageClient
        farmName={farmName}
        description={profile?.description ?? null}
        vision={profile?.vision ?? null}
        address={profile?.address ?? null}
        phone={profile?.phone ?? null}
        email={profile?.email ?? null}
        instagram={profile?.instagram ?? null}
        whatsapp={profile?.whatsapp ?? null}
        bannerUrl={profile?.bannerUrl}
        logoUrl={profile?.logoUrl}
        ownerName={profile?.ownerName ?? null}
        ownerRole={profile?.ownerRole ?? null}
        ownerBio={profile?.ownerBio ?? null}
        ownerImageUrl={profile?.ownerImageUrl ?? null}
        title={profile?.heroAboutTitle}
        subtitle={profile?.heroAboutSubtitle}
      />
      <PublicFooter profile={profile} copyrightOnly={true} />
    </div>
  );
}
