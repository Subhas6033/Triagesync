// Optional browser regression suite. Uses isolated API fixtures; never writes to a real backend.
// Start Vite with VITE_API_URL=http://127.0.0.1:5173/api, then set PLAYWRIGHT_MODULE
// to an installed Playwright entry point (or install Playwright in your test environment).
import assert from "node:assert/strict";
import { mkdir } from "node:fs/promises";
const { chromium } = await import(
  process.env.PLAYWRIGHT_MODULE || "playwright"
);
const base = process.env.E2E_BASE_URL || "http://127.0.0.1:5173";
const browser = await chromium.launch({
  headless: true,
  executablePath: process.env.E2E_BROWSER || "/usr/bin/google-chrome",
});
const runtimeErrors = [];
const checks = [];
const record = (message) => {
  checks.push(message);
  console.log(`PASS ${message}`);
};
const date = new Date();
date.setUTCDate(date.getUTCDate() + 2);
date.setUTCHours(10, 0, 0, 0);
const start = date.toISOString();
const later = (hours) =>
  new Date(date.getTime() + hours * 3600000).toISOString();
const local = async (page, value) =>
  page.evaluate((value) => {
    const date = new Date(value);
    return new Date(date.getTime() - date.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 16);
  }, value);
async function setup(role = "USER") {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 1000 },
    timezoneId: "Asia/Kolkata",
  });
  const resources = Array.from({ length: 12 }, (_, index) => ({
    id: `r${index + 1}`,
    name: `Resource ${String(index + 1).padStart(2, "0")}`,
    type: index % 2 ? "LAB" : "ROOM",
    capacity: 8,
    location: "Main building",
    description: "A shared workspace for team sessions.",
    isActive: true,
  }));
  const tickets = Array.from({ length: 18 }, (_, index) => ({
    id: `t${index + 1}`,
    externalId: `case-${index + 1}`,
    subject: `Login issue ${String(index + 1).padStart(2, "0")}`,
    body: "Unable to access the account after resetting the password.",
    category: index % 2 ? "LOGIN" : "BUG",
    priority: "MEDIUM",
    status: index % 3 ? "OPEN" : "IN_PROGRESS",
    createdAt: new Date(Date.now() - index * 60000).toISOString(),
  }));
  const bookings = Array.from({ length: 12 }, (_, index) => ({
    id: `b${index + 1}`,
    resourceId: "r1",
    resource: resources[0],
    user: { name: "Test member", email: "member@example.test" },
    startTime: start,
    endTime: later(1),
    purpose: `Team planning session ${index + 1}`,
    status: index % 2 ? "APPROVED" : "PENDING",
  }));
  const requests = [];
  const events = [];
  let failTickets = false;
  await context.route("**/api/**", async (route) => {
    const req = route.request();
    const url = new URL(req.url());
    const path = url.pathname.replace(/^\/api/, "");
    const method = req.method();
    const body = req.postDataJSON();
    requests.push({
      path,
      method,
      body,
      params: Object.fromEntries(url.searchParams),
      authorization: req.headers().authorization,
    });
    const send = (json, status = 200) =>
      route.fulfill({
        status,
        contentType: "application/json",
        body: JSON.stringify(json),
      });
    const paged = (items) => {
      const page = Number(url.searchParams.get("page") || 1);
      const size = Number(url.searchParams.get("pageSize") || 10);
      return {
        data: items.slice((page - 1) * size, page * size),
        total: items.length,
        page,
        pageSize: size,
        totalPages: Math.ceil(items.length / size),
      };
    };
    if (path === "/auth/register")
      return send({ user: { id: "u1", name: body.name } }, 201);
    if (path === "/auth/login") {
      if (body.password === "Wrong1234")
        return send({ error: { message: "Invalid credentials" } }, 401);
      return send({
        token: `test-${role}`,
        user: { id: "u1", name: "Taylor", email: body.email, role },
      });
    }
    if (!req.headers().authorization)
      return send({ message: "Unauthenticated" }, 401);
    if (path === "/tickets/import") {
      tickets.unshift(
        ...body.tickets.map((ticket, index) => ({
          ...ticket,
          id: `import-${index}`,
          status: "OPEN",
          priority: "MEDIUM",
          category: "BUG",
          createdAt: new Date().toISOString(),
        })),
      );
      return send({ importedCount: body.tickets.length, updatedCount: 0, skippedOverrideCount: 0 });
    }
    if (path === "/tickets") {
      if (failTickets)
        return send({ error: { message: "Temporary ticket failure" } }, 500);
      return send(
        paged(
          tickets.filter(
            (ticket) =>
              ["status", "category", "priority"].every(
                (key) =>
                  !url.searchParams.get(key) ||
                  ticket[key] === url.searchParams.get(key),
              ) &&
              `${ticket.subject} ${ticket.body}`
                .toLowerCase()
                .includes((url.searchParams.get("q") || "").toLowerCase()),
          ),
        ),
      );
    }
    if (/^\/tickets\//.test(path)) {
      const ticket = tickets.find((ticket) => ticket.id === path.split("/")[2]);
      if (!ticket) return send({ message: "Ticket not found" }, 404);
      if (method === "PATCH") {
        Object.assign(ticket, body, { isReviewed: true });
        events.push({
          id: "e1",
          field: "priority",
          oldValue: "MEDIUM",
          newValue: body.priority,
          actor: "member@example.test",
          createdAt: new Date().toISOString(),
        });
      }
      return send({ ticket, events });
    }
    if (path === "/resources") {
      if (method === "POST") {
        const resource = {
          ...body,
          id: `r${resources.length + 1}`,
          isActive: true,
        };
        resources.unshift(resource);
        return send(resource, 201);
      }
      return send(
        paged(
          resources.filter(
            (resource) =>
              (!url.searchParams.get("type") ||
                resource.type === url.searchParams.get("type")) &&
              `${resource.name} ${resource.location} ${resource.description}`
                .toLowerCase()
                .includes((url.searchParams.get("q") || "").toLowerCase()),
          ),
        ),
      );
    }
    if (/^\/resources\/[^/]+\/availability$/.test(path)) {
      assert.match(url.searchParams.get("from"), /Z$/);
      assert.match(url.searchParams.get("to"), /Z$/);
      return send({
        bookings: [{ startTime: start, endTime: later(1), status: "APPROVED" }],
      });
    }
    if (/^\/resources\//.test(path)) {
      const resource = resources.find(
        (resource) => resource.id === path.split("/")[2],
      );
      if (!resource) return send({ message: "Resource not found" }, 404);
      if (method === "PATCH") Object.assign(resource, body);
      return send(resource);
    }
    if (path === "/bookings" && method === "POST") {
      const booking = {
        ...body,
        id: `b${bookings.length + 1}`,
        resource: resources.find((resource) => resource.id === body.resourceId),
        status: "PENDING",
      };
      bookings.unshift(booking);
      return send(booking, 201);
    }
    if (path === "/bookings" || path === "/bookings/mine")
      return send(
        paged(
          bookings.filter(
            (booking) =>
              !url.searchParams.get("status") ||
              booking.status === url.searchParams.get("status"),
          ),
        ),
      );
    if (/^\/bookings\//.test(path)) {
      const [, , id, action] = path.split("/");
      const booking = bookings.find((booking) => booking.id === id);
      booking.status = {
        cancel: "CANCELLED",
        approve: "APPROVED",
        reject: "REJECTED",
      }[action];
      if (action === "reject") booking.decisionNote = body.note;
      return send(booking);
    }
    const ticketStats = {
      reviewedCount: 7,
      modelAgreementRate: 85,
      byCategory: [
        { category: "BUG", count: 9 },
        { category: "LOGIN", count: 9 },
      ],
      byPriority: [{ priority: "MEDIUM", count: 18 }],
    };
    if (path === "/stats") return send(ticketStats);
    if (path === "/admin/stats")
      return role === "ADMIN"
        ? send({
            activeResources: 12,
            ticketStats,
            bookingsByStatus: {
              PENDING: 6,
              APPROVED: 6,
              CANCELLED: 0,
              REJECTED: 0,
            },
            topResources: [{ name: "Resource 01", bookingCount: 12 }],
          })
        : send({ message: "Forbidden" }, 403);
    return send({ message: `Unexpected endpoint: ${path}` }, 404);
  });
  const page = await context.newPage();
  page.on("pageerror", (error) => runtimeErrors.push(error.message));
  const visit = async (path) => {
    await page.goto(base + path);
    await page.waitForLoadState("networkidle");
  };
  const login = async () => {
    await page.getByLabel("Email address").fill("member@example.test");
    await page.getByLabel("Password", { exact: true }).fill("Pass12345");
    await page.getByRole("button", { name: "Sign in", exact: true }).click();
    await page.waitForLoadState("networkidle");
  };
  return {
    context,
    page,
    visit,
    login,
    requests,
    resources,
    bookings,
    tickets,
    failTickets: (value) => {
      failTickets = value;
    },
  };
}
try {
  const user = await setup();
  const { page, visit, login } = user;
  await visit("/");
  await page.getByRole("heading", { level: 1 }).waitFor();
  await visit("/register");
  await page.getByLabel("Full name").fill("Taylor");
  await page.getByLabel("Email address").fill("member@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Pass12345");
  await page
    .getByRole("button", { name: "Create account", exact: true })
    .click();
  await page.getByText("Account created. Please sign in.").waitFor();
  await page.getByLabel("Email address").fill("member@example.test");
  await page.getByLabel("Password", { exact: true }).fill("Wrong1234");
  await page.getByRole("button", { name: "Sign in", exact: true }).click();
  await page.getByText("Invalid credentials", { exact: true }).waitFor();
  record("registration and failed-login feedback");
  await visit("/tickets/t1");
  await page.waitForURL("**/login");
  await login();
  await page
    .getByRole("heading", { name: "Login issue 01", exact: true })
    .waitFor();
  record("protected route returns to the requested detail page after login");
  await page.getByLabel("Priority", { exact: true }).selectOption("HIGH");
  await page.getByRole("button", { name: "Save changes" }).click();
  await page.getByText("Human reviewed", { exact: true }).waitFor();
  await page.getByText("Ticket changes saved.").waitFor();
  assert.ok(
    user.requests.some(
      (request) =>
        request.method === "PATCH" && request.body.priority === "HIGH",
    ),
  );
  record("ticket edit refreshes review state and audit history");
  await visit("/tickets");
  await page.getByRole("button", { name: "Next page" }).click();
  await page.getByText("Page 2 of 3").waitFor();
  await page.getByLabel("Category", { exact: true }).selectOption("LOGIN");
  await page.getByText("9 tickets", { exact: true }).waitFor();
  assert.ok(
    user.requests.some(
      (request) =>
        request.params.category === "LOGIN" && request.params.page === "1",
    ),
  );
  await page.getByLabel("Search tickets", { exact: true }).fill("no-match");
  await page.getByRole("button", { name: "Search", exact: true }).click();
  await page.getByText("No tickets found").waitFor();
  record("server pagination, category filter, search, and empty state");
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "bad.json",
      mimeType: "application/json",
      buffer: Buffer.from("{}"),
    });
  await page
    .getByRole("dialog", { name: "Tickets could not be imported" })
    .waitFor();
  await page.keyboard.press("Escape");
  const beforeImport = user.requests.filter(
    (request) => request.path === "/tickets/import",
  ).length;
  assert.equal(beforeImport, 0);
  await page
    .locator("input[type=file]")
    .setInputFiles({
      name: "tickets.json",
      mimeType: "application/json",
      buffer: Buffer.from(
        JSON.stringify([
          {
            externalId: "import-1",
            subject: "Imported issue",
            body: "Imported support issue description.",
          },
        ]),
      ),
    });
  await page.getByRole("status").filter({ hasText: "Feed import complete: 1 imported" }).waitFor();
  assert.equal(user.tickets.length, 19);
  record("ticket import validates files and submits the existing payload");
  await visit("/resources");
  await page.getByRole("button", { name: "Next page" }).click();
  await page
    .getByRole("heading", { name: "Resource 12", exact: true })
    .waitFor();
  await page.getByLabel("Search resources").fill("Resource 12");
  await page.getByText("1 resources", { exact: true }).waitFor();
  await page
    .getByRole("link", { name: "View availability for Resource 12" })
    .click();
  await page.getByRole("heading", { name: "Request a booking" }).waitFor();
  await page.getByLabel("Start date and time").fill(await local(page, start));
  await page.getByLabel("End date and time").fill(await local(page, later(1)));
  await page
    .getByLabel("Purpose", { exact: true })
    .fill("Team workshop planning");
  await page
    .getByRole("button", { name: "Request booking", exact: true })
    .click();
  await page
    .getByText(
      "This time overlaps an existing reservation. Choose another time.",
    )
    .waitFor();
  await page
    .getByLabel("Start date and time")
    .fill(await local(page, later(2)));
  await page.getByLabel("End date and time").fill(await local(page, later(3)));
  await page
    .getByRole("button", { name: "Request booking", exact: true })
    .click();
  await page
    .getByText("Booking request sent. Track its status in My bookings.")
    .waitFor();
  const created = user.requests.find(
    (request) => request.path === "/bookings" && request.method === "POST",
  );
  assert.equal(created.body.startTime, later(2));
  record(
    "resource search/pagination, UTC availability, overlap prevention, and booking creation",
  );
  await visit("/bookings");
  await page
    .getByRole("button", { name: "Cancel booking", exact: true })
    .first()
    .click();
  const cancelDialog = page.getByRole("dialog", {
    name: "Cancel this booking?",
  });
  await cancelDialog.waitFor();
  await page.keyboard.press("Tab");
  assert.ok(
    await page.evaluate(() =>
      document.querySelector("dialog").contains(document.activeElement),
    ),
  );
  await page.keyboard.press("Escape");
  assert.equal(await page.getByRole("dialog").count(), 0);
  await page
    .getByRole("button", { name: "Cancel booking", exact: true })
    .first()
    .click();
  await cancelDialog
    .getByRole("button", { name: "Cancel booking", exact: true })
    .click();
  await page.getByText("Cancelled", { exact: true }).first().waitFor();
  record(
    "booking cancellation confirmation, keyboard focus, and Escape handling",
  );
  await visit("/admin/resources");
  await page.waitForURL("**/forbidden");
  await page.getByRole("heading", { name: "You don’t have access to this area." }).waitFor();
  assert.equal(
    await page
      .getByRole("link", { name: "Manage resources", exact: true })
      .count(),
    0,
  );
  assert.ok(!user.requests.some((request) => request.path === "/admin/stats"));
  record("member admin-route protection, forbidden page, and role-based navigation");
  user.failTickets(true);
  await visit("/tickets");
  await page
    .getByText("Tickets could not be loaded", { exact: true })
    .waitFor();
  user.failTickets(false);
  await page.getByRole("button", { name: "Try again", exact: true }).click();
  await page
    .getByRole("link", { name: /Imported issue/ })
    .first()
    .waitFor();
  record("query error and retry recovery");

  const admin = await setup("ADMIN");
  await admin.visit("/login");
  await admin.login();
  await admin.page.getByRole("heading", { name: /Good to see you/ }).waitFor();
  assert.ok(!admin.requests.some((request) => request.path === "/stats"));
  const ticketReads = admin.requests.filter(
    (request) => request.path === "/tickets" && request.method === "GET",
  ).length;
  await admin.page
    .getByRole("navigation", { name: "Workspace", exact: true })
    .getByRole("link", { name: "Tickets", exact: true })
    .click();
  await admin.page.waitForLoadState("networkidle");
  assert.equal(
    admin.requests.filter(
      (request) => request.path === "/tickets" && request.method === "GET",
    ).length,
    ticketReads,
  );
  record("dashboard and ticket page share the same fresh query cache");
  await admin.visit("/admin/bookings");
  await admin.page
    .getByRole("button", { name: "Approve", exact: true })
    .first()
    .click();
  await admin.page.getByText("5 requests", { exact: true }).waitFor();
  await admin.page
    .getByRole("button", { name: "Reject", exact: true })
    .first()
    .click();
  await admin.page
    .getByRole("dialog")
    .getByLabel("Reason")
    .fill("Resource is under maintenance.");
  await admin.page
    .getByRole("button", { name: "Reject request", exact: true })
    .click();
  await admin.page.getByText("4 requests", { exact: true }).waitFor();
  await admin.page
    .getByRole("button", { name: "All requests", exact: true })
    .click();
  await admin.page
    .getByText("Resource is under maintenance.", { exact: true })
    .first()
    .waitFor();
  record(
    "admin approval/rejection, server status filtering, and decision notes",
  );
  await admin.visit("/admin/resources");
  await admin.page
    .getByLabel("Resource name", { exact: true })
    .fill("New laboratory");
  await admin.page.getByLabel("Type", { exact: true }).selectOption("LAB");
  await admin.page.getByLabel("Location", { exact: true }).fill("North wing");
  await admin.page
    .getByRole("button", { name: "Create resource", exact: true })
    .click();
  await admin.page
    .getByRole("heading", { name: "New laboratory", exact: true })
    .waitFor();
  const resourceCard = admin.page
    .locator("article")
    .filter({
      has: admin.page.getByRole("heading", {
        name: "New laboratory",
        exact: true,
      }),
    });
  await resourceCard.getByRole("button", { name: "Edit details" }).click();
  await admin.page
    .getByLabel("Resource name", { exact: true })
    .fill("Renamed laboratory");
  await admin.page
    .getByRole("button", { name: "Save resource", exact: true })
    .click();
  const renamed = admin.page
    .locator("article")
    .filter({
      has: admin.page.getByRole("heading", {
        name: "Renamed laboratory",
        exact: true,
      }),
    });
  await renamed
    .getByRole("button", { name: "Deactivate", exact: true })
    .click();
  await admin.page
    .getByRole("dialog")
    .getByRole("button", { name: "Deactivate", exact: true })
    .click();
  await renamed.getByText("INACTIVE", { exact: true }).waitFor();
  record("admin resource creation, editing, and confirmed deactivation");

  await mkdir("/tmp/triagesync-qa", { recursive: true });
  const routes = [
    "/",
    "/login",
    "/register",
    "/dashboard",
    "/tickets",
    "/tickets/t1",
    "/resources",
    "/resources/r1",
    "/bookings",
    "/admin/bookings",
    "/admin/resources",
    "/missing-page",
    "/forbidden",
  ];
  for (const theme of ["light", "dark"]) {
    await admin.visit("/dashboard");
    const currentTheme = await admin.page.evaluate(() => document.documentElement.dataset.theme);
    if (currentTheme !== theme) {
      await admin.page.locator(".app-topbar").getByRole("button", { name: `Switch to ${theme} theme` }).click();
    }
    for (const width of [1440, 1280, 768, 390, 375, 320]) {
      await admin.page.setViewportSize({ width, height: 1000 });
      for (const route of routes) {
        await admin.visit(route);
        const overflow = await admin.page.evaluate(
          () => document.documentElement.scrollWidth > window.innerWidth + 1,
        );
        assert.equal(overflow, false, `Horizontal overflow at ${route}, ${width}px, ${theme} theme`);
        assert.equal(await admin.page.getByRole("heading", { level: 1 }).count(), 1, `Missing/duplicate heading at ${route}, ${width}px, ${theme} theme`);
      }
      await admin.visit("/dashboard");
      await admin.page.screenshot({
        path: `/tmp/triagesync-qa/dashboard-${theme}-${width}.png`,
        fullPage: true,
      });
      if (width <= 720) {
        await admin.page.getByRole("button", { name: "Open navigation" }).click();
        await admin.page
          .getByRole("dialog")
          .getByRole("link", { name: "Manage resources", exact: true })
          .click();
        assert.equal(await admin.page.getByRole("dialog").count(), 0);
      }
    }
  }
  record("all routes at 1440, 1280, 768, 390, 375, and 320px in light and dark; no page overflow; mobile navigation");
  await admin.page.setViewportSize({ width: 1440, height: 1000 });
  await admin.visit("/dashboard");
  await admin.page.getByRole("button", { name: "Collapse navigation" }).click();
  assert.ok(
    await admin.page
      .locator(".app-shell")
      .evaluate((element) => element.classList.contains("sidebar-collapsed")),
  );
  await admin.page
    .getByRole("button", { name: "Sign out", exact: true })
    .click();
  await admin.page.waitForURL("**/login");
  assert.equal(
    await admin.page.evaluate(() => localStorage.getItem("triagesync_token")),
    null,
  );
  record("desktop sidebar collapse and session logout");
  assert.deepEqual(runtimeErrors, []);
  assert.ok(
    user.requests
      .filter((request) => !request.path.startsWith("/auth"))
      .every((request) => request.authorization === "Bearer test-USER"),
  );
  record(
    "no browser runtime errors; authenticated API requests retain bearer tokens",
  );
  console.log(
    `${checks.length} workflow groups passed. Screenshots: /tmp/triagesync-qa`,
  );
} finally {
  await browser.close();
}
