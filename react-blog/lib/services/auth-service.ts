import clientPromise from "../mongodb"
import { ObjectId } from "mongodb"

export interface User {
  _id: string | ObjectId
  name: string
  email: string
  avatar?: string
  role: "user" | "editor" | "admin"
}

export async function getCurrentUser(userId: string): Promise<User | null> {
  if (!userId) return null

  const client = await clientPromise
  const db = client.db()

  try {
    const user = await db.collection("users").findOne({ _id: new ObjectId(userId) })
    return user as User | null
  } catch (error) {
    console.error("Error getting current user:", error)
    return null
  }
}

export async function checkUserPermission(userId: string, permission: "create" | "edit" | "delete"): Promise<boolean> {
  const user = await getCurrentUser(userId)

  if (!user) return false

  // Definir permisos basados en roles
  switch (permission) {
    case "create":
      return ["editor", "admin"].includes(user.role)
    case "edit":
      return ["editor", "admin"].includes(user.role)
    case "delete":
      return user.role === "admin"
    default:
      return false
  }
}

