import { Handlers, PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../../components/layout/Navbar.tsx";
import { Footer } from "../../components/layout/Footer.tsx";
import { getUserFromRequest } from "../../utils/auth.ts";
import { User } from "../../models/User.ts";
import { Input } from "../../components/ui/Input.tsx";
import { Button } from "../../components/ui/Button.tsx";
import { Badge } from "../../components/ui/Badge.tsx";
import { Card } from "../../components/ui/Card.tsx";
import { Label } from "../../components/ui/Label.tsx";
import { Textarea } from "../../components/ui/Textarea.tsx";
import { ImageUpload } from "../../components/ui/ImageUpload.tsx";
import { Editor } from "../../components/ui/Editor.tsx";

interface Data {
  user: User | null;
  error?: string;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const user = await getUserFromRequest(req);
    
    // Redirigir si no hay usuario autenticado
    if (!user) {
      return new Response("", {
        status: 302,
        headers: { Location: "/login" },
      });
    }

    return ctx.render({ user });
  },
};

export default function NewPostPage({ data }: PageProps<Data>) {
  const { user, error } = data;

  return (
    <>
      <Head>
        <title>Crear Post - AT Vault Blog</title>
        <meta name="description" content="Crea un nuevo artículo para el blog de AT Vault" />
      </Head>

      <Navbar user={user} active="blog" />

      <main class="flex-1 py-16">
        <div class="container max-w-4xl">
          <div class="flex items-center justify-between mb-8">
            <div>
              <h1 class="text-3xl font-bold tracking-tight">Crear Post</h1>
              <p class="text-muted-foreground mt-2">
                Crea un nuevo artículo para el blog
              </p>
            </div>
            <Button variant="outline" onClick={() => window.location.href = "/blog"}>
              Cancelar
            </Button>
          </div>

          {error && (
            <div class="bg-destructive/15 text-destructive px-4 py-3 rounded-lg mb-6">
              {error}
            </div>
          )}

          <form action="/api/posts" method="POST" class="space-y-8">
            <Card>
              <div class="p-6 space-y-6">
                <div class="space-y-4">
                  <div>
                    <Label htmlFor="coverImage">Imagen de portada</Label>
                    <ImageUpload
                      id="coverImage"
                      name="coverImage"
                      maxSize={5}
                      accept="image/*"
                      class="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="title">Título</Label>
                    <Input
                      id="title"
                      name="title"
                      placeholder="Escribe el título del artículo"
                      required
                      class="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="excerpt">Extracto</Label>
                    <Textarea
                      id="excerpt"
                      name="excerpt"
                      placeholder="Escribe un breve resumen del artículo"
                      required
                      class="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="category">Categoría</Label>
                    <Input
                      id="category"
                      name="category"
                      placeholder="Ej: Tecnología, Innovación, etc."
                      required
                      class="mt-2"
                    />
                  </div>

                  <div>
                    <Label htmlFor="tags">Etiquetas</Label>
                    <Input
                      id="tags"
                      name="tags"
                      placeholder="Separa las etiquetas con comas"
                      class="mt-2"
                    />
                    <p class="text-sm text-muted-foreground mt-2">
                      Las etiquetas ayudan a categorizar y encontrar tu artículo más fácilmente
                    </p>
                  </div>

                  <div>
                    <Label htmlFor="content">Contenido</Label>
                    <div class="mt-2 prose prose-stone dark:prose-invert">
                      <Editor
                        id="content"
                        name="content"
                        placeholder="Escribe el contenido de tu artículo..."
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>
              <div class="flex items-center justify-end gap-4 p-6 border-t border-border">
                <Button type="button" variant="outline" onClick={() => window.location.href = "/blog"}>
                  Cancelar
                </Button>
                <Button type="submit">
                  Publicar artículo
                </Button>
              </div>
            </Card>
          </form>
        </div>
      </main>

      <Footer user={user} />
    </>
  );
} 