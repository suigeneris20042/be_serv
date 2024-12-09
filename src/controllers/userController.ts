import { Request, Response } from "express";
import User from "../models/userModel";
import Role from "../models/roleModel";

// Obtener todos los usuarios con roles
export const getAllUsers = async (req: Request, res: Response) => {
  try {
    const users = await User.find().populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
    res.json(users);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Crear un nuevo usuario con roles
export const createUser = async (req: Request, res: Response) => {
  try {
    const { username, email, password, roles } = req.body;

    // Validar que los roles sean válidos
    if (roles && !Array.isArray(roles)) {
      return res.status(400).json({ message: "Roles debe ser un array" });
    }

    const roleDocuments = roles ? await Role.find({ _id: { $in: roles } }) : [];
    if (roles && roleDocuments.length !== roles.length) {
      return res
        .status(400)
        .json({ message: "Uno o más roles no son válidos" });
    }

    const newUser = new User({
      username,
      email,
      password,
      roles: roleDocuments.map((role) => role._id),
    });

    await newUser.save();

    res.status(201).json({
      newUser,
      message: "Usuario registrado exitosamente!",
    });
  } catch (err) {
    res.status(400).json({
      message:
        (err as Error).message || "El nombre de usuario o email ya está en uso",
    });
  }
};

// Obtener un usuario por ID con roles y permisos
export const getUserById = async (req: Request, res: Response) => {
  try {
    const user = await User.findById(req.params.id).populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Actualizar un usuario por ID
export const updateUser = async (req: Request, res: Response) => {
  try {
    const { roles } = req.body;

    // Validar roles si se proporcionan
    if (roles && !Array.isArray(roles)) {
      return res.status(400).json({ message: "Roles debe ser un array" });
    }

    const roleDocuments = roles ? await Role.find({ _id: { $in: roles } }) : [];
    if (roles && roleDocuments.length !== roles.length) {
      return res
        .status(400)
        .json({ message: "Uno o más roles no son válidos" });
    }

    const updatedUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        ...req.body,
        roles: roleDocuments.map((role) => role._id),
      },
      { new: true }
    ).populate({
      path: "roles",
      populate: {
        path: "permissions",
        model: "Permission",
      },
    });

    if (!updatedUser)
      return res.status(404).json({ message: "Usuario no encontrado" });

    res.json({ updatedUser, message: "Usuario actualizado exitosamente!" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Eliminar un usuario por ID
export const deleteUser = async (req: Request, res: Response) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user)
      return res.status(404).json({ message: "Usuario no encontrado" });
    res.json({ message: "Usuario eliminado exitosamente" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
