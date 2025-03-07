"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Check, ChevronsUpDown, ImagePlus, Loader2, X } from "lucide-react"
import { cn } from "@/lib/utils"
import { useRouter } from "next/navigation"

// Importar el editor de texto rico dinámicamente para evitar errores de SSR
const Editor = dynamic(() => import("@/components/editor"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-muted rounded-md">
      <Loader2 className="h-8 w-8 animate-spin" />
    </div>
  ),
})

// Esquema de validación para el formulario
const postSchema = z.object({
  title: z.string().min(1, "El título es requerido"),
  slug: z.string().min(1, "El slug es requerido"),
  excerpt: z.string().min(1, "El resumen es requerido"),
  content: z.string().min(1, "El contenido es requerido"),
  coverImage: z.string().min(1, "La imagen de portada es requerida"),
  coverImageAlt: z.string().min(1, "El texto alternativo es requerido"),
  category: z.string().min(1, "La categoría es requerida"),
  tags: z.array(z.string()).min(1, "Al menos una etiqueta es requerida"),
  metaTitle: z.string().min(1, "El título meta es requerido"),
  metaDescription: z.string().min(1, "La descripción meta es requerida"),
  status: z.enum(["draft", "review", "published"]),
})

// Categorías de ejemplo
const categories = [
  { id: "desarrollo", name: "Desarrollo" },
  { id: "diseno", name: "Diseño" },
  { id: "marketing", name: "Marketing" },
  { id: "tecnologia", name: "Tecnología" },
]

// Etiquetas populares de ejemplo
const popularTags = [
  "React",
  "JavaScript",
  "TypeScript",
  "Next.js",
  "Node.js",
  "CSS",
  "HTML",
  "UI/UX",
  "Frontend",
  "Backend",
  "DevOps",
  "Cloud",
  "AWS",
  "Docker",
  "Kubernetes",
  "API",
]

interface PostEditorProps {
  postId?: string
}

