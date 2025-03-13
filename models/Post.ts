import { ObjectId } from "mongodb";

export const POSTS_COLLECTION = "posts";

export interface IPost {
  _id?: ObjectId;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  coverImage?: string;
  category: string;
  tags: string[];
  author: ObjectId;
  status: "draft" | "published";
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export function createPost(data: Partial<IPost>): IPost {
  const now = new Date();
  return {
    title: "",
    slug: "",
    content: "",
    excerpt: "",
    category: "General",
    tags: [],
    author: new ObjectId(),
    status: "draft",
    createdAt: now,
    updatedAt: now,
    ...data
  };
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function updatePost(data: Partial<IPost>) {
  return {
    ...data,
    updatedAt: new Date(),
  };
} 