import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../models/Post.ts";
import { USERS_COLLECTION } from "../../models/User.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { ObjectId } from "mongodb";
import { Head } from "$fresh/runtime.ts";

interface Data {
  post: IPost | null;
}

export const handler: Handlers<Data> = {
  async GET(_req, ctx) {
    try {
      const db = await connectDB();
      const post = await db.collection<IPost>(POSTS_COLLECTION).findOne({
        slug: ctx.params.slug,
        status: 'published'
      });

      if (!post) {
        return ctx.renderNotFound();
      }

      // Obtener el autor
      const author = await db.collection(USERS_COLLECTION).findOne(
        { _id: new ObjectId(post.author.toString()) },
        { projection: { name: 1, image: 1 } }
      );

      // Agregar la información del autor al post
      post.author = author || { name: 'Anónimo' };

      return ctx.render({ post });
    } catch (error) {
      console.error('Error al obtener post:', error);
      return ctx.renderNotFound();
    }
  },
};

export default function PostPage({ data }: PageProps<Data>) {
  const { post } = data;

  if (!post) {
    return <div>Post no encontrado</div>;
  }

  return (
    <>
      <Head>
        <title>{post.title} - AT Vault Blog</title>
        <meta name="description" content={post.excerpt} />
        <style>{`
          .blog-content {
            max-width: 100%;
            overflow-x: hidden;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.6;
          }
          .blog-content p {
            margin: 1rem 0;
          }
          .blog-content img {
            max-width: 100%;
            height: auto;
            border-radius: 0.5rem;
            margin: 1.5rem 0;
          }
          .blog-content h1 {
            font-size: 2.25rem;
            font-weight: bold;
            margin: 2rem 0 1rem;
          }
          .blog-content h2 {
            font-size: 1.875rem;
            font-weight: bold;
            margin: 1.5rem 0 1rem;
          }
          .blog-content h3 {
            font-size: 1.5rem;
            font-weight: bold;
            margin: 1.25rem 0 0.75rem;
          }
          .blog-content ul, .blog-content ol {
            margin: 1rem 0;
            padding-left: 2rem;
          }
          .blog-content li {
            margin: 0.5rem 0;
          }
          .blog-content strong {
            font-weight: bold;
          }
          .blog-content em {
            font-style: italic;
          }
          .blog-content a {
            color: #2563eb;
            text-decoration: underline;
          }
          .blog-content a:hover {
            color: #1d4ed8;
          }
          .blog-content pre {
            background-color: #f3f4f6;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1.5rem 0;
          }
          .blog-content code {
            font-family: monospace;
            background-color: #f3f4f6;
            padding: 0.2rem 0.4rem;
            border-radius: 0.25rem;
          }
          .blog-content blockquote {
            border-left: 4px solid #e5e7eb;
            padding-left: 1rem;
            margin: 1.5rem 0;
            font-style: italic;
          }
          .blog-content table {
            width: 100%;
            border-collapse: collapse;
            margin: 1.5rem 0;
          }
          .blog-content th, .blog-content td {
            border: 1px solid #e5e7eb;
            padding: 0.75rem;
          }
          .blog-content th {
            background-color: #f9fafb;
          }
        `}</style>
      </Head>
      <Navbar />
      <article class="max-w-4xl mx-auto px-4 py-12">
        <header class="mb-8">
          <h1 class="text-4xl font-bold mb-4">{post.title}</h1>
          <div class="flex items-center text-gray-600">
            <span class="mr-4">Por {post.author.name}</span>
            <time dateTime={post.publishedAt?.toString()}>
              {new Date(post.publishedAt || post.createdAt).toLocaleDateString()}
            </time>
          </div>
        </header>

        {post.coverImage && (
          <img
            src={post.coverImage}
            alt={post.title}
            class="w-full h-96 object-cover rounded-lg mb-8"
          />
        )}

        <div 
          class="blog-content"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <footer class="mt-12 pt-8 border-t border-gray-200">
          <div class="flex flex-wrap gap-2">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </footer>
      </article>
      <Footer />
    </>
  );
} 