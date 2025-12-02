import express from "express";
import { PouzivatelController } from "../controllers/PouzivatelController.js";

const router = express.Router();

// GET /api/users
router.get("/users", PouzivatelController.getAll);

// POST /api/users
router.post("/users", PouzivatelController.create);

// DELETE /api/users/:id
router.delete("/users/:id", PouzivatelController.delete);

export default router;
