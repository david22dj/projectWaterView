import express from "express";
import { ProfileController } from "../controllers/ProfileController.js";

const router = express.Router();

router.put("/profile/email", ProfileController.updateEmail);
router.put("/profile/password", ProfileController.updatePassword);

export default router;
