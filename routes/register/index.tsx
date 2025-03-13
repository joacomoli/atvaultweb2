import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { connectDB } from "../../utils/db.ts";
import { IUser, USERS_COLLECTION, createUser } from "../../models/User.ts";
import { getUserFromRequest } from "../../utils/auth.ts";
import { User } from "../../models/User.ts";
import RegisterForm from "../../islands/RegisterForm.tsx";

interface RegisterData {
  error?: string;
  user: User | null;
}

export const handler: Handlers<RegisterData> = {
  async GET(req, ctx) {
    const user = await getUserFromRequest(req);
    // Si el usuario ya está autenticado, redirigir a la página principal
    if (user) {
      return new Response("", {
        status: 307,
        headers: { Location: "/" },
      });
    }
    return ctx.render({ user });
  },

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
  const { user } = data;
  return (
    <>
      <Head>
        <title>Registro - AT Vault</title>
        <meta name="description" content="Regístrate en AT Vault para acceder a contenido exclusivo y más funcionalidades." />
      </Head>

      <div class="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main class="flex-grow bg-gray-50 pt-20 pb-12">
          <div class="container mx-auto px-4">
            <div class="max-w-md mx-auto">
              <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
                Crear una cuenta
              </h1>
              <RegisterForm />
            </div>
          </div>
        </main>
        <Footer user={null} />
      </div>
    </>
  );
} 