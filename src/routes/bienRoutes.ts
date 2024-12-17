import { Router } from "express";
import {
  getAllBienes,
  createBien,
  getBienById,
  updateBien,
  deleteBien,
  getAniosBienes,
  getBienesPorAnio,
  getBienesPorPublicador
} from "../controllers/bienController";
import { authenticate, authorize } from "../middleware/authMiddleware";

const router = Router();

// Rutas públicas
router.get("/", getAllBienes);
router.get("/anios/:anio", getBienesPorAnio);
router.get("/publicador/:publicador",authenticate,authorize(["super_admin", "administrador_bienes", "publisher_bienes"]), getBienesPorPublicador);
router.get("/anios", getAniosBienes);

// Rutas protegidas
router.post(
  "/",
  authenticate,
  authorize(["super_admin", "administrador_bienes", "publisher_bienes"]),
  createBien
);
router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_bienes"]),
  getBienById
);
router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_bienes"]),
  updateBien
);
router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_bienes"]),
  deleteBien
);

export default router;
