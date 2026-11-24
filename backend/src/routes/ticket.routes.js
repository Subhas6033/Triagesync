import { Router } from "express";
import {
  importTicketData,
  getTickets,
  getTicketById,
  updateTicket,
} from "../controllers/ticket.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validate.middleware.js";
import {
  importTicketsSchema,
} from "../validators/ticket.validator.js";

const router = Router();

router.use(authenticate);

router.post("/import", validate(importTicketsSchema), importTicketData);
router.get("/", getTickets);
router.get("/:id", getTicketById);
router.patch("/:id", updateTicket);

export default router;
