import type { ObjectId } from "mongodb"

export interface Post {
  _id?: ObjectId | string
  title: string
  slug: string
  excerpt: string
  content: string
  coverImage: string
  coverImageAlt?: string
  author: {
    _id: string | ObjectId
    name: string
    avatar?: string
    bio?: string
  }
  date: string
  readTime: string
  category: string
  tags: string[]
  status: "draft" | "review" | "published"
  metaTitle?: string
  metaDescription?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface PostWithRelevance extends Post {
  relevance?: number
}

