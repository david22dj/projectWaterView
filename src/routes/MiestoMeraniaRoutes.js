import express from "express";
import { MiestoMeraniaController } from "../controllers/MiestoMeraniaController.js";

const router = express.Router();

router.get("/measurements", MiestoMeraniaController.getAll);
router.post("/measurements", MiestoMeraniaController.create);
router.put("/measurements/:id", MiestoMeraniaController.update);
router.delete("/measurements/:id", MiestoMeraniaController.delete);

export default router;
