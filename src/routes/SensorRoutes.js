/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import { SensorController } from "../controllers/SensorController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/sensors", requireAuth, SensorController.getAll);
router.post("/sensors", requireAdmin, SensorController.create);
router.put("/sensors/:id", requireAdmin, SensorController.update);
router.delete("/sensors/:id", requireAdmin, SensorController.delete);

export default router;
