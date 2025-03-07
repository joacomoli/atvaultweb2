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
  searchTerm?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, _ctx) {
    try {
      const url = new URL(req.url);
      const searchTerm = url.searchParams.get("search") || "";
      
      const db = await connectDB();
      
      // Construir la consulta base
      let query: any = { status: 'published' };
      
      // Agregar búsqueda si hay término
      if (searchTerm) {
        query = {
          ...query,
          $or: [
            { title: { $regex: searchTerm, $options: 'i' } },
            { content: { $regex: searchTerm, $options: 'i' } },
            { excerpt: { $regex: searchTerm, $options: 'i' } },
            { category: { $regex: searchTerm, $options: 'i' } }
          ]
        };
      }

      const posts = await db.collection<IPost>(POSTS_COLLECTION)
        .find(query)
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

      const authorMap = new Map(authors.map(author => [author._id.toString(), author]));
      const postsWithAuthors = posts.map(post => ({
        ...post,
        author: authorMap.get(post.author.toString()) || { name: 'Anónimo' }
      }));

      const user = await getUserFromRequest(req);
      const isAdmin = user?.role === UserRole.ADMIN;

      return _ctx.render({ posts: postsWithAuthors, isAdmin, searchTerm });
    } catch (error) {
      console.error('Error al obtener posts:', error);
      return _ctx.render({ posts: [], isAdmin: false, searchTerm: "" });
    }
  },
};

export default function BlogPage({ data }: PageProps<Data>) {
  const { posts, isAdmin, searchTerm = "" } = data;

  return (
    <>
      <Head>
        <title>Blog - AT Vault</title>
        <meta name="description" content="Explora nuestro blog con artículos sobre tecnología, Salesforce, y más." />
      </Head>

      <Navbar />
      <main class="min-h-screen bg-gray-50 pt-20 pb-12">
        <div class="container mx-auto px-4">
          {/* Hero Section */}
          <div class="text-center mb-12">
            <h1 class="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
              Blog AT Vault
            </h1>
            <p class="text-xl text-gray-600 max-w-2xl mx-auto">
              Descubre artículos sobre tecnología, desarrollo, y las últimas tendencias en el mundo digital.
            </p>
          </div>

          {/* Barra de búsqueda */}
          <form class="max-w-2xl mx-auto mb-12" method="GET">
            <div class="relative">
              <input
                type="text"
                name="search"
                value={searchTerm}
                placeholder="Buscar artículos..."
                class="w-full px-6 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
              />
              <svg
                class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
              {searchTerm && (
                <a
                  href="/blog"
                  class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </a>
              )}
            </div>
          </form>

          {/* Resultados de búsqueda */}
          {searchTerm && (
            <div class="max-w-2xl mx-auto mb-8">
              <p class="text-gray-600">
                {posts.length === 0 
                  ? `No se encontraron resultados para "${searchTerm}"` 
                  : `Se encontraron ${posts.length} resultado${posts.length === 1 ? '' : 's'} para "${searchTerm}"`}
              </p>
            </div>
          )}

          {/* Grid de posts */}
          {posts.length === 0 ? (
            <div class="text-center py-12">
              <h2 class="text-2xl font-semibold text-gray-700 mb-4">
                No hay posts disponibles
              </h2>
              <p class="text-gray-600">
                {searchTerm 
                  ? "Intenta con otros términos de búsqueda"
                  : "Pronto publicaremos contenido interesante. ¡Vuelve más tarde!"}
              </p>
            </div>
          ) : (
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {posts.map((post) => (
                <article key={post._id?.toString()} class="bg-white rounded-xl shadow-md overflow-hidden hover:shadow-xl transition-all duration-300">
                  <div class="relative h-48">
                    <img
                      src={post.coverImage || '/assets/images/default-post.jpg'}
                      alt={post.title}
                      class="w-full h-full object-cover"
                    />
                    <div class="absolute top-4 left-4">
                      <span class="px-3 py-1 bg-primary-600 text-white rounded-full text-sm">
                        {post.category || 'General'}
                      </span>
                    </div>
                  </div>
                  <div class="p-6">
                    <h2 class="text-xl font-bold text-gray-900 mb-3">
                      <a href={`/blog/${post.slug}`} class="hover:text-primary-600 transition-colors">
                        {post.title}
                      </a>
                    </h2>
                    <p class="text-gray-600 mb-4 line-clamp-2">{post.excerpt}</p>
                    <div class="flex items-center justify-between text-sm text-gray-500">
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <span>{new Date(post.publishedAt).toLocaleDateString('es-ES', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}</span>
                      </div>
                      <div class="flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>{post.readTime || "5 min"}</span>
                      </div>
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