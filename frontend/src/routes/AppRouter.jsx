import { Suspense, lazy } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import Skeleton from "../components/common/Skeleton";
const LandingPage = lazy(() => import("../pages/LandingPage"));
const DashboardPage = lazy(() => import("../pages/DashboardPage"));
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import ResourcesPage from "../pages/ResourcesPage";
import ResourceDetailsPage from "../pages/ResourceDetailsPage";
import AdminResourcesPage from "../pages/AdminResourcesPage";
import MyBookingsPage from "../pages/MyBookingsPage";
import AdminBookingsPage from "../pages/AdminBookingsPage";
import TicketsPage from "../pages/TicketsPage";
import TicketDetailsPage from "../pages/TicketDetailsPage";
import NotFoundPage from "../pages/NotFoundPage";
import ProtectedRoute from "../components/layout/ProtectedRoute";
import AppLayout from "../components/layout/AppLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AppErrorBoundary from "../components/common/AppErrorBoundary";
import ForbiddenPage from "../pages/ForbiddenPage";
export default function AppRouter() {
  const { pathname } = useLocation();
  return (
    <AppErrorBoundary key={pathname}>
    <Routes>
      <Route path="/" element={<Suspense fallback={<Skeleton count={3} className="detail-skeleton" />}><LandingPage /></Suspense>} />
      <Route path="/forbidden" element={<ForbiddenPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<Suspense fallback={<Skeleton count={4} className="stat-skeleton" />}><DashboardPage /></Suspense>} />
          <Route path="/resources" element={<ResourcesPage />} />
          <Route path="/resources/:id" element={<ResourceDetailsPage />} />
          <Route path="/bookings" element={<MyBookingsPage />} />
          <Route path="/tickets" element={<TicketsPage />} />
          <Route path="/tickets/:id" element={<TicketDetailsPage />} />
          <Route element={<ProtectedRoute adminOnly />}>
            <Route path="/admin/resources" element={<AdminResourcesPage />} />
            <Route path="/admin/bookings" element={<AdminBookingsPage />} />
          </Route>
        </Route>
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
    </AppErrorBoundary>
  );
}
