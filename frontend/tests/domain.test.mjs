import test from "node:test";
import assert from "node:assert/strict";
import { parseTicketImport, validateBooking } from "../src/utils/validation.js";
import {
  availabilityWindow,
  formatDate,
  formatDateRange,
  toLocalDateTime,
} from "../src/utils/date.js";
import {
  chartEntries,
  getErrorMessage,
  listPage,
  rowsFrom,
  ticketTotalFromStats,
} from "../src/utils/formatters.js";
import queryKeys from "../src/lib/queryKeys.js";

const now = new Date("2026-01-01T00:00:00Z");
const booking = {
  startTime: "2026-01-02T10:00:00Z",
  endTime: "2026-01-02T11:00:00Z",
};
const ticket = {
  externalId: "case-1",
  subject: "Cannot sign in",
  body: "The login form reports an error.",
};

test("ticket imports accept the existing array and object formats", () => {
  assert.deepEqual(parseTicketImport(JSON.stringify([ticket])), [ticket]);
  assert.deepEqual(parseTicketImport(JSON.stringify({ tickets: [ticket] })), [
    ticket,
  ]);
});
test("imports reject invalid JSON, empty batches, unsupported fields, and oversized batches", () => {
  for (const value of [
    "invalid",
    "{}",
    "[]",
    JSON.stringify([{ ...ticket, status: "OPEN" }]),
    JSON.stringify(Array(501).fill(ticket)),
  ])
    assert.throws(() => parseTicketImport(value));
});
test("imports validate each record before submitting the batch", () => {
  assert.throws(
    () => parseTicketImport(JSON.stringify([ticket, { ...ticket, body: "" }])),
    /Ticket 2/,
  );
  assert.throws(() => parseTicketImport(JSON.stringify([null])), /Ticket 1/);
});
test("booking accepts valid future reservations and adjacent intervals", () => {
  assert.equal(
    validateBooking(
      booking,
      [
        {
          status: "APPROVED",
          startTime: booking.endTime,
          endTime: "2026-01-02T12:00:00Z",
        },
      ],
      now,
    ),
    "",
  );
});
test("pending, approved, booked, and unavailable slots block overlaps", () => {
  for (const slot of [
    { status: "PENDING" },
    { status: "APPROVED" },
    { status: "BOOKED" },
    { isAvailable: false },
  ])
    assert.match(
      validateBooking(booking, [{ ...booking, ...slot }], now),
      /overlaps/,
    );
});
test("rejected and cancelled reservations do not block availability", () => {
  for (const status of ["REJECTED", "CANCELLED"])
    assert.equal(validateBooking(booking, [{ ...booking, status }], now), "");
});
test("booking validates dates, ordering, half-hour boundaries, and duration", () => {
  assert.match(
    validateBooking({ ...booking, startTime: "" }, [], now),
    /valid/,
  );
  assert.match(
    validateBooking({ ...booking, endTime: booking.startTime }, [], now),
    /after/,
  );
  assert.match(
    validateBooking({ ...booking, startTime: "2026-01-02T10:15:00Z" }, [], now),
    /boundaries/,
  );
  assert.match(
    validateBooking({ ...booking, endTime: "2026-01-02T15:00:00Z" }, [], now),
    /4 hours/,
  );
});
test("booking enforces future starts and the 30-day booking horizon", () => {
  assert.match(
    validateBooking(booking, [], new Date("2026-01-03T00:00:00Z")),
    /future/,
  );
  assert.match(
    validateBooking(
      { startTime: "2026-03-01T10:00:00Z", endTime: "2026-03-01T11:00:00Z" },
      [],
      now,
    ),
    /30 days/,
  );
});
test("availability uses UTC timestamps and never exceeds the API seven-day limit", () => {
  const range = availabilityWindow(new Date("2026-11-01T13:00:00Z"));
  assert.match(range.from, /Z$/);
  assert.match(range.to, /Z$/);
  assert.equal(Date.parse(range.to) - Date.parse(range.from), 7 * 86400000);
});
test("datetime-local inputs use local clock time rather than a UTC slice", () => {
  const date = new Date(2026, 0, 2, 9, 30);
  assert.equal(toLocalDateTime(date), "2026-01-02T09:30");
});
test("date formatters handle missing dates and overnight reservations", () => {
  assert.equal(formatDate("invalid"), "—");
  assert.equal(formatDateRange(null, null), "Date unavailable");
  const end = new Date("2026-01-03T11:00:00Z");
  assert.ok(
    formatDateRange(booking.startTime, end).includes(end.toLocaleString()),
  );
});
test("list normalization supports nested envelopes without discarding server totals", () => {
  const result = listPage(
    { data: { data: [ticket], total: 42, page: 3, pageSize: 8 } },
    "tickets",
  );
  assert.deepEqual(result, {
    items: [ticket],
    total: 42,
    page: 3,
    pageSize: 8,
    pages: 6,
  });
  assert.deepEqual(rowsFrom({ tickets: [ticket] }, "tickets"), [ticket]);
  assert.deepEqual(rowsFrom({ data: { resources: null } }, "resources"), []);
});
test("empty lists have a safe page count", () => {
  assert.equal(listPage({ data: [], total: 0 }, "tickets").pages, 1);
});
test("charts accept API aggregates and exclude invalid and negative counts", () => {
  assert.deepEqual(chartEntries([{ category: "BUG", count: 12 }]), [
    ["BUG", 12],
  ]);
  assert.deepEqual(
    chartEntries({
      PENDING: 0,
      APPROVED: { count: 3 },
      invalid: "no",
      negative: -1,
    }),
    [
      ["PENDING", 0],
      ["APPROVED", 3],
    ],
  );
  assert.equal(
    ticketTotalFromStats({
      byStatus: [
        { status: "OPEN", count: 8 },
        { status: "CLOSED", count: 4 },
      ],
    }),
    12,
  );
});
test("nested API errors keep the server explanation", () => {
  assert.equal(
    getErrorMessage({ response: { data: { error: { message: "Conflict" } } } }),
    "Conflict",
  );
});
test("detail, list, and availability query namespaces do not collide", () => {
  assert.notDeepEqual(queryKeys.ticket("list"), queryKeys.ticketList);
  assert.notDeepEqual(
    queryKeys.resource("availability"),
    queryKeys.allAvailability,
  );
  assert.deepEqual(queryKeys.ticket(1), queryKeys.ticket("1"));
  assert.deepEqual(
    queryKeys.availability("r1").slice(0, 2),
    queryKeys.allAvailability,
  );
});
