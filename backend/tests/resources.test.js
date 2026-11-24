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
let admin;
let user;
let adminToken;
let userToken;

let activeResource;
let inactiveResource;
let secondResource;

const createdUsers = [];
const createdResources = [];

const createResourceBody = (overrides = {}) => ({
  name: "Integration Test Resource",
  description: "A resource created for automated integration tests",
  type: "ROOM",
  capacity: 12,
  location: "Test Building",
  ...overrides,
});

before(async () => {
  server = await startTestServer();

  admin = await createTestUser("ADMIN");
  user = await createTestUser("USER");

  createdUsers.push(admin, user);

  adminToken = createToken(admin);
  userToken = createToken(user);

  activeResource = await createTestResource(true);
  inactiveResource = await createTestResource(false);
  secondResource = await createTestResource(true);

  createdResources.push(activeResource, inactiveResource, secondResource);
});

after(async () => {
  await cleanupFixtures({
    userIds: createdUsers.map((item) => item.id),
    resourceIds: createdResources.map((item) => item.id),
  });

  if (server) await server.close();

  await prisma.$disconnect();
});

test("authenticated user can list active resources", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources",
  );

  assert.equal(response.status, 200);
  assert.ok(Array.isArray(response.data.data));
  assert.ok(response.data.data.length > 0);

  assert.ok(response.data.data.every((resource) => resource.isActive === true));
});

test("unauthenticated user cannot list resources", async () => {
  const response = await fetch(`${server.baseUrl}/api/resources`);

  assert.equal(response.status, 401);
});

test("admin can include inactive resources", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    "/api/resources?includeInactive=true",
  );

  assert.equal(response.status, 200);

  assert.ok(
    response.data.data.some((resource) => resource.id === inactiveResource.id),
  );
});

test("resource list supports type and minimum capacity filters", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources?type=ROOM&minCapacity=5",
  );

  assert.equal(response.status, 200);

  assert.ok(
    response.data.data.every(
      (resource) =>
        resource.type === "ROOM" &&
        resource.capacity >= 5 &&
        resource.isActive === true,
    ),
  );
});

test("resource list supports search", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources?q=${encodeURIComponent(activeResource.name)}`,
  );

  assert.equal(response.status, 200);

  assert.ok(
    response.data.data.some((resource) => resource.id === activeResource.id),
  );
});

test("resource list supports pagination", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources?page=1&pageSize=1",
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.page, 1);
  assert.equal(response.data.pageSize, 1);
  assert.ok(response.data.data.length <= 1);
  assert.ok(response.data.totalPages >= 1);
});

test("resource list rejects invalid filters", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources?type=INVALID",
  );

  assert.equal(response.status, 400);
});

test("user can view an active resource but cannot view an inactive one", async () => {
  const active = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${activeResource.id}`,
  );

  assert.equal(active.status, 200);
  assert.equal(active.data.data.id, activeResource.id);

  const inactive = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${inactiveResource.id}`,
  );

  assert.equal(inactive.status, 404);
});

test("admin can view an inactive resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${inactiveResource.id}`,
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.data.isActive, false);
});

test("admin can create a resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    "/api/resources",
    {
      method: "POST",
      body: createResourceBody(),
    },
  );

  assert.equal(response.status, 201);
  assert.equal(response.data.data.name, "Integration Test Resource");

  createdResources.push(response.data.data);
});

test("regular user cannot create a resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources",
    {
      method: "POST",
      body: createResourceBody(),
    },
  );

  assert.equal(response.status, 403);
});

test("admin can update a resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${activeResource.id}`,
    {
      method: "PATCH",
      body: { capacity: 25 },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.data.capacity, 25);
});

test("admin can deactivate a resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${secondResource.id}`,
    {
      method: "PATCH",
      body: { isActive: false },
    },
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.data.isActive, false);
});

test("regular user cannot update a resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${activeResource.id}`,
    {
      method: "PATCH",
      body: { capacity: 30 },
    },
  );

  assert.equal(response.status, 403);
});

test("resource creation rejects invalid input", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    "/api/resources",
    {
      method: "POST",
      body: createResourceBody({ capacity: 0 }),
    },
  );

  assert.equal(response.status, 400);
});

test("resource update rejects an empty body", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${activeResource.id}`,
    {
      method: "PATCH",
      body: {},
    },
  );

  assert.equal(response.status, 400);
});

test("resource details return 404 for an unknown resource", async () => {
  const response = await apiRequest(
    server.baseUrl,
    userToken,
    "/api/resources/nonexistent-resource-id",
  );

  assert.equal(response.status, 404);
});

test("availability rejects missing or invalid date parameters", async () => {
  const missing = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${activeResource.id}/availability`,
  );

  assert.equal(missing.status, 400);

  const invalid = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${activeResource.id}/availability?startTime=invalid&endTime=invalid`,
  );

  assert.equal(invalid.status, 400);
});

test("availability rejects an inactive resource", async () => {
  const slot = makeSlot(60);

  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${inactiveResource.id}/availability?startTime=${encodeURIComponent(slot.startTime)}&endTime=${encodeURIComponent(slot.endTime)}`,
  );

  assert.equal(response.status, 409);
});

test("availability returns only overlapping active bookings", async () => {
  const slot = makeSlot(61);

  const booking = await apiRequest(server.baseUrl, userToken, "/api/bookings", {
    method: "POST",
    body: {
      resourceId: activeResource.id,
      ...slot,
      purpose: "Resource availability integration test",
    },
  });

  assert.equal(booking.status, 201);

  const response = await apiRequest(
    server.baseUrl,
    userToken,
    `/api/resources/${activeResource.id}/availability?startTime=${encodeURIComponent(slot.startTime)}&endTime=${encodeURIComponent(slot.endTime)}`,
  );

  assert.equal(response.status, 200);
  assert.equal(response.data.data.resourceId, activeResource.id);
  assert.ok(Array.isArray(response.data.data.bookings));
  assert.equal(response.data.data.bookings.length, 1);

  const returnedBooking = response.data.data.bookings[0];

  assert.equal(returnedBooking.status, "PENDING");
  assert.ok(returnedBooking.startTime);
  assert.ok(returnedBooking.endTime);
});

test("resource creation rejects a duplicate name with 409", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    "/api/resources",
    {
      method: "POST",
      body: createResourceBody({ name: activeResource.name }),
    },
  );

  assert.equal(response.status, 409);
  assert.equal(response.data.error.code, "CONFLICT");
});

test("resource update rejects a duplicate name with 409", async () => {
  const response = await apiRequest(
    server.baseUrl,
    adminToken,
    `/api/resources/${secondResource.id}`,
    {
      method: "PATCH",
      body: { name: activeResource.name },
    },
  );

  assert.equal(response.status, 409);
  assert.equal(response.data.error.code, "CONFLICT");
});
