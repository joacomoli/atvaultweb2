import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../models/Post.ts";
import { USERS_COLLECTION } from "../../models/User.ts";
import { ObjectId } from "mongodb";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { getUserFromRequest } from "../../utils/auth.ts";
import { User } from "../../models/User.ts";
import { PostCard } from "../../components/blog/PostCard.tsx";
import { Input } from "../../components/ui/Input.tsx";
import { Badge } from "../../components/ui/Badge.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Search, X } from "../../components/icons/index.tsx";

interface Data {
  posts: (IPost & { author: { name: string; image?: string } })[];
  categories: { name: string; count: number }[];
  tags: { name: string; count: number }[];
  user: User | null;
  searchTerm?: string;
  activeCategory?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    console.log("1. Iniciando GET request");
    const db = await connectDB();
    console.log("2. Conexión a DB establecida");
    
    const url = new URL(req.url);
    const searchTerm = url.searchParams.get("search") || "";
    const activeCategory = url.searchParams.get("category") || "all";
    console.log("3. Parámetros de URL:", { searchTerm, activeCategory });

    // Obtener usuario autenticado
    const user = await getUserFromRequest(req);
    console.log("4. Usuario:", user ? "Autenticado" : "No autenticado");

    try {
      console.log("5. Iniciando búsqueda de posts");
      
      // Construir la consulta base
      let query: any = { status: "published" };
      if (activeCategory !== "all") {
        query.category = activeCategory;
      }
      if (searchTerm) {
        query.$or = [
          { title: { $regex: searchTerm, $options: "i" } },
          { content: { $regex: searchTerm, $options: "i" } },
          { excerpt: { $regex: searchTerm, $options: "i" } },
          { category: { $regex: searchTerm, $options: "i" } },
          { tags: { $regex: searchTerm, $options: "i" } }
        ];
      }
      
      console.log("6. Query construido:", JSON.stringify(query));

      // Verificar documentos totales en la colección
      const totalDocs = await db.collection(POSTS_COLLECTION).countDocuments();
      console.log("7. Total documentos en la colección:", totalDocs);

      // Obtener un documento de ejemplo
      const sampleDoc = await db.collection(POSTS_COLLECTION).findOne({});
      console.log("8. Documento de ejemplo:", JSON.stringify(sampleDoc, null, 2));

      // Obtener posts con autores
      const posts = await db.collection(POSTS_COLLECTION)
        .aggregate([
          { $match: query },
          { $sort: { publishedAt: -1, createdAt: -1 } },
          {
            $lookup: {
              from: USERS_COLLECTION,
              localField: "author",
              foreignField: "_id",
              as: "author"
            }
          },
          {
            $unwind: {
              path: "$author",
              preserveNullAndEmptyArrays: true
            }
          },
          {
            $project: {
              _id: 1,
              title: 1,
              slug: 1,
              excerpt: 1,
              content: 1,
              coverImage: 1,
              category: 1,
              tags: 1,
              status: 1,
              createdAt: 1,
              publishedAt: 1,
              "author.name": 1,
              "author.image": 1
            }
          }
        ]).toArray();

      console.log("9. Posts encontrados:", posts.length);
      if (posts.length > 0) {
        console.log("10. Primer post:", JSON.stringify(posts[0], null, 2));
      }

      // Obtener categorías con conteo
      const categories = await db.collection(POSTS_COLLECTION).aggregate([
        { $match: { status: "published" } },
        { $group: { _id: "$category", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]).toArray();

      console.log("11. Categorías encontradas:", categories.length);

      // Obtener tags con conteo
      const tags = await db.collection(POSTS_COLLECTION).aggregate([
        { $match: { status: "published" } },
        { $unwind: "$tags" },
        { $group: { _id: "$tags", count: { $sum: 1 } } },
        { $project: { name: "$_id", count: 1, _id: 0 } },
        { $sort: { count: -1 } }
      ]).toArray();

      console.log("12. Tags encontrados:", tags.length);

      return ctx.render({ 
        posts, 
        categories, 
        tags, 
        user, 
        searchTerm, 
        activeCategory 
      });
    } catch (error) {
      console.error("13. ERROR:", error);
      return ctx.render({ 
        posts: [], 
        categories: [], 
        tags: [], 
        user, 
        searchTerm, 
        activeCategory 
      });
    }
  }
};

export default function BlogPage({ data }: PageProps<Data>) {
  const { posts, categories, tags, user, searchTerm, activeCategory } = data;

  return (
    <>
      <Head>
        <title>Blog - AT Vault</title>
        <meta name="description" content="Explora nuestros artículos sobre tecnología, innovación y soluciones empresariales." />
      </Head>

      <Navbar user={user} active="blog" />

      <main class="flex-1">
        <div class="container relative">
          <div class="mx-auto max-w-7xl py-16">
            <div class="flex items-center justify-between gap-4 mb-8">
              <div class="space-y-1">
                <h1 class="text-3xl font-bold tracking-tight">Blog</h1>
                <p class="text-muted-foreground">
                  Explora nuestros artículos sobre tecnología, innovación y soluciones empresariales.
                </p>
              </div>
              {user && (
                <Button onClick={() => window.location.href = "/blog/new"}>
                  Crear Post
                </Button>
              )}
            </div>

            <div class="flex flex-col md:flex-row gap-8">
              {/* Sidebar */}
              <aside class="w-full md:w-64 space-y-8">
                <div class="space-y-4">
                  <h2 class="text-xl font-semibold tracking-tight">Categorías</h2>
                  <div class="flex flex-col gap-2">
                    <Button
                      variant={activeCategory === "all" ? "default" : "ghost"}
                      class="justify-start h-9"
                      onClick={() => window.location.href = "/blog"}
                    >
                      Todas
                    </Button>
                    {categories.map((category) => (
                      <Button
                        key={category.name}
                        variant={activeCategory === category.name ? "default" : "ghost"}
                        class="justify-start h-9"
                        onClick={() => window.location.href = `/blog?category=${encodeURIComponent(category.name)}`}
                      >
                        {category.name} ({category.count})
                      </Button>
                    ))}
                  </div>
                </div>

                <div class="space-y-4">
                  <h2 class="text-xl font-semibold tracking-tight">Etiquetas populares</h2>
                  <div class="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        class="cursor-pointer"
                        onClick={() => window.location.href = `/blog?search=${encodeURIComponent(tag.name)}`}
                      >
                        {tag.name} ({tag.count})
                      </Badge>
                    ))}
                  </div>
                </div>
              </aside>

              {/* Main content */}
              <div class="flex-1 space-y-6">
                <div class="space-y-4">
                  <form action="/blog" method="get" class="relative">
                    <Search class="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      type="search"
                      name="search"
                      placeholder="Buscar artículos..."
                      value={searchTerm}
                      class="pl-10 pr-10 w-full"
                    />
                    {searchTerm && (
                      <button
                        type="button"
                        onClick={() => window.location.href = "/blog"}
                        class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground hover:text-foreground transition-colors"
                      >
                        <X />
                      </button>
                    )}
                  </form>

                  {(searchTerm || activeCategory !== "all") && (
                    <div class="flex items-center gap-2">
                      <span class="text-sm text-muted-foreground">Filtros:</span>
                      {searchTerm && (
                        <Badge variant="secondary" class="gap-1 px-2 py-0.5">
                          {searchTerm}
                          <button
                            onClick={() => window.location.href = "/blog"}
                            class="ml-1 ring-offset-background transition-colors hover:text-foreground"
                          >
                            <X class="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      {activeCategory !== "all" && (
                        <Badge variant="secondary" class="gap-1 px-2 py-0.5">
                          {activeCategory}
                          <button
                            onClick={() => window.location.href = "/blog"}
                            class="ml-1 ring-offset-background transition-colors hover:text-foreground"
                          >
                            <X class="h-3 w-3" />
                          </button>
                        </Badge>
                      )}
                      <Button
                        variant="link"
                        class="text-sm text-muted-foreground hover:text-foreground px-0"
                        onClick={() => window.location.href = "/blog"}
                      >
                        Limpiar filtros
                      </Button>
                    </div>
                  )}
                </div>

                {posts.length > 0 ? (
                  <div class="grid gap-6 sm:grid-cols-2">
                    {posts.map((post) => (
                      <PostCard key={post._id.toString()} post={post} searchTerm={searchTerm} />
                    ))}
                  </div>
                ) : (
                  <div class="flex min-h-[400px] flex-col items-center justify-center text-center">
                    <div class="mx-auto flex max-w-[420px] flex-col items-center justify-center text-center">
                      <div class="flex h-20 w-20 items-center justify-center rounded-full bg-muted">
                        <Search class="h-10 w-10 text-muted-foreground" />
                      </div>
                      <h2 class="mt-6 text-xl font-semibold">No se encontraron artículos</h2>
                      <p class="mt-2 text-center text-sm text-muted-foreground">
                        No se encontraron artículos que coincidan con tu búsqueda. Intenta con otros términos.
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <Footer user={user} />
    </>
  );
} 