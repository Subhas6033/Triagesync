import { Router } from "express";

import {
  importTicketData,
  getTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticket.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  importTicketsSchema,
  updateTicketSchema,
} from "../validators/ticket.validator.js";

const router = Router();

// All ticket operations require authentication.
router.use(authenticate);

// Only administrators can import or modify tickets.
router.post("/import", authorizeRoles("ADMIN"), validate(importTicketsSchema), importTicketData);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id", authorizeRoles("ADMIN"), validate(updateTicketSchema), updateTicket);

export default router;