export default function PostEditor({ postId }: PostEditorProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [openTags, setOpenTags] = useState(false)
  const [isLoading, setIsLoading] = useState(postId ? true : false)
  const router = useRouter()

  const form = useForm<z.infer<typeof postSchema>>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      title: "",
      slug: "",
      excerpt: "",
      content: "",
      coverImage: "",
      coverImageAlt: "",
      category: "",
      tags: [],
      metaTitle: "",
      metaDescription: "",
      status: "draft",
    },
  })

  useEffect(() => {
    if (postId) {
      // Cargar los datos del post
      async function loadPost() {
        try {
          const response = await fetch(`/api/posts/${postId}`)
          const data = await response.json()

          // Actualizar el formulario con los datos del post
          form.reset({
            title: data.title,
            slug: data.slug,
            excerpt: data.excerpt,
            content: data.content,
            coverImage: data.coverImage,
            coverImageAlt: data.coverImageAlt,
            category: data.category,
            tags: data.tags,
            metaTitle: data.metaTitle,
            metaDescription: data.metaDescription,
            status: data.status,
          })

          setSelectedTags(data.tags)
        } catch (error) {
          console.error("Error loading post:", error)
        } finally {
          setIsLoading(false)
        }
      }

      loadPost()
    }
  }, [postId, form])

  // Modificar el título según si es edición o creación
  const title = postId ? "Editar Artículo" : "Crear Nuevo Artículo"

  if (isLoading) {
    return (
      <div className="container mx-auto py-8">
        <div className="flex items-center justify-center">
          <Loader2 className="h-8 w-8 animate-spin" />
        </div>
      </div>
    )
  }

  async function onSubmit(data: z.infer<typeof postSchema>) {
    setIsSubmitting(true)

    try {
      const url = postId ? `/api/posts/${postId}` : "/api/posts"
      const method = postId ? "PUT" : "POST"

      const response = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
          // Aquí iría el token de autenticación
          Authorization: `Bearer ${localStorage.getItem("authToken")}`, // Ajustar según su implementación
        },
        body: JSON.stringify(data),
      })

      if (!response.ok) {
        throw new Error("Error al guardar el post")
      }

      const savedPost = await response.json()

      // Redirigir a la página del post o a la lista de posts
      if (method === "POST") {
        router.push(`/admin/posts/${savedPost._id}/edit`)
      } else {
        // Mostrar mensaje de éxito
        console.log("Post actualizado exitosamente")
      }
    } catch (error) {
      console.error("Error al guardar el post:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">{title}</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => form.setValue("status", "draft")} disabled={isSubmitting}>
            Guardar borrador
          </Button>
          <Button variant="outline" onClick={() => form.setValue("status", "review")} disabled={isSubmitting}>
            Enviar a revisión
          </Button>
          <Button onClick={() => form.setValue("status", "published")} disabled={isSubmitting}>
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Publicando...
              </>
            ) : (
              "Publicar"
            )}
          </Button>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Contenido principal */}
            <div className="lg:col-span-2 space-y-8">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Título */}
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título</FormLabel>
                        <FormControl>
                          <Input placeholder="Escribe el título del artículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Slug */}
                  <FormField
                    control={form.control}
                    name="slug"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Slug</FormLabel>
                        <FormControl>
                          <Input placeholder="url-del-articulo" {...field} />
                        </FormControl>
                        <FormDescription>La URL amigable del artículo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Resumen */}
                  <FormField
                    control={form.control}
                    name="excerpt"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Resumen</FormLabel>
                        <FormControl>
                          <Textarea placeholder="Escribe un breve resumen del artículo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Editor de contenido */}
                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Contenido</FormLabel>
                        <FormControl>
                          <Editor value={field.value} onChange={field.onChange} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* Imagen de portada */}
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <FormField
                        control={form.control}
                        name="coverImage"
                        render={({ field }) => (
                          <FormItem className="flex-1">
                            <FormLabel>Imagen de portada</FormLabel>
                            <FormControl>
                              <div className="flex gap-2">
                                <Input placeholder="URL de la imagen" {...field} />
                                <Button type="button" variant="outline" size="icon">
                                  <ImagePlus className="h-4 w-4" />
                                </Button>
                              </div>
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
                    <FormField
                      control={form.control}
                      name="coverImageAlt"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Texto alternativo</FormLabel>
                          <FormControl>
                            <Input placeholder="Describe la imagen para accesibilidad" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Barra lateral */}
            <div className="space-y-8">
              {/* Categoría y etiquetas */}
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Categoría */}
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Categoría</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona una categoría" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {/* Etiquetas */}
                  <FormField
                    control={form.control}
                    name="tags"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Etiquetas</FormLabel>
                        <FormControl>
                          <Popover open={openTags} onOpenChange={setOpenTags}>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                role="combobox"
                                aria-expanded={openTags}
                                className="w-full justify-between"
                              >
                                {selectedTags.length === 0
                                  ? "Seleccionar etiquetas"
                                  : `${selectedTags.length} etiqueta(s) seleccionada(s)`}
                                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0">
                              <Command>
                                <CommandInput placeholder="Buscar etiqueta..." />
                                <CommandList>
                                  <CommandEmpty>No se encontraron etiquetas.</CommandEmpty>
                                  <CommandGroup>
                                    <div className="max-h-[200px] overflow-y-auto p-1">
                                      {popularTags.map((tag) => (
                                        <CommandItem
                                          key={tag}
                                          onSelect={() => {
                                            const newTags = selectedTags.includes(tag)
                                              ? selectedTags.filter((t) => t !== tag)
                                              : [...selectedTags, tag]
                                            setSelectedTags(newTags)
                                            field.onChange(newTags)
                                          }}
                                          className="flex items-center gap-2 px-2 py-1.5 cursor-pointer hover:bg-accent rounded-sm"
                                        >
                                          <div className="flex items-center flex-1">
                                            <Check
                                              className={cn(
                                                "mr-2 h-4 w-4 flex-shrink-0",
                                                selectedTags.includes(tag) ? "opacity-100" : "opacity-0",
                                              )}
                                            />
                                            <span>{tag}</span>
                                          </div>
                                        </CommandItem>
                                      ))}
                                    </div>
                                  </CommandGroup>
                                </CommandList>
                              </Command>
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <div className="flex flex-wrap gap-2 mt-2">
                          {selectedTags.map((tag) => (
                            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
                              {tag}
                              <Button
                                type="button"
                                variant="ghost"
                                size="icon"
                                className="h-4 w-4 p-0 hover:bg-transparent"
                                onClick={() => {
                                  const newTags = selectedTags.filter((t) => t !== tag)
                                  setSelectedTags(newTags)
                                  field.onChange(newTags)
                                }}
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </Badge>
                          ))}
                        </div>
                        <FormDescription>Selecciona las etiquetas relevantes para tu artículo</FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>

              {/* SEO */}
              <Card>
                <CardContent className="p-6">
                  <Tabs defaultValue="meta" className="w-full">
                    <TabsList className="w-full">
                      <TabsTrigger value="meta" className="flex-1">
                        Meta Tags
                      </TabsTrigger>
                      <TabsTrigger value="preview" className="flex-1">
                        Vista previa
                      </TabsTrigger>
                    </TabsList>
                    <TabsContent value="meta" className="space-y-4 mt-4">
                      <FormField
                        control={form.control}
                        name="metaTitle"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Título Meta</FormLabel>
                            <FormControl>
                              <Input placeholder="Título para SEO" {...field} />
                            </FormControl>
                            <FormDescription>50-60 caracteres recomendados</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={form.control}
                        name="metaDescription"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Descripción Meta</FormLabel>
                            <FormControl>
                              <Textarea placeholder="Descripción para SEO" {...field} />
                            </FormControl>
                            <FormDescription>150-160 caracteres recomendados</FormDescription>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </TabsContent>
                    <TabsContent value="preview" className="mt-4">
                      <div className="space-y-2">
                        <h3 className="text-blue-600 text-xl hover:underline">
                          {form.watch("metaTitle") || "Título del artículo"}
                        </h3>
                        <p className="text-sm text-green-700">
                          https://tu-sitio.com/blog/{form.watch("slug") || "url-del-articulo"}
                        </p>
                        <p className="text-sm text-gray-600">
                          {form.watch("metaDescription") || "Descripción del artículo para motores de búsqueda..."}
                        </p>
                      </div>
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </Form>
    </div>
  )
}

