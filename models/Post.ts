import { ObjectId } from "mongodb";

export interface IPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  excerpt: string;
  content: string;
  coverImage?: string;
  status: 'draft' | 'published';
  publishedAt: Date;
  author: ObjectId | string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const POSTS_COLLECTION = 'posts';

export function createPost(data: Omit<IPost, '_id' | 'createdAt' | 'updatedAt'>) {
  const now = new Date();
  return {
    ...data,
    status: data.status || 'published',
    createdAt: now,
    updatedAt: now,
  };
}

export function updatePost(data: Partial<IPost>) {
  return {
    ...data,
    updatedAt: new Date(),
  };
} 