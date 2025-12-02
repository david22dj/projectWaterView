import express from "express";
import { SensorController } from "../controllers/SensorController.js";

const router = express.Router();

router.get("/sensors", SensorController.getAll);
router.post("/sensors", SensorController.create);
router.delete("/sensors/:id", SensorController.delete);

export default router;
