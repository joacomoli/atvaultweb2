import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { connectDB } from "../../../utils/db.ts";
import { IPost, POSTS_COLLECTION, createPost } from "../../../models/Post.ts";
import { getUserFromRequest } from "../../../utils/auth.ts";

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
      const title = form.get("title")?.toString();
      const content = form.get("content")?.toString();
      const excerpt = form.get("excerpt")?.toString();
      const coverImage = form.get("coverImage")?.toString();
      const status = form.get("status")?.toString() as 'draft' | 'published' || 'published';

      if (!title || !content || !excerpt) {
        return ctx.render({ error: "Todos los campos son obligatorios" });
      }

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
      </Head>
      <div class="max-w-4xl mx-auto px-4 py-12">
        <h1 class="text-3xl font-bold mb-8">Crear Nuevo Post</h1>

        {data?.error && (
          <div class="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
            {data.error}
          </div>
        )}

        <form method="POST" class="space-y-6">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Título
            </label>
            <input
              type="text"
              name="title"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Extracto
            </label>
            <textarea
              name="excerpt"
              required
              rows={3}
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Contenido
            </label>
            <textarea
              name="content"
              required
              rows={10}
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            ></textarea>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              URL de la imagen de portada
            </label>
            <input
              type="url"
              name="coverImage"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
              placeholder="/assets/images/default-post.jpg"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Estado
            </label>
            <select
              name="status"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
            >
              <option value="published">Publicado</option>
              <option value="draft">Borrador</option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
          >
            Publicar Post
          </button>
        </form>
      </div>
    </>
  );
} 