import express from "express";
import { ZaznamController } from "../controllers/ZaznamController.js";

const router = express.Router();

router.get("/records", ZaznamController.getAll);
router.post("/records", ZaznamController.create);
router.delete("/records/:id", ZaznamController.delete);

export default router;
