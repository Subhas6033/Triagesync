import { prisma } from "../config/mysql.js";
import { seedUsers, seedResources } from "./mysql.seed.js";

const runSeed = async () => {
  try {
    await prisma.$connect();

    await seedUsers();
    await seedResources();

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
};

runSeed();
