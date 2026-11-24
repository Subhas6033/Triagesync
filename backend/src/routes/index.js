import { Router } from "express";

import authRoutes from "./auth.routes.js";
import ticketRoutes from "./ticket.routes.js";
import resourceRoutes from "./resource.routes.js";
import bookingRoutes from "./booking.routes.js";
import adminStatsRoutes from "./stats.routes.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { getTicketDashboardStats } from "../controllers/ticket.controller.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/tickets", ticketRoutes);

// Existing ticket-dashboard statistics
router.get("/stats", authenticate, getTicketDashboardStats);

router.use("/resources", resourceRoutes);
router.use("/bookings", bookingRoutes);

// Admin-only analytics: GET /api/admin/stats
router.use("/admin", adminStatsRoutes);

export default router;
