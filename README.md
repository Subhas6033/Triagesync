# TriageSync

**Smart Support Ticket Triage & Resource Slot Booking System**

TriageSync is a full-stack web application designed to simplify customer support ticket management and resource booking.

The application automatically classifies support tickets based on their content, assigns priority levels, allows administrators to review and manage tickets, and provides a resource booking system with availability and conflict prevention.

---

## 1. Project Overview

TriageSync provides two primary functionalities:

### Smart Ticket Triage

- Automatically classify incoming support tickets.
- Assign priority levels based on ticket content.
- Allow administrators to review and override automatic classifications.
- Maintain an audit history of ticket changes.
- Search and filter tickets.
- Prevent duplicate tickets during repeated imports.

### Resource Slot Booking

- Browse available rooms, laboratories, and equipment.
- Check resource availability.
- Request resource bookings.
- Prevent overlapping bookings.
- Allow administrators to approve or reject booking requests.
- Allow users to view and cancel their own bookings.

### User Roles

| Role  | Permissions                                                                                       |
| ----- | ------------------------------------------------------------------------------------------------- |
| USER  | Register, log in, browse resources, create bookings, view and cancel own bookings                 |
| ADMIN | Manage tickets, review classifications, manage resources, approve/reject bookings, view analytics |

Public registration is restricted to the USER role. ADMIN accounts are created through database seeding.

---

## 2. Technology Stack

### Frontend

- React
- Vite
- Tailwind CSS
- React Router
- TanStack Query
- Axios
- React Hook Form
- Zod
- Lucide React
- Recharts

### Backend

- Node.js
- Express.js
- JavaScript ES Modules
- MongoDB with Mongoose
- MySQL 8 with Prisma ORM
- JWT Authentication
- bcrypt Password Hashing
- Zod Validation
- Helmet
- CORS
- Morgan

### Database Architecture

TriageSync uses a hybrid database architecture.

**MySQL + Prisma**

- Users
- Resources
- Bookings
- Booking relationships

**MongoDB + Mongoose**

- Support Tickets
- Ticket Events
- Ticket Audit History

Express services coordinate operations between the two databases.

MySQL and MongoDB do not share cross-database foreign keys. References between their records are validated by backend services.

---

## 3. Project Structure

```text
Triagesync/
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── layouts/
│   │   ├── hooks/
│   │   ├── services/
│   │   ├── context/
│   │   ├── routes/
│   │   └── main.jsx
│   └── package.json
│
├── backend/
│   ├── src/
│   │   ├── config/
│   │   ├── controllers/
│   │   ├── middleware/
│   │   ├── models/
│   │   │   └── mongodb/
│   │   ├── prisma/
│   │   │   ├── migrations/
│   │   │   └── schema.prisma
│   │   ├── repositories/
│   │   │   ├── mongodb/
│   │   │   └── mysql/
│   │   ├── routes/
│   │   ├── seeds/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── validators/
│   │   ├── app.js
│   │   └── server.js
│   │
│   ├── tests/
│   ├── package.json
│   └── .env.example
│
├── README.md
├── SOLUTION.md
├── AI_USAGE.md
├── .gitignore
└── .env.example
```

---

## 4. Prerequisites

Install the following before running the project:

- Node.js (LTS)
- npm
- MySQL 8
- MongoDB or MongoDB Atlas
- Git

Verify your installation:

```bash
node --version
npm --version
git --version
```

---

## 5. Environment Configuration

Create a `.env` file inside the backend directory.

Location:

```text
backend/.env
```

Example configuration:

```env
PORT=5000
NODE_ENV=development

DATABASE_URL="mysql://USERNAME:PASSWORD@localhost:3306/triagesync"

MONGODB_URI="mongodb+srv://USERNAME:PASSWORD@CLUSTER/triagesync"

JWT_SECRET="replace_with_a_random_secret_at_least_32_characters"
JWT_EXPIRES_IN="24h"

CLIENT_URL="http://localhost:5173"
```

Replace the database credentials and connection strings with your own values.

**Important:**

- Never commit `.env` files.
- Never expose database passwords or JWT secrets.
- Keep `.env.example` in Git with placeholder values.

---

## 6. Installation and Local Setup

Clone the repository:

```bash
git clone https://github.com/YOUR_USERNAME/engnf1-fullstack-YOUR_GITHUB_USERNAME.git

cd Triagesync
```

### Backend Setup

```bash
cd backend

npm install
```

Generate the Prisma client:

```bash
npx prisma generate
```

Run database migrations:

```bash
npx prisma migrate dev
```

Seed the databases:

```bash
npm run seed
```

Start the backend development server:

```bash
npm run dev
```

Backend default URL:

```text
http://localhost:5000
```

### Frontend Setup

Open another terminal:

```bash
cd frontend

npm install

npm run dev
```

Frontend default URL:

```text
http://localhost:5173
```

---

## 7. Seeded Test Accounts

The development database includes the following test accounts.

| Role  | Email                 | Password  |
| ----- | --------------------- | --------- |
| ADMIN | admin@triagesync.test | Admin@123 |
| USER  | user@triagesync.test  | User@123  |

These are development and assessment credentials only.

Change passwords and use secure environment configuration before production deployment.

---

## 8. Database Design

### MySQL Models

**User**

- id
- name
- email
- password
- role
- createdAt
- updatedAt

**Resource**

- id
- name
- description
- type
- capacity
- location
- isActive
- createdAt
- updatedAt

**Booking**

- id
- userId
- resourceId
- startTime
- endTime
- purpose
- status
- ticketId
- rejectionNote
- createdAt
- updatedAt

### MongoDB Models

**Ticket**

