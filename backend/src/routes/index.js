import { Router } from "express";

import authRoutes from "./auth.routes.js";
import ticketRoutes from "./ticket.routes.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

import { getTicketDashboardStats } from "../controllers/ticket.controller.js";
import resourceRoutes from "./resource.routes.js";

const router = Router();

router.use("/auth", authRoutes);

router.use("/tickets", ticketRoutes);

router.get(
  "/stats",
  authenticate,
  authorizeRoles("ADMIN"),
  getTicketDashboardStats,
);

router.use("/resources", resourceRoutes);

export default router;
