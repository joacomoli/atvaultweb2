import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../models/Post.ts";
import { USERS_COLLECTION } from "../../models/User.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { ObjectId } from "mongodb";
import { Head } from "$fresh/runtime.ts";
import { getUserFromRequest } from "../../utils/auth.ts";
import { User } from "../../models/User.ts";
import { marked } from "https://esm.sh/marked@11.1.1";
import { PostContent } from "../../components/blog/PostContent.tsx";

interface Data {
  post: IPost & { author: { name: string; image?: string } };
  user: User | null;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    try {
      const { slug } = ctx.params;
      const db = await connectDB();

      const post = await db.collection<IPost>(POSTS_COLLECTION).findOne({ slug });
      if (!post) {
        return new Response("Post no encontrado", { status: 404 });
      }

      // Obtener el autor del post
      const author = await db.collection(USERS_COLLECTION).findOne(
        { _id: new ObjectId(post.author.toString()) },
        { projection: { name: 1, image: 1 } }
      );

      const postWithAuthor = {
        ...post,
        author: author || { name: "Anónimo" }
      };

      // Obtener el usuario actual
      const user = await getUserFromRequest(req);

      return ctx.render({ post: postWithAuthor, user });
    } catch (error) {
      console.error('Error al obtener el post:', error);
      return new Response("Error interno del servidor", { status: 500 });
    }
  },
};

export default function BlogPostPage({ data }: PageProps<Data>) {
  const { post, user } = data;

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
      <Navbar user={user} />
      <main class="min-h-screen bg-gray-50 pt-20 pb-12">
        <div class="container mx-auto px-4">
          <PostContent post={post} />
        </div>
      </main>
      <Footer user={user} />
    </>
  );
} 