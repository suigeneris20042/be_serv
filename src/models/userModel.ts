import { Schema, model, Document } from 'mongoose';
import bcrypt from 'bcryptjs';

// Definir la interfaz de Usuario
interface IUser extends Document {
  username: string;
  email: string;
  password: string;
  roles: string[];
  createdAt: Date;
  updatedAt: Date;
  comparePassword(password: string): Promise<boolean>;
}

// Esquema de Usuario
const userSchema = new Schema<IUser>({
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  roles: { type: [String], default: ['viewer'] },  // Rol predeterminado "viewer"
}, {
  timestamps: { createdAt: 'created_at', updatedAt: 'updated_at' }  // Genera automáticamente las fechas
});

// Middleware para hashear la contraseña antes de guardar
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

// Método para comparar la contraseña
userSchema.methods.comparePassword = async function (password: string): Promise<boolean> {
  return await bcrypt.compare(password, this.password);
};

const User = model<IUser>('User', userSchema);

export default User;
