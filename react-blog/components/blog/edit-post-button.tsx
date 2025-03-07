"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Pencil } from "lucide-react"

interface EditPostButtonProps {
  postId: number | string
}

export function EditPostButton({ postId }: EditPostButtonProps) {
  return (
    <Button variant="ghost" size="sm" asChild className="absolute top-2 right-2">
      <Link href={`/admin/posts/${postId}/edit`}>
        <Pencil className="mr-2 h-4 w-4" />
        Editar
      </Link>
    </Button>
  )
}

