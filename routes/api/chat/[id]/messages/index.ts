import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../../../../utils/auth.ts";
import { connectDB } from "../../../../../utils/db.ts";
import { MESSAGES_COLLECTION, CHATS_COLLECTION, createMessage } from "../../../../../models/Chat.ts";
import { ObjectId } from "mongodb";
import { getChatCompletion } from "../../../../../utils/openai.ts";

export const handler: Handlers = {
  // Obtener mensajes de un chat
  async GET(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const db = await connectDB();
      
      // Verificar que el chat pertenece al usuario
      const chat = await db.collection(CHATS_COLLECTION).findOne({
        _id: new ObjectId(chatId),
        userId: user._id,
      });

      if (!chat) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      const messages = await db.collection(MESSAGES_COLLECTION)
        .find({ chatId: new ObjectId(chatId) })
        .sort({ timestamp: 1 })
        .toArray();

      return new Response(JSON.stringify(messages), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al obtener mensajes:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },

  // Enviar un nuevo mensaje
  async POST(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const { content, role } = await req.json();
      if (!content?.trim() || role !== "user") {
        return new Response("Mensaje inválido", { status: 400 });
      }

      const db = await connectDB();
      
      // Verificar que el chat pertenece al usuario
      const chat = await db.collection(CHATS_COLLECTION).findOne({
        _id: new ObjectId(chatId),
        userId: user._id,
      });

      if (!chat) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      // Crear y guardar el mensaje del usuario
      const userMessage = createMessage(new ObjectId(chatId), content, role);
      await db.collection(MESSAGES_COLLECTION).insertOne(userMessage);

      // Obtener el historial de mensajes para contexto
      const messages = await db.collection(MESSAGES_COLLECTION)
        .find({ chatId: new ObjectId(chatId) })
        .sort({ timestamp: 1 })
        .toArray();

      // Obtener respuesta de OpenAI
      const aiResponse = await getChatCompletion(messages);
      
      // Crear y guardar el mensaje de la IA
      const aiMessage = createMessage(new ObjectId(chatId), aiResponse, "assistant");
      await db.collection(MESSAGES_COLLECTION).insertOne(aiMessage);

      // Actualizar el último mensaje y título del chat si es el primer mensaje
      const updateData: Record<string, unknown> = {
        lastMessage: aiMessage,
        updatedAt: new Date(),
      };

      if (messages.length <= 2) {
        // Si es el primer intercambio, usar el mensaje del usuario como título
        updateData.title = content.slice(0, 50) + (content.length > 50 ? "..." : "");
      }

      await db.collection(CHATS_COLLECTION).updateOne(
        { _id: new ObjectId(chatId) },
        { $set: updateData }
      );

      return new Response(JSON.stringify([userMessage, aiMessage]), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 