import { JSX } from "preact";
import { IPost } from "../../models/Post.ts";

interface PostContentProps {
  post: IPost & { author: { name: string; image?: string } };
}

export function PostContent({ post }: PostContentProps): JSX.Element {
  return (
    <article class="max-w-3xl mx-auto">
      <header class="mb-8">
        <div class="flex items-center justify-between mb-4">
          <h1 class="text-4xl font-bold">{post.title}</h1>
        </div>
        <div class="flex items-center gap-4 mb-6">
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span class="text-gray-500">
              {new Date(post.publishedAt).toLocaleDateString('es-ES', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </span>
          </div>
          <div class="flex items-center gap-2">
            <svg class="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span class="text-gray-500">{post.readTime || "5 min"}</span>
          </div>
        </div>

        {/* Cover image */}
        {post.coverImage && (
          <div class="mb-8">
            <img
              src={post.coverImage}
              alt={post.title}
              class="w-full h-auto rounded-lg object-cover"
            />
          </div>
        )}
      </header>

      <div
        class="prose prose-lg max-w-none dark:prose-invert mb-8"
        dangerouslySetInnerHTML={{ __html: post.content }}
      />

      {/* Tags */}
      {post.tags && post.tags.length > 0 && (
        <div class="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <span
              key={tag}
              class="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
            >
              {tag}
            </span>
          ))}
        </div>
      )}
    </article>
  );
} 