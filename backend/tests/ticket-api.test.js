import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import app from "../src/app.js";
import { env } from "../src/config/environment.js";
import { createToken, createTestUser } from "./helpers/booking-test-helpers.js";
import Ticket from "../src/models/mongodb/Ticket.model.js";
import TicketEvent from "../src/models/mongodb/TicketEvent.model.js";

let server;
let baseUrl;
let admin;
let user;
let adminToken;
let userToken;

const prefix = `API-TEST-${Date.now()}`;
const externalIds = [];

const sampleTicket = (suffix, overrides = {}) => ({
  externalId: `${prefix}-${suffix}`,
  subject: "Refund requested for my payment",
  body: "I was charged twice and need a refund.",
  ...overrides,
});

const request = async (path, { token = adminToken, method = "GET", body } = {}) => {
  const response = await fetch(`${baseUrl}${path}`, {
    method,
    headers: {
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
    },
    ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
  });

  return {
    status: response.status,
    data: await response.json(),
  };
};

const importOne = async (ticket) => {
  externalIds.push(ticket.externalId);

  return request("/api/tickets/import", {
    method: "POST",
    body: { tickets: [ticket] },
  });
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
  await TicketEvent.deleteMany({
    ticketId: {
      $in: await Ticket.find({
        externalId: { $in: externalIds },
      }).distinct("_id"),
    },
  });

  await Ticket.deleteMany({
    externalId: { $in: externalIds },
  });

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

test("ticket endpoints require authentication", async () => {
  const response = await request("/api/tickets", { token: null });

  assert.equal(response.status, 401);
});

test("regular users can access ticket endpoints", async () => {
  const response = await request("/api/tickets", { token: userToken });

  assert.equal(response.status, 200);
});

test("admin can import a ticket and classifier assigns category and priority", async () => {
  const response = await importOne(
    sampleTicket("IMPORT-1", {
      subject: "Refund my payment",
      body: "I was charged twice.",
    }),
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.data.importedCount, 1);
  assert.equal(response.data.data.failedCount, 0);

  const saved = await Ticket.findOne({
    externalId: `${prefix}-IMPORT-1`,
  });

  assert.ok(saved);
  assert.equal(saved.autoCategory, "BILLING");
  assert.equal(saved.category, "BILLING");
  assert.equal(saved.priority, "HIGH");
});

test("re-import updates ticket without creating a duplicate", async () => {
  const ticket = sampleTicket("IDEMPOTENT-1");

  const first = await importOne(ticket);

  assert.equal(first.data.data.importedCount, 1);

  const second = await importOne({
    ...ticket,
    subject: "Updated refund request",
    body: "Please check my duplicate payment.",
  });

  assert.equal(second.data.data.updatedCount, 1);

  const count = await Ticket.countDocuments({
    externalId: ticket.externalId,
  });

  assert.equal(count, 1);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  assert.equal(saved.subject, "Updated refund request");
});

test("manual category override survives a later re-import", async () => {
  const ticket = sampleTicket("OVERRIDE-1", {
    subject: "Application crashes",
    body: "The application crashes whenever I open it.",
  });

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const update = await request(`/api/tickets/${saved._id}`, {
    method: "PATCH",
    body: { category: "BILLING" },
  });

  assert.equal(update.status, 200);
  assert.equal(update.data.data.category, "BILLING");
  assert.equal(update.data.data.isHumanOverride, true);

  await importOne({
    ...ticket,
    subject: "Application crashes after update",
  });

  const reloaded = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  assert.equal(reloaded.category, "BILLING");
  assert.equal(reloaded.autoCategory, "BUG");
  assert.equal(reloaded.isHumanOverride, true);
  assert.equal(reloaded.subject, "Application crashes after update");
});

test("ticket list supports combined category, priority and status filters", async () => {
  const ticket = sampleTicket("FILTER-1", {
    subject: "Password login problem",
    body: "I cannot sign in.",
  });

  await importOne(ticket);

  const response = await request(
    "/api/tickets?category=LOGIN&priority=MEDIUM&status=OPEN",
  );

  assert.equal(response.status, 200);

  assert.ok(
    response.data.data.some(
      (item) => item.externalId === ticket.externalId,
    ),
  );

  assert.ok(
    response.data.data.every(
      (item) =>
        item.category === "LOGIN" &&
        item.priority === "MEDIUM" &&
        item.status === "OPEN",
    ),
  );
});

test("ticket search safely handles regular expression characters", async () => {
  const ticket = sampleTicket("SEARCH-1", {
    subject: "Payment issue [urgent] (customer)",
    body: "Please investigate.",
  });

  await importOne(ticket);

  const response = await request(
    `/api/tickets?q=${encodeURIComponent("[urgent]")}`,
  );

  assert.equal(response.status, 200);

  assert.ok(
    response.data.data.some(
      (item) => item.externalId === ticket.externalId,
    ),
  );
});

test("ticket list supports pagination", async () => {
  const response = await request("/api/tickets?page=1&pageSize=2");

  assert.equal(response.status, 200);
  assert.equal(response.data.page, 1);
  assert.equal(response.data.pageSize, 2);
  assert.ok(response.data.data.length <= 2);
  assert.ok(response.data.total >= response.data.data.length);
});

test("ticket list rejects invalid filters", async () => {
  const response = await request("/api/tickets?category=INVALID");

  assert.equal(response.status, 400);
});

test("ticket detail includes audit events", async () => {
  const ticket = sampleTicket("DETAIL-1");

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const response = await request(`/api/tickets/${saved._id}`);

  assert.equal(response.status, 200);
  assert.equal(response.data.data.ticket.externalId, ticket.externalId);
  assert.ok(Array.isArray(response.data.data.events));
});

test("category update marks ticket as overridden and reviewed", async () => {
  const ticket = sampleTicket("REVIEW-CATEGORY-1");

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const response = await request(`/api/tickets/${saved._id}`, {
    method: "PATCH",
    body: { category: "FEATURE_REQUEST" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.data.isHumanOverride, true);
  assert.equal(response.data.data.isReviewed, true);
});

test("status transition from OPEN marks ticket as reviewed", async () => {
  const ticket = sampleTicket("REVIEW-STATUS-1");

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const response = await request(`/api/tickets/${saved._id}`, {
    method: "PATCH",
    body: { status: "IN_PROGRESS" },
  });

  assert.equal(response.status, 200);
  assert.equal(response.data.data.status, "IN_PROGRESS");
  assert.equal(response.data.data.isReviewed, true);
});

test("ticket updates create audit events for changed fields", async () => {
  const ticket = sampleTicket("AUDIT-1");

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const response = await request(`/api/tickets/${saved._id}`, {
    method: "PATCH",
    body: {
      priority: "URGENT",
      status: "IN_PROGRESS",
      assigneeId: admin.id,
    },
  });

  assert.equal(response.status, 200);

  const events = await TicketEvent.find({
    ticketId: saved._id,
  }).lean();

  const fields = events.map((event) => event.field);

  assert.ok(fields.includes("priority"));
  assert.ok(fields.includes("status"));
  assert.ok(fields.includes("assigneeId"));
  assert.ok(events.every((event) => event.actor === admin.email));
});

test("ticket update rejects an empty body", async () => {
  const ticket = sampleTicket("EMPTY-UPDATE-1");

  await importOne(ticket);

  const saved = await Ticket.findOne({
    externalId: ticket.externalId,
  });

  const response = await request(`/api/tickets/${saved._id}`, {
    method: "PATCH",
    body: {},
  });

  assert.equal(response.status, 400);
});

test("ticket detail returns 404 for an unknown ID", async () => {
  const response = await request(
    "/api/tickets/507f1f77bcf86cd799439011",
  );

  assert.equal(response.status, 404);
});

test("ticket detail returns 404 for an invalid ID", async () => {
  const response = await request("/api/tickets/not-a-valid-id");

  assert.equal(response.status, 404);
});

test("dashboard statistics return ticket counts and agreement rate", async () => {
  const response = await request("/api/stats");

  assert.equal(response.status, 200);
  assert.ok(response.data.data.total >= 0);
  assert.ok(response.data.data.reviewed >= 0);
  assert.ok(response.data.data.modelAgreementRate >= 0);
  assert.ok(response.data.data.modelAgreementRate <= 100);
});

test("regular users can access dashboard statistics", async () => {
  const response = await request("/api/stats", { token: userToken });

  assert.equal(response.status, 200);
});
