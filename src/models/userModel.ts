import { Schema, model, Document, CallbackError } from "mongoose";
import bcrypt from "bcryptjs";
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: Schema.Types.ObjectId[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
  hasPermission(permission: string): Promise<boolean>;
}

const userSchema = new Schema<IUser>(
  {
    username: { type: String, required: true, unique: true },
    email: {
      type: String,
      required: true,
      unique: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true },
    roles: [
      {
        type: String,
        enum: [
          "super_admin",
          "admin",
          "viewer",
          "administrador_bienes",
          "administrador_servicios",
          "publisher_bienes",
          "publisher_servicios",
        ],
      },
    ], // Roles como cadenas
  },
  {
    timestamps: { createdAt: "created_at", updatedAt: "updated_at" },
  }
);

// Middleware para hashear la contraseña
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error as CallbackError);
  }
});

// Comparar contraseñas
userSchema.methods.comparePassword = async function (
  password: string
): Promise<boolean> {
  return bcrypt.compare(password, this.password);
};

// Verificar permisos
userSchema.methods.hasPermission = async function (
  permission: string
): Promise<boolean> {
  const user = await this.populate({
    path: "roles",
    populate: {
      path: "permissions",
      model: "Permission",
    },
  });

  const userPermissions = user.roles.flatMap((role: any) =>
    role.permissions.map((perm: any) => perm.name)
  );

  return userPermissions.includes(permission);
};

const User = model<IUser>("User", userSchema);
export default User;
