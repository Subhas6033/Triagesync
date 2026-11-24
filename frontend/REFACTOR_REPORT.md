# TriageSync frontend refactoring report

The frontend now uses the existing page, feature, shared component, layout, hook, context, infrastructure, and utility boundaries. All 12 pages were refactored, and all 44 previously empty source files have implementations. React, JavaScript/JSX, React Router, TanStack Query, Axios, Tailwind, and Lucide remain the stack. No dependencies were added, and no backend files were changed.

The working tree was clean before this task. Backend controllers, validators, and services were read only to verify the frontend contracts. No live backend records were changed during validation.

## Architecture and folder structure

```text
frontend/
├── src/
│   ├── components/
│   │   ├── common/       Shared controls, fields, dialogs, feedback, tables, pagination
│   │   ├── charts/       Accessible status, category, priority, and breakdown charts
│   │   └── layout/       App shell, auth shell, navigation, and protected route guard
│   ├── context/          Auth/toast providers and separate context objects
│   ├── features/
│   │   ├── auth/         Forms, session hook, existing auth API
│   │   ├── tickets/      Lists, cards, edit/import/history, queries and mutations
│   │   ├── bookings/     Shared user/admin views, actions, forms, queries and mutations
│   │   ├── resources/    Inventory, forms, availability agenda, queries and mutations
│   │   ├── dashboard/    Statistics hooks, summaries, and overview components
│   │   └── landing/      Existing landing content split into focused sections
│   ├── hooks/            Debounce, paginated queries, media queries, toast access
│   ├── lib/              Axios client, QueryClient, query-key configuration
│   ├── pages/            Route composition and page orchestration
│   ├── routes/           Central route configuration
│   ├── utils/            Status constants, response/date formatting, validation
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css         Consolidated design system and responsive rules
├── tests/
│   ├── architecture.test.mjs
│   ├── domain.test.mjs
│   └── browser-smoke.mjs
├── index.html
├── package.json
└── REFACTOR_REPORT.md
```

Pages do not import API services, Axios, or query infrastructure. Feature hooks own data requests and invalidation. Shared components contain generic presentation and accessibility behavior. Context objects live separately from providers so hooks can be reused without violating Fast Refresh or introducing import cycles.

## Newly created components

- [src/components/charts/BreakdownChart.jsx](src/components/charts/BreakdownChart.jsx)
- [src/components/common/Card.jsx](src/components/common/Card.jsx)
- [src/components/common/ConfirmDialog.jsx](src/components/common/ConfirmDialog.jsx)
- [src/components/common/DataTable.jsx](src/components/common/DataTable.jsx)
- [src/components/common/ErrorState.jsx](src/components/common/ErrorState.jsx)
- [src/components/common/FormField.jsx](src/components/common/FormField.jsx)
- [src/components/common/PageHeader.jsx](src/components/common/PageHeader.jsx)
- [src/components/common/SearchInput.jsx](src/components/common/SearchInput.jsx)
- [src/components/common/Skeleton.jsx](src/components/common/Skeleton.jsx)
- [src/features/auth/components/PasswordInput.jsx](src/features/auth/components/PasswordInput.jsx)
- [src/features/bookings/components/BookingList.jsx](src/features/bookings/components/BookingList.jsx)
- [src/features/dashboard/components/WorkspaceSnapshot.jsx](src/features/dashboard/components/WorkspaceSnapshot.jsx)
- [src/features/landing/components/LandingCTA.jsx](src/features/landing/components/LandingCTA.jsx)
- [src/features/landing/components/LandingFeatures.jsx](src/features/landing/components/LandingFeatures.jsx)
- [src/features/landing/components/LandingFooter.jsx](src/features/landing/components/LandingFooter.jsx)
- [src/features/landing/components/LandingHeader.jsx](src/features/landing/components/LandingHeader.jsx)
- [src/features/landing/components/LandingHero.jsx](src/features/landing/components/LandingHero.jsx)
- [src/features/landing/components/LandingWorkflow.jsx](src/features/landing/components/LandingWorkflow.jsx)
- [src/features/resources/components/ResourceDetails.jsx](src/features/resources/components/ResourceDetails.jsx)