- externalId
- subject
- body
- autoCategory
- category
- isHumanOverride
- priority
- status
- assigneeId
- isReviewed
- createdAt
- updatedAt

**TicketEvent**

- ticketId
- field
- oldValue
- newValue
- actorId
- createdAt

### Ticket Categories

- BILLING
- LOGIN
- DELIVERY
- BUG
- FEATURE_REQUEST

### Ticket Priorities

- URGENT
- HIGH
- MEDIUM
- LOW

### Booking Statuses

- PENDING
- APPROVED
- REJECTED
- CANCELLED

---

## 9. API Documentation

Base URL:

```text
http://localhost:5000/api
```

### Authentication

| Method | Endpoint       | Description                    |
| ------ | -------------- | ------------------------------ |
| POST   | /auth/register | Register a user                |
| POST   | /auth/login    | Authenticate user              |
| GET    | /auth/me       | Get current authenticated user |

### Tickets

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| POST   | /tickets/import | Import support tickets  |
| GET    | /tickets        | List and filter tickets |
| GET    | /tickets/:id    | Get ticket details      |
| PATCH  | /tickets/:id    | Update ticket           |
| GET    | /stats          | Get ticket statistics   |

### Resources

| Method | Endpoint                    | Description             |
| ------ | --------------------------- | ----------------------- |
| GET    | /resources                  | List resources          |
| GET    | /resources/:id              | Get resource details    |
| POST   | /resources                  | Create resource (ADMIN) |
| PATCH  | /resources/:id              | Update resource (ADMIN) |
| GET    | /resources/:id/availability | Check availability      |

### Bookings

| Method | Endpoint              | Description               |
| ------ | --------------------- | ------------------------- |
| POST   | /bookings             | Create booking            |
| GET    | /bookings/mine        | Get own bookings          |
| GET    | /bookings/:id         | Get booking details       |
| GET    | /bookings             | List all bookings (ADMIN) |
| PATCH  | /bookings/:id/cancel  | Cancel own booking        |
| PATCH  | /bookings/:id/approve | Approve booking (ADMIN)   |
| PATCH  | /bookings/:id/reject  | Reject booking (ADMIN)    |

### Admin

| Method | Endpoint     | Description         |
| ------ | ------------ | ------------------- |
| GET    | /admin/stats | Get admin analytics |

All protected endpoints require a JWT access token:

```http
Authorization: Bearer YOUR_JWT_TOKEN
```

---

## 10. Automatic Ticket Classification

TriageSync uses a rule-based classification engine.

### Category Rules

| Keywords                                       | Category        |
| ---------------------------------------------- | --------------- |
| refund, invoice, charge, payment               | BILLING         |
| password, 2fa, sign in, locked out, login      | LOGIN           |
| package, arrived, shipping, tracking, delivery | DELIVERY        |
| crash, error, 500, exception, broken           | BUG             |
| Other requests                                 | FEATURE_REQUEST |

### Priority Rules

| Keywords                            | Priority |
| ----------------------------------- | -------- |
| urgent, production down, locked out | URGENT   |
| error, refund, not arrived          | HIGH     |
| Other requests                      | MEDIUM   |

Human category overrides must be preserved during subsequent ticket imports.

The original automatic classification is stored separately in `autoCategory`.

---

## 11. Booking Validation and Concurrency

The booking system is designed to prevent conflicting reservations.

Validation rules include:

- Booking duration must be between 30 and 240 minutes.
- Booking times must use valid 30-minute intervals.
- Start time must be in the future.
- Bookings cannot be more than 30 days ahead.
- Only active resources can be booked.
- Users can have at most three future PENDING or APPROVED bookings.
- Overlapping PENDING and APPROVED bookings are not allowed.
- Back-to-back bookings are allowed.

The backend uses MySQL transactions and resource-row locking to protect booking creation against concurrent requests.

---

## 12. Testing

Backend tests use Node.js's built-in test runner.

Run all backend tests:

```bash
cd backend

npm test
```

Current test coverage includes:

- Authentication
- Booking operations
- Booking concurrency
- Resource operations
- Ticket classification
- Ticket model validation
- Ticket event model validation

Latest recorded test result:

```text
Tests: 37
Passed: 37
Failed: 0
```

This result reflects the test run during development. Run the suite again after making changes.

---

## 13. Deployment

The application is designed for deployment using:

| Component | Suggested platform                        |
| --------- | ----------------------------------------- |
| Frontend  | Vercel                                    |
| Backend   | Render                                    |
| MySQL     | Railway or another managed MySQL provider |
| MongoDB   | MongoDB Atlas                             |

Production deployment requires:

- Configured production environment variables.
- Persistent database instances.
- Successful database migrations.
- Seeded initial data.
- HTTPS frontend and backend URLs.
- Correct CORS configuration.
- Verified authentication and authorization.
- Successful production build and API tests.

### Live Application

Frontend: TO BE ADDED

Backend: TO BE ADDED

GitHub Repository: TO BE ADDED

---

## 14. Known Limitations

This section should be updated as development progresses.

- Ticket import and audit workflows require integration testing against MongoDB.
- Frontend functionality and production deployment links must be verified before submission.
- Hybrid database operations require application-level coordination because MySQL and MongoDB do not share a transaction.
- Automated classification currently uses keyword-based rules rather than a trained machine learning model.

---

## 15. Future Improvements

Potential future enhancements include:

- Machine-learning-based ticket classification.
- Automated ticket assignment.
- Email notifications for booking decisions.
- Advanced analytics dashboards.
- Ticket response-time tracking.
- Resource utilization reports.
- More comprehensive automated integration testing.

---

## 16. Author

**Project:** TriageSync

**Developer:** Subhas Mondal

---

## License

This project was developed as part of an individual full-stack development assessment.
