import { Router } from "express";
import {
  getAllRoles,
  createRole,
  getRoleById,
  updateRole,
  deleteRole,
} from "../controllers/roleController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// Definir rutas para roles
router.get("/", authenticate, authorize(["super_admin"]), getAllRoles);
router.post("/", authenticate, authorize(["super_admin"]), createRole);
router.get("/:id", authenticate, authorize(["super_admin"]), getRoleById);
router.put("/:id", authenticate, authorize(["super_admin"]), updateRole);
router.delete("/:id", authenticate, authorize(["super_admin"]), deleteRole);

export { router as roleRoutes }; // Exportación nombrada
