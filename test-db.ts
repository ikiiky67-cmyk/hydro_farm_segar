import { prisma } from "./src/lib/prisma";
async function main() {
  const users = await prisma.admin.findMany();
  console.log("Admins:", users);
}
main().catch(console.error).finally(() => prisma.$disconnect());
