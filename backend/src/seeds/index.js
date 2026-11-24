import mongoose from "mongoose";
import { prisma } from "../config/mysql.js";
import { connectMongoDB } from "../config/mongodb.js";
import { seedUsers, seedResources } from "./mysql.seed.js";
import { seedTickets } from "./mongodb.seed.js";

const runSeed = async () => {
  try {
    await prisma.$connect();
    await connectMongoDB();

    await seedUsers();
    await seedResources();
    await seedTickets();

    console.log("Database seeding completed successfully");
  } catch (error) {
    console.error("Database seeding failed:", error);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
    await prisma.$disconnect();
  }
};

runSeed();
