import bcrypt from "bcrypt";
import { prisma } from "../config/mysql.js";

const SALT_ROUNDS = 12;

export const seedUsers = async () => {
  const adminPassword = await bcrypt.hash("Admin@123", SALT_ROUNDS);
  const userPassword = await bcrypt.hash("User@123", SALT_ROUNDS);

  await prisma.user.upsert({
    where: { email: "admin@triagesync.test" },
    update: { role: "ADMIN" },
    create: {
      name: "TriageSync Admin",
      email: "admin@triagesync.test",
      password: adminPassword,
      role: "ADMIN",
    },
  });

  await prisma.user.upsert({
    where: { email: "user@triagesync.test" },
    update: { role: "USER" },
    create: {
      name: "TriageSync User",
      email: "user@triagesync.test",
      password: userPassword,
      role: "USER",
    },
  });

  console.log("Assessment users seeded successfully");
};

const resources = [
  {
    name: "Innovation Room",
    description: "Collaborative project and meeting room",
    type: "ROOM",
    capacity: 12,
    location: "Building A, Floor 2",
    isActive: true,
  },
  {
    name: "Conference Room",
    description: "Room for team meetings and presentations",
    type: "ROOM",
    capacity: 20,
    location: "Building A, Floor 1",
    isActive: true,
  },
  {
    name: "Computer Lab",
    description: "Computer laboratory for development work",
    type: "LAB",
    capacity: 30,
    location: "Building B, Floor 1",
    isActive: true,
  },
  {
    name: "Electronics Lab",
    description: "Laboratory for electronics experiments",
    type: "LAB",
    capacity: 15,
    location: "Building B, Floor 2",
    isActive: true,
  },
  {
    name: "Portable Projector",
    description: "Portable projector for presentations",
    type: "EQUIPMENT",
    capacity: 1,
    location: "Equipment Store",
    isActive: true,
  },
  {
    name: "Hardware Testing Device",
    description: "Device for hardware testing",
    type: "EQUIPMENT",
    capacity: 2,
    location: "Equipment Store",
    isActive: false,
  },
];

export const seedResources = async () => {
  for (const resource of resources) {
    const existing = await prisma.resource.findFirst({
      where: { name: resource.name },
      select: { id: true },
    });

    if (existing) {
      await prisma.resource.update({
        where: { id: existing.id },
        data: resource,
      });
    } else {
      await prisma.resource.create({
        data: resource,
      });
    }
  }

  console.log("Assessment resources seeded successfully");
};
