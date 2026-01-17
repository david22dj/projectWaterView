import express from "express";
import { MiestnostController } from "../controllers/MiestnostController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/rooms", requireAuth, MiestnostController.getAll);
router.post("/rooms", requireAdmin, MiestnostController.create);
router.put("/rooms/:id", requireAdmin, MiestnostController.update);
router.delete("/rooms/:id", requireAdmin, MiestnostController.delete);

export default router;
