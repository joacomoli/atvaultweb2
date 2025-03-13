import { ObjectId } from "mongodb";
import { ChatMessage } from "../utils/openai.ts";

export const CHATS_COLLECTION = "chats";
export const MESSAGES_COLLECTION = "messages";

export interface IMessage {
  _id?: ObjectId;
  chatId: ObjectId;
  role: "system" | "user" | "assistant";
  content: string;
  timestamp: Date;
}

export interface IChat {
  _id?: ObjectId;
  userId: ObjectId;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  lastMessage?: IMessage;
}

export function createChat(userId: ObjectId, title = "Nueva conversación"): IChat {
  const now = new Date();
  return {
    userId,
    title,
    createdAt: now,
    updatedAt: now,
  };
}

export function createMessage(chatId: ObjectId, role: "system" | "user" | "assistant", content: string): IMessage {
  // Validar y normalizar el rol
  const validRoles = ["system", "user", "assistant"] as const;
  const normalizedRole = role.toLowerCase() as "system" | "user" | "assistant";
  
  if (!validRoles.includes(normalizedRole)) {
    throw new Error(`Rol inválido: ${role}. Los roles válidos son: ${validRoles.join(", ")}`);
  }

  return {
    chatId,
    role: normalizedRole,
    content: content.toString().trim(),
    timestamp: new Date(),
  };
}

export function convertToOpenAIMessages(messages: IMessage[]): ChatMessage[] {
  // Asegurarse de que el primer mensaje tenga el contexto del sistema
  const systemMessage: ChatMessage = {
    role: "system",
    content: "Eres un asistente experto en tecnología y desarrollo de software, especializado en ayudar a los usuarios de AT Vault. Proporciona respuestas claras, precisas y profesionales."
  };

  // Validar y limpiar cada mensaje
  const validMessages = messages
    .filter((msg): msg is IMessage => {
      // Verificar que el mensaje tiene la estructura correcta
      if (!msg || typeof msg.content !== 'string') {
        console.log("Mensaje inválido - estructura incorrecta:", msg);
        return false;
      }

      // Verificar que el rol es válido
      const validRoles = ["system", "user", "assistant"];
      if (!validRoles.includes(msg.role?.toLowerCase())) {
        console.log("Mensaje inválido - rol incorrecto:", msg.role);
        return false;
      }

      return true;
    })
    .map(msg => ({
      role: msg.role.toLowerCase() as "system" | "user" | "assistant",
      content: msg.content.trim()
    }));

  console.log("Mensajes validados en convertToOpenAIMessages:", validMessages);

  // Retornar array con el mensaje del sistema primero
  return [systemMessage, ...validMessages];
} 