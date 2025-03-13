import { JSX } from "preact";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "../ui/Card.tsx";
import { Badge } from "../ui/Badge.tsx";
import { IPost } from "../../models/Post.ts";
import { CalendarIcon, Clock, Tag } from "../icons/index.tsx";

interface PostCardProps {
  post: IPost & { author?: { name: string; image?: string } };
  searchTerm?: string;
}

export function PostCard({ post, searchTerm }: PostCardProps) {
  // Función para resaltar texto que coincide con la búsqueda
  const highlightText = (text: string, term: string) => {
    if (!term) return text;

    const parts = text.split(new RegExp(`(${term})`, "gi"));
    return parts.map((part, i) =>
      part.toLowerCase() === term.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">
          {part}
        </mark>
      ) : part
    );
  };

  // Función para formatear la fecha
  const formatDate = (date: Date | string) => {
    return new Intl.DateTimeFormat('es-ES', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  // Calcular tiempo de lectura (asumiendo 200 palabras por minuto)
  const readingTime = Math.ceil(post.content.split(/\s+/).length / 200);

  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-all duration-200">
      {post.coverImage && (
        <div className="relative aspect-video overflow-hidden">
          <img
            src={post.coverImage}
            alt={post.title}
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-200 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background/80 to-background/20" />
        </div>
      )}
      <CardHeader className="space-y-0 p-4">
        <div className="flex items-center justify-between space-y-0 pb-2">
          <Badge variant="secondary" className="px-2 py-0.5 text-xs font-medium">
            {post.category}
          </Badge>
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{formatDate(post.publishedAt || post.createdAt)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              <span>{readingTime} min</span>
            </div>
          </div>
        </div>
        <CardTitle className="line-clamp-2">
          <a
            href={`/blog/${post.slug}`}
            className="text-lg font-semibold hover:text-primary transition-colors duration-200"
          >
            {searchTerm ? highlightText(post.title, searchTerm) : post.title}
          </a>
        </CardTitle>
      </CardHeader>
      <CardContent className="p-4 pt-0">
        <p className="text-sm text-muted-foreground line-clamp-3">
          {searchTerm ? highlightText(post.excerpt, searchTerm) : post.excerpt}
        </p>
      </CardContent>
      <CardFooter className="flex items-center justify-between p-4 pt-0">
        <div className="flex items-center gap-2">
          {post.author ? (
            <>
              <div className="relative h-7 w-7 rounded-full overflow-hidden bg-muted">
                {post.author.image ? (
                  <img
                    src={post.author.image}
                    alt={post.author.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex items-center justify-center bg-primary/10">
                    <span className="text-xs font-medium text-primary">
                      {post.author.name.charAt(0)}
                    </span>
                  </div>
                )}
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">{post.author.name}</span>
                <span className="text-xs text-muted-foreground">Autor</span>
              </div>
            </>
          ) : (
            <div className="flex items-center gap-2">
              <div className="h-7 w-7 rounded-full flex items-center justify-center bg-muted">
                <span className="text-xs font-medium text-muted-foreground">?</span>
              </div>
              <div className="flex flex-col">
                <span className="text-sm font-medium leading-none">Autor Desconocido</span>
                <span className="text-xs text-muted-foreground">Autor</span>
              </div>
            </div>
          )}
        </div>
        {post.tags && post.tags.length > 0 && (
          <div className="flex items-center gap-1.5">
            {post.tags.slice(0, 2).map((tag) => (
              <Badge key={tag} variant="outline" className="px-2 py-0.5 text-xs gap-1">
                <Tag className="h-3 w-3" />
                {tag}
              </Badge>
            ))}
            {post.tags.length > 2 && (
              <span className="text-xs text-muted-foreground">+{post.tags.length - 2}</span>
            )}
          </div>
        )}
      </CardFooter>
    </Card>
  );
} 