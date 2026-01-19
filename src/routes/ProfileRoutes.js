/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import { ProfileController } from "../controllers/ProfileController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.put("/profile/email", requireAuth, ProfileController.updateEmail);
router.put("/profile/password", requireAuth, ProfileController.updatePassword);

export default router;
