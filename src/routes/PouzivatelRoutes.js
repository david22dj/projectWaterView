/****************************************
 *  pri vytváraní tohoto súboru som si pomáhal s AI
 ****************************************/


import express from "express";
import { PouzivatelController } from "../controllers/PouzivatelController.js";
import { requireAdmin } from "../middleware/auth.js";

const router = express.Router();

router.get("/users", requireAdmin, PouzivatelController.getAll);
router.post("/users", requireAdmin, PouzivatelController.create);
router.put("/users/:id", requireAdmin, PouzivatelController.update);
router.delete("/users/:id", requireAdmin, PouzivatelController.delete);

// LOGIN ostáva verejný
router.post("/users/login", PouzivatelController.login);


export default router;
