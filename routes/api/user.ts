import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../utils/auth.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const user = await getUserFromRequest(req);

      if (!user) {
        return new Response(
          JSON.stringify({ error: "No autenticado" }),
          {
            status: 401,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      return new Response(
        JSON.stringify({
          user: {
            name: user.name,
            email: user.email,
            role: user.role
          }
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        }
      );
    } catch (error) {
      console.error("Error al obtener usuario:", error);
      return new Response(
        JSON.stringify({ error: "Error del servidor" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
}; 