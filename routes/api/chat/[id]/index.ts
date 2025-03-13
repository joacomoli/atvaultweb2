import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../../../utils/auth.ts";
import { connectDB } from "../../../../utils/db.ts";
import { CHATS_COLLECTION } from "../../../../models/Chat.ts";
import { ObjectId } from "mongodb";

export const handler: Handlers = {
  // Actualizar título del chat
  async PATCH(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const { title } = await req.json();
      if (!title?.trim()) {
        return new Response("Título inválido", { status: 400 });
      }

      const db = await connectDB();
      const result = await db.collection(CHATS_COLLECTION).updateOne(
        { _id: new ObjectId(chatId), userId: user._id },
        { $set: { title, updatedAt: new Date() } }
      );

      if (result.matchedCount === 0) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al actualizar chat:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },

  // Eliminar chat
  async DELETE(_req, ctx) {
    const user = await getUserFromRequest(_req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const db = await connectDB();
      const result = await db.collection(CHATS_COLLECTION).deleteOne({
        _id: new ObjectId(chatId),
        userId: user._id,
      });

      if (result.deletedCount === 0) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      return new Response(JSON.stringify({ success: true }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al eliminar chat:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 