# SOLUTION

## Part A — Architecture and ticket trace

```text
Ticket feed
   | POST /api/tickets/import
   v
Express route -> ticket controller -> ticket import service
                                  | classify subject + body
                                  v
                         classifier service
                                  |
                                  v
                         MongoDB Ticket
                                  |
GET /api/tickets -> ticket service -> filters / pagination -> frontend queue
PATCH /api/tickets/:id -> ticket service -> update + TicketEvent -> detail/audit UI
                                  |
                                  v
GET /api/stats -> stats service -> dashboard counters and model agreement rate
```

The request enters through the Express ticket routes and controller. `ticketImport.service.js` handles the import and invokes `classifier.service.js` to derive category and priority from subject plus body. The ticket service/repository layer persists tickets in MongoDB. Listing requests apply the supported filters and pagination before the frontend renders the queue. A ticket PATCH records changed values in ticket events; the detail view requests the ticket and its event history. The stats route aggregates ticket counts and agreement information for the dashboard. Relevant code is in `backend/src/routes/ticket.routes.js`, `backend/src/controllers/ticket.controller.js`, `backend/src/services/ticketImport.service.js`, `backend/src/services/classifier.service.js`, `backend/src/services/ticket.service.js`, and `backend/src/services/stats.service.js`.

**Reviewed definition:** the assessment defines a ticket as reviewed when an agent changes its category or transitions its status from `OPEN`. The implementation should set `isReviewed` on either of those actions, and leave unrelated priority/assignee changes alone. Verify this definition against the ticket update service before final submission.

## Part B — Concurrency and import idempotency

### Booking overlap (B6)

The booking service delegates critical-section work to `backend/src/services/concurrency.service.js` and persists bookings through Prisma/MySQL. The intended invariant is to perform the overlap check and insert while holding a lock for the resource in one database transaction. The interval comparison is `newStart < existingEnd && newEnd > existingStart`, limited to `PENDING` and `APPROVED`; equality at an endpoint permits back-to-back bookings. The resource lock serializes competing booking requests for the same resource while allowing requests for different resources to proceed independently.

**Evidence still required:** run at least ten simultaneous POST requests for the same active resource and slot against the assessment database. Record the number of `201` and `409` responses here. No verified race-run output is currently recorded, so this document does not claim a measured pass.

### Import idempotency and human override (T-B2)

`externalId` is the stable feed key. The MongoDB ticket model has a unique external identifier, and the import service upserts rather than blindly inserting. On an existing record, subject and body can be refreshed. The classifier may update the current category only while `isHumanOverride` is false; the original `autoCategory` remains the classifier result. Agent category changes set the override flag, preventing later feed imports from replacing the agent's choice. Check `backend/src/services/ticketImport.service.js` and `backend/src/services/ticket.service.js` for the current implementation.

## Part C — Measure first, then optimise

Required measurement: `GET /api/tickets?limit=100` with at least 500 persisted tickets, using the same environment and dataset before and after the indexing/query optimization. Report the median over repeated requests and state whether network time is included.

| State | Dataset | Measurement | Result |
|---|---:|---|---|
| Before optimization | 500+ tickets | Median response latency, repeated requests | **Not measured / enter verified value** |
| After optimization | Same 500+ tickets | Median response latency, repeated requests | **Not measured / enter verified value** |

The repository does not contain verified before/after timings. Populate this table from actual runs; do not use a fabricated estimate. Document the exact index/query change and command or measurement method alongside the results.

**Trade-off to evaluate:** additional indexes can reduce filter/sort read time, but consume storage and make ticket inserts and updates more expensive. State the actual index selected and observed trade-off after measurement.

## Part D — One more day

1. Verify the full API contract, including validation, access-control ordering, exact response fields, and error codes. Start with `backend/src/routes/` and `backend/src/validators/`.
2. Add repeatable integration evidence for cross-database ticket references and booking race behavior, beginning at `backend/src/services/concurrency.service.js`.
3. Complete deployment verification and responsive/optimistic rollback checks in the frontend ticket mutation path (`frontend/src/features/tickets/hooks/useTickets.js`).
4. Measure and optimize the 500+ ticket list query, then record real latency values above.
