import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

// Interfaz personalizada extendiendo `Request`
interface CustomRequest extends Request {
  user?: any;  // Aquí puedes especificar el tipo de `user` si lo conoces
}
// Middleware de autenticación
export const authenticate = (req: CustomRequest, res: Response, next: NextFunction) => {
  const token = req.headers['authorization'];
  
  if (!token) {
    return res.status(403).json({ message: 'No token provided' });
  }

  try {
    const decoded = jwt.verify(token.split(' ')[1], process.env.JWT_SECRET || 'defaultsecret');
    req.user = decoded;  // Guardar los datos decodificados en `req.user`
    next();  // Pasar al siguiente middleware o ruta
  } catch (err) {
    return res.status(401).json({ message: 'Invalid token' });
  }
};


// Ejemplo del middleware de autorización, que usa `req.user`
export const authorize = (roles: string[]) => {
  return (req: CustomRequest, res: Response, next: NextFunction) => {
    console.log('Roles del usuario:', req.user?.roles);  // Imprime los roles para verificar

    if (!req.user || !roles.some(role => req.user.roles.includes(role))) {
      return res.status(403).json({ message: 'No tienes permisos para acceder a esta ruta' });
    }
    next();
  };
};