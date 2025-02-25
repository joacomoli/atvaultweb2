import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { authenticateUser, createAuthToken, setAuthCookie } from "../../utils/auth.ts";

interface LoginData {
  error?: string;
}

export const handler: Handlers<LoginData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const email = form.get("email")?.toString();
      const password = form.get("password")?.toString();

      console.log("📧 Intento de login con email:", email);

      if (!email || !password) {
        console.log("❌ Email o contraseña faltantes");
        return ctx.render({ error: "Por favor ingresa tu email y contraseña" });
      }

      const user = await authenticateUser(email, password);
      console.log("👤 Usuario encontrado:", user ? {
        _id: user._id?.toString(),
        email: user.email,
        name: user.name,
        role: user.role
      } : null);

      if (!user || !user._id) {
        console.log("❌ Usuario no encontrado o credenciales inválidas");
        return ctx.render({ error: "Email o contraseña incorrectos" });
      }

      try {
        console.log("🔑 Creando token para usuario:", user._id.toString());
        const token = await createAuthToken(user._id.toString());
        console.log("✅ Token creado exitosamente");
        
        const response = new Response("", {
          status: 303,
          headers: { Location: "/blog" },
        });

        setAuthCookie(response, token);
        console.log("🍪 Cookie establecida, redirigiendo a /blog");
        return response;
      } catch (tokenError) {
        console.error("❌ Error creando token:", tokenError);
        return ctx.render({ error: "Error al iniciar sesión. Por favor intenta nuevamente." });
      }
    } catch (error) {
      console.error("❌ Error en login:", error);
      return ctx.render({ error: "Error al iniciar sesión" });
    }
  },
};

export default function LoginPage({ data }: PageProps<LoginData>) {
  return (
    <>
      <Head>
        <title>Iniciar Sesión - AT Vault</title>
      </Head>
      <Navbar />
      <main class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Iniciar Sesión
            </h2>
          </div>

          {data?.error && (
            <div class="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded relative">
              {data.error}
            </div>
          )}

          <form class="mt-8 space-y-6" method="POST">
            <div class="rounded-md shadow-sm -space-y-px">
              <div>
                <label for="email" class="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Email"
                />
              </div>
              <div>
                <label for="password" class="sr-only">Contraseña</label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-b-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Contraseña"
                />
              </div>
            </div>

            <div>
              <button
                type="submit"
                class="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                Iniciar Sesión
              </button>
            </div>

            <div class="text-center">
              <a href="/register" class="text-primary-600 hover:text-primary-500">
                ¿No tienes cuenta? Regístrate
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
} 