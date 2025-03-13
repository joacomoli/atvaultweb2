import { JSX } from "preact";
import { useState } from "preact/hooks";

export default function LoginForm(): JSX.Element {
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData(e.currentTarget as HTMLFormElement);
    const email = formData.get("email")?.toString();
    const password = formData.get("password")?.toString();

    if (!email || !password) {
      setError("Por favor ingresa email y contraseña");
      setLoading(false);
      return;
    }

    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include' // Importante: para que acepte cookies
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Error en el login");
      }

      console.log("Login exitoso, verificando usuario...");
      
      // Verificar que las cookies se hayan establecido
      const verifyResponse = await fetch("/api/user", {
        credentials: 'include'
      });

      if (!verifyResponse.ok) {
        throw new Error("Error al verificar la sesión");
      }

      const userData = await verifyResponse.json();
      console.log("Sesión verificada:", userData);

      // Redirigir al home
      window.location.href = "/";
      
    } catch (err) {
      console.error("Error en login:", err);
      setError(err instanceof Error ? err.message : "Error en el login");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div class="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md">
      {error && (
        <div class="bg-red-50 dark:bg-red-900 border border-red-200 dark:border-red-700 text-red-600 dark:text-red-200 px-4 py-3 rounded relative mb-4">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} class="space-y-6">
        <div>
          <label htmlFor="email" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <div>
          <label htmlFor="password" class="block text-sm font-medium text-gray-700 dark:text-gray-200">
            Contraseña
          </label>
          <input
            type="password"
            name="password"
            id="password"
            required
            class="mt-1 block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-700 dark:text-white"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          class={`w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:hover:bg-primary-500 ${
            loading ? "opacity-75 cursor-not-allowed" : ""
          }`}
        >
          {loading ? "Iniciando sesión..." : "Iniciar Sesión"}
        </button>

        <div class="text-center">
          <a href="/register" class="text-primary-600 hover:text-primary-500 dark:text-primary-400 dark:hover:text-primary-300">
            ¿No tienes cuenta? Regístrate
          </a>
        </div>
      </form>
    </div>
  );
} 