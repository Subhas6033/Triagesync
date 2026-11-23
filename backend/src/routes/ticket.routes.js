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

// All ticket endpoints require an authenticated admin.
router.use(authenticate, authorizeRoles("ADMIN"));

// Keep /import before /:id.
router.post("/import", validate(importTicketsSchema), importTicketData);

router.get("/", getTickets);

router.get("/:id", getTicketById);

router.patch("/:id", validate(updateTicketSchema), updateTicket);

export default router;
