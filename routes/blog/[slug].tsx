import { Handlers, PageProps } from "$fresh/server.ts";
import { connectDB } from "../../utils/db.ts";
import { IPost, POSTS_COLLECTION } from "../../models/Post.ts";
import { USERS_COLLECTION } from "../../models/User.ts";
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
      </Head>
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

        <div class="prose max-w-none">
          {post.content.split('\n').map((paragraph, index) => (
            <p key={index} class="mb-4">
              {paragraph}
            </p>
          ))}
        </div>

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
    </>
  );
} 