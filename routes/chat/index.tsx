import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { getUserFromRequest } from "../../utils/auth.ts";
import { connectDB } from "../../utils/db.ts";
import { CHATS_COLLECTION, IChat } from "../../models/Chat.ts";
import ChatInterface from "../../islands/ChatInterface.tsx";

interface Data {
  user: any;
  chats: IChat[];
  currentChatId?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const user = await getUserFromRequest(req);
    if (!user) {
      return new Response("", {
        status: 307,
        headers: { Location: "/login" },
      });
    }

    try {
      const db = await connectDB();
      const chats = await db.collection(CHATS_COLLECTION)
        .find({ userId: user._id })
        .sort({ updatedAt: -1 })
        .toArray() as IChat[];

      // Obtener el ID del chat actual de la URL si existe
      const url = new URL(req.url);
      const currentChatId = url.searchParams.get("id") || undefined;

      return ctx.render({ user, chats, currentChatId });
    } catch (error) {
      console.error("Error al obtener chats:", error);
      return ctx.render({ user, chats: [], currentChatId: undefined });
    }
  },
};

export default function ChatPage({ data }: PageProps<Data>) {
  const { user, chats, currentChatId } = data;

  return (
    <>
      <Head>
        <title>Chat - AT Vault</title>
      </Head>

      <Navbar user={user} active="chat" />

      <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto">
          <ChatInterface 
            user={user} 
            initialChats={chats} 
            initialChatId={currentChatId}
          />
        </div>
      </main>

      <Footer user={user} />
    </>
  );
} 