import { Request, Response } from "express";
import Servicio from "../models/servicioModel";

// Función para manejar respuestas con errores
const handleError = (res: Response, error: unknown, customMessage?: string) => {
  console.error(customMessage || "Error:", error);
  res.status(500).json({
    success: false,
    message: customMessage || "Error interno del servidor",
    error: error instanceof Error ? error.message : "Error desconocido",
  });
};

// Obtener años únicos de servicios
export const getAniosServicios = async (req: Request, res: Response) => {
  try {
    const anios = await Servicio.distinct("anio");
    const aniosOrdenados = anios.sort(
      (a: string, b: string) => parseInt(b) - parseInt(a)
    );
    res.json({ success: true, data: aniosOrdenados });
  } catch (err) {
    handleError(res, err, "Error al obtener los años de servicios.");
  }
};

// Obtener servicios por año
export const getServiciosPorAnio = async (req: Request, res: Response) => {
  const { anio } = req.params;
  if (!anio || isNaN(parseInt(anio))) {
    return res.status(400).json({
      success: false,
      message: "El parámetro 'anio' es requerido y debe ser numérico.",
    });
  }

  try {
    // Ordenar los servicios de forma ascendente por `fech_publi`
    const servicios = await Servicio.find({ anio }).sort({ fech_publi: -1 });

    res.json({ success: true, data: servicios });
  } catch (err) {
    handleError(res, err, "Error al obtener los servicios por año.");
  }
};

// Obtener publicaciones según publicador
export const getServiciosPorPublicador = async (req: Request, res: Response) => {
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
    const servicios = await Servicio.find({ publicador: publicador.trim() });

    if (servicios.length === 0) {
      return res.status(200).json({
        success: true,
        data: [],
        message: `No se encontraron servicios para el publicador: ${publicador}`,
      });
    }

    return res.status(200).json({
      success: true,
      data: servicios,
    });
  } catch (err) {
    console.error("Error al obtener los servicios por publicador:", err);
    return res.status(500).json({
      success: false,
      message: "Error interno del servidor al obtener los servicios.",
    });
  }
};


// Obtener todos los servicios
export const getAllServicios = async (req: Request, res: Response) => {
  try {
    const servicios = await Servicio.find();
    res.json({ success: true, data: servicios });
  } catch (err) {
    handleError(res, err, "Error al obtener todos los servicios.");
  }
};

// Crear un servicio
export const createServicio = async (req: Request, res: Response) => {
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

  // Validaciones de datos requeridos
  if (!descripcion || !fech_ini || !anio || !enlace || !publicador) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos requeridos deben estar presentes.",
    });
  }

  try {
    const newServicio = new Servicio({
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
    await newServicio.save();
    res.status(201).json({
      success: true,
      data: newServicio,
      message: "Servicio creado exitosamente.",
    });
  } catch (err) {
    handleError(res, err, "Error al crear el servicio.");
  }
};

// Obtener un servicio por ID
export const getServicioById = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findById(id);
    if (!servicio) {
      return res
        .status(404)
        .json({ success: false, message: "Servicio no encontrado." });
    }
    res.json({ success: true, data: servicio });
  } catch (err) {
    handleError(res, err, "Error al obtener el servicio por ID.");
  }
};

// Actualizar un servicio por ID
export const updateServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  
  try {
    const servicio = await Servicio.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log("servicio",servicio)
    if (!servicio) {
      return res
        .status(404)
        .json({ success: false, message: "Servicio no encontrado." });
    }
    res.json({
      success: true,
      data: servicio,
      message: "Servicio actualizado exitosamente.",
    });
  } catch (err) {
    handleError(res, err, "Error al actualizar el servicio.");
  }
};

// Eliminar un servicio por ID
export const deleteServicio = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const servicio = await Servicio.findByIdAndDelete(id);
    if (!servicio) {
      return res
        .status(404)
        .json({ success: false, message: "Servicio no encontrado." });
    }
    res.json({ success: true, message: "Servicio eliminado exitosamente." });
  } catch (err) {
    handleError(res, err, "Error al eliminar el servicio.");
  }
};
