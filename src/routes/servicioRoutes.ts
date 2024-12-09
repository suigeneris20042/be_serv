import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAllServicios,
  createServicio,
  getServicioById,
  updateServicio,
  deleteServicio,
  getAniosServicios,
  getServiciosPorAnio,
} from "../controllers/servicioControllers";
import { authenticate, authorize } from "../middleware/authMiddleware";
import { validateFields } from "../middleware/validateFields";

const router = Router();

// Rutas públicas
router.get(
  "/anios/:anio",
  [
    param("anio").isNumeric().withMessage("El año debe ser un valor numérico"),
    validateFields,
  ],
  getServiciosPorAnio
);

router.get("/anios", getAniosServicios);

router.get("/", validateFields, getAllServicios);

// Rutas protegidas
router.post(
  "/",
  authenticate,
  authorize(["admin", "editor"]),
  [
    body("nombre")
      .isString()
      .notEmpty()
      .withMessage("El nombre es obligatorio"),
    body("descripcion")
      .isString()
      .withMessage("La descripción debe ser un texto"),
    body("fecha_inicio")
      .isISO8601()
      .withMessage("La fecha de inicio debe ser una fecha válida"),
    body("fecha_fin")
      .optional()
      .isISO8601()
      .withMessage("La fecha de fin debe ser una fecha válida"),
    validateFields,
  ],
  createServicio
);

router.get(
  "/:id",
  authenticate,
  authorize(["admin", "editor", "viewer"]),
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID válido"),
    validateFields,
  ],
  getServicioById
);

router.put(
  "/:id",
  authenticate,
  authorize(["admin", "editor"]),
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID válido"),
    body("nombre")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("El nombre debe ser un texto válido"),
    body("descripcion")
      .optional()
      .isString()
      .withMessage("La descripción debe ser un texto válido"),
    body("fecha_inicio")
      .optional()
      .isISO8601()
      .withMessage("La fecha de inicio debe ser una fecha válida"),
    body("fecha_fin")
      .optional()
      .isISO8601()
      .withMessage("La fecha de fin debe ser una fecha válida"),
    validateFields,
  ],
  updateServicio
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID válido"),
    validateFields,
  ],
  deleteServicio
);

export default router;
