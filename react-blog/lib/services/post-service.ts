import { ObjectId } from "mongodb"
import clientPromise from "../mongodb"
import type { Post, PostWithRelevance } from "../models/post"

export async function getAllPosts(
  options: {
    status?: "draft" | "review" | "published"
    category?: string
    tag?: string
    authorId?: string | ObjectId
    limit?: number
    skip?: number
    sort?: { [key: string]: 1 | -1 }
  } = {},
) {
  const { status = "published", category, tag, authorId, limit = 100, skip = 0, sort = { date: -1 } } = options

  const client = await clientPromise
  const db = client.db()

  const query: any = { status }

  if (category) {
    query.category = category
  }

  if (tag) {
    query.tags = tag
  }

  if (authorId) {
    query["author._id"] = typeof authorId === "string" ? new ObjectId(authorId) : authorId
  }

  const posts = await db.collection("posts").find(query).sort(sort).skip(skip).limit(limit).toArray()

  return posts as Post[]
}

export async function getPostById(id: string) {
  const client = await clientPromise
  const db = client.db()

  const post = await db.collection("posts").findOne({ _id: new ObjectId(id) })

  return post as Post | null
}

export async function getPostBySlug(slug: string) {
  const client = await clientPromise
  const db = client.db()

  const post = await db.collection("posts").findOne({ slug })

  return post as Post | null
}

export async function createPost(post: Omit<Post, "_id">) {
  const client = await clientPromise
  const db = client.db()

  const now = new Date()
  const postWithDates = {
    ...post,
    createdAt: now,
    updatedAt: now,
  }

  const result = await db.collection("posts").insertOne(postWithDates)

  return {
    ...postWithDates,
    _id: result.insertedId,
  } as Post
}

export async function updatePost(id: string, post: Partial<Post>) {
  const client = await clientPromise
  const db = client.db()

  const updatedPost = {
    ...post,
    updatedAt: new Date(),
  }

  await db.collection("posts").updateOne({ _id: new ObjectId(id) }, { $set: updatedPost })

  return await getPostById(id)
}

export async function deletePost(id: string) {
  const client = await clientPromise
  const db = client.db()

  await db.collection("posts").deleteOne({ _id: new ObjectId(id) })

  return { success: true }
}

export async function searchPosts(
  searchTerm: string,
  options: {
    status?: "draft" | "review" | "published"
    category?: string
    limit?: number
  } = {},
) {
  const { status = "published", category, limit = 100 } = options

  const client = await clientPromise
  const db = client.db()

  const query: any = { status }

  if (category && category !== "all") {
    query.category = category
  }

  if (searchTerm) {
    query.$or = [
      { title: { $regex: searchTerm, $options: "i" } },
      { excerpt: { $regex: searchTerm, $options: "i" } },
      { content: { $regex: searchTerm, $options: "i" } },
      { category: { $regex: searchTerm, $options: "i" } },
      { tags: { $in: [new RegExp(searchTerm, "i")] } },
    ]
  }

  const posts = (await db.collection("posts").find(query).limit(limit).toArray()) as PostWithRelevance[]

  // Calcular relevancia para ordenar resultados
  if (searchTerm) {
    posts.forEach((post) => {
      let score = 0
      const searchLower = searchTerm.toLowerCase()

      // Title match (highest weight)
      if (post.title.toLowerCase().includes(searchLower)) {
        score += 10
        // Bonus for title starting with search term
        if (post.title.toLowerCase().startsWith(searchLower)) {
          score += 5
        }
      }

      // Category match
      if (post.category.toLowerCase().includes(searchLower)) {
        score += 8
      }

      // Tags match
      const matchingTags = post.tags.filter((tag) => tag.toLowerCase().includes(searchLower))
      score += matchingTags.length * 6

      // Excerpt match
      if (post.excerpt.toLowerCase().includes(searchLower)) {
        score += 4
      }

      // Content match
      if (post.content.toLowerCase().includes(searchLower)) {
        score += 2
      }

      post.relevance = score
    })

    // Ordenar por relevancia
    posts.sort((a, b) => (b.relevance || 0) - (a.relevance || 0))
  }

  return posts
}

export async function getCategories() {
  const client = await clientPromise
  const db = client.db()

  const categories = await db
    .collection("posts")
    .aggregate([
      { $match: { status: "published" } },
      { $group: { _id: "$category", count: { $sum: 1 } } },
      { $sort: { _id: 1 } },
    ])
    .toArray()

  return categories.map((c) => ({
    name: c._id,
    count: c.count,
  }))
}

export async function getTags() {
  const client = await clientPromise
  const db = client.db()

  const tags = await db
    .collection("posts")
    .aggregate([
      { $match: { status: "published" } },
      { $unwind: "$tags" },
      { $group: { _id: "$tags", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
    ])
    .toArray()

  return tags.map((t) => ({
    name: t._id,
    count: t.count,
  }))
}

export async function getRelatedPosts(postId: string, limit = 3) {
  const post = await getPostById(postId)

  if (!post) return []

  const client = await clientPromise
  const db = client.db()

  // Buscar posts con la misma categoría o tags similares
  const relatedPosts = await db
    .collection("posts")
    .find({
      _id: { $ne: new ObjectId(postId) },
      status: "published",
      $or: [{ category: post.category }, { tags: { $in: post.tags } }],
    })
    .limit(limit)
    .toArray()

  return relatedPosts as Post[]
}

