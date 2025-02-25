import { Handlers } from "$fresh/server.ts";
import { connectDB } from "../../../../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../../../../models/Post.ts";
import { ObjectId } from "npm:mongodb@6.3.0";

export const handler: Handlers = {
  async GET(_req, ctx) {
    try {
      const db = await connectDB();
      const post = await db.collection(POSTS_COLLECTION).findOne({
        _id: new ObjectId(ctx.params.slug)
      });

      if (!post) {
        return new Response(JSON.stringify({ error: 'Post no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify(post), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al obtener post:', error);
      return new Response(JSON.stringify({ error: 'Error al obtener el post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async PATCH(req, ctx) {
    try {
      const db = await connectDB();
      const data = await req.json();
      
      const result = await db.collection(POSTS_COLLECTION).updateOne(
        { _id: new ObjectId(ctx.params.slug) },
        { $set: { ...data, updatedAt: new Date() } }
      );

      if (!result.matchedCount) {
        return new Response(JSON.stringify({ error: 'Post no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: 'Post actualizado correctamente' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al actualizar post:', error);
      return new Response(JSON.stringify({ error: 'Error al actualizar el post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  },

  async DELETE(_req, ctx) {
    try {
      const db = await connectDB();
      const result = await db.collection(POSTS_COLLECTION).deleteOne({
        _id: new ObjectId(ctx.params.slug)
      });

      if (!result.deletedCount) {
        return new Response(JSON.stringify({ error: 'Post no encontrado' }), {
          status: 404,
          headers: { 'Content-Type': 'application/json' }
        });
      }

      return new Response(JSON.stringify({ message: 'Post eliminado correctamente' }), {
        headers: { 'Content-Type': 'application/json' }
      });
    } catch (error) {
      console.error('Error al eliminar post:', error);
      return new Response(JSON.stringify({ error: 'Error al eliminar el post' }), {
        status: 500,
        headers: { 'Content-Type': 'application/json' }
      });
    }
  }
}; 