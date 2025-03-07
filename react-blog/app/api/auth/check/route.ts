import { type NextRequest, NextResponse } from "next/server"
import { getCurrentUser } from "@/lib/services/auth-service"

export async function GET(request: NextRequest) {
  try {
    // Obtener el ID del usuario de la sesión (esto dependerá de cómo manejen la autenticación)
    const session = request.headers.get("authorization")
    if (!session) {
      return NextResponse.json({ isAuthenticated: false }, { status: 401 })
    }

    const userId = session.split(" ")[1] // Ejemplo simple, ajustar según su implementación

    const user = await getCurrentUser(userId)

    return NextResponse.json({
      isAuthenticated: !!user,
      user: user
        ? {
            id: user._id,
            name: user.name,
            role: user.role,
          }
        : null,
    })
  } catch (error) {
    console.error("Error checking authentication:", error)
    return NextResponse.json({ isAuthenticated: false }, { status: 500 })
  }
}

