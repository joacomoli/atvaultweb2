import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { connectDB } from "../../utils/db.ts";
import { IUser, USERS_COLLECTION, createUser } from "../../models/User.ts";

interface RegisterData {
  error?: string;
}

export const handler: Handlers<RegisterData> = {
  async POST(req, ctx) {
    try {
      const form = await req.formData();
      const name = form.get("name")?.toString();
      const email = form.get("email")?.toString();
      const password = form.get("password")?.toString();

      if (!name || !email || !password) {
        return ctx.render({ error: "Todos los campos son obligatorios" });
      }

      const db = await connectDB();
      
      // Verificar si el email ya existe
      const existingUser = await db.collection<IUser>(USERS_COLLECTION).findOne({ email });
      if (existingUser) {
        return ctx.render({ error: "El email ya está registrado" });
      }

      // Crear el usuario
      const userData = {
        name,
        email,
        password,
        role: "standard",
      };

      const user = await createUser(userData);
      await db.collection(USERS_COLLECTION).insertOne(user);

      return new Response("", {
        status: 303,
        headers: { Location: "/login" },
      });
    } catch (error) {
      console.error("Error en registro:", error);
      return ctx.render({ error: "Error al crear el usuario" });
    }
  },
};

export default function RegisterPage({ data }: PageProps<RegisterData>) {
  return (
    <>
      <Head>
        <title>Registro - AT Vault</title>
      </Head>
      <Navbar />
      <main class="min-h-screen bg-gray-50 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div class="max-w-md w-full space-y-8">
          <div>
            <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Crear una cuenta
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
                <label for="name" class="sr-only">Nombre</label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 rounded-t-md focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
                  placeholder="Nombre completo"
                />
              </div>
              <div>
                <label for="email" class="sr-only">Email</label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  class="appearance-none rounded-none relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary-500 focus:border-primary-500 focus:z-10 sm:text-sm"
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
                Registrarse
              </button>
            </div>

            <div class="text-center">
              <a href="/login" class="text-primary-600 hover:text-primary-500">
                ¿Ya tienes cuenta? Inicia sesión
              </a>
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </>
  );
} 