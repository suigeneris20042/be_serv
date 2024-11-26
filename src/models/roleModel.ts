import { Schema, model, Document } from 'mongoose';

interface IRole extends Document {
  roleName: string;
  permissions: string[];
}

const roleSchema = new Schema<IRole>({
  roleName: { type: String, required: true, unique: true },
  permissions: { type: [String], required: true }
});

const Role = model<IRole>('Role', roleSchema);
export default Role;
