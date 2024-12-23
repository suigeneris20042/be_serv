import { Request, Response } from "express";
import mongoose from "mongoose";
import Bien from "../models/bienModel";



const handleError = (res: Response, error: unknown, customMessage?: string) => {
  console.error(customMessage || "Error:", error);
  res.status(500).json({
    success: false,
    message: customMessage || "Error interno del servidor",
    error: error instanceof Error ? error.message : "Error desconocido",
  });
};

export const getAniosBienes = async (req: Request, res: Response) => {
  try {
    // Obtener años únicos del campo `anio` y ordenarlos de mayor a menor
    const anios = await Bien.distinct("anio");
    const aniosOrdenados = anios.map(Number).sort((a, b) => b - a); // Convertir a números y ordenar de mayor a menor

    res.status(200).json({
      success: true,
      data: aniosOrdenados,
      message: "Años obtenidos exitosamente",
    });
  } catch (err) {
    console.error("Error al obtener años de bienes:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener años de bienes",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};



// Obtener servicios por año
export const getBienesPorAnio = async (req: Request, res: Response) => {
  const { anio } = req.params;
  if (!anio || isNaN(parseInt(anio))) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'anio' es requerido y debe ser numérico.",
    });
  }

  try {
    // Ordenar los servicios de forma ascendente por `fech_publi`
    const bienes = await Bien.find({ anio }).sort({ fech_publi: -1 });

    res.json({ success: true, data: bienes });
  } catch (err) {
    handleError(res, err, "Error al obtener los servicios por año.");
  }
};

export const getAllBienes = async (req: Request, res: Response) => {
  try {
    const bienes = await Bien.find();
    res.status(200).json({
      success: true,
      data: bienes,
      message: "Bienes obtenidos exitosamente",
    });
  } catch (err) {
    console.error("Error al obtener todos los bienes:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener todos los bienes",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};

export const createBien = async (req: Request, res: Response) => {
  const {
    descripcion,
    fech_ini,
    fech_fin,
    fech_publi,
    anio,
    enlace,
    publicado,
    publicador,
    editable,
  } = req.body;

  // Validaciones de campos requeridos
  if (
    !descripcion ||
    !fech_ini ||
    !fech_fin ||
    !fech_publi ||
    !anio ||
    !enlace
  ) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos requeridos deben estar presentes",
    });
  }

  try {
    const nuevoBien = new Bien({
      descripcion,
      fech_ini,
      fech_fin,
      fech_publi,
      anio,
      enlace,
      publicado,
      publicador,
      editable,
    });

    await nuevoBien.save();
    res.status(201).json({
      success: true,
      data: nuevoBien,
      message: "Bien creado exitosamente",
    });
  } catch (err) {
    console.error("Error al crear el bien:", err);
    res.status(500).json({
      success: false,
      message: "Error al crear el bien",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};

export const getBienById = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "El ID proporcionado no es válido",
    });
  }

  try {
    const bien = await Bien.findById(id);
    if (!bien) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: bien,
      message: "Bien obtenido exitosamente",
    });
  } catch (err) {
    console.error("Error al obtener el bien:", err);
    res.status(500).json({
      success: false,
      message: "Error al obtener el bien",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};

// Obtener publicaciones según Publicador
export const getBienesPorPublicador = async (req: Request, res: Response) => {
  const { publicador } = req.params;

  // Muestra el valor del publicador en los logs
  //console.log("publicador es:", publicador);

  // Validación del parámetro
  if (!publicador || typeof publicador !== "string" || publicador.trim() === "") {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'publicador' es requerido y debe ser texto.",
    });
  }

  try {
    // Realiza la consulta en MongoDB
    const bienes = await Bien.find({ publicador: publicador.trim() });

    if (bienes.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: `No se encontraron bienes para el publicador: ${publicador}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: bienes,
    });
  } catch (err) {
    console.error("Error al obtener los bienes por publicador:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los bienes.",
    });
  }
};

export const updateBien = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "El ID proporcionado no es válido",
    });
  }

  try {
    const bienActualizado = await Bien.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!bienActualizado) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: bienActualizado,
      message: "Bien actualizado exitosamente",
    });
  } catch (err) {
    console.error("Error al actualizar el bien:", err);
    res.status(500).json({
      success: false,
      message: "Error al actualizar el bien",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};

export const deleteBien = async (req: Request, res: Response) => {
  const { id } = req.params;

  if (!mongoose.isValidObjectId(id)) {
    return res.status(400).json({
      success: false,
      message: "El ID proporcionado no es válido",
    });
  }

  try {
    const bienEliminado = await Bien.findByIdAndDelete(id);
    if (!bienEliminado) {
      return res.status(404).json({
        success: false,
        message: "Bien no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Bien eliminado exitosamente",
    });
  } catch (err) {
    console.error("Error al eliminar el bien:", err);
    res.status(500).json({
      success: false,
      message: "Error al eliminar el bien",
      error: err instanceof Error ? err.message : "Error desconocido",
    });
  }
};
