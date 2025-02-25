import { Handlers } from "$fresh/server.ts";
import { getUserFromRequest } from "../../utils/auth.ts";

export const handler: Handlers = {
  async POST(req, _ctx) {
    try {
      // Verificar autenticación
      const user = await getUserFromRequest(req);
      if (!user || user.role !== "admin") {
        return new Response(JSON.stringify({ error: "No autorizado" }), {
          status: 401,
          headers: { "Content-Type": "application/json" },
        });
      }

      const form = await req.formData();
      const file = form.get("image") as File;
      
      if (!file) {
        return new Response(JSON.stringify({ error: "No se proporcionó ninguna imagen" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Verificar que sea una imagen
      if (!file.type.startsWith("image/")) {
        return new Response(JSON.stringify({ error: "El archivo debe ser una imagen" }), {
          status: 400,
          headers: { "Content-Type": "application/json" },
        });
      }

      // Crear el directorio si no existe
      const uploadDir = "./static/uploads";
      try {
        await Deno.mkdir(uploadDir, { recursive: true });
      } catch (error) {
        if (!(error instanceof Deno.errors.AlreadyExists)) {
          throw error;
        }
      }

      // Generar un nombre único para el archivo
      const extension = file.name.split(".").pop();
      const fileName = `${crypto.randomUUID()}.${extension}`;
      const filePath = `${uploadDir}/${fileName}`;

      // Convertir el archivo a ArrayBuffer
      const arrayBuffer = await file.arrayBuffer();
      const uint8Array = new Uint8Array(arrayBuffer);

      // Guardar el archivo
      await Deno.writeFile(filePath, uint8Array);

      // Devolver la URL del archivo
      return new Response(JSON.stringify({ 
        url: `/uploads/${fileName}`,
        success: true 
      }), {
        headers: { "Content-Type": "application/json" },
      });

    } catch (error) {
      console.error("Error al subir imagen:", error);
      return new Response(JSON.stringify({ error: "Error al subir la imagen" }), {
        status: 500,
        headers: { "Content-Type": "application/json" },
      });
    }
  },
}; 