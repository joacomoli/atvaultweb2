"use client"

import { useState, useEffect } from "react"
import { Command } from "@/components/ui/command"
import { Badge } from "@/components/ui/badge"

interface TagSearchProps {
  allTags: string[]
  selectedTags: string[]
  onTagSelect: (tag: string) => void
}

export function TagSearch({ allTags, selectedTags, onTagSelect }: TagSearchProps) {
  const [search, setSearch] = useState("")
  const [filteredTags, setFilteredTags] = useState(allTags)

  useEffect(() => {
    const filtered = allTags.filter((tag) => tag.toLowerCase().includes(search.toLowerCase()))
    setFilteredTags(filtered)
  }, [search, allTags])

  return (
    <div className="space-y-4">
      <Command>
        <div className="flex items-center border-b px-3">
          <input
            placeholder="Buscar etiquetas..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex h-10 w-full rounded-md bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
          />
        </div>
      </Command>

      <div className="flex flex-wrap gap-2">
        {filteredTags.map((tag) => (
          <Badge
            key={tag}
            variant={selectedTags.includes(tag) ? "default" : "secondary"}
            className="cursor-pointer"
            onClick={() => onTagSelect(tag)}
          >
            {tag}
          </Badge>
        ))}
      </div>
    </div>
  )
}

