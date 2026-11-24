import test, { before, after } from "node:test";
import assert from "node:assert/strict";

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

let server;
let owner;
let otherUser;
let admin;
let limitUser;
let activeResource;
let inactiveResource;

let ownerToken;
let otherToken;
let adminToken;
let limitToken;

const createdUsers = [];
const createdResources = [];

const bookingBody = (resourceId, slot) => ({
  resourceId,
  ...slot,
  purpose: "Automated booking integration test",
});

const createFreshTestUser = async () => {
  const user = await createTestUser("USER");
  createdUsers.push(user);

  return {
    user,
    token: createToken(user),
  };
};

const postBooking = (token, resourceId, slot) =>
  apiRequest(server.baseUrl, token, "/api/bookings", {
    method: "POST",
    body: bookingBody(resourceId, slot),
  });

before(async () => {
  server = await startTestServer();

  owner = await createTestUser("USER");
  otherUser = await createTestUser("USER");
  admin = await createTestUser("ADMIN");
  limitUser = await createTestUser("USER");

  createdUsers.push(owner, otherUser, admin, limitUser);

  activeResource = await createTestResource(true);
  inactiveResource = await createTestResource(false);

  createdResources.push(activeResource, inactiveResource);

  ownerToken = createToken(owner);
  otherToken = createToken(otherUser);
  adminToken = createToken(admin);
  limitToken = createToken(limitUser);
});

after(async () => {
  await cleanupFixtures({
    userIds: createdUsers.map((user) => user.id),
    resourceIds: createdResources.map((resource) => resource.id),
  });

  if (server) await server.close();

  await prisma.$disconnect();
});

test("creates a valid booking with PENDING status", async () => {
  const slot = makeSlot(0);

  const response = await postBooking(ownerToken, activeResource.id, slot);

  assert.equal(response.status, 201);
  assert.equal(response.data.status, "PENDING");

  const saved = await prisma.booking.findUnique({
    where: { id: response.data.id },
  });

  assert.ok(saved);
  assert.equal(saved.userId, owner.id);
  assert.equal(saved.resourceId, activeResource.id);
});

test("rejects an overlapping booking", async () => {
  const slot = makeSlot(2);

  const first = await postBooking(ownerToken, activeResource.id, slot);

  assert.equal(first.status, 201);

  const second = await postBooking(otherToken, activeResource.id, slot);

  assert.equal(second.status, 409);
});

test("allows back-to-back bookings", async () => {
  const firstSlot = makeSlot(4);

  const first = await postBooking(ownerToken, activeResource.id, firstSlot);

  assert.equal(first.status, 201);

  const nextStart = new Date(firstSlot.endTime);
  const nextEnd = new Date(nextStart.getTime() + 30 * 60 * 1000);

  const second = await postBooking(otherToken, activeResource.id, {
    startTime: nextStart.toISOString(),
    endTime: nextEnd.toISOString(),
  });

  assert.equal(second.status, 201);
});

test("rejects booking times that are not on 30-minute boundaries", async () => {
  const slot = makeSlot(6);

  const invalidStart = new Date(slot.startTime);
  invalidStart.setUTCMinutes(invalidStart.getUTCMinutes() + 15);

  const invalidEnd = new Date(slot.endTime);
  invalidEnd.setUTCMinutes(invalidEnd.getUTCMinutes() + 15);

  const response = await postBooking(ownerToken, activeResource.id, {
    startTime: invalidStart.toISOString(),
    endTime: invalidEnd.toISOString(),
  });

  assert.equal(response.status, 400);
});

test("rejects booking durations below 30 minutes", async () => {
  const slot = makeSlot(7, 15);

  const response = await postBooking(ownerToken, activeResource.id, slot);

  assert.equal(response.status, 400);
});

test("rejects booking durations above 240 minutes", async () => {
  const slot = makeSlot(8, 270);

  const response = await postBooking(ownerToken, activeResource.id, slot);

  assert.equal(response.status, 400);
});

test("rejects bookings in the past", async () => {
  const halfHour = 30 * 60 * 1000;

  const start = new Date(
    Math.floor(Date.now() / halfHour) * halfHour - halfHour,
  );

  const end = new Date(start.getTime() + halfHour);

  const response = await postBooking(ownerToken, activeResource.id, {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });

  assert.equal(response.status, 400);
});

test("rejects bookings more than 30 days in advance", async () => {
  const halfHour = 30 * 60 * 1000;

  const start = new Date(
    Math.ceil((Date.now() + 31 * 24 * 60 * 60 * 1000) / halfHour) * halfHour,
  );

  const end = new Date(start.getTime() + halfHour);

  const response = await postBooking(ownerToken, activeResource.id, {
    startTime: start.toISOString(),
    endTime: end.toISOString(),
  });

  assert.equal(response.status, 400);
});

