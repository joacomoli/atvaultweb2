import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../models/Post.ts";
import { USERS_COLLECTION } from "../../models/User.ts";
import { ObjectId } from "mongodb";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { getUserFromRequest } from "../../utils/auth.ts";
import { UserRole } from "../../models/User.ts";

interface Data {
  posts: IPost[];
  isAdmin: boolean;
}

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    try {
      const db = await connectDB();
      const posts = await db.collection<IPost>(POSTS_COLLECTION)
        .find({ status: 'published' })
        .sort({ publishedAt: -1 })
        .toArray();

      // Obtener los autores de los posts
      const authorIds = posts.map(post => new ObjectId(post.author.toString()));
      const authors = await db.collection(USERS_COLLECTION)
        .find(
          { _id: { $in: authorIds } },
          { projection: { name: 1, image: 1 } }
        )
        .toArray();

      // Crear un mapa de autores para fácil acceso
      const authorMap = new Map(authors.map(author => [author._id.toString(), author]));

      // Agregar la información del autor a cada post
      const postsWithAuthors = posts.map(post => ({
        ...post,
        author: authorMap.get(post.author.toString()) || { name: 'Anónimo' }
      }));

      // Verificar si el usuario es administrador
      const user = await getUserFromRequest(req);
      const isAdmin = user?.role === UserRole.ADMIN;

      return _ctx.render({ posts: postsWithAuthors, isAdmin });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return _ctx.render({ posts: [], isAdmin: false });
    }
  },
};

export default function BlogPage({ data }: PageProps<Data>) {
  const { posts, isAdmin } = data;

  return (
    <>
      <Head>
        <title>Blog - AT Vault</title>
        <meta name="description" content="Explora nuestro blog con artículos sobre tecnología, Salesforce, y más." />
      </Head>
      <Navbar />
      <main class="min-h-screen bg-gray-50 pt-20 pb-12">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center mb-8">
            <h1 class="text-4xl font-bold text-gray-900">Blog AT Vault</h1>
            {isAdmin && (
              <a
                href="/admin/blog/create"
                class="bg-primary-600 text-white px-6 py-2 rounded-lg hover:bg-primary-700 transition-colors"
              >
                Crear Post
              </a>
            )}
          </div>
          
          {posts.length === 0 ? (
            <div class="text-center py-12">
              <h2 class="text-2xl font-semibold text-gray-700 mb-4">
                No hay posts disponibles
              </h2>
              <p class="text-gray-600">
                Pronto publicaremos contenido interesante. ¡Vuelve más tarde!
              </p>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post._id?.toString()} class="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  <img
                    src={post.coverImage || '/assets/images/default-post.jpg'}
                    alt={post.title}
                    class="w-full h-48 object-cover"
                  />
                  <div class="p-6">
                    <h2 class="text-xl font-semibold text-gray-900 mb-2">
                      <a href={`/blog/${post.slug}`} class="hover:text-primary-600">
                        {post.title}
                      </a>
                    </h2>
                    <p class="text-gray-600 mb-4">{post.excerpt}</p>
                    <div class="flex items-center justify-between">
                      <span class="text-sm text-gray-500">
                        {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <a
                        href={`/blog/${post.slug}`}
                        class="text-primary-600 hover:text-primary-700 font-medium"
                      >
                        Leer más →
                      </a>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
} 