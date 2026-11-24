import { Routes, Route } from "react-router-dom";
import LandingPage from "../pages/LandingPage";
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import DashboardPage from "../pages/DashboardPage";
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
export default function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
      </Route>
      <Route element={<ProtectedRoute />}>
        <Route element={<AppLayout />}>
          <Route path="/dashboard" element={<DashboardPage />} />
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
  );
}
