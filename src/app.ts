import express from "express";
import mongoose from "mongoose";
import cors from "cors"; // Importar cors
import { roleRoutes } from "./routes/roleRoutes"; // Importar rutas de roles
import userRoutes from "./routes/userRoutes"; // Rutas de usuarios
import authRoutes from "./routes/authRoutes"; // Rutas de autenticación
import bienRoutes from "./routes/bienRoutes"; // Rutas de bienes
import servicioRoutes from "./routes/servicioRoutes"; // Rutas de servicios
import cookieParser from "cookie-parser"; // Importar cookie-parser

const app = express();

// Configuración de CORS para permitir cookies y credenciales
const corsOptions = {
  origin: "http://localhost:3000", // Dominio del frontend
  credentials: true, // Permitir el envío de cookies y credenciales
  optionsSuccessStatus: 200, // Asegura compatibilidad con navegadores antiguos
};

// Aplicar CORS globalmente a todas las rutas
app.use(cors(corsOptions));

// Middleware para parsear JSON
app.use(express.json());
//Midleware para manejar cookies
app.use(cookieParser()); 

// Usar las rutas
app.use("/api/roles", roleRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/bienes", bienRoutes);
app.use("/api/servicios", servicioRoutes);

// Conectar a MongoDB
mongoose
  .connect(
    process.env.MONGODB_URI || "mongodb://localhost:27017/bd_webservicios"
  )
  .then(() => console.log("Conectado a MongoDB"))
  .catch((err) => console.log("Error al conectar a MongoDB:", err));

// Iniciar servidor
app.listen(3001, () => {
  console.log("Servidor corriendo en el puerto 3001");
});
