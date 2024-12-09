import { Request, Response } from "express";
import Role from "../models/roleModel";

// Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().populate("permissions"); // Agrega los permisos asociados
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response) => {
  try {
    const { roleName, permissions } = req.body;

    // Validar que los campos obligatorios estén presentes
    if (!roleName || !permissions || !Array.isArray(permissions)) {
      return res.status(400).json({
        message:
          "roleName y permissions son obligatorios, y permissions debe ser un array",
      });
    }

    // Crear y guardar el rol
    const newRole = new Role({ roleName, permissions });
    await newRole.save();

    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions"); // Incluye permisos en la respuesta
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.json(role);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Actualizar un rol por ID
export const updateRole = async (req: Request, res: Response) => {
  try {
    const { roleName, permissions } = req.body;

    // Validar que los permisos sean un array si están presentes
    if (permissions && !Array.isArray(permissions)) {
      return res.status(400).json({ message: "permissions debe ser un array" });
    }

    // Actualizar el rol
    const role = await Role.findByIdAndUpdate(
      req.params.id,
      { roleName, permissions },
      { new: true, runValidators: true } // Valida los datos antes de guardar
    );

    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.json(role);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Eliminar un rol por ID
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: "Rol no encontrado" });

    res.json({ message: "Rol eliminado" });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
