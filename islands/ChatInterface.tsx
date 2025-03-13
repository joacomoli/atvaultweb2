import { useEffect, useRef, useState } from "preact/hooks";
import { IChat, IMessage } from "../models/Chat.ts";

interface ChatInterfaceProps {
  user: any;
  initialChats: IChat[];
  initialChatId?: string;
}

export default function ChatInterface({ user, initialChats, initialChatId }: ChatInterfaceProps) {
  const [chats, setChats] = useState<IChat[]>(initialChats);
  const [currentChat, setCurrentChat] = useState<IChat | null>(
    initialChatId ? chats.find(chat => chat._id === initialChatId) || null : null
  );
  const [messages, setMessages] = useState<IMessage[]>([]);
  const [loading, setLoading] = useState(false);
  const [input, setInput] = useState("");
  const [editingTitle, setEditingTitle] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [isRecording, setIsRecording] = useState(false);
  const [audioUrl, setAudioUrl] = useState<string | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Cargar mensajes cuando se selecciona un chat
  useEffect(() => {
    if (currentChat) {
      loadMessages(currentChat._id);
      setNewTitle(currentChat.title);
    }
  }, [currentChat?._id]);

  // Scroll al último mensaje
  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadMessages = async (chatId: string) => {
    try {
      const response = await fetch(`/api/chat/${chatId}/messages`);
      if (!response.ok) throw new Error("Error al cargar mensajes");
      const data = await response.json();
      setMessages(data);
    } catch (error) {
      console.error("Error al cargar mensajes:", error);
    }
  };

  const createNewChat = async () => {
    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user._id }),
      });

      if (!response.ok) throw new Error("Error al crear chat");
      const newChat = await response.json();
      setChats(prev => [newChat, ...prev]);
      setCurrentChat(newChat);
    } catch (error) {
      console.error("Error al crear chat:", error);
    }
  };

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    if (!input.trim()) return;

    // Si no hay usuario, mostrar mensaje de registro
    if (!user) {
      setMessages([
        ...messages,
        { role: "user", content: input },
        {
          role: "assistant",
          content: "Para poder chatear con Vaulty es necesario que te registres y solicites nuestra licencia a info@atvault.com"
        }
      ]);
      setInput("");
      return;
    }

    // Si no hay chat activo, crear uno nuevo
    if (!currentChat) {
      try {
        const response = await fetch("/api/chat", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ userId: user._id }),
        });

        if (!response.ok) throw new Error("Error al crear chat");
        const newChat = await response.json();
        setChats(prev => [newChat, ...prev]);
        setCurrentChat(newChat);
      } catch (error) {
        console.error("Error al crear chat:", error);
        return;
      }
    }

    setLoading(true);
    const userMessage = { role: "user", content: input };

    try {
      // Agregar mensaje del usuario inmediatamente para mejor UX
      setMessages(prev => [...prev, userMessage]);
      setInput("");

      const response = await fetch(`/api/chat/${currentChat?._id}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ content: input }),
      });

      if (!response.ok) throw new Error("Error al enviar mensaje");
      const assistantMessage = await response.json();
      
      // Actualizar mensajes con la respuesta del asistente
      setMessages(prev => [...prev, assistantMessage]);
      
      // Actualizar el chat en la lista con el último mensaje
      setChats(prev => prev.map(chat => 
        chat._id === currentChat?._id 
          ? { ...chat, lastMessage: assistantMessage }
          : chat
      ));
    } catch (error) {
      console.error("Error al enviar mensaje:", error);
      // Mostrar mensaje de error al usuario
      setMessages(prev => [...prev, {
        role: "assistant",
        content: "Lo siento, ha ocurrido un error al procesar tu mensaje. Por favor, intenta nuevamente."
      }]);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTitle = async () => {
    if (!currentChat || !newTitle.trim()) return;

    try {
      const response = await fetch(`/api/chat/${currentChat._id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title: newTitle }),
      });

      if (!response.ok) throw new Error("Error al actualizar título");
      
      setChats(prev => prev.map(chat => 
        chat._id === currentChat._id 
          ? { ...chat, title: newTitle }
          : chat
      ));
      setCurrentChat(prev => prev ? { ...prev, title: newTitle } : null);
      setEditingTitle(false);
    } catch (error) {
      console.error("Error al actualizar título:", error);
    }
  };

  const handleDeleteChat = async (chatId: string) => {
    if (!confirm("¿Estás seguro de que deseas eliminar este chat?")) return;

    try {
      const response = await fetch(`/api/chat/${chatId}`, {
        method: "DELETE",
      });

      if (!response.ok) throw new Error("Error al eliminar chat");
      
      setChats(prev => prev.filter(chat => chat._id !== chatId));
      if (currentChat?._id === chatId) {
        setCurrentChat(null);
        setMessages([]);
      }
    } catch (error) {
      console.error("Error al eliminar chat:", error);
    }
  };

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" });
        const url = URL.createObjectURL(audioBlob);
        setAudioUrl(url);

        // Transcribir el audio
        const formData = new FormData();
        formData.append("audio", audioBlob);

        try {
          const response = await fetch(`/api/chat/${currentChat?._id}/transcribe`, {
            method: "POST",
            body: formData,
          });

          if (!response.ok) throw new Error("Error al transcribir audio");
          const { text } = await response.json();
          setInput(text);
        } catch (error) {
          console.error("Error al transcribir audio:", error);
        }
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (error) {
      console.error("Error al iniciar grabación:", error);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      setIsRecording(false);
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
    }
  };

  const playMessageAudio = async (text: string) => {
    try {
      const response = await fetch(`/api/chat/${currentChat?._id}/speech`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      if (!response.ok) throw new Error("Error al generar audio");

      const audioBlob = await response.blob();
      const url = URL.createObjectURL(audioBlob);
      const audio = new Audio(url);
      audio.play();
    } catch (error) {
      console.error("Error al reproducir audio:", error);
    }
  };

  return (
    <div class="flex h-[calc(100vh-4rem)] overflow-hidden">
      {/* Sidebar */}
      <div class="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700">
        <div class="p-4">
          <button
            onClick={createNewChat}
            class="w-full flex items-center justify-center px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg"
          >
            Nuevo Chat
          </button>
        </div>
        <div class="overflow-y-auto h-full">
          {chats.map(chat => (
            <div
              key={chat._id}
              class={`p-4 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 ${
                currentChat?._id === chat._id ? "bg-gray-100 dark:bg-gray-700" : ""
              }`}
              onClick={() => setCurrentChat(chat)}
            >
              <div class="flex items-center justify-between">
                <h3 class="text-sm font-medium truncate">
                  {chat.title}
                </h3>
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDeleteChat(chat._id);
                  }}
                  class="text-gray-500 hover:text-red-500"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                  </svg>
                </button>
              </div>
              {chat.lastMessage && (
                <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 truncate">
                  {chat.lastMessage.content}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Chat Area */}
      <div class="flex-1 flex flex-col">
        {currentChat ? (
          <>
            {/* Chat Header */}
            <div class="p-4 border-b border-gray-200 dark:border-gray-700">
              {editingTitle ? (
                <div class="flex items-center gap-2">
                  <input
                    type="text"
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.currentTarget.value)}
                    class="flex-1 px-2 py-1 border rounded"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") handleUpdateTitle();
                      if (e.key === "Escape") setEditingTitle(false);
                    }}
                  />
                  <button
                    onClick={handleUpdateTitle}
                    class="text-blue-600 hover:text-blue-700"
                  >
                    Guardar
                  </button>
                  <button
                    onClick={() => setEditingTitle(false)}
                    class="text-gray-500 hover:text-gray-700"
                  >
                    Cancelar
                  </button>
                </div>
              ) : (
                <div class="flex items-center justify-between">
                  <h2 class="text-lg font-medium">{currentChat.title}</h2>
                  <button
                    onClick={() => setEditingTitle(true)}
                    class="text-gray-500 hover:text-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                    </svg>
                  </button>
                </div>
              )}
            </div>

            {/* Messages */}
            <div class="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((message, index) => (
                <div
                  key={index}
                  class={`flex ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  <div
                    class={`max-w-[70%] rounded-lg px-4 py-2 ${
                      message.role === "user"
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 dark:bg-gray-700"
                    }`}
                  >
                    <div class="flex items-center justify-between gap-2">
                      <p class="text-sm">{message.content}</p>
                      <button
                        onClick={() => playMessageAudio(message.content)}
                        class="text-current opacity-60 hover:opacity-100"
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.415z" clip-rule="evenodd" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} class="p-4 border-t border-gray-200 dark:border-gray-700">
              <div class="flex items-center gap-2">
                <button
                  type="button"
                  onClick={isRecording ? stopRecording : startRecording}
                  class={`p-2 rounded-full ${
                    isRecording
                      ? "bg-red-500 hover:bg-red-600"
                      : "bg-blue-600 hover:bg-blue-700"
                  } text-white`}
                >
                  {isRecording ? (
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 002 0V8a1 1 0 00-1-1z" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd" d="M7 4a3 3 0 016 0v4a3 3 0 11-6 0V4zm4 10.93A7.001 7.001 0 0017 8a1 1 0 10-2 0A5 5 0 015 8a1 1 0 00-2 0 7.001 7.001 0 006 6.93V17H6a1 1 0 100 2h8a1 1 0 100-2h-3v-2.07z" clip-rule="evenodd" />
                    </svg>
                  )}
                </button>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.currentTarget.value)}
                  placeholder="Escribe un mensaje..."
                  class="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={loading || isRecording}
                />
                <button
                  type="submit"
                  disabled={loading || !input.trim() || isRecording}
                  class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
                >
                  {loading ? "Enviando..." : "Enviar"}
                </button>
              </div>
            </form>
          </>
        ) : (
          <div class="flex-1 flex items-center justify-center">
            <p class="text-gray-500 dark:text-gray-400">
              Selecciona un chat o crea uno nuevo para comenzar
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 