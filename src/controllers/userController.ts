import { Request, Response } from "express";
import User from "../models/userModel";

export const getAllUsers = async (req: Request, res: Response) => {
  const users = await User.find();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  try {
    const newUser = new User(req.body);
    await newUser.save();
    res
      .status(201)
      .json({ newUser, message: "Usuario registrado exitosamente!" });
  } catch (err) {
    res.status(400).json({ message: "El nombre de usuario ya esta en uso" });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  const user = await User.findById(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json(user);
};

export const updateUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ user, message: "Usuario Actualizado" });
};

export const deleteUser = async (req: Request, res: Response) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado" });
};
