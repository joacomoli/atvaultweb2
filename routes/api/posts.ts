import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { getUserFromRequest } from "../../utils/auth.ts";
import { createPost, generateSlug, POSTS_COLLECTION } from "../../models/Post.ts";

export const handler: Handlers = {
  async GET(req) {
    try {
      const db = await connectDB();
      const posts = await db.collection(POSTS_COLLECTION).find().toArray();
      return new Response(JSON.stringify(posts), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    } catch (error) {
      console.error("Error al obtener posts:", error);
      return new Response(
        JSON.stringify({ error: "Error al obtener posts" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },

  async POST(req) {
    try {
      const user = await getUserFromRequest(req);
      if (!user) {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const form = await req.formData();
      const title = form.get("title") as string;
      const excerpt = form.get("excerpt") as string;
      const content = form.get("content") as string;
      const category = form.get("category") as string;
      const tags = (form.get("tags") as string || "")
        .split(",")
        .map((tag) => tag.trim())
        .filter(Boolean);

      if (!title || !excerpt || !content || !category) {
        return new Response(
          JSON.stringify({ error: "Todos los campos son requeridos" }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }

      const db = await connectDB();
      const post = createPost({
        title,
        slug: generateSlug(title),
        excerpt,
        content,
        category,
        tags,
        authorId: user._id,
        published: true,
      });

      await db.collection(POSTS_COLLECTION).insertOne(post);

      return new Response("", {
        status: 302,
        headers: { Location: `/blog/${post.slug}` },
      });
    } catch (error) {
      console.error("Error al crear el post:", error);
      return new Response(
        JSON.stringify({ error: "Error al crear el post" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }
  },
}; 