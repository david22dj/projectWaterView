import express from "express";
import { VstupPicoController } from "../controllers/VstupPicoController.js";
import { sensorAuth } from "../middleware/sensorAuth.js";

const router = express.Router();

router.post("/pico-records", sensorAuth, VstupPicoController.create);

export default router;