Additional new modules and test files:

- [src/context/authState.js](src/context/authState.js)
- [src/context/toastState.js](src/context/toastState.js)
- [src/features/landing/landingContent.js](src/features/landing/landingContent.js)
- [src/hooks/useListQuery.js](src/hooks/useListQuery.js)
- [src/hooks/useMediaQuery.js](src/hooks/useMediaQuery.js)
- [src/hooks/useToast.js](src/hooks/useToast.js)
- [src/utils/validation.js](src/utils/validation.js)
- [tests/architecture.test.mjs](tests/architecture.test.mjs)
- [tests/browser-smoke.mjs](tests/browser-smoke.mjs)
- [tests/domain.test.mjs](tests/domain.test.mjs)

## Previously empty files implemented

- [src/components/charts/CategoryChart.jsx](src/components/charts/CategoryChart.jsx)
- [src/components/charts/PriorityChart.jsx](src/components/charts/PriorityChart.jsx)
- [src/components/charts/StatusChart.jsx](src/components/charts/StatusChart.jsx)
- [src/components/common/Badge.jsx](src/components/common/Badge.jsx)
- [src/components/common/Button.jsx](src/components/common/Button.jsx)
- [src/components/common/EmptyState.jsx](src/components/common/EmptyState.jsx)
- [src/components/common/Input.jsx](src/components/common/Input.jsx)
- [src/components/common/Loader.jsx](src/components/common/Loader.jsx)
- [src/components/common/Modal.jsx](src/components/common/Modal.jsx)
- [src/components/common/Pagination.jsx](src/components/common/Pagination.jsx)
- [src/components/common/Select.jsx](src/components/common/Select.jsx)
- [src/components/layout/AuthLayout.jsx](src/components/layout/AuthLayout.jsx)
- [src/features/auth/components/LoginForm.jsx](src/features/auth/components/LoginForm.jsx)
- [src/features/auth/components/RegisterForm.jsx](src/features/auth/components/RegisterForm.jsx)
- [src/features/auth/hooks/useAuth.js](src/features/auth/hooks/useAuth.js)
- [src/features/bookings/components/BookingActions.jsx](src/features/bookings/components/BookingActions.jsx)
- [src/features/bookings/components/BookingCard.jsx](src/features/bookings/components/BookingCard.jsx)
- [src/features/bookings/components/BookingForm.jsx](src/features/bookings/components/BookingForm.jsx)
- [src/features/bookings/components/BookingStatus.jsx](src/features/bookings/components/BookingStatus.jsx)
- [src/features/bookings/components/BookingTable.jsx](src/features/bookings/components/BookingTable.jsx)
- [src/features/bookings/hooks/useBookings.js](src/features/bookings/hooks/useBookings.js)
- [src/features/dashboard/components/ResourceOverview.jsx](src/features/dashboard/components/ResourceOverview.jsx)
- [src/features/dashboard/components/StatCard.jsx](src/features/dashboard/components/StatCard.jsx)
- [src/features/dashboard/components/TicketOverview.jsx](src/features/dashboard/components/TicketOverview.jsx)
- [src/features/dashboard/hooks/useDashboardStats.js](src/features/dashboard/hooks/useDashboardStats.js)
- [src/features/resources/components/AvailabilityCalendar.jsx](src/features/resources/components/AvailabilityCalendar.jsx)
- [src/features/resources/components/ResourceCard.jsx](src/features/resources/components/ResourceCard.jsx)
- [src/features/resources/components/ResourceForm.jsx](src/features/resources/components/ResourceForm.jsx)
- [src/features/resources/components/ResourceList.jsx](src/features/resources/components/ResourceList.jsx)
- [src/features/resources/hooks/useResources.js](src/features/resources/hooks/useResources.js)
- [src/features/tickets/components/TicketCard.jsx](src/features/tickets/components/TicketCard.jsx)
- [src/features/tickets/components/TicketDetails.jsx](src/features/tickets/components/TicketDetails.jsx)
- [src/features/tickets/components/TicketEditForm.jsx](src/features/tickets/components/TicketEditForm.jsx)
- [src/features/tickets/components/TicketFilters.jsx](src/features/tickets/components/TicketFilters.jsx)
- [src/features/tickets/components/TicketImport.jsx](src/features/tickets/components/TicketImport.jsx)
- [src/features/tickets/components/TicketTable.jsx](src/features/tickets/components/TicketTable.jsx)
- [src/features/tickets/components/TicketTimeline.jsx](src/features/tickets/components/TicketTimeline.jsx)
- [src/features/tickets/hooks/useTicketStats.js](src/features/tickets/hooks/useTicketStats.js)
- [src/features/tickets/hooks/useTickets.js](src/features/tickets/hooks/useTickets.js)
- [src/hooks/useDebounce.js](src/hooks/useDebounce.js)
- [src/pages/NotFoundPage.jsx](src/pages/NotFoundPage.jsx)
- [src/utils/constants.js](src/utils/constants.js)
- [src/utils/date.js](src/utils/date.js)
- [src/utils/formatters.js](src/utils/formatters.js)

