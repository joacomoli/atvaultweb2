import { ObjectId } from "mongodb";
import * as bcrypt from "bcrypt";

export enum UserRole {
  ADMIN = 'admin',
  STANDARD = 'standard',
  CHATBOT = 'chatbot',
  DEMO = 'demo',
}

export interface IUser {
  _id?: ObjectId;
  name: string;
  email: string;
  password: string;
  role: UserRole;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const USERS_COLLECTION = 'users';

export async function createUser(data: Omit<IUser, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  const hashedPassword = await bcrypt.hash(data.password);
  
  return {
    ...data,
    role: data.role || UserRole.STANDARD,
    password: hashedPassword,
    createdAt: now,
    updatedAt: now,
  };
}

export async function validatePassword(password: string, hashedPassword: string): Promise<boolean> {
  return await bcrypt.compare(password, hashedPassword);
}

export function sanitizeUser(user: IUser) {
  const { password, ...safeUser } = user;
  return safeUser;
}

export function updateUser(data: Partial<IUser>) {
  return {
    ...data,
    updatedAt: new Date(),
  };
} 