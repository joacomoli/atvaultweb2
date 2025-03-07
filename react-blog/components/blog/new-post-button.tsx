"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"

export function NewPostButton() {
  return (
    <Button asChild className="fixed bottom-8 right-8 shadow-lg" size="lg">
      <Link href="/admin/posts/new">
        <Plus className="mr-2 h-4 w-4" />
        Nuevo Artículo
      </Link>
    </Button>
  )
}

