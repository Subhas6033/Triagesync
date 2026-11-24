import { Router } from "express";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createBooking,
  getMyBookings,
  getAllBookings,
  getBookingById,
  cancelMyBooking,
  approveBookingByAdmin,
  rejectBookingByAdmin,
} from "../controllers/booking.controller.js";

import {
  createBookingSchema,
  rejectBookingSchema,
} from "../validators/booking.validator.js";

const router = Router();

router.use(authenticate);

// User routes
router.post("/", validate(createBookingSchema), createBooking);
router.get("/mine", getMyBookings);
router.patch("/:id/cancel", cancelMyBooking);

// Admin routes
router.get("/", authorizeRoles("ADMIN"), getAllBookings);
router.patch("/:id/approve", authorizeRoles("ADMIN"), approveBookingByAdmin);
router.patch(
  "/:id/reject",
  authorizeRoles("ADMIN"),
  validate(rejectBookingSchema),
  rejectBookingByAdmin,
);

// Keep this after /mine and other named routes.
router.get("/:id", getBookingById);

export default router;
