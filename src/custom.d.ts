import { IUser } from './models/userModel';  // Asegúrate de importar tu modelo de usuario o tipo

declare global {
  namespace Express {
    interface Request {
      user?: IUser;  // Ajusta el tipo si es necesario
    }
  }
}

