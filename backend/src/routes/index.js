import { Router } from "express";

import authRoutes from "./auth.routes.js";
import ticketRoutes from "./ticket.routes.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import { getTicketDashboardStats } from "../controllers/ticket.controller.js";
import resourceRoutes from "./resource.routes.js";
import bookingRoutes from "./booking.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/tickets", ticketRoutes);

router.get("/stats", authenticate, getTicketDashboardStats);

router.use("/resources", resourceRoutes);
router.use("/bookings", bookingRoutes);

export default router;
