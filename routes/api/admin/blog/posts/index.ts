import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../../../../utils/db.ts";
import { IPost, POSTS_COLLECTION, createPost } from "../../../../../models/Post.ts";
import { User } from "../../../../../models/User.ts";

export const handler: Handlers = {
  async GET(_req, _ctx) {
    try {
      const db = await connectDB();
      const posts = await db.collection(POSTS_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray();

      return new Response(JSON.stringify(posts), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return new Response(JSON.stringify({ error: 'Error al obtener los posts' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async POST(req, _ctx) {
    try {
      const db = await connectDB();
      const data = await req.json();
      
      // Crear el post con los campos requeridos
      const post = createPost({
        ...data,
        status: data.status || 'draft',
        publishedAt: data.status === 'published' ? new Date() : null,
      });

      const result = await db.collection(POSTS_COLLECTION).insertOne(post);

      if (!result.insertedId) {
        throw new Error('No se pudo crear el post');
      }

      return new Response(JSON.stringify({ 
        message: 'Post creado correctamente',
        id: result.insertedId 
      }), {
        status: 201,
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al crear post:', error);
      return new Response(JSON.stringify({ error: 'Error al crear el post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },
}; 