"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { ArrowLeft, Calendar, Clock, Tag } from "lucide-react"
import { AuthCheck } from "@/components/auth/auth-check"
import { Pencil } from "lucide-react"
import type { Post } from "@/lib/models/post"

export default function BlogPost({ postId }: { postId: string }) {
  const router = useRouter()
  const [post, setPost] = useState<Post | null>(null)
  const [loading, setLoading] = useState(true)
  const [relatedPosts, setRelatedPosts] = useState<Post[]>([])

  useEffect(() => {
    // Cargar el post y los posts relacionados
    async function loadPost() {
      if (!postId) return

      try {
        // Cargar el post
        const postResponse = await fetch(`/api/posts/${postId}`)

        if (!postResponse.ok) {
          throw new Error("Post not found")
        }

        const postData = await postResponse.json()
        setPost(postData)

        // Cargar posts relacionados
        const relatedResponse = await fetch(`/api/posts/related/${postId}`)
        const relatedData = await relatedResponse.json()
        setRelatedPosts(relatedData)
      } catch (error) {
        console.error("Error loading post:", error)
        router.push("/blog")
      } finally {
        setLoading(false)
      }
    }

    loadPost()
  }, [postId, router])

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando artículo...</p>
        </div>
      </div>
    )
  }

  if (!post) {
    return (
      <div className="container mx-auto px-4 py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Artículo no encontrado</h2>
        <p className="text-muted-foreground mb-6">El artículo que estás buscando no existe o ha sido eliminado.</p>
        <Button asChild>
          <Link href="/blog">Volver al Blog</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" onClick={() => router.push("/blog")}>
        <ArrowLeft size={16} />
        Volver al Blog
      </Button>

      <article className="max-w-3xl mx-auto">
        <header className="mb-8">
          <Badge variant="outline" className="mb-4">
            {post.category}
          </Badge>
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-4xl font-bold">{post.title}</h1>
            <AuthCheck requiredPermission="edit">
              <Button variant="outline" asChild>
                <Link href={`/admin/posts/${post._id}/edit`}>
                  <Pencil className="mr-2 h-4 w-4" />
                  Editar artículo
                </Link>
              </Button>
            </AuthCheck>
          </div>
          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={post.author.avatar || "/placeholder.svg?height=40&width=40"} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.bio || "Autor"}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1">
              <Calendar size={14} />
              <span>{post.date}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock size={14} />
              <span>{post.readTime}</span>
            </div>
          </div>

          {/* Cover image */}
          <div className="mb-8">
            <Image
              src={post.coverImage || "/placeholder.svg?height=400&width=800"}
              alt={post.coverImageAlt || post.title}
              width={800}
              height={400}
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </header>

        <div
          className="prose prose-lg max-w-none dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag size={12} />
              {tag}
            </Badge>
          ))}
        </div>

        <Separator className="my-8" />

        {relatedPosts.length > 0 && (
          <div className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Artículos Relacionados</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedPosts.map((relatedPost) => (
                <Card key={relatedPost._id?.toString()} className="overflow-hidden">
                  <div className="h-40 relative">
                    <Image
                      src={relatedPost.coverImage || "/placeholder.svg?height=400&width=600"}
                      alt={relatedPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="font-bold mb-2">
                      <Link href={`/blog/${relatedPost._id}`} className="hover:text-primary transition-colors">
                        {relatedPost.title}
                      </Link>
                    </h3>
                    <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{relatedPost.excerpt}</p>
                    <div className="flex items-center gap-2 text-xs text-muted-foreground">
                      <Calendar size={12} />
                      <span>{relatedPost.date}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        )}
      </article>
    </div>
  )
}

