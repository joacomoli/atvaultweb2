import { load } from "https://deno.land/std@0.204.0/dotenv/mod.ts";
import OpenAI from "https://deno.land/x/openai@v4.20.1/mod.ts";

const env = await load();
const OPENAI_API_KEY = env["OPENAI_API_KEY"] || Deno.env.get("OPENAI_API_KEY") || "";

if (!OPENAI_API_KEY) {
  throw new Error("OPENAI_API_KEY is required");
}

const openai = new OpenAI({
  apiKey: OPENAI_API_KEY,
});

export interface ChatMessage {
  role: "system" | "user" | "assistant";
  content: string;
}

export async function getChatCompletion(messages: ChatMessage[]): Promise<string> {
  try {
    // Validar que todos los mensajes tengan roles válidos
    const validMessages = messages.map(msg => ({
      role: msg.role,
      content: msg.content
    }));

    const completion = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: validMessages,
      temperature: 0.7,
      max_tokens: 1000,
    });

    return completion.choices[0]?.message?.content || "Lo siento, no pude generar una respuesta.";
  } catch (error) {
    console.error("Error en OpenAI:", error);
    throw new Error("Error al generar respuesta");
  }
}

export async function generateSpeech(text: string): Promise<ArrayBuffer> {
  try {
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "alloy",
      input: text,
    });

    const buffer = await mp3.arrayBuffer();
    return buffer;
  } catch (error) {
    console.error("Error generando audio:", error);
    throw new Error("Error al generar audio");
  }
}

export async function transcribeAudio(audioBuffer: ArrayBuffer): Promise<string> {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: new File([audioBuffer], "audio.mp3", { type: "audio/mp3" }),
      model: "whisper-1",
    });

    return transcription.text;
  } catch (error) {
    console.error("Error transcribiendo audio:", error);
    throw new Error("Error al transcribir audio");
  }
} 