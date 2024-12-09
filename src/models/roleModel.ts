import { Schema, model, Document } from "mongoose";

interface IRole extends Document {
  roleName: string; // Nombre del rol (e.g., 'admin', 'editor')
  permissions: Schema.Types.ObjectId[]; // Referencias a permisos
}

const roleSchema = new Schema<IRole>(
  {
    roleName: {
      type: String,
      required: [true, "El nombre del rol es obligatorio"], // Mensaje de error personalizado
      unique: true,
      trim: true, // Elimina espacios en blanco alrededor del valor
    },
    permissions: [
      {
        type: Schema.Types.ObjectId,
        ref: "Permission",
        required: [true, "Los permisos son obligatorios"], // Mensaje de error personalizado
      },
    ],
  },
  {
    timestamps: true, // Agrega createdAt y updatedAt automáticamente
  }
);

const Role = model<IRole>("Role", roleSchema);
export default Role;
