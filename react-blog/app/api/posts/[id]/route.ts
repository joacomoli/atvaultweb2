import { type NextRequest, NextResponse } from "next/server"
import { getPostById, updatePost, deletePost } from "@/lib/services/post-service"
import { checkUserPermission } from "@/lib/services/auth-service"

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const post = await getPostById(params.id)

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 })
    }

    return NextResponse.json(post)
  } catch (error) {
    console.error("Error fetching post:", error)
    return NextResponse.json({ error: "Error fetching post" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener el ID del usuario de la sesión
    const session = request.headers.get("authorization")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.split(" ")[1] // Ejemplo simple, ajustar según su implementación

    // Verificar permisos
    const hasPermission = await checkUserPermission(userId, "edit")
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    const data = await request.json()
    const updatedPost = await updatePost(params.id, data)

    return NextResponse.json(updatedPost)
  } catch (error) {
    console.error("Error updating post:", error)
    return NextResponse.json({ error: "Error updating post" }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Obtener el ID del usuario de la sesión
    const session = request.headers.get("authorization")
    if (!session) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const userId = session.split(" ")[1] // Ejemplo simple, ajustar según su implementación

    // Verificar permisos
    const hasPermission = await checkUserPermission(userId, "delete")
    if (!hasPermission) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 })
    }

    await deletePost(params.id)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error deleting post:", error)
    return NextResponse.json({ error: "Error deleting post" }, { status: 500 })
  }
}

