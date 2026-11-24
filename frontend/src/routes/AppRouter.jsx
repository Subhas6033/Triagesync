import { Routes, Route, Navigate } from "react-router-dom";
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
import ProtectedRoute from "../components/layout/ProtectedRoute";
import { useAuth } from "../context/AuthContext";
import AppLayout from "../components/layout/AppLayout";

function AdminRoute({ children }) { const { isAdmin } = useAuth(); return isAdmin ? children : <Navigate to="/dashboard" replace />; }
export default function AppRouter() {
 return <Routes><Route path="/" element={<LandingPage/>}/><Route path="/login" element={<LoginPage/>}/><Route path="/register" element={<RegisterPage/>}/>
 <Route element={<ProtectedRoute/>}><Route element={<AppLayout/>}><Route path="/dashboard" element={<DashboardPage/>}/><Route path="/resources" element={<ResourcesPage/>}/><Route path="/resources/:id" element={<ResourceDetailsPage/>}/><Route path="/bookings" element={<MyBookingsPage/>}/><Route path="/tickets" element={<TicketsPage/>}/><Route path="/tickets/:id" element={<TicketDetailsPage/>}/><Route path="/admin/resources" element={<AdminRoute><AdminResourcesPage/></AdminRoute>}/><Route path="/admin/bookings" element={<AdminRoute><AdminBookingsPage/></AdminRoute>}/></Route></Route><Route path="*" element={<Navigate to="/dashboard"/>}/></Routes>
}
