import { Router } from "express";

import { getAdminStats } from "../controllers/stats.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { authorizeRoles } from "../middleware/role.middleware.js";

const router = Router();

router.use(authenticate, authorizeRoles("ADMIN"));

router.get("/stats", getAdminStats);

export default router;
