import bcrypt from "bcrypt";
import { prisma } from "../config/mysql.js";

const SALT_ROUNDS = 12;

export const seedUsers = async () => {
  const adminPassword = await bcrypt.hash("Admin@123", SALT_ROUNDS);
  const userPassword = await bcrypt.hash("User@123", SALT_ROUNDS);

  await prisma.user.upsert({
    where: {
      email: "admin@triagesync.test",
    },
    update: {
      role: "ADMIN",
    },
    create: {
      name: "TriageSync Admin",
      email: "admin@triagesync.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: {
      email: "user@triagesync.test",
    },
    update: {
      role: "USER",
    },
    create: {
      name: "TriageSync User",
      email: "user@triagesync.test",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("Assessment users seeded successfully");
};
