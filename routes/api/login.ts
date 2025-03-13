import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { authenticateUser, createAuthToken, setAuthCookie, setUserCookies } from "../../utils/auth.ts";

export const handler: Handlers = {
  async POST(req) {
    try {
      const body = await req.json();
      const { email, password } = body;

      // Autenticar usuario
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

      // Crear token JWT
      const token = await createAuthToken(user._id.toString());

      // Crear respuesta
      const response = new Response(
        JSON.stringify({ 
          message: "Login exitoso",
          user: { 
            email: user.email,
            name: user.name,
            role: user.role
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );

      // Configurar cookies
      setAuthCookie(response, token);
      setUserCookies(response, user.name, user.role);

      return response;
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