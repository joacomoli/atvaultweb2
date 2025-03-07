"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, Calendar, Clock, Facebook, Heart, Linkedin, MessageCircle, Send, Tag, Twitter } from "lucide-react"

// Ejemplo de un artículo
const post = {
  id: 1,
  title: "10 Trucos para Mejorar tu Productividad como Desarrollador",
  excerpt: "Descubre las mejores prácticas y herramientas para aumentar tu productividad en el desarrollo de software.",
  content: `
    <p>La productividad es clave en el desarrollo de software. En este artículo, exploraremos diez trucos efectivos para mejorar tu eficiencia como desarrollador.</p>
    
    <h2>1. Automatiza tareas repetitivas</h2>
    <p>La automatización es tu mejor amiga. Identifica las tareas que realizas frecuentemente y crea scripts para automatizarlas.</p>
    
    <h2>2. Utiliza atajos de teclado</h2>
    <p>Aprende los atajos de teclado de tu IDE. Te sorprenderá cuánto tiempo puedes ahorrar.</p>
    
    <h2>3. Implementa la técnica Pomodoro</h2>
    <p>Trabaja en intervalos enfocados de 25 minutos seguidos de descansos cortos.</p>
  `,
  coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
  author: {
    name: "Ana García",
    avatar: "/placeholder.svg?height=40&width=40",
    bio: "Desarrolladora Senior & Tech Writer",
  },
  date: "2024-02-28",
  readTime: "5 min",
  category: "Productividad",
  tags: ["Desarrollo", "Productividad", "Herramientas"],
}

export default function BlogPost() {
  const [newComment, setNewComment] = useState("")
  const [comments, setComments] = useState([
    {
      id: 1,
      author: {
        name: "Juan Pérez",
        avatar: "/placeholder.svg?height=40&width=40",
      },
      date: "2024-02-28",
      content: "Excelente artículo, muy completo y bien explicado.",
      likes: 5,
    },
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <Button variant="ghost" className="mb-6 flex items-center gap-2" asChild>
        <Link href="/blog">
          <ArrowLeft size={16} />
          Volver al Blog
        </Link>
      </Button>

      <article className="max-w-3xl mx-auto">
        {/* Cabecera del artículo */}
        <header className="mb-8">
          <Badge variant="outline" className="mb-4">
            {post.category}
          </Badge>
          <h1 className="text-4xl font-bold mb-4">{post.title}</h1>

          <div className="flex items-center gap-4 mb-6">
            <Avatar>
              <AvatarImage src={post.author.avatar} alt={post.author.name} />
              <AvatarFallback>{post.author.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-medium">{post.author.name}</p>
              <p className="text-sm text-muted-foreground">{post.author.bio}</p>
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

          <Image
            src={post.coverImage || "/placeholder.svg"}
            alt={post.title}
            width={800}
            height={400}
            className="w-full h-auto rounded-lg object-cover"
          />
        </header>

        {/* Contenido del artículo */}
        <div
          className="prose prose-lg max-w-none dark:prose-invert mb-8"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />

        {/* Etiquetas */}
        <div className="flex flex-wrap gap-2 mb-8">
          {post.tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              <Tag size={12} />
              {tag}
            </Badge>
          ))}
        </div>

        {/* Botón "Quiero saber más" */}
        <div className="mb-8">
          <Dialog>
            <DialogTrigger asChild>
              <Button size="lg" className="w-full sm:w-auto">
                Quiero saber más
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Solicitar más información</DialogTitle>
                <DialogDescription>Completa el formulario y nos pondremos en contacto contigo.</DialogDescription>
              </DialogHeader>
              <form className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Nombre</Label>
                  <Input id="name" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message">Mensaje</Label>
                  <Textarea id="message" placeholder={`Me gustaría saber más sobre "${post.title}"`} required />
                </div>
                <Button type="submit" className="w-full">
                  <Send className="mr-2 h-4 w-4" />
                  Enviar solicitud
                </Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        {/* Botones de compartir */}
        <div className="flex items-center gap-4 mb-8">
          <span className="text-sm text-muted-foreground">Compartir:</span>
          <div className="flex gap-2">
            <Button variant="outline" size="icon" className="hover:text-blue-400">
              <Twitter size={18} />
            </Button>
            <Button variant="outline" size="icon" className="hover:text-blue-600">
              <Facebook size={18} />
            </Button>
            <Button variant="outline" size="icon" className="hover:text-blue-700">
              <Linkedin size={18} />
            </Button>
          </div>
        </div>

        <Separator className="my-12" />

        {/* Artículos relacionados */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Artículos Relacionados</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[1, 2].map((i) => (
              <Card key={i} className="overflow-hidden">
                <div className="h-40 relative">
                  <Image src="/placeholder.svg" alt="Artículo relacionado" fill className="object-cover" />
                </div>
                <div className="p-4">
                  <h3 className="font-bold mb-2">
                    <Link href="#" className="hover:text-primary transition-colors">
                      Título del artículo relacionado {i}
                    </Link>
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">Breve descripción del artículo relacionado...</p>
                  <div className="flex items-center gap-2 text-xs text-muted-foreground">
                    <Calendar size={12} />
                    <span>2024-02-28</span>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Sección de comentarios */}
        <div className="space-y-6">
          <h3 className="text-xl font-semibold flex items-center gap-2">
            <MessageCircle className="h-5 w-5" />
            Comentarios ({comments.length})
          </h3>

          {/* Formulario para nuevo comentario */}
          <form className="space-y-4">
            <Textarea
              placeholder="Escribe tu comentario..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              required
            />
            <Button type="submit">Publicar comentario</Button>
          </form>

          {/* Lista de comentarios */}
          <div className="space-y-4">
            {comments.map((comment) => (
              <Card key={comment.id} className="p-4">
                <div className="flex items-start gap-4">
                  <Avatar>
                    <AvatarImage src={comment.author.avatar} alt={comment.author.name} />
                    <AvatarFallback>{comment.author.name[0]}</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <h4 className="font-medium">{comment.author.name}</h4>
                        <p className="text-sm text-muted-foreground">{comment.date}</p>
                      </div>
                      <Button variant="ghost" size="sm" className="flex items-center gap-1">
                        <Heart size={14} />
                        {comment.likes}
                      </Button>
                    </div>
                    <p className="text-sm">{comment.content}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </article>
    </div>
  )
}

