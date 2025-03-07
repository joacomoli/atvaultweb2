"use client"

import type React from "react"
import { useEffect, useState } from "react"

interface AuthCheckProps {
  children: React.ReactNode
  fallback?: React.ReactNode
  requiredPermission?: "create" | "edit" | "delete"
}

export function AuthCheck({ children, fallback, requiredPermission }: AuthCheckProps) {
  const [isAuthorized, setIsAuthorized] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Verificar la autorización del usuario
    async function checkAuth() {
      try {
        // Si se requiere un permiso específico, verificarlo
        if (requiredPermission) {
          const response = await fetch(`/api/auth/check-permission?permission=${requiredPermission}`)
          const data = await response.json()
          setIsAuthorized(data.hasPermission)
        } else {
          // Verificación general de autenticación
          const response = await fetch("/api/auth/check")
          const data = await response.json()
          setIsAuthorized(data.isAuthenticated)
        }
      } catch (error) {
        console.error("Error checking auth:", error)
        setIsAuthorized(false)
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [requiredPermission])

  if (isLoading) {
    return null
  }

  return isAuthorized ? children : fallback
}

