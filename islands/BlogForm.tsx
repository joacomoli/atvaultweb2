import { useSignal } from "@preact/signals";
import { JSX } from "preact";

interface BlogFormProps {
  error?: string;
}

export default function BlogForm({ error }: BlogFormProps): JSX.Element {
  const imageUrl = useSignal("");
  const uploadStatus = useSignal<"idle" | "uploading" | "success" | "error">("idle");
  const errorMessage = useSignal("");

  const handleImageUpload = async (e: Event) => {
    const input = e.target as HTMLInputElement;
    if (!input.files?.length) return;

    const file = input.files[0];
    uploadStatus.value = "uploading";

    const formData = new FormData();
    formData.append("image", file);

    try {
      const response = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        imageUrl.value = data.url;
        uploadStatus.value = "success";
        errorMessage.value = "";
      } else {
        uploadStatus.value = "error";
        errorMessage.value = data.error || "Error al subir la imagen";
      }
    } catch (error) {
      uploadStatus.value = "error";
      errorMessage.value = "Error al subir la imagen";
    }
  };

  return (
    <form method="POST" class="space-y-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Título
        </label>
        <input
          type="text"
          name="title"
          placeholder="Ingresa el título del post"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Extracto
        </label>
        <textarea
          name="excerpt"
          rows={3}
          placeholder="Breve descripción del post"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        ></textarea>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Contenido
        </label>
        <textarea
          name="content"
          class="w-full border rounded-lg focus:ring-2 focus:ring-primary-500 content-editor"
          placeholder="Escribe el contenido de tu post aquí..."
        ></textarea>
        <p class="mt-2 text-sm text-gray-500">
          Puedes usar HTML básico para dar formato (p, br, strong, em, ul, ol, li, etc.)
        </p>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Imagen de portada
        </label>
        <div class="space-y-4">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary-50 file:text-primary-700 hover:file:bg-primary-100"
          />
          <input 
            type="hidden" 
            name="coverImage" 
            value={imageUrl.value} 
          />
          
          {uploadStatus.value === "uploading" && (
            <div class="text-sm text-gray-500">
              Subiendo imagen...
            </div>
          )}
          
          {uploadStatus.value === "error" && (
            <div class="text-sm text-red-600">
              {errorMessage.value}
            </div>
          )}
          
          {imageUrl.value && (
            <div class="mt-4">
              <img 
                src={imageUrl.value} 
                alt="Vista previa" 
                class="image-preview"
              />
            </div>
          )}
        </div>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-2">
          Estado
        </label>
        <select
          name="status"
          class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
        >
          <option value="published">Publicado</option>
          <option value="draft">Borrador</option>
        </select>
      </div>

      <button
        type="submit"
        class="w-full bg-primary-600 text-white py-3 px-6 rounded-lg hover:bg-primary-700 transition-colors"
      >
        Publicar Post
      </button>
    </form>
  );
} 