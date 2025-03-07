import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../../utils/db.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      // Obtener el email del usuario de la cookie
      const cookies = req.headers.get("cookie");
      if (!cookies) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const emailCookie = cookies.split(";")
        .find(cookie => cookie.trim().startsWith("userEmail="));

      if (!emailCookie) {
        return new Response(JSON.stringify({ authenticated: false }), {
          status: 200,
          headers: { "Content-Type": "application/json" },
        });
      }

      const email = decodeURIComponent(emailCookie.split("=")[1].trim());
      
      // Si hay un email en la cookie, consideramos que está autenticado
      return new Response(JSON.stringify({
        authenticated: true,
        user: {
          name: "Usuario",
          email: email
        }
      }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error checking auth:", error);
      return new Response(JSON.stringify({ 
        authenticated: false,
        error: "Error verificando autenticación"
      }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  }
}; 