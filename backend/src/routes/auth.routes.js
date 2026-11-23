import { Router } from "express";
import { register, login, me } from "../controllers/auth.controller.js";
import { authenticate } from "../middleware/auth.middleware.js";
import { registerSchema, loginSchema } from "../validators/auth.validator.js";
import { validate } from "../middleware/validate.middleware.js";

const router = Router();

router
  .post("/register", validate(registerSchema), register)
  .post("/login", validate(loginSchema), login)
  .get("/me", authenticate, me);

export default router;
