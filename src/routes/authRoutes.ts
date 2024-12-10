import express from "express";
import {
  login,
  register,
  logout,
  checkAuth,
} from "../controllers/authControllers";

const router = express.Router();

// Rutas de autenticación
router.post("/login", login);
router.post("/register", register);
router.post("/logout", logout);
router.get("/check", checkAuth);

export default router;
