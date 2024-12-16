import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

// Interfaz personalizada extendiendo `Request`
interface CustomRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    [key: string]: any; // Permite agregar más propiedades si es necesario
  };
}

// Middleware de autenticación
// Interfaz personalizada extendiendo `Request`
interface CustomRequest extends Request {
  user?: {
    id: string;
    roles: string[];
    [key: string]: any; // Permite agregar más propiedades si es necesario
  };
}

// Middleware de autenticación
export const authenticate = (
  req: CustomRequest,
  res: Response,
  next: NextFunction
) => {
  // Leer el token del encabezado o de las cookies
  const authorizationHeader = req.headers["authorization"];
  const tokenFromHeader = authorizationHeader?.split(" ")[1]; // Bearer Token
  const tokenFromCookie = req.cookies?.token; // Cookie Token

  const token = tokenFromHeader || tokenFromCookie; // Usar cualquiera que esté disponible
  if (!token) {
    return res.status(403).json({ message: "No token provided" });
  }

  try {
    // Verificar el token JWT
    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "defaultsecret"
    ) as JwtPayload;

    // Adjuntar el usuario decodificado al objeto `req`
    req.user = {
      id: decoded.id,
      roles: decoded.roles, // Asegúrate de que contiene un array de strings
      ...decoded,
    };

    next();
  } catch (err) {
    console.error("Token verification failed:", err);
    return res.status(401).json({ message: "Invalid token" });
  }
};

// Middleware de autorización basado en roles
export const authorize = (requiredRoles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    // Asegurarse de que `req.user` existe y tiene roles
    if (!req.user || !req.user.roles) {
      return res.status(403).json({
        message: "No tienes permisos para acceder a esta ruta",
        requiredRoles,
        userRoles: [],
      });
    }

    // Verificar si el usuario tiene al menos uno de los roles requeridos
    const hasRole = req.user.roles.some((role: string) =>
      requiredRoles.includes(role)
    );

    if (!hasRole) {
      return res.status(403).json({
        message: "No tienes permisos para acceder a esta ruta",
        requiredRoles,
        userRoles: req.user.roles,
      });
    }

    next();
  };
};
