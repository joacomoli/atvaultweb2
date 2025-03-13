import { Handlers } from "$fresh/server.ts";
import { clearAllCookies } from "../utils/auth.ts";

export const handler: Handlers = {
  async POST(_req, _ctx) {
    const response = new Response("", {
      status: 303,
      headers: { Location: "/login" },
    });
    
    clearAllCookies(response);
    return response;
  },
}; 