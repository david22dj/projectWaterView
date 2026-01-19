/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import { MiestoMeraniaController } from "../controllers/MiestoMeraniaController.js";
import { requireAuth, requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/measurements", requireAuth, MiestoMeraniaController.getAll);
router.post("/measurements", requireAdmin, MiestoMeraniaController.create);
router.put("/measurements/:id", requireAdmin, MiestoMeraniaController.update);
router.delete("/measurements/:id", requireAdmin, MiestoMeraniaController.delete);

export default router;
