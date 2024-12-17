import { Router } from "express";
import {
  getAniosServicios,
  getServiciosPorAnio,
  getAllServicios,
  createServicio,
  getServicioById,
  updateServicio,
  deleteServicio,
  getServiciosPorPublicador,
} from "../controllers/servicioControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { get } from "http";
import { validateFields } from "../middleware/validateFields";

const router = Router();

// Rutas públicas
router.get("/", validateFields, getAllServicios);
router.get("/anios/:anio", getServiciosPorAnio);
router.get("/publicador/:publicador",authenticate,authorize(["super_admin", "administrador_servicios", "publisher_servicios"]), getServiciosPorPublicador);
router.get("/anios", getAniosServicios);

// Rutas protegidas
router.post(
  "/",
  authenticate,
  authorize(["super_admin", "administrador_servicios", "publisher_servicios"]),
  createServicio
);
router.get(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_servicios"]),
  getServicioById
);
router.put(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_servicios"]),
  updateServicio
);
router.delete(
  "/:id",
  authenticate,
  authorize(["super_admin", "administrador_servicios"]),
  deleteServicio
);

export default router;
