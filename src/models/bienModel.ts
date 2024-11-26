import { Schema, model, Document } from 'mongoose';

interface IBien extends Document {
  descripcion: string;
  fech_ini: Date;
  fech_fin: Date;
  fech_publi: Date;
  anio: string;
  enlace: string;
  publicado: boolean;
  publicador: string;
  editable: boolean;
}

const bienSchema = new Schema<IBien>({
  descripcion: { type: String, required: true },
  fech_ini: { type: Date, required: true },
  fech_fin: { type: Date, required: true },
  fech_publi: { type: Date, required: true },
  anio: { type: String, required: true },
  enlace: { type: String, required: true },
  publicado: { type: Boolean, required: true },
  publicador: { type: String, required: true },
  editable: { type: Boolean, required: true }
}, {
  timestamps: true
});

const Bien = model<IBien>('Bien', bienSchema, 'bienes');
export default Bien;
