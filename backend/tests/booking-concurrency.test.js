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
let resource;
let users = [];

const resourceIds = [];
const userIds = [];

before(async () => {
  server = await startTestServer();

  resource = await createTestResource(true);
  resourceIds.push(resource.id);

  for (let i = 0; i < 10; i++) {
    const user = await createTestUser("USER");

    users.push(user);
    userIds.push(user.id);
  }
});

after(async () => {
  await cleanupFixtures({ userIds, resourceIds });

  if (server) await server.close();

  await prisma.$disconnect();
});

test("10 simultaneous requests for one slot create exactly one booking", async () => {
  const slot = makeSlot(0);

  const requests = users.map((user) => {
    const token = createToken(user);

    return apiRequest(server.baseUrl, token, "/api/bookings", {
      method: "POST",
      body: {
        resourceId: resource.id,
        ...slot,
        purpose: "Concurrency integration test",
      },
    });
  });

  const responses = await Promise.all(requests);

  const created = responses.filter((response) => response.status === 201);

  const conflicts = responses.filter((response) => response.status === 409);

  const unexpected = responses.filter(
    (response) => response.status !== 201 && response.status !== 409,
  );

  assert.equal(
    created.length,
    1,
    "Exactly one request should create the booking",
  );

  assert.equal(
    conflicts.length,
    9,
    "The remaining nine requests should conflict",
  );

  assert.equal(
    unexpected.length,
    0,
    "No request should return an unexpected status",
  );

  const databaseCount = await prisma.booking.count({
    where: {
      resourceId: resource.id,
      startTime: new Date(slot.startTime),
      endTime: new Date(slot.endTime),
    },
  });

  assert.equal(
    databaseCount,
    1,
    "MySQL must contain exactly one booking for this slot",
  );

  console.log("Concurrency test results:", {
    totalRequests: responses.length,
    created: created.length,
    conflicts: conflicts.length,
    databaseBookings: databaseCount,
  });
});
