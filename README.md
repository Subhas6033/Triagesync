# TriageSync

TriageSync is a support triage and shared resource-slot booking application for the ENGN-F1 Full Stack assessment. It imports and classifies support tickets, supports agent review with an audit history, and lets users request 30-minute-grid bookings for rooms, labs, and equipment.

## 1. Overview

- Ticket feed import is keyed by `externalId`; automated category and priority rules are documented below. Human category overrides are represented separately from `autoCategory`.
- Agents can search and filter tickets and inspect ticket events. Ticket text is rendered as text by the frontend.
- Users can browse resources, check availability, book slots, and manage their own bookings. Administrators manage resources and booking decisions.
- Roles are `USER` and `ADMIN`. Public registration creates USER accounts; the seed script creates the assessment ADMIN.

## 2. Live links

- Frontend: **Not deployed / URL not recorded**
- Backend: **Not deployed / URL not recorded**
- Public repository: **Add the assessment repository URL**

Replace these entries with the verified HTTPS URLs before submission. The checked-in environment examples currently describe local development.

## 3. Seeded credentials

| Role | Email | Password |
|---|---|---|
| ADMIN | `admin@triagesync.test` | `Admin@123` |
| USER | `user@triagesync.test` | `User@123` |

These are assessment seed credentials. The seed inserts six resources (two per type, including one inactive resource) and twenty initial tickets, including a raw HTML/script payload and reviewed tickets. Do not use the sample passwords for other services.

## 4. Tech stack

- Frontend: React, Vite, React Router, TanStack Query, Axios, Tailwind CSS.
- Backend: Node.js ES modules, Express, Zod, JWT, bcrypt, Helmet.
- Persistence: MySQL 8 through Prisma for users, resources, and bookings; MongoDB through Mongoose for tickets and ticket events.
- The two databases do not share transactions or foreign keys. Cross-database references must be checked by application services.

## 5. Folder structure

```text
backend/
  src/{config,controllers,middleware,models,prisma,repositories,routes,seeds,services,validators}/
  tests/
frontend/
  src/{components,context,features,hooks,layouts,pages,routes,utils}/
  tests/
README.md
SOLUTION.md
AI_USAGE.md
```

The project is a monorepo with separate `frontend/` and `backend/` applications. The repository's present files should be treated as authoritative if this abbreviated tree changes.

## 6. Local setup and idempotent seed command

Requirements: Node.js, npm, MySQL, and MongoDB. Configure the variables in `backend/.env.example` in `backend/.env`; configure the frontend API base URL using `frontend/.env.example` in `frontend/.env`. Keep real credentials out of Git.

```sh
cd backend
npm install
npm run prisma:generate
npm run prisma:migrate
npm run seed
npm run dev
```

In a second terminal:

```sh
cd frontend
npm install
npm run dev
```

The backend listens on port 5000 by default and Vite on port 5173. Run `npm run seed` from `backend/` to seed both databases. User seeding uses upserts, resources are matched by name before insert/update, and ticket records use `externalId` with upsert semantics, so repeated runs do not create duplicate seed records. The seed command and sample values are defined in `backend/src/seeds/`.

## 7. Database schema

The assessment's logical entities and API names are:

- **User (MySQL):** `id`, `name`, `email`, `passwordHash`, `role`, `createdAt`. Password hashes are not returned by the API.
- **Resource (MySQL):** `id`, `name`, `type`, `capacity`, `description`, `isActive`, `createdAt`. The implementation schema also has a `location` field.
- **Booking (MySQL):** `id`, `resourceId`, `userId`, `ticketId`, `startTime`, `endTime`, `purpose`, `status`, `decisionNote`, `createdAt`.
- **Ticket (MongoDB):** `id`, `externalId`, `subject`, `body`, `autoCategory`, `category`, `isHumanOverride`, `priority`, `status`, `assigneeId`, `isReviewed`, `createdAt`, `updatedAt`.
- **TicketEvent (MongoDB):** `id`, `ticketId`, `field`, `oldValue`, `newValue`, `actor`, `createdAt`.

Ticket categories: `BILLING`, `BUG`, `FEATURE_REQUEST`, `LOGIN`, `DELIVERY`. Priorities: `LOW`, `MEDIUM`, `HIGH`, `URGENT`. Ticket statuses: `OPEN`, `IN_PROGRESS`, `RESOLVED`, `CLOSED`. Resource types: `ROOM`, `LAB`, `EQUIPMENT`. Booking statuses: `PENDING`, `APPROVED`, `REJECTED`, `CANCELLED`.

The Prisma schema and migrations are under `backend/src/prisma/`; Mongoose models are under `backend/src/models/mongodb/`.

## 8. API summary

Base path: `/api`. Protected routes use `Authorization: Bearer <token>`.

| Method | Path | Purpose / access |
|---|---|---|
| POST | `/auth/register` | Register USER |
| POST | `/auth/login` | Log in |
| GET | `/auth/me` | Current user |
| POST / GET | `/tickets/import`, `/tickets` | Import feed / list and filter tickets |
| GET / PATCH | `/tickets/:id` | Ticket detail / agent update |
| GET | `/stats` | Ticket statistics |
| GET | `/resources` | List resources |
| GET / POST | `/resources/:id`, `/resources` | Resource detail / ADMIN create |
| PATCH | `/resources/:id` | ADMIN resource update |
| GET | `/resources/:id/availability` | Resource slot availability |
| POST | `/bookings` | Request a booking |
| GET | `/bookings/mine` | List own bookings |
| GET | `/bookings/:id` | Owner or ADMIN booking detail |
| GET | `/bookings` | ADMIN booking list |
| PATCH | `/bookings/:id/cancel` | Owner cancellation |
| PATCH | `/bookings/:id/approve` | ADMIN approval |
| PATCH | `/bookings/:id/reject` | ADMIN rejection with note |
| GET | `/admin/stats` | ADMIN analytics |

List endpoints are paginated. See `SOLUTION.md` and the route/controller code for implementation details and any assessment-contract gaps that remain.

## 9. Completed features checklist

Status here describes repository evidence, not a claim that the deployed assessment has passed external evaluation.

- [x] Seed scripts provide assessment accounts, six resources, and twenty tickets; seed operations are repeatable.
- [x] Ticket import, deterministic category/priority classification, and separate original/current category fields are implemented.
- [x] Ticket filters, ticket event model, resource and booking routes, and booking concurrency service are present.
- [x] Frontend includes login/register, ticket queue/detail, resource browsing/detail, and booking/admin pages.
- [ ] Verify all 21 API routes against the assessment contract and deployed database.
- [ ] Record actual before/after latency for `GET /api/tickets?limit=100` on 500+ tickets in `SOLUTION.md`.
- [ ] Verify optimistic update rollback, XSS rendering, responsive widths, and ten-request booking race behavior in the deployed app.
- [ ] Add live HTTPS URLs and verify the deployment remains available for the required period.

## 10. Known limitations

- No live deployment URLs or measured latency results are recorded in this repository documentation yet.
- MySQL and MongoDB operations cannot be committed atomically together; cross-store consistency relies on application logic.
- The current database schema includes implementation fields beyond the brief's minimum fields (for example resource `location`). Confirm all serialized API fields and error/check ordering against Section 7 before submission.
- The rule-based classifier is deterministic keyword matching, not a trained model.
- `SOLUTION.md` identifies the remaining measurement and implementation evidence to record rather than inventing results.
