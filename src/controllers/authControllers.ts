import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import { Request, Response } from "express";
import User from "../models/userModel";
import Role from "../models/roleModel"; // Asegúrate de importar el modelo de roles correctamente
import Permission from "../models/permisosModel"; // Asegúrate de importar el modelo de permisos correctamente


dotenv.config();

// Controlador para el inicio de sesión
export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  try {
    // Buscar usuario en la base de datos con roles poblados
    const user = await User.findOne({ email }).populate("roles", "roleName");
    if (!user) {
      return res
        .status(400)
        .json({ message: "El Usuario o Contraseña es Incorrecta" });
    }

    // Verificar la contraseña
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res
        .status(400)
        .json({ message: "El Usuario o Contraseña es Incorrecta" });
    }

    // Normalizar los roles
    const roles = Array.isArray(user.roles)
      ? user.roles.map((role: any) => role.roleName || role)
      : [];

    if (roles.length === 0) {
      return res.status(400).json({
        message: "El usuario no tiene roles asignados.",
      });
    }

    // Generar el token JWT
    const token = jwt.sign(
      { id: user._id, username: user.username, roles },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Configurar la cookie HTTP-Only con el token
    res.cookie("token", token, {
      httpOnly: true, // Solo accesible desde el servidor
      secure: process.env.NODE_ENV === "production", // Solo HTTPS en producción
      sameSite: "strict", // Prevención de ataques CSRF
      maxAge: 60 * 60 * 1000, // Expiración de 1 hora
    });

    res.status(200).json({
      message: "Autenticación exitosa",
      token,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        roles,
      },
    });
  } catch (error) {
    console.error("Error en el inicio de sesión:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Controlador para registrar un nuevo usuario
export const register = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Validar y asignar roles
    const assignedRoles = roles && Array.isArray(roles) ? roles : ["viewer"];

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password,
      roles: assignedRoles,
    });

    await newUser.save();

    // Generar el token JWT
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, roles: assignedRoles },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    // Configurar la cookie HTTP-Only con el token
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60 * 1000, // Expiración de 1 hora
    });

    res.status(201).json({
      message: "Usuario registrado exitosamente",
      token,
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: assignedRoles,
      },
    });
  } catch (error) {
    console.error("Error en el registro:", error);
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

// Controlador para verificar autenticación
/*export const checkAuth = (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No autorizado: token no encontrado",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret",
      (err: Error | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          return res
            .status(401)
            .json({ authenticated: false, message: "Token no válido" });
        }

        res.status(200).json({ authenticated: true, user: decoded });
      }
    );
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res
      .status(500)
      .json({ authenticated: false, message: "Error interno del servidor" });
  }
};*/
export const checkAuth = async (req: Request, res: Response) => {
  try {
    const token =
      req.cookies?.token || req.headers.authorization?.split(" ")[1];

    if (!token) {
      return res.status(401).json({
        authenticated: false,
        message: "No autorizado: token no encontrado",
      });
    }

    jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret",
      async (err: Error | null, decoded: JwtPayload | string | undefined) => {
        if (err) {
          return res
            .status(401)
            .json({ authenticated: false, message: "Token no válido" });
        }

        // Extraer los roles del token
        const roles = (decoded as JwtPayload)?.roles || [];
        if (!roles.length) {
          return res.status(403).json({
            authenticated: false,
            message: "No tienes roles asignados.",
          });
        }

        try {
          // Buscar los permisos asociados a los roles
          const userRoles = await Role.find({ roleName: { $in: roles } }).populate("permissions");

          // Construir la respuesta con roles y permisos
          const rolesWithPermissions = userRoles.map((role) => ({
            roleName: role.roleName,
            permissions: role.permissions.map((perm: any) => perm.name),
          }));

          res.status(200).json({
            authenticated: true,
            user: {
              id: (decoded as JwtPayload)?.id,
              username: (decoded as JwtPayload)?.username,
              roles: rolesWithPermissions, // Agregar permisos dentro de roles
            },
          });
        } catch (error) {
          console.error("Error al obtener permisos:", error);
          res.status(500).json({
            authenticated: true,
            user: decoded,
            message: "Error al obtener roles y permisos.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error en la autenticación:", error);
    res.status(500).json({
      authenticated: false,
      message: "Error interno del servidor",
    });
  }
};
