import { randomUUID } from "node:crypto";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import app from "../../src/app.js";
import { env } from "../../src/config/environment.js";
import { prisma } from "../../src/config/mysql.js";

export { prisma };

export const startTestServer = async () => {
  const server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  const address = server.address();

  return {
    baseUrl: `http://127.0.0.1:${address.port}`,

    close: () =>
      new Promise((resolve, reject) => {
        server.close((error) => {
          if (error) reject(error);
          else resolve();
        });
      }),
  };
};

export const createTestUser = async (role = "USER") => {
  const suffix = randomUUID();

  return prisma.user.create({
    data: {
      name: `Booking Test ${suffix}`,
      email: `booking-${suffix}@triagesync.test`,
      passwordHash: await bcrypt.hash("TestPassword@123", 10),
      role,
    },
  });
};

export const createTestResource = async (isActive = true) => {
  const suffix = randomUUID();

  return prisma.resource.create({
    data: {
      name: `Booking Test Resource ${suffix}`,
      description: "Temporary resource for automated booking tests",
      type: "ROOM",
      capacity: 10,
      location: "Test Location",
      isActive,
    },
  });
};

export const createToken = (user) =>
  jwt.sign(
    {
      userId: user.id,
      role: user.role,
    },
    env.JWT_SECRET,
    { expiresIn: "10m" },
  );

export const apiRequest = async (
  baseUrl,
  token,
  path,
  { method = "GET", body } = {},
) => {
  const headers = {
    Authorization: `Bearer ${token}`,
  };

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  const data = await response.json();

  return {
    status: response.status,
    data,
  };
};

export const makeSlot = (index = 0, durationMinutes = 30) => {
  const halfHour = 30 * 60 * 1000;

  const firstSlot =
    Math.ceil((Date.now() + 3 * 60 * 60 * 1000) / halfHour) * halfHour;

  const start = new Date(firstSlot + index * 60 * 60 * 1000);
  const end = new Date(start.getTime() + durationMinutes * 60 * 1000);

  return {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  };
};

export const cleanupFixtures = async ({
  userIds = [],
  resourceIds = [],
} = {}) => {
  if (userIds.length === 0 && resourceIds.length === 0) return;

  const conditions = [];

  if (userIds.length) {
    conditions.push({ userId: { in: userIds } });
  }

  if (resourceIds.length) {
    conditions.push({ resourceId: { in: resourceIds } });
  }

  if (conditions.length) {
    await prisma.booking.deleteMany({
      where: { OR: conditions },
    });
  }

  if (resourceIds.length) {
    await prisma.resource.deleteMany({
      where: { id: { in: resourceIds } },
    });
  }

  if (userIds.length) {
    await prisma.user.deleteMany({
      where: { id: { in: userIds } },
    });
  }
};