test("rejects bookings for inactive resources", async () => {
  const response = await postBooking(
    ownerToken,
    inactiveResource.id,
    makeSlot(10),
  );

  assert.equal(response.status, 404);
});

test("enforces the maximum of three future bookings per user", async () => {
  for (let index = 20; index < 23; index++) {
    const response = await postBooking(
      limitToken,
      activeResource.id,
      makeSlot(index),
    );

    assert.equal(response.status, 201);
  }

  const fourth = await postBooking(limitToken, activeResource.id, makeSlot(23));

  assert.equal(fourth.status, 409);
});

test("users cannot view or cancel another user's booking", async () => {
  const { token: bookingOwnerToken } = await createFreshTestUser();

  const created = await postBooking(
    bookingOwnerToken,
    activeResource.id,
    makeSlot(30),
  );

  assert.equal(created.status, 201);

  const bookingId = created.data.id;

  const getResponse = await apiRequest(
    server.baseUrl,
    ownerToken,
    `/api/bookings/${bookingId}`,
  );

  assert.equal(getResponse.status, 403);

  const cancelResponse = await apiRequest(
    server.baseUrl,
    ownerToken,
    `/api/bookings/${bookingId}/cancel`,
    { method: "PATCH" },
  );

  assert.equal(cancelResponse.status, 403);
});

test("users can view their own bookings", async () => {
  const response = await apiRequest(
    server.baseUrl,
    ownerToken,
    "/api/bookings/mine",
  );

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.data.data));
});

test("admin can approve a future pending booking", async () => {
  const { token } = await createFreshTestUser();

  const created = await postBooking(token, activeResource.id, makeSlot(32));

  assert.equal(created.status, 201);

  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/bookings/${created.data.id}/approve`,
    { method: "PATCH" },
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.status, "APPROVED");
});

test("owner can cancel an approved future booking", async () => {
  const { token } = await createFreshTestUser();

  const created = await postBooking(token, activeResource.id, makeSlot(34));

  assert.equal(created.status, 201);

  const bookingId = created.data.id;

  const approved = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/bookings/${bookingId}/approve`,
    { method: "PATCH" },
  );

  assert.equal(approved.status, 200);

  const cancelled = await apiRequest(
    server.baseUrl,
    token,
    `/api/bookings/${bookingId}/cancel`,
    { method: "PATCH" },
  );

  assert.equal(cancelled.status, 200);
  assert.equal(cancelled.data.status, "CANCELLED");
});

test("admin rejection requires a note", async () => {
  const { token } = await createFreshTestUser();

  const created = await postBooking(token, activeResource.id, makeSlot(36));

  assert.equal(created.status, 201);

  const bookingId = created.data.id;

  const invalid = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/bookings/${bookingId}/reject`,
    {
      method: "PATCH",
      body: {},
    },
  );

  assert.equal(invalid.status, 400);

  const rejected = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/bookings/${bookingId}/reject`,
    {
      method: "PATCH",
      body: {
        note: "Resource unavailable for this request",
      },
    },
  );

  assert.equal(rejected.status, 200);
  assert.equal(rejected.data.status, "REJECTED");
  assert.equal(
    rejected.data.decisionNote,
    "Resource unavailable for this request",
  );
});

test("regular users cannot access the admin booking list", async () => {
  const response = await apiRequest(
    server.baseUrl,
    ownerToken,
    "/api/bookings",
  );

  assert.equal(response.status, 403);
});

test("admin can access the booking list", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    "/api/bookings",
  );

  assert.equal(response.status, 200);
});

test("concurrent admin approval and rejection allow only one transition", async () => {
  const { token: userToken } = await createFreshTestUser();

  const created = await postBooking(
    userToken,
    activeResource.id,
    makeSlot(40),
  );

  assert.equal(created.status, 201);

  const bookingId = created.data.id;

  const [approved, rejected] = await Promise.all([
    apiRequest(
      server.baseUrl,
      adminToken,
      `/api/bookings/${bookingId}/approve`,
      { method: "PATCH" },
    ),
    apiRequest(
      server.baseUrl,
      adminToken,
      `/api/bookings/${bookingId}/reject`,
      {
        method: "PATCH",
        body: {
          note: "Resource unavailable for this request",
        },
      },
    ),
  ]);

  const statuses = [approved.status, rejected.status].sort();

  assert.deepEqual(statuses, [200, 409]);

  const saved = await prisma.booking.findUnique({
    where: { id: bookingId },
  });

  assert.ok(["APPROVED", "REJECTED"].includes(saved.status));
});
