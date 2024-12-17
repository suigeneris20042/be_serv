import { Request, Response } from "express";
import Role from "../models/roleModel";
import Permission from "../models/permisosModel";

// Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find().populate("permissions"); // Agrega los permisos asociados
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const createRole = async (req: Request, res: Response) => {
  const { roleName, permissions } = req.body;

  try {
   // console.log("Datos recibidos:", req.body);

    if (!roleName || !permissions || !Array.isArray(permissions)) {
      console.error("Validación fallida: roleName o permissions no válidos");
      return res.status(400).json({
        message:
          "roleName y permissions son obligatorios, y permissions debe ser un array",
      });
    }

    // Verifica que los permisos existan en la base de datos
    const validPermissions = await Permission.find({
      _id: { $in: permissions },
    });

    //console.log("Permisos válidos encontrados:", validPermissions);

    if (validPermissions.length !== permissions.length) {
      console.error("Uno o más permisos no son válidos");
      return res
        .status(400)
        .json({ message: "Uno o más permisos no son válidos" });
    }

    const newRole = new Role({
      roleName,
      permissions,
    });

    await newRole.save();
   // console.log("Nuevo rol creado:", newRole);

    res.status(201).json({ message: "Rol creado exitosamente", role: newRole });
  } catch (error) {
    console.error("Error al crear el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id).populate("permissions");
    if (!role) {
      return res.status(404).json({ message: "Rol no encontrado" });
    }
    res.json(role);
  } catch (error) {
    console.error("Error al obtener el rol:", error);
    res.status(500).json({ message: "Error interno del servidor" });
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
