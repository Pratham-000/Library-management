import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../src/generated/prisma";

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  throw new Error("DATABASE_URL is not configured");
}

const adapter = new PrismaPg({
  connectionString,
});

const prisma = new PrismaClient({
  adapter,
});

async function main() {
  const hashedStudentPassword = await bcrypt.hash("test123", 10);

  const student = await prisma.user.upsert({
    where: {
      email: "pratham@test.com",
    },
    update: {
      name: "Pratham",
      password: hashedStudentPassword,
      role: "STUDENT",
    },
    create: {
      name: "Pratham",
      email: "pratham@test.com",
      password: hashedStudentPassword,
      role: "STUDENT",
    },
  });

  console.log("Seeded student:", student.email);

  const hashedAdminPassword = await bcrypt.hash("admin123", 10);

  const admin = await prisma.user.upsert({
    where: {
      email: "admin@test.com",
    },
    update: {
      name: "Admin",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
    create: {
      name: "Admin",
      email: "admin@test.com",
      password: hashedAdminPassword,
      role: "ADMIN",
    },
  });

  console.log("Seeded admin:", admin.email);
}

main()
  .catch((error) => {
    console.error("Seed failed:", error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });