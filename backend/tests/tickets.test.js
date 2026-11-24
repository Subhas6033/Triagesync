import test, { before, after } from "node:test";
import assert from "node:assert/strict";
import mongoose from "mongoose";
import {
  classifyCategory,
  classifyPriority,
  classifyTicket,
} from "../src/services/classifier.service.js";
import Ticket from "../src/models/mongodb/Ticket.model.js";
import TicketEvent from "../src/models/mongodb/TicketEvent.model.js";

// Classifier Tests
test("Ticket classification tests", async (t) => {
  const cases = [
    ["Refund requested", "BILLING"],
    ["Invoice is incorrect", "BILLING"],
    ["Payment failed", "BILLING"],
    ["Password not working", "LOGIN"],
    ["Cannot sign in", "LOGIN"],
    ["My package has not arrived", "DELIVERY"],
    ["Shipping is delayed", "DELIVERY"],
    ["Tracking number missing", "DELIVERY"],
    ["Application crashes", "BUG"],
    ["Server error 500", "BUG"],
    ["Add dark mode", "FEATURE_REQUEST"],
  ];

  for (const [input, expected] of cases) {
    await t.test(input, () => {
      assert.equal(classifyCategory(input), expected);
    });
  }
});

test("Priority classification tests", async (t) => {
  const cases = [
    ["URGENT production down", "URGENT"],
    ["I am locked out", "URGENT"],
    ["Please refund my money", "HIGH"],
    ["I received an error", "HIGH"],
    ["My package has not arrived", "HIGH"],
    ["Please add dark mode", "MEDIUM"],
  ];

  for (const [input, expected] of cases) {
    await t.test(input, () => {
      assert.equal(classifyPriority(input), expected);
    });
  }
});

test("Combined classifier returns correct category and priority", () => {
  assert.deepEqual(
    classifyTicket("My package has not arrived", "I have waited five days."),
    {
      category: "DELIVERY",
      priority: "HIGH",
    },
  );
});

test("Refund ticket gets BILLING and HIGH", () => {
  assert.deepEqual(
    classifyTicket("Refund my payment", "Money was deducted twice."),
    {
      category: "BILLING",
      priority: "HIGH",
    },
  );
});

test("Classifier is case insensitive", () => {
  assert.equal(classifyCategory("REFUND MY PAYMENT"), "BILLING");

  assert.equal(classifyPriority("PRODUCTION DOWN"), "URGENT");
});

test("Unknown ticket defaults to FEATURE_REQUEST and MEDIUM", () => {
  assert.deepEqual(
    classifyTicket("Dashboard suggestion", "Please improve the dashboard."),
    {
      category: "FEATURE_REQUEST",
      priority: "MEDIUM",
    },
  );
});

// Mongoose model Validations Test
test("Ticket model validation tests", async (t) => {
  await t.test("Accepts valid ticket", async () => {
    const ticket = new Ticket({
      externalId: "TEST-001",
      subject: "Payment failed",
      body: "Payment is not working.",
      autoCategory: "BILLING",
      category: "BILLING",
      priority: "HIGH",
    });

    await assert.doesNotReject(() => ticket.validate());

    assert.equal(ticket.status, "OPEN");
    assert.equal(ticket.isReviewed, false);
    assert.equal(ticket.isHumanOverride, false);
  });

  await t.test("Rejects invalid category", async () => {
    const ticket = new Ticket({
      externalId: "TEST-002",
      subject: "Test",
      body: "Test body",
      autoCategory: "INVALID",
      category: "INVALID",
    });

    await assert.rejects(() => ticket.validate());
  });

  await t.test("Rejects missing subject", async () => {
    const ticket = new Ticket({
      externalId: "TEST-003",
      body: "Test body",
      autoCategory: "BUG",
      category: "BUG",
    });

    await assert.rejects(() => ticket.validate());
  });

  await t.test("Rejects missing externalId", async () => {
    const ticket = new Ticket({
      subject: "Test",
      body: "Test body",
      autoCategory: "BUG",
      category: "BUG",
    });

    await assert.rejects(() => ticket.validate());
  });

  await t.test("Rejects invalid priority", async () => {
    const ticket = new Ticket({
      externalId: "TEST-004",
      subject: "Test",
      body: "Test body",
      autoCategory: "BUG",
      category: "BUG",
      priority: "CRITICAL",
    });

    await assert.rejects(() => ticket.validate());
  });
});

// Ticket Validations Test
test("TicketEvent model validation tests", async (t) => {
  await t.test("Accepts valid audit event", async () => {
    const event = new TicketEvent({
      ticketId: new mongoose.Types.ObjectId(),
      field: "category",
      oldValue: "BUG",
      newValue: "BILLING",
      actor: "admin-test-id",
    });

    await assert.doesNotReject(() => event.validate());
  });

  await t.test("Rejects missing actor", async () => {
    const event = new TicketEvent({
      ticketId: new mongoose.Types.ObjectId(),
      field: "category",
      oldValue: "BUG",
      newValue: "BILLING",
    });

    await assert.rejects(() => event.validate());
  });

  await t.test("Rejects missing ticketId", async () => {
    const event = new TicketEvent({
      field: "category",
      oldValue: "BUG",
      newValue: "BILLING",
      actor: "admin-test-id",
    });

    await assert.rejects(() => event.validate());
  });
});
