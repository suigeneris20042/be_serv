import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';
import { Request, Response } from 'express';
import User from '../models/userModel';

dotenv.config();

export const login = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  // Buscar usuario en la base de datos
  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ message: 'Usuario no encontrado' });
  }

  // Verificar la contraseña
  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    return res.status(400).json({ message: 'Contraseña incorrecta' });
  }

  // Generar el token JWT incluyendo roles
  const token = jwt.sign(
    { _id: user._id, username: user.username, roles: user.roles },  // Incluir roles en el token
    process.env.JWT_SECRET || 'defaultsecret',
    { expiresIn: '1h' }
  );

  res.json({ token });
};

// Registro de usuario (signup)
export const register = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe por email
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Crear un nuevo usuario, permitiendo personalizar los roles
    const newUser = new User({
      username,
      email,
      password,
      roles: roles || ['viewer']  // Si no se proporcionan roles, se asigna "viewer" como predeterminado
    });

    // Guardar el usuario en la base de datos
    await newUser.save();

    res.status(201).json({ message: 'Usuario creado exitosamente' });
  } catch (error) {
    res.status(500).json({ message: (error as Error).message });
  }
};