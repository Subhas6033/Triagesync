import { Router } from "express";

import {
  getResources,
  getResourceById,
  createResource,
  updateResource,
  getResourceAvailabilityById,
} from "../controllers/resource.controller.js";

import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";
import { validate } from "../middleware/validate.middleware.js";

import {
  createResourceSchema,
} from "../validators/resource.validator.js";

const router = Router();

router.use(authenticate);

// Public-to-authenticated resource operations.
router.get("/", getResources);

// Keep this route before /:id.
router.get("/:id/availability", getResourceAvailabilityById);
router.get("/:id", getResourceById);

// Admin-only resource management.
router.post(
  "/",
  authorizeRoles("ADMIN"),
  validate(createResourceSchema),
  createResource,
);

router.patch(
  "/:id",
  authorizeRoles("ADMIN"),
  updateResource,
);

export default router;