## Reuse and duplication removed

| Area | Reused implementation and callers |
| --- | --- |
| Controls | Button, Input, Select, FormField, and Loader across auth, ticket, resource, and booking forms |
| Statuses | Badge and shared status configuration across tickets, bookings, resources, and dashboards |
| Page structure | PageHeader and Card throughout the workspace; AuthLayout for login and registration |
| Lists | DataTable for tickets and admin bookings; Pagination for ticket, resource, admin resource, user booking, and admin booking lists |
| Feedback | EmptyState, ErrorState, and Skeleton across list/detail screens |
| Dialogs | Modal for mobile navigation, import errors, and rejection; ConfirmDialog for cancellations and resource activation changes |
| Search | SearchInput for tickets and resources; useDebounce for resource search |
| Resources | ResourceList and ResourceCard for member and admin inventory; ResourceForm for creation and editing |
| Bookings | BookingList, BookingTable, BookingCard, BookingStatus, and BookingActions for member/admin views |
| Charts | BreakdownChart underneath CategoryChart, PriorityChart, and resource utilization; StatusChart for booking counts |
| Authentication | PasswordInput reused by LoginForm and RegisterForm; useAuth provides session behavior |
| Data | useListQuery preserves server pagination metadata; query keys share cached lists between dashboard and feature pages |

Removed duplicated inline auth forms, page headers, ticket tables, resource cards, booking rows, status maps, date conversions, response-envelope parsing, loading/error blocks, and rejection dialog markup. Removed the redundant AdminRoute in favor of ProtectedRoute's adminOnly option. Removed the duplicate `/stats` service function from dashboard.api.js; useTicketStats owns that endpoint. Replaced the monolithic/minified stylesheet and accumulated overrides with grouped shared styles. Removed verified obsolete styles, nonfunctional notification controls, and the unsupported help-center teaser; the header search now links to working ticket search.

No source files were deleted. Existing nonempty API service modules were retained; changes outside the duplicate statistics function are formatting only. lib/queryClient.js, features/auth/auth.api.js, and main.jsx continue to be reused unchanged.

## API contracts and preserved workflows

Existing route URLs and access permissions remain: `/`, `/login`, `/register`, `/dashboard`, `/tickets`, `/tickets/:id`, `/resources`, `/resources/:id`, `/bookings`, `/admin/resources`, and `/admin/bookings`. Unknown URLs now render the implemented NotFoundPage.

Authentication retains the login/register endpoints, token/accessToken response handling, existing localStorage keys, bearer headers, ADMIN role comparison, and login redirect on an expired session. Session changes clear cached private data; storage events synchronize sessions across tabs. A failed login remains on the login page with the server explanation. Registration confirmation appears after redirect, and protected deep links resume after login.

