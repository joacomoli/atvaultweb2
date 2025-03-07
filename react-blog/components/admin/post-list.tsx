"use client"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Edit2, Eye, FilePlus, MoreHorizontal, Trash } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Datos de ejemplo
const posts = [
  {
    id: 1,
    title: "10 Trucos para Mejorar tu Productividad",
    author: "Ana García",
    category: "Productividad",
    status: "published",
    date: "2024-02-28",
  },
  {
    id: 2,
    title: "Introducción a la Inteligencia Artificial",
    author: "Carlos Ruiz",
    category: "Tecnología",
    status: "draft",
    date: "2024-02-25",
  },
  {
    id: 3,
    title: "Diseño UI/UX: Tendencias 2024",
    author: "Laura Martínez",
    category: "Diseño",
    status: "review",
    date: "2024-02-20",
  },
]

const statusColors = {
  published: "success",
  draft: "secondary",
  review: "warning",
} as const

export default function PostList() {
  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Artículos</h1>
        <Button asChild>
          <Link href="/admin/posts/new">
            <FilePlus className="mr-2 h-4 w-4" />
            Nuevo artículo
          </Link>
        </Button>
      </div>

      <Card>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Título</TableHead>
              <TableHead>Autor</TableHead>
              <TableHead>Categoría</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Fecha</TableHead>
              <TableHead className="text-right">Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {posts.map((post) => (
              <TableRow key={post.id}>
                <TableCell className="font-medium">{post.title}</TableCell>
                <TableCell>{post.author}</TableCell>
                <TableCell>{post.category}</TableCell>
                <TableCell>
                  <Badge variant={statusColors[post.status as keyof typeof statusColors]}>
                    {post.status === "published" && "Publicado"}
                    {post.status === "draft" && "Borrador"}
                    {post.status === "review" && "En revisión"}
                  </Badge>
                </TableCell>
                <TableCell>{post.date}</TableCell>
                <TableCell className="text-right">
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>
                        <Eye className="mr-2 h-4 w-4" />
                        Ver
                      </DropdownMenuItem>
                      <DropdownMenuItem>
                        <Edit2 className="mr-2 h-4 w-4" />
                        Editar
                      </DropdownMenuItem>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem className="text-destructive">
                        <Trash className="mr-2 h-4 w-4" />
                        Eliminar
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Card>
    </div>
  )
}

