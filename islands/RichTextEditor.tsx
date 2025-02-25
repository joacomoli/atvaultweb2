import { useEffect } from "preact/hooks";
import { JSX } from "preact";

declare global {
  interface Window {
    tinymce: any;
  }
}

interface RichTextEditorProps {
  value?: string;
  onChange?: (content: string) => void;
  height?: number;
  id: string;
}

export default function RichTextEditor({ value = "", onChange, height = 500, id }: RichTextEditorProps): JSX.Element {
  useEffect(() => {
    // Cargar TinyMCE desde CDN con la API key
    const script = document.createElement("script");
    script.src = "https://cdn.tiny.cloud/1/5l2khc31dkqg4math66gah0suyf4h15z3x6ypr2oq543y4l5/tinymce/6/tinymce.min.js";
    script.referrerPolicy = "origin";
    document.head.appendChild(script);

    script.onload = () => {
      window.tinymce.init({
        selector: `#${id}`,
        height: height,
        menubar: true,
        language: 'es',
        skin: 'oxide',
        plugins: [
          'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
          'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
          'insertdatetime', 'media', 'table', 'help', 'wordcount', 'emoticons',
          'codesample', 'quickbars'
        ],
        toolbar: 'undo redo | blocks | ' +
          'bold italic forecolor backcolor | alignleft aligncenter ' +
          'alignright alignjustify | bullist numlist outdent indent | ' +
          'removeformat | image media emoticons codesample | help',
        content_style: `
          body { 
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
            font-size: 16px;
            line-height: 1.6;
            color: #374151;
          }
          p { margin: 0 0 1em; }
          img { max-width: 100%; height: auto; }
          pre { background-color: #f3f4f6; padding: 1em; border-radius: 0.375rem; }
          blockquote { 
            border-left: 4px solid #9ca3af;
            margin: 1em 0;
            padding-left: 1em;
            font-style: italic;
          }
        `,
        quickbars_selection_toolbar: 'bold italic | quicklink h2 h3 blockquote',
        quickbars_insert_toolbar: 'image media table',
        automatic_uploads: true,
        images_upload_handler: async (blobInfo: any) => {
          try {
            const base64 = await new Promise((resolve) => {
              const reader = new FileReader();
              reader.readAsDataURL(blobInfo.blob());
              reader.onload = () => resolve(reader.result);
            });
            return base64 as string;
          } catch (error) {
            console.error('Error al subir imagen:', error);
            throw new Error('Error al subir la imagen');
          }
        },
        setup: (editor: any) => {
          editor.on('init', () => {
            editor.setContent(value);
          });
          
          editor.on('change input keyup', () => {
            const content = editor.getContent();
            onChange?.(content);
          });
        },
        image_title: true,
        file_picker_types: 'image',
        convert_urls: false,
        extended_valid_elements: 'span[*],i[*],em[*],strong[*],a[*]',
      });
    };

    return () => {
      if (window.tinymce) {
        window.tinymce.remove(`#${id}`);
      }
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <textarea
      id={id}
      style={{ visibility: "hidden" }}
      class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500"
    >
      {value}
    </textarea>
  );
} 