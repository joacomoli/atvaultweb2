import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../../../utils/auth.ts";
import { connectDB } from "../../../../utils/db.ts";
import { CHATS_COLLECTION } from "../../../../models/Chat.ts";
import { ObjectId } from "mongodb";
import { generateSpeech } from "../../../../utils/openai.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const { text } = await req.json();
      if (!text?.trim()) {
        return new Response("Texto inválido", { status: 400 });
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

      // Generar audio
      const audioBuffer = await generateSpeech(text);

      return new Response(audioBuffer, {
        headers: {
          "Content-Type": "audio/mpeg",
          "Content-Disposition": 'attachment; filename="speech.mp3"',
        },
      });
    } catch (error) {
      console.error("Error al generar voz:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 