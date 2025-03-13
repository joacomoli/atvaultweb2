import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { authenticateUser, createAuthToken, setAuthCookie, getUserFromRequest } from "../../utils/auth.ts";
import { User } from "../../models/User.ts";
import LoginForm from "../../islands/LoginForm.tsx";

interface Data {
  user: User | null;
}

export const handler: Handlers<Data> = {
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
};

export default function LoginPage({ data }: PageProps<Data>) {
  const { user } = data;
  return (
    <>
      <Head>
        <title>Iniciar Sesión - AT Vault</title>
        <meta name="description" content="Inicia sesión en AT Vault para acceder a tu cuenta y contenido exclusivo." />
      </Head>

      <div class="min-h-screen flex flex-col">
        <Navbar user={user} />
        <main class="flex-grow bg-gray-50 pt-20 pb-12">
          <div class="container mx-auto px-4">
            <div class="max-w-md mx-auto">
              <h1 class="text-3xl font-bold text-gray-900 mb-8 text-center">
                Iniciar Sesión
              </h1>
              <LoginForm />
            </div>
          </div>
        </main>
        <Footer user={null} />
      </div>
    </>
  );
} 