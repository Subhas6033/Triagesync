import { prisma } from "../config/mysql.js";
import { seedUsers } from "./mysql.seed.js";

const runSeed = async () => {
  try {
    await prisma.$connect();

    await seedUsers();

    console.log("Database seeding completed");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

runSeed();
