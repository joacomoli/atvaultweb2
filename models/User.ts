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
  hasLicense: boolean;
  avatar?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const USERS_COLLECTION = 'users';

export async function createUser(data: {
  name: string;
  email: string;
  password: string;
  role: UserRole;
}): Promise<IUser> {
  const hashedPassword = await bcrypt.hash(data.password);
  
  return {
    name: data.name,
    email: data.email.toLowerCase(),
    password: hashedPassword,
    role: data.role,
    hasLicense: false,
    createdAt: new Date(),
    updatedAt: new Date(),
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