import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import jwt from "jsonwebtoken";
import { randomUUID } from "node:crypto";

import {
  prisma,
  startTestServer,
  createTestUser,
  createToken,
} from "./helpers/booking-test-helpers.js";

import { env } from "../src/config/environment.js";

let server;
let admin;
let regularUser;
let adminToken;
let userToken;

const registeredEmails = [];
const createdUserIds = [];

const request = async (path, { method = "GET", body, token } = {}) => {
  const headers = {};

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
  }

  const response = await fetch(`${server.baseUrl}${path}`, {
    method,
    headers,
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};

before(async () => {
  server = await startTestServer();

  admin = await createTestUser("ADMIN");
  regularUser = await createTestUser("USER");

  createdUserIds.push(admin.id, regularUser.id);

  adminToken = createToken(admin);
  userToken = createToken(regularUser);
});

after(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [{ id: { in: createdUserIds } }, { email: { in: registeredEmails } }],
    },
  });

  if (server) await server.close();

  await prisma.$disconnect();
});

test("registers a new user successfully", async () => {
  const email = `register-${randomUUID()}@triagesync.test`;
  registeredEmails.push(email);

  const response = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "New Test User",
      email,
      password: "StrongPassword@123",
    },
  });

  assert.equal(response.status, 201);
  assert.deepEqual(Object.keys(response.data), ["user"]);
  assert.equal(response.data.user.email, email);
  assert.equal(response.data.user.role, "USER");
  assert.equal(response.data.user.passwordHash, undefined);

  const saved = await prisma.user.findUnique({
    where: { email },
  });

  assert.ok(saved);
  assert.notEqual(saved.passwordHash, "StrongPassword@123");
});

test("public registration cannot create an ADMIN account", async () => {
  const email = `no-admin-${randomUUID()}@triagesync.test`;
  registeredEmails.push(email);

  const response = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Attempted Admin",
      email,
      password: "StrongPassword@123",
      role: "ADMIN",
    },
  });

  assert.equal(response.status, 400);

  const saved = await prisma.user.findUnique({
    where: { email },
  });

  assert.equal(saved, null);
});

test("rejects duplicate registration email", async () => {
  const email = `duplicate-${randomUUID()}@triagesync.test`;
  registeredEmails.push(email);

  const body = {
    name: "Duplicate Test",
    email,
    password: "StrongPassword@123",
  };

  const first = await request("/api/auth/register", {
    method: "POST",
    body,
  });

  assert.equal(first.status, 201);

  const second = await request("/api/auth/register", {
    method: "POST",
    body,
  });

  assert.equal(second.status, 409);
});

test("registration normalizes email to lowercase", async () => {
  const email = `Mixed-${randomUUID()}@Triagesync.Test`;
  const normalizedEmail = email.toLowerCase();

  registeredEmails.push(normalizedEmail);

  const response = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Email Case Test",
      email,
      password: "StrongPassword@123",
    },
  });

  assert.equal(response.status, 201);
  assert.equal(response.data.user.email, normalizedEmail);
});

test("rejects registration with invalid input", async () => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "A",
      email: "not-an-email",
      password: "short",
    },
  });

  assert.equal(response.status, 400);
});

test("rejects registration with unexpected fields", async () => {
  const response = await request("/api/auth/register", {
    method: "POST",
    body: {
      name: "Unexpected Field",
      email: `extra-${randomUUID()}@triagesync.test`,
      password: "StrongPassword@123",
      isAdmin: true,
    },
  });

  assert.equal(response.status, 400);
});

test("logs in with valid credentials", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: regularUser.email,
      password: "TestPassword@123",
    },
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.user.id, regularUser.id);
  assert.equal(response.data.user.role, "USER");
  assert.ok(response.data.token);
  assert.equal(response.data.user.passwordHash, undefined);
});

test("rejects login with an incorrect password", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: regularUser.email,
      password: "WrongPassword@123",
    },
  });

  assert.equal(response.status, 401);
});

test("rejects login for an unknown email", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: `unknown-${randomUUID()}@triagesync.test`,
      password: "StrongPassword@123",
    },
  });

  assert.equal(response.status, 401);
});

test("rejects login with invalid input", async () => {
  const response = await request("/api/auth/login", {
    method: "POST",
    body: {
      email: "invalid-email",
      password: "",
    },
  });

  assert.equal(response.status, 400);
});

test("returns current user with a valid USER token", async () => {
  const response = await request("/api/auth/me", {
    token: userToken,
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.user.id, regularUser.id);
  assert.equal(response.data.user.role, "USER");
  assert.equal(response.data.user.passwordHash, undefined);
});

test("returns current user with a valid ADMIN token", async () => {
  const response = await request("/api/auth/me", {
    token: adminToken,
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.user.id, admin.id);
  assert.equal(response.data.user.role, "ADMIN");
});

test("rejects request to current user without a token", async () => {
  const response = await request("/api/auth/me");

  assert.equal(response.status, 401);
});

test("rejects request to current user with an invalid token", async () => {
  const response = await request("/api/auth/me", {
    token: "invalid.jwt.token",
  });

  assert.equal(response.status, 401);
});

test("rejects request to current user with an expired token", async () => {
  const expiredToken = jwt.sign(
    {
      userId: regularUser.id,
      role: regularUser.role,
    },
    env.JWT_SECRET,
    { expiresIn: -10 },
  );

  const response = await request("/api/auth/me", {
    token: expiredToken,
  });

  assert.equal(response.status, 401);
});
