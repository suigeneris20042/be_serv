import { Schema, model, Document } from 'mongoose';

interface IServicio extends Document {
  descripcion: string;
  fecha_inicio: Date;
  fecha_fin: Date;
  fecha_publicacion: Date;
  anio: string;
  enlace: string;
  publicado: boolean;
  publicador: string;
  editable: boolean;
}

const servicioSchema = new Schema<IServicio>({
  descripcion: { type: String, required: true },
  fecha_inicio: { type: Date, required: true },
  fecha_fin: { type: Date, required: true },
  fecha_publicacion: { type: Date, required: true },
  anio: { type: String, required: true },
  enlace: { type: String, required: true },
  publicado: { type: Boolean, required: true },
  publicador: { type: String, required: true },
  editable: { type: Boolean, required: true }
}, {
  timestamps: true
});

const Servicio = model<IServicio>('Servicio', servicioSchema);
export default Servicio;
