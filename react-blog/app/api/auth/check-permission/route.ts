import { type NextRequest, NextResponse } from "next/server"
import { checkUserPermission } from "@/lib/services/auth-service"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const permission = searchParams.get("permission") as "create" | "edit" | "delete"

    // Obtener el ID del usuario de la sesión (esto dependerá de cómo manejen la autenticación)
    const session = request.headers.get("authorization")
    if (!session) {
      return NextResponse.json({ hasPermission: false }, { status: 401 })
    }

    const userId = session.split(" ")[1] // Ejemplo simple, ajustar según su implementación

    const hasPermission = await checkUserPermission(userId, permission)

    return NextResponse.json({ hasPermission })
  } catch (error) {
    console.error("Error checking permission:", error)
    return NextResponse.json({ hasPermission: false }, { status: 500 })
  }
}

