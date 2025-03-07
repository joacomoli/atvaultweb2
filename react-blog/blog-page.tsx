"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Clock, Search, Tag, X } from "lucide-react"
import { AuthCheck } from "@/components/auth/auth-check"
import { EditPostButton } from "@/components/blog/edit-post-button"
import { NewPostButton } from "@/components/blog/new-post-button"
import type { PostWithRelevance } from "@/lib/models/post"

export default function BlogPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [activeCategory, setActiveCategory] = useState("all")
  const [searchOpen, setSearchOpen] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>([])
  const [posts, setPosts] = useState<PostWithRelevance[]>([])
  const [categories, setCategories] = useState<{ name: string; count: number }[]>([])
  const [allTags, setAllTags] = useState<{ name: string; count: number }[]>([])
  const [loading, setLoading] = useState(true)
  const [filteredPosts, setFilteredPosts] = useState<PostWithRelevance[]>([])

  // Cargar posts, categorías y etiquetas
  useEffect(() => {
    async function fetchData() {
      try {
        // Cargar posts
        const postsResponse = await fetch("/api/posts")
        const postsData = await postsResponse.json()
        setPosts(postsData)

        // Cargar categorías
        const categoriesResponse = await fetch("/api/posts/categories")
        const categoriesData = await categoriesResponse.json()
        setCategories(categoriesData)

        // Cargar etiquetas
        const tagsResponse = await fetch("/api/posts/tags")
        const tagsData = await tagsResponse.json()
        setAllTags(tagsData)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  // Filtrar posts cuando cambia la búsqueda o categoría
  useEffect(() => {
    async function filterPosts() {
      setLoading(true)
      try {
        let url = "/api/posts?"

        if (searchTerm) {
          url += `search=${encodeURIComponent(searchTerm)}&`
        }

        if (activeCategory !== "all") {
          url += `category=${encodeURIComponent(activeCategory)}&`
        }

        const response = await fetch(url)
        const data = await response.json()
        setFilteredPosts(data)
      } catch (error) {
        console.error("Error filtering posts:", error)
      } finally {
        setLoading(false)
      }
    }

    filterPosts()
  }, [searchTerm, activeCategory])

  // Función para resaltar texto que coincide con la búsqueda
  const highlightText = (text: string, searchTerm: string) => {
    if (!searchTerm) return text

    const parts = text.split(new RegExp(`(${searchTerm})`, "gi"))
    return parts.map((part, i) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <mark key={i} className="bg-yellow-200 dark:bg-yellow-800 rounded px-1">
          {part}
        </mark>
      ) : (
        part
      ),
    )
  }

  // Manejar la búsqueda
  const handleSearch = (term: string) => {
    setSearchTerm(term)
    setSearchOpen(false)

    // Añadir a búsquedas recientes si no está ya presente
    if (term && !recentSearches.includes(term)) {
      setRecentSearches((prev) => [term, ...prev].slice(0, 5))
    }
  }

  // Limpiar búsquedas recientes
  const clearRecentSearches = () => {
    setRecentSearches([])
  }

  // Obtener nombres de etiquetas
  const tagNames = useMemo(() => allTags.map((tag) => tag.name), [allTags])

  if (loading && posts.length === 0) {
    return (
      <div className="container mx-auto px-4 py-8 flex justify-center items-center min-h-[60vh]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Cargando artículos...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-8 text-center">Nuestro Blog</h1>

      {/* Enhanced Search Bar */}
      <div className="max-w-2xl mx-auto mb-8">
        <Popover open={searchOpen} onOpenChange={setSearchOpen}>
          <PopoverTrigger asChild>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={18} />
              <Input
                type="text"
                placeholder="Buscar artículos, temas, etiquetas..."
                className="pl-10 pr-4"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                onClick={() => setSearchOpen(true)}
              />
              {searchTerm && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-1/2 transform -translate-y-1/2"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={16} />
                </Button>
              )}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
            <Command>
              <CommandInput placeholder="Escribe para buscar..." />
              <CommandList>
                <CommandEmpty>No se encontraron resultados.</CommandEmpty>
                {recentSearches.length > 0 && (
                  <CommandGroup heading="Búsquedas recientes">
                    {recentSearches.map((term) => (
                      <CommandItem
                        key={term}
                        onSelect={() => handleSearch(term)}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center">
                          <Clock className="mr-2 h-4 w-4" />
                          {term}
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            setRecentSearches((prev) => prev.filter((t) => t !== term))
                          }}
                        >
                          <X size={14} />
                        </Button>
                      </CommandItem>
                    ))}
                    <CommandItem onSelect={clearRecentSearches} className="text-muted-foreground">
                      Limpiar búsquedas recientes
                    </CommandItem>
                  </CommandGroup>
                )}
                <CommandGroup heading="Categorías populares">
                  {categories.map((category) => (
                    <CommandItem
                      key={category.name}
                      onSelect={() => {
                        setActiveCategory(category.name)
                        setSearchOpen(false)
                      }}
                    >
                      {category.name} ({category.count} artículos)
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Etiquetas populares">
                  <div className="p-2 flex flex-wrap gap-2">
                    {allTags.slice(0, 15).map((tag) => (
                      <Badge
                        key={tag.name}
                        variant="secondary"
                        className="cursor-pointer"
                        onClick={() => handleSearch(tag.name)}
                      >
                        {tag.name}
                      </Badge>
                    ))}
                  </div>
                </CommandGroup>
              </CommandList>
            </Command>
          </PopoverContent>
        </Popover>

        {/* Active filters */}
        {(searchTerm || activeCategory !== "all") && (
          <div className="flex items-center gap-2 mt-4">
            <span className="text-sm text-muted-foreground">Filtros activos:</span>
            {searchTerm && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Búsqueda: {searchTerm}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setSearchTerm("")}
                >
                  <X size={14} />
                </Button>
              </Badge>
            )}
            {activeCategory !== "all" && (
              <Badge variant="secondary" className="flex items-center gap-1">
                Categoría: {activeCategory}
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-4 w-4 p-0 hover:bg-transparent"
                  onClick={() => setActiveCategory("all")}
                >
                  <X size={14} />
                </Button>
              </Badge>
            )}
          </div>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar with categories */}
        <aside className="w-full md:w-64 shrink-0">
          <Card>
            <CardHeader>
              <CardTitle>Temas</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <ul className="space-y-1">
                <li>
                  <Button
                    variant={activeCategory === "all" ? "default" : "ghost"}
                    className="w-full justify-start"
                    onClick={() => setActiveCategory("all")}
                  >
                    Todos los artículos
                    <Badge variant="secondary" className="ml-auto">
                      {posts.length}
                    </Badge>
                  </Button>
                </li>
                <Separator className="my-2" />
                {categories.map((category) => (
                  <li key={category.name}>
                    <Button
                      variant={activeCategory === category.name ? "default" : "ghost"}
                      className="w-full justify-start"
                      onClick={() => setActiveCategory(category.name)}
                    >
                      {category.name}
                      <Badge variant="secondary" className="ml-auto">
                        {category.count}
                      </Badge>
                    </Button>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Etiquetas Populares</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {allTags.slice(0, 10).map((tag) => (
                  <Badge
                    key={tag.name}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleSearch(tag.name)}
                  >
                    {tag.name}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* Main content - article listings */}
        <main className="flex-1">
          <div className="space-y-6">
            {filteredPosts.length === 0 ? (
              <div className="text-center py-12">
                <h2 className="text-xl font-medium">No se encontraron artículos</h2>
                <p className="text-muted-foreground mt-2">
                  {searchTerm
                    ? "Intenta con otros términos de búsqueda o navega por categorías"
                    : "No hay artículos en esta categoría"}
                </p>
              </div>
            ) : (
              <>
                {searchTerm && (
                  <p className="text-sm text-muted-foreground mb-4">
                    Se encontraron {filteredPosts.length} resultados para "{searchTerm}"
                  </p>
                )}
                {filteredPosts.map((post) => (
                  <Card key={post._id?.toString()} className="overflow-hidden relative">
                    <AuthCheck requiredPermission="edit">
                      <EditPostButton postId={post._id?.toString() || ""} />
                    </AuthCheck>
                    <div className="md:flex">
                      <div className="md:w-1/3 shrink-0">
                        <Image
                          src={post.coverImage || "/placeholder.svg?height=400&width=600"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="h-48 md:h-full w-full object-cover"
                        />
                      </div>
                      <div className="p-6 md:w-2/3">
                        <CardHeader className="p-0 pb-2">
                          <div className="flex items-center justify-between mb-2">
                            <Badge variant="outline">{highlightText(post.category, searchTerm)}</Badge>
                            <div className="flex items-center text-sm text-muted-foreground">
                              <Clock size={14} className="mr-1" />
                              <span>{post.readTime}</span>
                            </div>
                          </div>
                          <CardTitle className="mb-2">
                            <Link href={`/blog/${post._id}`} className="hover:text-primary transition-colors">
                              {highlightText(post.title, searchTerm)}
                            </Link>
                          </CardTitle>
                          <CardDescription className="flex items-center text-sm">
                            <CalendarIcon size={14} className="mr-1" />
                            {post.date}
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="p-0 py-4">
                          <p className="text-muted-foreground">{highlightText(post.excerpt, searchTerm)}</p>
                        </CardContent>
                        <CardFooter className="p-0 pt-2 flex flex-col items-start">
                          <div className="flex flex-wrap gap-2 mb-4">
                            {post.tags.map((tag) => (
                              <Badge
                                key={tag}
                                variant="secondary"
                                className="flex items-center gap-1 cursor-pointer"
                                onClick={() => handleSearch(tag)}
                              >
                                <Tag size={12} />
                                {highlightText(tag, searchTerm)}
                              </Badge>
                            ))}
                          </div>
                          <Button asChild variant="outline" size="sm">
                            <Link href={`/blog/${post._id}`}>Leer más</Link>
                          </Button>
                        </CardFooter>
                      </div>
                    </div>
                  </Card>
                ))}
              </>
            )}
          </div>
          <AuthCheck requiredPermission="create">
            <NewPostButton />
          </AuthCheck>
        </main>
      </div>
    </div>
  )
}

