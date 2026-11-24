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

test("admin receives analytics in the required API contract", async () => {
  const response = await request("/api/admin/stats");

  assert.equal(response.status, 200);

  const stats = response.data;

  assert.deepEqual(
    Object.keys(stats).sort(),
    [
      "activeResources",
      "bookingsByStatus",
      "ticketStats",
      "topResources",
    ].sort(),
  );

  assert.equal(typeof stats.activeResources, "number");
  assert.ok(stats.activeResources >= 0);

  assert.deepEqual(
    Object.keys(stats.bookingsByStatus).sort(),
    ["APPROVED", "CANCELLED", "PENDING", "REJECTED"].sort(),
  );

  for (const count of Object.values(stats.bookingsByStatus)) {
    assert.equal(typeof count, "number");
    assert.ok(count >= 0);
  }

  assert.ok(Array.isArray(stats.topResources));
  assert.ok(stats.topResources.length <= 3);

  for (const resource of stats.topResources) {
    assert.equal(typeof resource.id, "string");
    assert.equal(typeof resource.name, "string");
    assert.ok(["ROOM", "LAB", "EQUIPMENT"].includes(resource.type));
    assert.equal(typeof resource.bookingCount, "number");
    assert.ok(resource.bookingCount > 0);
  }

  assert.ok(stats.ticketStats);
  assert.ok(Array.isArray(stats.ticketStats.byCategory));
  assert.ok(Array.isArray(stats.ticketStats.byPriority));
  assert.ok(Array.isArray(stats.ticketStats.byStatus));

  assert.equal(typeof stats.ticketStats.reviewedCount, "number");
  assert.ok(stats.ticketStats.reviewedCount >= 0);

  assert.equal(typeof stats.ticketStats.modelAgreementRate, "number");
  assert.ok(stats.ticketStats.modelAgreementRate >= 0);
  assert.ok(stats.ticketStats.modelAgreementRate <= 100);

  for (const item of stats.ticketStats.byCategory) {
    assert.equal(typeof item.category, "string");
    assert.equal(typeof item.count, "number");
  }

  for (const item of stats.ticketStats.byPriority) {
    assert.equal(typeof item.priority, "string");
    assert.equal(typeof item.count, "number");
  }

  for (const item of stats.ticketStats.byStatus) {
    assert.equal(typeof item.status, "string");
    assert.equal(typeof item.count, "number");
  }
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
  assert.ok(response.data.byCategory);
  assert.ok(response.data.modelAgreementRate >= 0);
});