Ticket search, filters, pagination, JSON import, edits, assignee IDs, and audit history remain. Resource browsing, details, creation, editing, activation, and availability remain. Booking requests, member cancellation, admin approval/rejection, and decision reasons remain. Dashboard cards, review coverage, model agreement, category/priority charts, booking status counts, resource utilization, and recent tickets remain.

Contract mismatches discovered in the previous frontend were corrected against the existing backend:

- Ticket categories are BILLING, LOGIN, DELIVERY, BUG, and FEATURE_REQUEST; resource types are ROOM, LAB, and EQUIPMENT.
- Lists use the existing server `page`, `pageSize`, `total`, and filter parameters, so records beyond the first backend page are reachable. Server ordering remains intact.
- Availability uses ISO UTC `from` and `to` timestamps and a maximum seven-day elapsed window. The existing weekly reservations response is rendered as an accessible agenda.
- Booking inputs use local clock values and submit UTC timestamps. Validation reflects the backend's future-start, 30-day horizon, half-hour boundary, 30–240-minute duration, and overlap rules. Server-side conflict detection remains authoritative.
- Resource field limits, ticket import batch/record limits, password requirements, purpose lengths, and rejection-note lengths reflect backend validation.
- Human review reads `isReviewed`; rejection reasons read `decisionNote` while retaining the former `note` fallback.
- Approve/reject/cancel controls respect the backend's future-booking restriction.
- Administrator utilization uses the backend's `topResources` aggregate. Member booking counts use server totals for each status, rather than counting only a single returned page.

Mutations invalidate affected ticket/resource/booking lists, detail/availability queries, and dashboard statistics. Query failures have retry actions; mutation success notifications originate in feature hooks. No application page substitutes fixture data for API responses.

## UI and accessibility improvements

A consistent indigo/slate design system now covers typography, spacing, borders, radii, cards, buttons, fields, badges, dialogs, feedback, and toast notifications. Landing sections retain their content and anchors with reduced decorative gradients. The browser title and description identify TriageSync.

Desktop navigation is collapsible; mobile navigation uses the shared native dialog with keyboard focus containment, Escape handling, and focus restoration. Navigation remains role-aware with active states and a skip link. Auth forms share one layout, associated labels, password visibility controls, and accessible errors.

Ticket and admin booking tables become cards on narrow screens. Forms stack on small displays; dialogs scroll within the viewport. Charts expose their labels and counts as text. Reduced-motion preferences, visible focus states, meaningful empty states, and retry controls are supported.

## Validation

| Check | Result |
| --- | --- |
| Baseline lint | Two pre-existing Fast Refresh errors in AuthContext and ToastContext; both fixed |
| npm run lint | Passed after the refactor |
| npm test | Passed: two Node test files containing 19 checks; direct execution also verified all 19 individual checks |
| npm run build | Passed using the existing Vite/React compiler pipeline |
| Import and architecture checks | No empty source modules, unresolved relative imports, circular source dependencies, or direct API/query imports from pages |
| git diff --check | Passed |
| Browser workflow suite | Passed 15 workflow groups, including shared-cache navigation |
| Responsive checks | All 12 pages checked at 1440, 768, 390, and 320 pixels; no page-level horizontal overflow |
| Browser runtime checks | No page errors in the completed suite; authenticated requests retained bearer tokens |

The browser suite uses installed Playwright and Chrome with isolated intercepted API fixtures. It covers registration, failed login, protected deep links, ticket edits/import/search/filters/pagination, resource browsing and booking conflicts, booking creation/cancellation, keyboard dialogs, admin access restrictions, query retries, approval/rejection, resource create/edit/deactivate, mobile navigation, desktop collapse, and logout. Screenshots are stored in `/tmp/triagesync-qa` for this session.

Run normal checks with:

```sh
npm run lint
npm test
npm run build
```

