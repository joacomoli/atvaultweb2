import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../../../utils/db.ts";
import { getUserFromRequest } from "../../../../utils/auth.ts";
import { CHATS_COLLECTION, MESSAGES_COLLECTION, createMessage, convertToOpenAIMessages } from "../../../../models/Chat.ts";
import { ObjectId } from "mongodb";
import { getChatCompletion, ChatMessage } from "../../../../utils/openai.ts";

export const handler: Handlers = {
  async GET(req, ctx) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return new Response("No autorizado", { status: 401 });
      }

      const { id } = ctx.params;
      const db = await connectDB();

      // Verificar que el chat pertenece al usuario
      const chat = await db.collection(CHATS_COLLECTION).findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user._id),
      });

      if (!chat) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      // Obtener mensajes del chat
      const messages = await db.collection(MESSAGES_COLLECTION)
        .find({ chatId: new ObjectId(id) })
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

  async POST(req, ctx) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return new Response("No autorizado", { status: 401 });
      }

      const { id } = ctx.params;
      const db = await connectDB();

      // Verificar que el chat pertenece al usuario
      const chat = await db.collection(CHATS_COLLECTION).findOne({
        _id: new ObjectId(id),
        userId: new ObjectId(user._id),
      });

      if (!chat) {
        return new Response("Chat no encontrado", { status: 404 });
      }

      // Obtener el mensaje del usuario
      const { content } = await req.json();
      if (!content || typeof content !== 'string') {
        return new Response(
          JSON.stringify({ error: "El contenido del mensaje es requerido" }),
          { status: 400, headers: { "Content-Type": "application/json" } }
        );
      }

      console.log("Creando mensaje de usuario con contenido:", content);
      const userMessage = createMessage(new ObjectId(id), "user", content);

      // Guardar mensaje del usuario
      await db.collection(MESSAGES_COLLECTION).insertOne(userMessage);

      console.log("Mensaje guardado:", userMessage);

      // Si el usuario no tiene licencia, enviar mensaje de registro
      if (!user.hasLicense) {
        const registrationMessage = createMessage(
          new ObjectId(id),
          "assistant",
          "Para poder chatear con Vaulty es necesario que te registres y solicites nuestra licencia a info@atvault.com"
        );

        await db.collection(MESSAGES_COLLECTION).insertOne(registrationMessage);

        // Actualizar último mensaje del chat
        await db.collection(CHATS_COLLECTION).updateOne(
          { _id: new ObjectId(id) },
          { $set: { lastMessage: registrationMessage } }
        );

        return new Response(JSON.stringify(registrationMessage), {
          headers: { "Content-Type": "application/json" },
        });
      }

      try {
        // Obtener historial de mensajes para contexto
        const chatHistory = await db.collection(MESSAGES_COLLECTION)
          .find({ chatId: new ObjectId(id) })
          .sort({ timestamp: 1 })
          .toArray();

        console.log("Chat history raw:", JSON.stringify(chatHistory, null, 2));

        // Verificar y limpiar los mensajes antes de la conversión
        const cleanedHistory = chatHistory.map(msg => ({
          ...msg,
          role: msg.role?.toLowerCase?.() || "user", // Asegurarse de que el rol sea minúsculas
          content: typeof msg.content === 'string' ? msg.content : String(msg.content)
        }));

        console.log("Cleaned history:", JSON.stringify(cleanedHistory, null, 2));

        // Convertir mensajes al formato de OpenAI
        const openAIMessages = convertToOpenAIMessages(cleanedHistory);
        
        console.log("OpenAI Messages:", JSON.stringify(openAIMessages, null, 2));

        // Validar que todos los mensajes tienen roles válidos
        const validMessages = openAIMessages.filter(msg => 
          msg && 
          typeof msg.content === 'string' && 
          ["system", "user", "assistant"].includes(msg.role)
        );

        console.log("Valid messages for OpenAI:", JSON.stringify(validMessages, null, 2));

        if (validMessages.length === 0) {
          throw new Error("No hay mensajes válidos para procesar");
        }

        // Obtener respuesta de OpenAI
        const assistantResponse = await getChatCompletion(validMessages);
        
        if (!assistantResponse) {
          throw new Error("No se recibió respuesta del asistente");
        }

        const assistantMessage = createMessage(
          new ObjectId(id),
          "assistant",
          assistantResponse
        );

        // Guardar respuesta del asistente
        await db.collection(MESSAGES_COLLECTION).insertOne(assistantMessage);

        // Actualizar último mensaje del chat
        await db.collection(CHATS_COLLECTION).updateOne(
          { _id: new ObjectId(id) },
          { $set: { lastMessage: assistantMessage } }
        );

        return new Response(JSON.stringify(assistantMessage), {
          headers: { "Content-Type": "application/json" },
        });
      } catch (error) {
        console.error("Error con OpenAI:", error);
        const errorMessage = createMessage(
          new ObjectId(id),
          "assistant",
          "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente."
        );

        await db.collection(MESSAGES_COLLECTION).insertOne(errorMessage);
        return new Response(JSON.stringify(errorMessage), {
          headers: { "Content-Type": "application/json" },
        });
      }
    } catch (error) {
      console.error("Error al procesar mensaje:", error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
}; 