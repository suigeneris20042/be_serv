import { Request, Response } from 'express';
import Bien from '../models/bienModel';





export const getAniosBienes = async (req: Request, res: Response) => {
  try {

    // Obtener la ruta solicitada
    //const rutaConsultada = req.originalUrl;
    //console.log(`Ruta consultada: ${rutaConsultada}`);

    // Obtener los años únicos del campo `anio` en la colección de bienes
    const anios = await Bien.distinct('anio');
    
    // Ordenar los años de mayor a menor
    const aniosOrdenados = anios.sort((a: string, b: string) => {
      return parseInt(b) - parseInt(a);  // Convertir a entero y ordenar de mayor a menor
    });

    res.json(aniosOrdenados);  // Enviar los años ordenados en la respuesta
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getBienesPorAnio = async (req: Request, res: Response) => {
  const { anio } = req.params;  // Obtener el año de los parámetros de la URL

  try {
    // Obtener la ruta solicitada
       const rutaConsultada = req.originalUrl;
       console.log(`Ruta consultada: ${rutaConsultada}`);

    // Filtrar los bienes por el campo `anio`, no por `_id`
    const servicios = await Bien.find({ anio: anio });
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getAllBienes = async (req: Request, res: Response) => {
  const bienes = await Bien.find();
  res.json(bienes);
};

export const createBien = async (req: Request, res: Response) => {
  try {
    const newBien = new Bien(req.body);
    await newBien.save();
    res.status(201).json(newBien);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getBienById = async (req: Request, res: Response) => {
  const bien = await Bien.findById(req.params.id);
  if (!bien) return res.status(404).json({ message: 'Bien no encontrado' });
  res.json(bien);
};

export const updateBien = async (req: Request, res: Response) => {
  const bien = await Bien.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!bien) return res.status(404).json({ message: 'Bien no encontrado' });
  res.json(bien);
};

export const deleteBien = async (req: Request, res: Response) => {
  const bien = await Bien.findByIdAndDelete(req.params.id);
  if (!bien) return res.status(404).json({ message: 'Bien no encontrado' });
  res.json({ message: 'Bien eliminado' });
};
