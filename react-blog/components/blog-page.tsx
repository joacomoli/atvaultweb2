"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CalendarIcon, Clock, Search, Tag, TrendingUp } from "lucide-react"

// Datos de ejemplo para el blog
const blogPosts = [
  {
    id: 1,
    title: "10 Trucos para Mejorar tu Productividad como Desarrollador",
    excerpt:
      "Descubre las mejores prácticas y herramientas para aumentar tu productividad en el desarrollo de software.",
    coverImage: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=800&h=400&fit=crop",
    author: "Ana García",
    date: "2024-02-28",
    readTime: "5 min",
    category: "Productividad",
    tags: ["Desarrollo", "Productividad", "Herramientas"],
    featured: true,
  },
  {
    id: 2,
    title: "Introducción a la Inteligencia Artificial",
    excerpt: "Una guía básica para entender los conceptos fundamentales de la IA y su aplicación en el mundo real.",
    coverImage: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    author: "Carlos Ruiz",
    date: "2024-02-25",
    readTime: "8 min",
    category: "Tecnología",
    tags: ["IA", "Machine Learning", "Tecnología"],
    featured: true,
  },
  {
    id: 3,
    title: "Diseño UI/UX: Tendencias 2024",
    excerpt: "Las últimas tendencias en diseño de interfaces y experiencia de usuario que debes conocer este año.",
    coverImage: "https://images.unsplash.com/photo-1545235617-9465d2a55698?w=800&h=400&fit=crop",
    author: "Laura Martínez",
    date: "2024-02-20",
    readTime: "6 min",
    category: "Diseño",
    tags: ["UI", "UX", "Diseño"],
    featured: true,
  },
  {
    id: 4,
    title: "Guía Completa de React Hooks",
    excerpt: "Aprende a utilizar los React Hooks más importantes y cómo implementarlos en tus proyectos.",
    coverImage: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?w=800&h=400&fit=crop",
    author: "David López",
    date: "2024-02-15",
    readTime: "10 min",
    category: "Desarrollo",
    tags: ["React", "JavaScript", "Frontend"],
    featured: true,
  },
  {
    id: 5,
    title: "Optimización de Bases de Datos SQL",
    excerpt: "Técnicas avanzadas para mejorar el rendimiento de tus consultas SQL y optimizar tu base de datos.",
    coverImage: "https://images.unsplash.com/photo-1544383835-bda2bc66a55d?w=800&h=400&fit=crop",
    author: "Miguel Sánchez",
    date: "2024-02-10",
    readTime: "12 min",
    category: "Bases de Datos",
    tags: ["SQL", "Optimización", "Backend"],
    featured: false,
  },
]

// Obtener categorías únicas
const categories = [...new Set(blogPosts.map((post) => post.category))]

// Obtener artículos destacados
const featuredPosts = blogPosts.filter((post) => post.featured)

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")

  // Filtrar posts basado en búsqueda y categoría
  const filteredPosts = blogPosts.filter((post) => {
    const matchesSearch =
      post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = activeCategory === "all" || post.category === activeCategory
    return matchesSearch && matchesCategory
  })

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nuestro Blog</h1>

      {/* Barra de búsqueda */}
      <div className="max-w-2xl mx-auto mb-12 relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
        <Input
          type="text"
          placeholder="Buscar artículos..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Sección de destacados */}
      <section className="mb-16">
        <div className="flex items-center gap-2 mb-6">
          <TrendingUp className="text-primary" size={24} />
          <h2 className="text-2xl font-bold">Artículos Destacados</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredPosts.map((post) => (
            <Card key={post.id} className="group overflow-hidden">
              <div className="aspect-[16/9] overflow-hidden">
                <Image
                  src={post.coverImage || "/placeholder.svg"}
                  alt={post.title}
                  width={800}
                  height={450}
                  className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <CardHeader>
                <div className="flex items-center gap-2 mb-2">
                  <Badge variant="outline">{post.category}</Badge>
                  <span className="text-sm text-muted-foreground">{post.readTime}</span>
                </div>
                <CardTitle className="line-clamp-2">
                  <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                    {post.title}
                  </Link>
                </CardTitle>
                <CardDescription className="line-clamp-2">{post.excerpt}</CardDescription>
              </CardHeader>
            </Card>
          ))}
        </div>
      </section>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar con categorías */}
        <aside className="w-full md:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Temas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-col gap-2">
                <Button
                  variant={activeCategory === "all" ? "default" : "ghost"}
                  className="justify-start"
                  onClick={() => setActiveCategory("all")}
                >
                  Todos los artículos
                </Button>
                {categories.map((category) => (
                  <Button
                    key={category}
                    variant={activeCategory === category ? "default" : "ghost"}
                    className="justify-start"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Lista de artículos */}
        <main className="flex-1">
          <div className="space-y-6">
            {filteredPosts.map((post) => (
              <Card key={post.id} className="overflow-hidden">
                <div className="md:flex">
                  <div className="md:w-1/3 shrink-0">
                    <Image
                      src={post.coverImage || "/placeholder.svg"}
                      alt={post.title}
                      width={600}
                      height={400}
                      className="h-48 md:h-full w-full object-cover"
                    />
                  </div>
                  <div className="p-6 md:w-2/3">
                    <CardHeader className="p-0 pb-2">
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="outline">{post.category}</Badge>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Clock size={14} className="mr-1" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                      <CardTitle className="mb-2">
                        <Link href={`/blog/${post.id}`} className="hover:text-primary transition-colors">
                          {post.title}
                        </Link>
                      </CardTitle>
                      <CardDescription className="flex items-center text-sm">
                        <CalendarIcon size={14} className="mr-1" />
                        {post.date}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 py-4">
                      <p className="text-muted-foreground">{post.excerpt}</p>
                    </CardContent>
                    <CardFooter className="p-0 pt-2 flex flex-col items-start">
                      <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                            <Tag size={12} />
                            {tag}
                          </Badge>
                        ))}
                      </div>
                      <Button asChild variant="outline" size="sm">
                        <Link href={`/blog/${post.id}`}>Leer más</Link>
                      </Button>
                    </CardFooter>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </main>
      </div>
    </div>
  )
}

