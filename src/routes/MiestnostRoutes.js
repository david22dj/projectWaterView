import express from "express";
import { MiestnostController } from "../controllers/MiestnostController.js";

const router = express.Router();

router.get("/rooms", MiestnostController.getAll);
router.post("/rooms", MiestnostController.create);
router.delete("/rooms/:id", MiestnostController.delete);

export default router;
