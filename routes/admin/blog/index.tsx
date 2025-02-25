import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../../models/Post.ts";
import { Head } from "$fresh/runtime.ts";

interface Data {
  posts: IPost[];
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    try {
      const db = await connectDB();
      const posts = await db.collection(POSTS_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray() as IPost[];

      return ctx.render({ posts });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return ctx.render({ posts: [] });
    }
  },
};

export default function AdminBlogPage({ data }: PageProps<Data>) {
  const { posts } = data;

  return (
    <>
      <Head>
        <title>Administrar Blog - AT Vault</title>
      </Head>
      <div class="max-w-7xl mx-auto py-8 px-4">
        <div class="sm:flex sm:items-center">
          <div class="sm:flex-auto">
            <h1 class="text-3xl font-bold text-gray-900">Posts</h1>
            <p class="mt-2 text-sm text-gray-700">
              Lista de todos los posts del blog
            </p>
          </div>
          <div class="mt-4 sm:mt-0 sm:ml-16 sm:flex-none">
            <a
              href="/admin/blog/create"
              class="inline-flex items-center justify-center rounded-md border border-transparent bg-primary-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 sm:w-auto"
            >
              Crear Post
            </a>
          </div>
        </div>
        <div class="mt-8 flex flex-col">
          <div class="-my-2 -mx-4 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div class="inline-block min-w-full py-2 align-middle md:px-6 lg:px-8">
              <div class="overflow-hidden shadow ring-1 ring-black ring-opacity-5 md:rounded-lg">
                <table class="min-w-full divide-y divide-gray-300">
                  <thead class="bg-gray-50">
                    <tr>
                      <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 sm:pl-6">
                        Título
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Estado
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Categoría
                      </th>
                      <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900">
                        Fecha
                      </th>
                      <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                        <span class="sr-only">Acciones</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    {posts.map((post) => (
                      <tr key={post._id?.toString()}>
                        <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 sm:pl-6">
                          {post.title}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                            post.status === 'published' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {post.status === 'published' ? 'Publicado' : 'Borrador'}
                          </span>
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {post.category}
                        </td>
                        <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500">
                          {new Date(post.createdAt).toLocaleDateString()}
                        </td>
                        <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                          <a
                            href={`/admin/blog/edit?id=${post._id}`}
                            class="text-primary-600 hover:text-primary-900 mr-4"
                          >
                            Editar
                          </a>
                          <button
                            onClick={() => handleDelete(post._id?.toString() || '')}
                            class="text-red-600 hover:text-red-900"
                          >
                            Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );

  async function handleDelete(id: string) {
    if (!confirm('¿Estás seguro de que quieres eliminar este post?')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/blog/posts/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        window.location.reload();
      } else {
        alert('Error al eliminar el post');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('Error al eliminar el post');
    }
  }
} 