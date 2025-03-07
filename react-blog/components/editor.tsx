"use client"

import { useEffect, useRef } from "react"
import EditorJS from "@editorjs/editorjs"

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Escribe tu artículo aquí...",
      },
    },
  ],
}

interface EditorProps {
  value: string
  onChange: (value: string) => void
}

export default function Editor({ value, onChange }: EditorProps) {
  const editorRef = useRef<EditorJS>()

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new EditorJS({
        holder: "editor",
        placeholder: "Escribe tu artículo aquí...",
        data: value ? JSON.parse(value) : DEFAULT_INITIAL_DATA,
        onChange: async () => {
          const content = await editor.save()
          onChange(JSON.stringify(content))
        },
        tools: {
          // Aquí irían las configuraciones de las herramientas
          // Como enlaces, imágenes, listas, etc.
        },
      })

      editorRef.current = editor
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy()
        editorRef.current = undefined
      }
    }
  }, [value, onChange]) // Added value and onChange to dependencies

  return (
    <div className="prose prose-lg max-w-none">
      <div id="editor" className="min-h-[500px]" />
    </div>
  )
}

