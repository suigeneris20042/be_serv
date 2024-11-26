import { Request, Response } from 'express';
import Servicio from '../models/servicioModel';


export const getAniosServicios = async (req: Request, res: Response) => {
  try {

    // Obtener la ruta solicitada
    //const rutaConsultada = req.originalUrl;
    //console.log(`Ruta consultada: ${rutaConsultada}`);

    // Obtener los años únicos del campo `anio` en la colección de servicios
    const anios = await Servicio.distinct('anio');
    
    // Ordenar los años de mayor a menor
    const aniosOrdenados = anios.sort((a: string, b: string) => {
      return parseInt(b) - parseInt(a);  // Convertir a entero y ordenar de mayor a menor
    });

    res.json(aniosOrdenados);  // Enviar los años ordenados en la respuesta
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getServiciosPorAnio = async (req: Request, res: Response) => {
  const { anio } = req.params;  // Obtener el año de los parámetros de la URL

  try {
    // Obtener la ruta solicitada
       const rutaConsultada = req.originalUrl;
       console.log(`Ruta consultada: ${rutaConsultada}`);

    // Filtrar los servicios por el campo `anio`, no por `_id`
    const servicios = await Servicio.find({ anio: anio });
    res.json(servicios);
  } catch (err) {
    res.status(500).json({ message: (err as Error).message });
  }
};

export const getAllServicios = async (req: Request, res: Response) => {
  const servicios = await Servicio.find();
  res.json(servicios);
};

export const createServicio = async (req: Request, res: Response) => {
  try {
    const newServicio = new Servicio(req.body);
    await newServicio.save();
    res.status(201).json(newServicio);
  } catch (err) {
    res.status(400).json({ message: (err as Error).message });
  }
};

export const getServicioById = async (req: Request, res: Response) => {
  const servicio = await Servicio.findById(req.params.id);
  if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
  res.json(servicio);
};

export const updateServicio = async (req: Request, res: Response) => {
  const servicio = await Servicio.findByIdAndUpdate(req.params.id, req.body, { new: true });
  if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
  res.json(servicio);
};

export const deleteServicio = async (req: Request, res: Response) => {
  const servicio = await Servicio.findByIdAndDelete(req.params.id);
  if (!servicio) return res.status(404).json({ message: 'Servicio no encontrado' });
  res.json({ message: 'Servicio eliminado' });
};


