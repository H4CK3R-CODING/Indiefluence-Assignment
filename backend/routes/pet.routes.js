// ============================================
// src/routes/pet.routes.js
// ============================================
import express from "express";
import {
  createPet,
  getPet,
  getAllPets,
  updatePet,
  deletePet,
} from "../controllers/pet.controller.js";
import { protect } from "../middleware/auth.middleware.js";
import { validate } from "../middleware/validation.middleware.js";
import { petSchema } from "../utils/validators.js";

const router = express.Router();

router.use(protect);

router.route("/").post(validate(petSchema), createPet).get(getAllPets);

router.route("/single").get(getPet);

router.route("/:petId").put(validate(petSchema), updatePet).delete(deletePet);

export default router;
