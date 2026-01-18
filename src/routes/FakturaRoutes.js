import express from "express";
import { FakturaController } from "../controllers/FakturaController.js";
import { uploadFaktura } from "../middleware/uploadFaktura.js";
import { requireAuth } from "../middleware/auth.js";

const router = express.Router();

router.post("/faktury", requireAuth, uploadFaktura.single("file"), FakturaController.upload);
router.get("/faktury", requireAuth, FakturaController.list);
router.get("/faktury/:id/download", requireAuth, FakturaController.download);
router.put("/faktury/:id", requireAuth, FakturaController.update);
router.delete("/faktury/:id", requireAuth, FakturaController.delete);

export default router;
