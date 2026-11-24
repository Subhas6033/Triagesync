import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";

import {
  prisma,
  startTestServer,
  createTestUser,
  createTestResource,
  createToken,
  apiRequest,
  makeSlot,
  cleanupFixtures,
} from "./helpers/booking-test-helpers.js";

import { env } from "../src/config/environment.js";
import Ticket from "../src/models/mongodb/Ticket.model.js";
import TicketEvent from "../src/models/mongodb/TicketEvent.model.js";

let server;
let admin;
let assignee;
let owner;
let resource;
let ticket;

let adminToken;
let ownerToken;

const createdUsers = [];
const ticketExternalId = `REFERENCE-TEST-${Date.now()}`;

const request = (token, path, options = {}) =>
  apiRequest(server.baseUrl, token, path, options);

const bookingBody = (slot, ticketId) => ({
  resourceId: resource.id,
  ...slot,
  purpose: "Reference validation integration test",
  ...(ticketId ? { ticketId } : {}),
});

before(async () => {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(env.MONGODB_URI);
  }

  server = await startTestServer();

  admin = await createTestUser("ADMIN");
  assignee = await createTestUser("USER");
  owner = await createTestUser("USER");

  createdUsers.push(admin, assignee, owner);

  resource = await createTestResource(true);

  adminToken = createToken(admin);
  ownerToken = createToken(owner);

  ticket = await Ticket.create({
    externalId: ticketExternalId,
    subject: "Reference validation test ticket",
    body: "Testing valid and invalid cross-database references.",
    autoCategory: "BILLING",
    category: "BILLING",
  });
});

after(async () => {
  if (ticket) {
    await TicketEvent.deleteMany({ ticketId: ticket._id });
    await Ticket.deleteOne({ _id: ticket._id });
  }

  await cleanupFixtures({
    userIds: createdUsers.map((user) => user.id),
    resourceIds: resource ? [resource.id] : [],
  });

  if (server) {
    await server.close();
  }

  await prisma.$disconnect();
  await mongoose.disconnect();
});

test("ticket can be assigned to an existing MySQL user", async () => {
  const response = await request(
    adminToken,
    `/api/tickets/${ticket._id}`,
    {
      method: "PATCH",
      body: { assigneeId: assignee.id },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.ticket.assigneeId, assignee.id);
});

test("ticket rejects a nonexistent assignee", async () => {
  const response = await request(
    adminToken,
    `/api/tickets/${ticket._id}`,
    {
      method: "PATCH",
      body: { assigneeId: "nonexistent-user-reference" },
    },
  );

  assert.equal(response.status, 404);
  assert.equal(response.data.error.code, "NOT_FOUND");
});

test("ticket can be unassigned using a null assigneeId", async () => {
  const response = await request(
    adminToken,
    `/api/tickets/${ticket._id}`,
    {
      method: "PATCH",
      body: { assigneeId: null },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.ticket.assigneeId, null);
});

test("booking accepts an existing MongoDB ticket reference", async () => {
  const response = await request(ownerToken, "/api/bookings", {
    method: "POST",
    body: bookingBody(makeSlot(0), ticket._id.toString()),
  });

  assert.equal(response.status, 201);
  assert.equal(response.data.ticketId, ticket._id.toString());
});

test("booking rejects a nonexistent MongoDB ticket reference", async () => {
  const missingTicketId = new mongoose.Types.ObjectId().toString();

  const response = await request(ownerToken, "/api/bookings", {
    method: "POST",
    body: bookingBody(makeSlot(1), missingTicketId),
  });

  assert.equal(response.status, 404);
  assert.equal(response.data.error.code, "NOT_FOUND");
});

test("booking still works when optional ticketId is omitted", async () => {
  const response = await request(ownerToken, "/api/bookings", {
    method: "POST",
    body: bookingBody(makeSlot(2)),
  });

  assert.equal(response.status, 201);
  assert.equal(response.data.ticketId, null);
});
