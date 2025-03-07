import { type NextRequest, NextResponse } from "next/server"
import { getAllPosts, createPost, searchPosts } from "@/lib/services/post-service"
import { getCurrentUser, checkUserPermission } from "@/lib/services/auth-service"

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams
  const searchTerm = searchParams.get("search") || ""
  const category = searchParams.get("category") || undefined
  const tag = searchParams.get("tag") || undefined
  const status = searchParams.get("status") as "draft" | "review" | "published" | undefined
  const limit = searchParams.get("limit") ? Number.parseInt(searchParams.get("limit")!) : undefined

  try {
    let posts

    if (searchTerm) {
      posts = await searchPosts(searchTerm, { category, status, limit })
    } else {
      posts = await getAllPosts({ category, tag, status, limit })
    }

    return NextResponse.json(posts)
  } catch (error) {
    console.error("Error fetching posts:", error)
    return NextResponse.json({ error: "Error fetching posts" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    // Obtener el ID del usuario de la sesión (esto dependerá de cómo manejen la autenticación)
    const session = request.headers.get("authorization")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.split(" ")[1] // Ejemplo simple, ajustar según su implementación

    // Verificar permisos
    const hasPermission = await checkUserPermission(userId, "create")
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const user = await getCurrentUser(userId)
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 })
    }

    const data = await request.json()

    // Añadir información del autor
    const postWithAuthor = {
      ...data,
      author: {
        _id: user._id,
        name: user.name,
        avatar: user.avatar,
      },
      date: new Date().toISOString().split("T")[0], // Formato YYYY-MM-DD
    }

    const post = await createPost(postWithAuthor)

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error creating post:", error)
    return NextResponse.json({ error: "Error creating post" }, { status: 500 })
  }
}

