import jwt, { JwtPayload } from "jsonwebtoken";
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
    console.error("Error al obtener usuarios:", err);
    res.status(500).json({ message: "Error interno al obtener usuarios" });
  }
};

// Crear un nuevo usuario con roles
// Crear un nuevo usuario con roles
export const createUser = async (req: Request, res: Response) => {
  const { username, email, password, roles } = req.body;

  try {
    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "El usuario ya existe" });
    }

    // Conjunto de roles válidos
    const validRoles = [
      "admin",
      "viewer",
      "administrador_bienes",
      "administrador_servicios",
      "publisher_bienes",
      "publisher_servicios",
    ];

    // Validar y asignar roles
    const assignedRoles =
      roles && Array.isArray(roles)
        ? roles.filter((role: string) => validRoles.includes(role)) // Filtrar roles válidos
        : ["viewer"];

    // Verificar si hay roles no válidos
    if (roles && assignedRoles.length !== roles.length) {
      return res.status(400).json({
        message: "Uno o más roles proporcionados no son válidos",
      });
    }

    // Crear nuevo usuario
    const newUser = new User({
      username,
      email,
      password,
      roles: assignedRoles,
    });

    await newUser.save();

    // Generar el token JWT (opcional)
    const token = jwt.sign(
      { id: newUser._id, username: newUser.username, roles: assignedRoles },
      process.env.JWT_SECRET || "defaultsecret",
      { expiresIn: "1h" }
    );

    res.status(201).json({
      message: "Usuario creado exitosamente",
      token, // Token opcional, si deseas devolverlo
      user: {
        id: newUser._id,
        username: newUser.username,
        email: newUser.email,
        roles: assignedRoles,
      },
    });
  } catch (error) {
    console.error("Error al crear el usuario:", error);
    res.status(500).json({
      message: (error as Error).message || "Error interno al crear el usuario",
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
    console.error("Error al obtener el usuario:", err);
    res.status(500).json({ message: "Error interno al obtener el usuario" });
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

    const roleDocuments = roles
      ? await Role.find({ roleName: { $in: roles } })
      : [];
    if (roles && roleDocuments.length !== roles.length) {
      return res
        .status(400)
        .json({ message: "Uno o más roles proporcionados no son válidos" });
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
    console.error("Error al actualizar el usuario:", err);
    res.status(500).json({ message: "Error interno al actualizar el usuario" });
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
    console.error("Error al eliminar el usuario:", err);
    res.status(500).json({ message: "Error interno al eliminar el usuario" });
  }
};
