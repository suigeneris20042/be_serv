import { Router } from "express";
import { body, param } from "express-validator";
import {
  getAllBienes,
  createBien,
  getBienById,
  updateBien,
  deleteBien,
  getAniosBienes,
  getBienesPorAnio,
} from "../controllers/bienController";
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
  getBienesPorAnio
);

router.get("/anios", getAniosBienes);

router.get("/", getAllBienes);

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
    body("ubicacion")
      .isString()
      .notEmpty()
      .withMessage("La ubicación es obligatoria"),
    body("fecha_adquisicion")
      .isISO8601()
      .withMessage("La fecha de adquisición debe ser válida"),
    validateFields,
  ],
  createBien
);

router.get(
  "/:id",
  authenticate,
  authorize(["admin", "editor", "viewer"]),
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID válido"),
    validateFields,
  ],
  getBienById
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
    body("ubicacion")
      .optional()
      .isString()
      .notEmpty()
      .withMessage("La ubicación debe ser válida"),
    body("fecha_adquisicion")
      .optional()
      .isISO8601()
      .withMessage("La fecha de adquisición debe ser válida"),
    validateFields,
  ],
  updateBien
);

router.delete(
  "/:id",
  authenticate,
  authorize(["admin"]),
  [
    param("id").isMongoId().withMessage("El ID debe ser un MongoID válido"),
    validateFields,
  ],
  deleteBien
);

export default router;
