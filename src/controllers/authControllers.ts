import jwt , {JwtPayload} from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../models/userModel";

dotenv.config();

// Controlador para el inicio de sesión
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "El Usuario o Contraseña es Incorrecta" });
      console.log("USUARIO ENCONTRADO");
    }
    else{
      console.log("USUARIO ENCONTRADO");
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password); // Supone que tienes comparePassword implementado en el modelo
    if (!isMatch) {
      return res.status(400).json({ message: "El Usuario o Contraseña es Incorrecta" });
      console.log("USUARIO NO CORRECTA");
    }
    else{
      console.log("USUARIO CORRECTA");
    }

    // Generar el token JWT incluyendo roles
    const token = jwt.sign(
      { _id: user._id, username: user.username, roles: user.roles }, // Incluir roles en el token
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Establecer la cookie HTTP-Only
    res.cookie("token", token, {
      httpOnly: true, // No accesible desde JavaScript
      secure: process.env.NODE_ENV === "production", // Solo en HTTPS en producción
      sameSite: "strict", // Protege contra CSRF
      path: "/", // Disponible en toda la aplicación
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.status(200).json({ message: "Autenticación exitosa" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Controlador para registrar un nuevo usuario
export const register = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe por email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Crear un nuevo usuario, permitiendo personalizar los roles
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || ["viewer"], // Si no se proporcionan roles, se asigna "viewer" como predeterminado
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    // Generar token JWT después del registro
    const token = jwt.sign(
      { _id: newUser._id, username: newUser.username, roles: newUser.roles },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Establecer la cookie HTTP-Only
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 60 * 60 * 1000, // 1 hora
    });

    res.status(201).json({ message: "Usuario creado y autenticado exitosamente" });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};

// Controlador para cerrar sesión
export const logout = (req: Request, res: Response) => {
  // Eliminar la cookie estableciendo una fecha de expiración pasada
  res.cookie("token", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    path: "/",
    expires: new Date(0), // Expira inmediatamente
  });

  res.status(200).json({ message: "Sesión cerrada exitosamente" });
};

export const checkAuth = (req: Request, res: Response) => {
  try {
    const token = req.cookies.token;

    if (!token) {
      return res
        .status(401)
        .json({ authenticated: false, message: "No autorizado: token no encontrado" });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret",
      (err: Error | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          return res.status(401).json({ authenticated: false, message: "Token no válido" });
        }

        res.status(200).json({ authenticated: true, user: decoded });
      }
    );
  } catch (error) {
    res.status(500).json({ authenticated: false, message: "Error interno del servidor" });
  }
};