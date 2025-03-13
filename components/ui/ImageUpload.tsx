import { JSX } from "preact";
import { useState } from "preact/hooks";
import { Button } from "./Button.tsx";

interface ImageUploadProps extends JSX.HTMLAttributes<HTMLInputElement> {
  maxSize?: number; // in MB
  accept?: string;
  onUpload?: (file: File) => void;
}

export function ImageUpload({ id, name, maxSize = 5, accept = "image/*", onUpload, class: className, ...props }: ImageUploadProps) {
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: JSX.TargetedEvent<HTMLInputElement>) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    setError(null);

    if (!file) return;

    // Validar tamaño
    if (file.size > maxSize * 1024 * 1024) {
      setError(`El archivo es demasiado grande. El tamaño máximo es ${maxSize}MB`);
      return;
    }

    // Validar tipo
    if (!file.type.startsWith("image/")) {
      setError("El archivo debe ser una imagen");
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);

    // Llamar al callback
    onUpload?.(file);
  };

  const handleRemove = () => {
    setPreview(null);
    setError(null);
    const input = document.getElementById(id!) as HTMLInputElement;
    if (input) {
      input.value = "";
    }
  };

  return (
    <div class={`space-y-4 ${className}`}>
      <div class="flex items-center gap-4">
        <Button
          type="button"
          variant="outline"
          onClick={() => document.getElementById(id!)?.click()}
        >
          Seleccionar imagen
        </Button>
        {preview && (
          <Button
            type="button"
            variant="ghost"
            onClick={handleRemove}
          >
            Eliminar
          </Button>
        )}
      </div>

      <input
        type="file"
        id={id}
        name={name}
        accept={accept}
        onChange={handleFileChange}
        class="hidden"
        {...props}
      />

      {error && (
        <p class="text-sm text-destructive">{error}</p>
      )}

      {preview && (
        <div class="relative aspect-video w-full overflow-hidden rounded-lg border border-border">
          <img
            src={preview}
            alt="Preview"
            class="h-full w-full object-cover"
          />
        </div>
      )}

      {!preview && !error && (
        <div class="flex aspect-video w-full items-center justify-center rounded-lg border border-dashed border-border bg-muted">
          <div class="text-center">
            <p class="text-sm text-muted-foreground">
              Arrastra y suelta una imagen aquí o haz clic en "Seleccionar imagen"
            </p>
            <p class="text-xs text-muted-foreground mt-2">
              PNG, JPG o GIF. Máximo {maxSize}MB.
            </p>
          </div>
        </div>
      )}
    </div>
  );
} 