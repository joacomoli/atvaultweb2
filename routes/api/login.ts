import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { compare } from "bcrypt";
import { authenticateUser } from "../../utils/auth.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { email, password } = body;

      // Usar authenticateUser en lugar de buscar directamente en la base de datos
      const user = await authenticateUser(email, password);

      if (!user) {
        return new Response(
          JSON.stringify({ error: "Credenciales inválidas" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      // Crear una cookie que expire en 7 días
      const expires = new Date();
      expires.setDate(expires.getDate() + 7);
      const expiresStr = expires.toUTCString();

      // Solo establecer la cookie de email
      const cookie = `userEmail=${user.email}; Path=/; Expires=${expiresStr}`;

      return new Response(
        JSON.stringify({ 
          message: "Login exitoso",
          user: { email: user.email }
        }),
        {
          status: 200,
          headers: { 
            "Content-Type": "application/json",
            "Set-Cookie": cookie
          },
        }
      );
    } catch (error) {
      console.error("Error detallado en el login:", error);
      return new Response(
        JSON.stringify({ 
          error: "Error en el servidor",
          details: error instanceof Error ? error.message : "Error desconocido"
        }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
}; 