import { Handlers } from "$fresh/server.ts";
import { clearAllCookies } from "../../utils/auth.ts";

export const handler: Handlers = {
  async POST(req) {
    const response = new Response(
      JSON.stringify({ message: "Logout exitoso" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );

    clearAllCookies(response);

    return response;
  },
}; 