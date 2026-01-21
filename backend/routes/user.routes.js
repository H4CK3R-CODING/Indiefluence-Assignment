// ============================================
// src/routes/user.routes.js
// ============================================
import express from "express";
import {
  createOrUpdateProfile,
  getProfile,
} from "../controllers/user.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { userProfileSchema } from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router
  .route("/")
  .post(validate(userProfileSchema), createOrUpdateProfile)
  .get(getProfile);

export default router;