Optional browser checks require an existing Playwright installation and Chrome. Start Vite with a fixture-only API base:

```sh
VITE_API_URL=http://127.0.0.1:5173/api npm run dev -- --host 127.0.0.1 --port 5173 --strictPort
PLAYWRIGHT_MODULE=/absolute/path/to/playwright/index.mjs node tests/browser-smoke.mjs
```

E2E_BROWSER can override the Chrome executable and E2E_BASE_URL can override the frontend address. Playwright is deliberately not added as an application dependency.

## Remaining limits

Browser workflows were exercised against contract-shaped fixtures, not authenticated live backend accounts. Live database persistence, concurrent reservation conflicts, deployment/CORS configuration, and real expired-token behavior still require integration testing against the running backend. The existing `.env` was not modified.

Availability displays the existing seven-day API window; bookings outside that window rely on the backend for authoritative overlap validation. Browser verification used Chromium only. No automated screen-reader or exhaustive accessibility audit was run. A separate connected browser logged a React DevTools extension backendManager.js error during hot reload; this was outside application code and was not reproduced in the isolated browser suite. These changes have not been committed, deployed, or published.

## Complete modified file inventory

Tracked files modified during this task:

- [index.html](index.html)
- [package.json](package.json)
- [src/App.jsx](src/App.jsx)
- [src/components/charts/CategoryChart.jsx](src/components/charts/CategoryChart.jsx)
- [src/components/charts/PriorityChart.jsx](src/components/charts/PriorityChart.jsx)
- [src/components/charts/StatusChart.jsx](src/components/charts/StatusChart.jsx)
- [src/components/common/Badge.jsx](src/components/common/Badge.jsx)
- [src/components/common/Button.jsx](src/components/common/Button.jsx)
- [src/components/common/EmptyState.jsx](src/components/common/EmptyState.jsx)
- [src/components/common/Input.jsx](src/components/common/Input.jsx)
- [src/components/common/Loader.jsx](src/components/common/Loader.jsx)
- [src/components/common/Modal.jsx](src/components/common/Modal.jsx)
- [src/components/common/Pagination.jsx](src/components/common/Pagination.jsx)
- [src/components/common/Select.jsx](src/components/common/Select.jsx)
- [src/components/layout/AppLayout.jsx](src/components/layout/AppLayout.jsx)
- [src/components/layout/AuthLayout.jsx](src/components/layout/AuthLayout.jsx)
- [src/components/layout/Navbar.jsx](src/components/layout/Navbar.jsx)
- [src/components/layout/ProtectedRoute.jsx](src/components/layout/ProtectedRoute.jsx)
- [src/components/layout/Sidebar.jsx](src/components/layout/Sidebar.jsx)
- [src/context/AuthContext.jsx](src/context/AuthContext.jsx)
- [src/context/ToastContext.jsx](src/context/ToastContext.jsx)
- [src/features/auth/components/LoginForm.jsx](src/features/auth/components/LoginForm.jsx)
- [src/features/auth/components/RegisterForm.jsx](src/features/auth/components/RegisterForm.jsx)
- [src/features/auth/hooks/useAuth.js](src/features/auth/hooks/useAuth.js)
- [src/features/bookings/bookings.api.js](src/features/bookings/bookings.api.js)
- [src/features/bookings/components/BookingActions.jsx](src/features/bookings/components/BookingActions.jsx)
- [src/features/bookings/components/BookingCard.jsx](src/features/bookings/components/BookingCard.jsx)
- [src/features/bookings/components/BookingForm.jsx](src/features/bookings/components/BookingForm.jsx)
- [src/features/bookings/components/BookingStatus.jsx](src/features/bookings/components/BookingStatus.jsx)
- [src/features/bookings/components/BookingTable.jsx](src/features/bookings/components/BookingTable.jsx)
- [src/features/bookings/hooks/useBookings.js](src/features/bookings/hooks/useBookings.js)
- [src/features/dashboard/components/ResourceOverview.jsx](src/features/dashboard/components/ResourceOverview.jsx)
- [src/features/dashboard/components/StatCard.jsx](src/features/dashboard/components/StatCard.jsx)
- [src/features/dashboard/components/TicketOverview.jsx](src/features/dashboard/components/TicketOverview.jsx)
- [src/features/dashboard/dashboard.api.js](src/features/dashboard/dashboard.api.js)
- [src/features/dashboard/hooks/useDashboardStats.js](src/features/dashboard/hooks/useDashboardStats.js)
- [src/features/resources/components/AvailabilityCalendar.jsx](src/features/resources/components/AvailabilityCalendar.jsx)
- [src/features/resources/components/ResourceCard.jsx](src/features/resources/components/ResourceCard.jsx)
- [src/features/resources/components/ResourceForm.jsx](src/features/resources/components/ResourceForm.jsx)
- [src/features/resources/components/ResourceList.jsx](src/features/resources/components/ResourceList.jsx)
- [src/features/resources/hooks/useResources.js](src/features/resources/hooks/useResources.js)
- [src/features/resources/resources.api.js](src/features/resources/resources.api.js)
- [src/features/tickets/components/TicketCard.jsx](src/features/tickets/components/TicketCard.jsx)
- [src/features/tickets/components/TicketDetails.jsx](src/features/tickets/components/TicketDetails.jsx)
- [src/features/tickets/components/TicketEditForm.jsx](src/features/tickets/components/TicketEditForm.jsx)
- [src/features/tickets/components/TicketFilters.jsx](src/features/tickets/components/TicketFilters.jsx)
- [src/features/tickets/components/TicketImport.jsx](src/features/tickets/components/TicketImport.jsx)
- [src/features/tickets/components/TicketTable.jsx](src/features/tickets/components/TicketTable.jsx)
- [src/features/tickets/components/TicketTimeline.jsx](src/features/tickets/components/TicketTimeline.jsx)
- [src/features/tickets/hooks/useTicketStats.js](src/features/tickets/hooks/useTicketStats.js)
- [src/features/tickets/hooks/useTickets.js](src/features/tickets/hooks/useTickets.js)
- [src/features/tickets/tickets.api.js](src/features/tickets/tickets.api.js)
- [src/hooks/useDebounce.js](src/hooks/useDebounce.js)
- [src/index.css](src/index.css)
- [src/lib/axios.js](src/lib/axios.js)
- [src/lib/queryKeys.js](src/lib/queryKeys.js)
- [src/pages/AdminBookingsPage.jsx](src/pages/AdminBookingsPage.jsx)
- [src/pages/AdminResourcesPage.jsx](src/pages/AdminResourcesPage.jsx)
- [src/pages/DashboardPage.jsx](src/pages/DashboardPage.jsx)
- [src/pages/LandingPage.jsx](src/pages/LandingPage.jsx)
- [src/pages/LoginPage.jsx](src/pages/LoginPage.jsx)
- [src/pages/MyBookingsPage.jsx](src/pages/MyBookingsPage.jsx)
- [src/pages/NotFoundPage.jsx](src/pages/NotFoundPage.jsx)
- [src/pages/RegisterPage.jsx](src/pages/RegisterPage.jsx)
- [src/pages/ResourceDetailsPage.jsx](src/pages/ResourceDetailsPage.jsx)
- [src/pages/ResourcesPage.jsx](src/pages/ResourcesPage.jsx)
- [src/pages/TicketDetailsPage.jsx](src/pages/TicketDetailsPage.jsx)
- [src/pages/TicketsPage.jsx](src/pages/TicketsPage.jsx)
- [src/routes/AppRouter.jsx](src/routes/AppRouter.jsx)
- [src/utils/constants.js](src/utils/constants.js)
- [src/utils/date.js](src/utils/date.js)
- [src/utils/formatters.js](src/utils/formatters.js)

New files are listed above. This report is also new. Deleted files: none.
