import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../../utils/db.ts";
import { getUserFromRequest } from "../../../utils/auth.ts";
import { CHATS_COLLECTION, createChat } from "../../../models/Chat.ts";
import { ObjectId } from "mongodb";

export const handler: Handlers = {
  // Obtener todos los chats del usuario
  async GET(req) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return new Response("No autorizado", { status: 401 });
      }

      const db = await connectDB();
      const chats = await db.collection(CHATS_COLLECTION)
        .find({ userId: new ObjectId(user._id) })
        .sort({ updatedAt: -1 })
        .toArray();

      return new Response(JSON.stringify(chats), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al obtener chats:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },

  // Crear un nuevo chat
  async POST(req) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return new Response("No autorizado", { status: 401 });
      }

      const body = await req.json();
      const title = body.title || "Nueva conversación";

      const db = await connectDB();
      const chat = createChat(new ObjectId(user._id), title);
      
      const result = await db.collection(CHATS_COLLECTION).insertOne(chat);
      const newChat = { ...chat, _id: result.insertedId };

      return new Response(JSON.stringify(newChat), {
        status: 201,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al crear chat:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 