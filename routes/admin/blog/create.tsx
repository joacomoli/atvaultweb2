import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { connectDB } from "../../../utils/db.ts";
import { IPost, POSTS_COLLECTION, createPost } from "../../../models/Post.ts";
import { getUserFromRequest } from "../../../utils/auth.ts";
import BlogForm from "../../../islands/BlogForm.tsx";

interface Data {
  error?: string;
  success?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    const user = await getUserFromRequest(req);
    if (!user || user.role !== "admin") {
      return new Response("", {
        status: 303,
        headers: { Location: "/login" },
      });
    }
    return _ctx.render({});
  },

  async POST(req, ctx) {
    try {
      // Verificar autenticación y rol
      const user = await getUserFromRequest(req);
      if (!user || user.role !== "admin") {
        return new Response("", {
          status: 303,
          headers: { Location: "/login" },
        });
      }

      const form = await req.formData();
      const title = form.get("title")?.toString() || "Sin título";
      const content = form.get("content")?.toString() || "";
      const excerpt = form.get("excerpt")?.toString() || "";
      const coverImage = form.get("coverImage")?.toString();
      const status = form.get("status")?.toString() as 'draft' | 'published' || 'published';

      const db = await connectDB();
      
      // Crear el slug desde el título
      const slug = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/(^-|-$)/g, "");

      const postData = {
        title,
        slug,
        content,
        excerpt,
        coverImage: coverImage || "/assets/images/default-post.jpg",
        status,
        publishedAt: new Date(),
        author: user._id,
      };

      const post = createPost(postData);
      await db.collection(POSTS_COLLECTION).insertOne(post);

      return new Response("", {
        status: 303,
        headers: { Location: "/blog" },
      });
    } catch (error) {
      console.error("Error al crear post:", error);
      return ctx.render({ error: "Error al crear el post" });
    }
  },
};

export default function CreatePost({ data }: PageProps<Data>) {
  return (
    <>
      <Head>
        <title>Crear Post - AT Vault Blog</title>
        <style>{`
          .content-editor {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            min-height: 400px;
            padding: 1rem;
            white-space: pre-wrap;
          }
          .image-preview {
            max-width: 200px;
            max-height: 200px;
            object-fit: cover;
            border-radius: 0.5rem;
          }
        `}</style>
      </Head>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Crear Nuevo Post</h1>

        {data?.error && (
          <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {data.error}
          </div>
        )}

        <BlogForm error={data?.error} />
      </div>
    </>
  );
} 