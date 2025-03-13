import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../../../utils/auth.ts";
import { connectDB } from "../../../../utils/db.ts";
import { CHATS_COLLECTION } from "../../../../models/Chat.ts";
import { ObjectId } from "mongodb";
import { transcribeAudio } from "../../../../utils/openai.ts";

export const handler: Handlers = {
  async POST(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("Unauthorized", { status: 401 });
    }

    const chatId = ctx.params.id;
    try {
      const formData = await req.formData();
      const audioFile = formData.get("audio") as File;
      
      if (!audioFile) {
        return new Response("Archivo de audio no proporcionado", { status: 400 });
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

      // Convertir el archivo a ArrayBuffer
      const arrayBuffer = await audioFile.arrayBuffer();

      // Transcribir audio
      const text = await transcribeAudio(arrayBuffer);

      return new Response(JSON.stringify({ text }), {
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al transcribir audio:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 