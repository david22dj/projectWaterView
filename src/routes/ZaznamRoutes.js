import express from "express";
import { ZaznamController } from "../controllers/ZaznamController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/records", requireAuth, ZaznamController.getAll);
router.post("/records", requireAdmin, ZaznamController.create);
router.delete("/records/:id", requireAdmin, ZaznamController.delete);

export default router;
