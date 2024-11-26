import { Request, Response } from 'express';
import Role from '../models/roleModel';

// Obtener todos los roles
export const getAllRoles = async (req: Request, res: Response) => {
  try {
    const roles = await Role.find();
    res.json(roles);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Crear un nuevo rol
export const createRole = async (req: Request, res: Response) => {
  try {
    const newRole = new Role(req.body);
    await newRole.save();
    res.status(201).json(newRole);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Obtener un rol por ID
export const getRoleById = async (req: Request, res: Response) => {
  try {
    const role = await Role.findById(req.params.id);
    if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(role);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

// Actualizar un rol por ID
export const updateRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json(role);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

// Eliminar un rol por ID
export const deleteRole = async (req: Request, res: Response) => {
  try {
    const role = await Role.findByIdAndDelete(req.params.id);
    if (!role) return res.status(404).json({ message: 'Rol no encontrado' });
    res.json({ message: 'Rol eliminado' });
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};
