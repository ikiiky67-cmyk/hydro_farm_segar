// prisma/seed.ts
import "dotenv/config";
import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";
import bcrypt from "bcryptjs";

const connectionString = `${process.env.DATABASE_URL}`;
const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });


async function main() {
  console.log("🌱 Seeding database...");

  // Admin default
  const hashedPassword = await bcrypt.hash("admin123", 12);
  const admin = await prisma.admin.upsert({
    where: { email: "admin@hidroponik.com" },
    update: {},
    create: {
      name: "Admin Hidroponik",
      email: "admin@hidroponik.com",
      password: hashedPassword,
    },
  });
  console.log("✅ Admin created:", admin.email);

  // Profil bisnis
  await prisma.businessProfile.upsert({
    where: { id: "default-profile" },
    update: {},
    create: {
      id: "default-profile",
      farmName: "HydroFarm Segar",
      tagline: "Sayuran Hidroponik Segar, Sehat, Langsung dari Kebun",
      description:
        "Kami adalah petani hidroponik yang berkomitmen menghadirkan sayuran berkualitas tinggi tanpa pestisida. Dipanen setiap hari untuk kesegaran optimal.",
      phone: "0812-3456-7890",
      email: "info@hydrofarm.id",
      address: "Jl. Pertanian No. 12, Bandung, Jawa Barat",
      instagram: "@hydrofarm_segar",
      whatsapp: "6281234567890",
    },
  });
  console.log("✅ Business profile seeded");

  // Sample produk
  const products = [
    {
      name: "Selada Keriting",
      slug: "selada-keriting",
      description: "Selada keriting hidroponik segar, renyah, dan kaya nutrisi. Sempurna untuk salad dan sandwich.",
      pricePerKg: 25000,
      unit: "kg",
      category: "Sayuran Daun",
      isFeatured: true,
    },
    {
      name: "Bayam Merah",
      slug: "bayam-merah",
      description: "Bayam merah hidroponik kaya antioksidan dan zat besi tinggi.",
      pricePerKg: 20000,
      unit: "ikat",
      category: "Sayuran Daun",
      isFeatured: true,
    },
    {
      name: "Kangkung Air",
      slug: "kangkung-air",
      description: "Kangkung air segar ditanam secara hidroponik, bebas pestisida.",
      pricePerKg: 15000,
      unit: "ikat",
      category: "Sayuran Daun",
      isFeatured: false,
    },
    {
      name: "Pakchoy Hijau",
      slug: "pakchoy-hijau",
      description: "Pakchoy hijau muda dengan tekstur lembut dan rasa segar.",
      pricePerKg: 22000,
      unit: "kg",
      category: "Sayuran Daun",
      isFeatured: true,
    },
    {
      name: "Basil / Kemangi Italia",
      slug: "basil-italia",
      description: "Basil Italia aromatik untuk masakan mediterania dan pizza.",
      pricePerKg: 45000,
      unit: "gram",
      category: "Herbal",
      isFeatured: false,
    },
  ];

  for (const p of products) {
    await prisma.product.upsert({
      where: { slug: p.slug },
      update: {},
      create: p,
    });
  }
  console.log("✅ Products seeded:", products.length);

  // Sample promo
  await prisma.promoContent.createMany({
    skipDuplicates: true,
    data: [
      {
        title: "Promo Ramadan: Diskon 20%",
        description: "Dapatkan diskon 20% untuk semua produk sayuran daun selama bulan Ramadan.",
        badgeText: "DISKON 20%",
        status: "AKTIF",
        sortOrder: 1,
      },
      {
        title: "Langganan Mingguan",
        description: "Pesan paket mingguan dan hemat hingga 15% dari harga normal.",
        badgeText: "HEMAT 15%",
        status: "AKTIF",
        sortOrder: 2,
      },
    ],
  });
  console.log("✅ Promo contents seeded");

  console.log("🎉 Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
