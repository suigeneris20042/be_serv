import { Schema, model, Document } from "mongoose";

interface IPermission extends Document {
  name: string; // Nombre único del permiso (e.g., 'create_users', 'delete_roles')
  description?: string; // Descripción opcional del permiso
}

const permissionSchema = new Schema<IPermission>(
  {
    name: {
      type: String,
      required: [true, "El nombre del permiso es obligatorio"],
      unique: true,
      trim: true,
    },
    description: {
      type: String,
      trim: true,
    },
  },
  {
    timestamps: true,
  }
);

const Permission = model<IPermission>("Permission", permissionSchema);
export default Permission;
