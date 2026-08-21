"use client";

import type { Testimonial } from "@prisma/client";
import type { SerializedProduct } from "@/components/product/ProductCard";
import { IntroSection } from "@/components/home/sections/IntroSection";
import { PromoSection } from "@/components/home/sections/PromoSection";
import { FeaturedProductsSection } from "@/components/home/sections/FeaturedProductsSection";
import { CTASection } from "@/components/home/sections/CTASection";
import { TestimonialSection } from "@/components/home/TestimonialSection";
import { PublicFooter } from "@/components/layout/PublicFooter";

type Props = {
  promos: { id: string; title: string; description: string | null; badgeText: string | null; imageUrl: string | null }[];
  featuredProducts: SerializedProduct[];
  testimonials: Testimonial[];
  farmFeatures: any[];
  profile: {
    farmName: string;
    description: string | null;
    address: string | null;
    phone: string | null;
    instagram: string | null;
    whatsapp: string | null;
    logoUrl: string | null;
    whyChooseUsTitle: string | null;
    whyChooseUsSubtitle: string | null;
  } | null;
  whatsapp: string;
};

export function LandingSections({ promos, featuredProducts, testimonials, farmFeatures, profile, whatsapp }: Props) {
  return (
    <>
      <IntroSection 
        farmFeatures={farmFeatures} 
        title={profile?.whyChooseUsTitle} 
        subtitle={profile?.whyChooseUsSubtitle} 
      />

      <PromoSection promos={promos} />

      <FeaturedProductsSection featuredProducts={featuredProducts} farmName={profile?.farmName} whatsapp={whatsapp} />

      <TestimonialSection testimonials={testimonials} />

      <CTASection whatsapp={whatsapp} />

      <PublicFooter profile={profile} />
    </>
  );
}