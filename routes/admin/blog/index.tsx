import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { connectDB } from "../../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../../models/Post.ts";
import { getUserFromRequest } from "../../../utils/auth.ts";
import { Navbar } from "../../../components/layout/Navbar.tsx";
import { Footer } from "../../../components/layout/Footer.tsx";

interface Data {
  posts: IPost[];
  user: any;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      // Verificar autenticación
      const user = await getUserFromRequest(req);
      if (!user || user.role !== "admin") {
        return new Response("", {
          status: 307,
          headers: { Location: "/login" },
        });
      }

      const db = await connectDB();
      const posts = await db.collection(POSTS_COLLECTION)
        .find({})
        .sort({ createdAt: -1 })
        .toArray() as IPost[];

      return ctx.render({ posts, user });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return ctx.render({ posts: [], user: null });
    }
  },
};

export default function AdminBlogPage({ data }: PageProps<Data>) {
  const { posts, user } = data;

  return (
    <>
      <Head>
        <title>Administrar Blog - AT Vault</title>
      </Head>
      
      <Navbar user={user} active="admin" />

      <main class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div class="max-w-7xl mx-auto py-8 px-4">
          <div class="sm:flex sm:items-center">
            <div class="sm:flex-auto">
              <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Posts</h1>
              <p class="mt-2 text-sm text-gray-700 dark:text-gray-300">
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
                  <table class="min-w-full divide-y divide-gray-300 dark:divide-gray-700">
                    <thead class="bg-gray-50 dark:bg-gray-800">
                      <tr>
                        <th scope="col" class="py-3.5 pl-4 pr-3 text-left text-sm font-semibold text-gray-900 dark:text-gray-200 sm:pl-6">
                          Título
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                          Estado
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                          Categoría
                        </th>
                        <th scope="col" class="px-3 py-3.5 text-left text-sm font-semibold text-gray-900 dark:text-gray-200">
                          Fecha
                        </th>
                        <th scope="col" class="relative py-3.5 pl-3 pr-4 sm:pr-6">
                          <span class="sr-only">Acciones</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody class="divide-y divide-gray-200 dark:divide-gray-700 bg-white dark:bg-gray-800">
                      {posts.map((post) => (
                        <tr key={post._id?.toString()}>
                          <td class="whitespace-nowrap py-4 pl-4 pr-3 text-sm font-medium text-gray-900 dark:text-gray-200 sm:pl-6">
                            {post.title}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            <span class={`inline-flex rounded-full px-2 text-xs font-semibold leading-5 ${
                              post.status === 'published' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' 
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                            }`}>
                              {post.status === 'published' ? 'Publicado' : 'Borrador'}
                            </span>
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {post.category}
                          </td>
                          <td class="whitespace-nowrap px-3 py-4 text-sm text-gray-500 dark:text-gray-400">
                            {new Date(post.createdAt).toLocaleDateString()}
                          </td>
                          <td class="relative whitespace-nowrap py-4 pl-3 pr-4 text-right text-sm font-medium sm:pr-6">
                            <a
                              href={`/admin/blog/edit?id=${post._id}`}
                              class="text-primary-600 hover:text-primary-900 dark:text-primary-400 dark:hover:text-primary-300"
                            >
                              Editar
                            </a>
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
      </main>

      <Footer user={user} />
    </>
  );
} 