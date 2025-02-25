import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../../utils/db.ts";
import { IPost, POSTS_COLLECTION, createPost, updatePost } from "../../../models/Post.ts";
import { ObjectId } from "npm:mongodb@6.3.0";

interface Data {
  post?: IPost;
  action: 'create' | 'edit';
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    const { action, id } = ctx.params;
    
    if (action !== 'create' && action !== 'edit') {
      return ctx.renderNotFound();
    }

    let post: IPost | undefined;

    if (action === 'edit' && id) {
      const db = await connectDB();
      post = await db.collection(POSTS_COLLECTION).findOne({ 
        _id: new ObjectId(id)
      }) as IPost | undefined;

      if (!post) {
        return ctx.renderNotFound();
      }
    }

    return ctx.render({ post, action });
  },
};

export default function BlogForm({ data }: PageProps<Data>) {
  const { post, action } = data;
  const isEdit = action === 'edit';

  return (
    <div class="max-w-4xl mx-auto py-8 px-4">
      <h1 class="text-3xl font-bold mb-8">
        {isEdit ? 'Editar Post' : 'Crear Nuevo Post'}
      </h1>
      <form class="space-y-6" method="POST">
        <div>
          <label class="block text-sm font-medium text-gray-700">Título</label>
          <input
            type="text"
            name="title"
            value={post?.title || ''}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Extracto</label>
          <textarea
            name="excerpt"
            rows={3}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {post?.excerpt || ''}
          </textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Contenido</label>
          <textarea
            name="content"
            rows={10}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            {post?.content || ''}
          </textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Imagen de Portada</label>
          <input
            type="url"
            name="coverImage"
            value={post?.coverImage || ''}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Categoría</label>
          <input
            type="text"
            name="category"
            value={post?.category || ''}
            required
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Tags</label>
          <input
            type="text"
            name="tags"
            value={post?.tags?.join(', ') || ''}
            placeholder="Separados por comas"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700">Estado</label>
          <select
            name="status"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500"
          >
            <option value="draft" selected={post?.status === 'draft'}>Borrador</option>
            <option value="published" selected={post?.status === 'published'}>Publicado</option>
          </select>
        </div>

        <div class="flex justify-end space-x-4">
          <a
            href="/admin/blog"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancelar
          </a>
          <button
            type="submit"
            class="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700"
          >
            {isEdit ? 'Actualizar' : 'Crear'}
          </button>
        </div>
      </form>
    </div>
  );
} 