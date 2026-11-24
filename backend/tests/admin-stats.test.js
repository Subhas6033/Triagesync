import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import app from "../src/app.js";
import { env } from "../src/config/environment.js";
import { createToken, createTestUser } from "./helpers/booking-test-helpers.js";

let server;
let baseUrl;
let admin;
let user;
let adminToken;
let userToken;

const request = async (path, { token = adminToken } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    headers: token
      ? { Authorization: `Bearer ${token}` }
      : {},
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};

before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGODB_URI);
  }

  server = app.listen(0);

  await new Promise((resolve, reject) => {
    server.once("listening", resolve);
    server.once("error", reject);
  });

  baseUrl = `http://127.0.0.1:${server.address().port}`;

  admin = await createTestUser("ADMIN");
  user = await createTestUser("USER");

  adminToken = createToken(admin);
  userToken = createToken(user);
});

after(async () => {
  if (server) {
    await new Promise((resolve, reject) => {
      server.close((error) => {
        if (error) reject(error);
        else resolve();
      });
    });
  }

  if (admin || user) {
    const { prisma } = await import("../src/config/mysql.js");

    await prisma.user.deleteMany({
      where: {
        id: {
          in: [admin?.id, user?.id].filter(Boolean),
        },
      },
    });
  }

  await mongoose.disconnect();
});

test("admin can access dashboard statistics", async () => {
  const response = await request("/api/admin/stats");

  assert.equal(response.status, 200);
  assert.equal(response.data.success, true);
  assert.equal(
    response.data.message,
    "Admin dashboard statistics fetched successfully",
  );

  const stats = response.data.data;

  assert.ok(stats.generatedAt);
  assert.ok(Number.isNaN(Date.parse(stats.generatedAt)) === false);

  assert.equal(typeof stats.overview.totalUsers, "number");
  assert.equal(typeof stats.overview.totalResources, "number");
  assert.equal(typeof stats.overview.totalBookings, "number");
  assert.equal(typeof stats.overview.totalTickets, "number");
  assert.equal(typeof stats.overview.modelAgreementRate, "number");

  assert.ok(Array.isArray(stats.tickets.byCategory));
  assert.ok(Array.isArray(stats.tickets.byPriority));
  assert.ok(Array.isArray(stats.tickets.byStatus));
  assert.ok(Array.isArray(stats.resources.byType));
  assert.ok(Array.isArray(stats.bookings.byStatus));
});

test("regular users cannot access admin dashboard statistics", async () => {
  const response = await request("/api/admin/stats", {
    token: userToken,
  });

  assert.equal(response.status, 403);
  assert.equal(response.data.error.code, "FORBIDDEN");
});

test("admin dashboard statistics require authentication", async () => {
  const response = await request("/api/admin/stats", {
    token: null,
  });

  assert.equal(response.status, 401);
});

test("existing ticket dashboard statistics remain accessible to regular users", async () => {
  const response = await request("/api/stats", {
    token: userToken,
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.success, true);
  assert.ok(response.data.data);
});
