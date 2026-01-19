/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import { AuthController } from "../controllers/AuthController.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.get("/auth/me", requireAuth, AuthController.me);
router.post("/auth/logout", requireAuth, AuthController.logout);

export default router;
