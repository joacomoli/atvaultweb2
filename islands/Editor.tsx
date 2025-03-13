import { JSX } from "preact";
import { useEffect, useRef } from "preact/hooks";

declare global {
  interface Window {
    EditorJS: any;
    Header: any;
    List: any;
    ImageTool: any;
    LinkTool: any;
  }
}

const DEFAULT_INITIAL_DATA = {
  time: new Date().getTime(),
  blocks: [
    {
      type: "paragraph",
      data: {
        text: "Escribe tu artículo aquí...",
      },
    },
  ],
};

interface EditorProps {
  value: string;
  onChange: (value: string) => void;
  uploadImage?: (file: File) => Promise<{ success: number; file: { url: string } }>;
}

export default function Editor({ value, onChange, uploadImage }: EditorProps) {
  const editorRef = useRef<any>();

  useEffect(() => {
    // Cargar los scripts necesarios
    const loadScript = (src: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const script = document.createElement('script');
        script.src = src;
        script.onload = () => resolve();
        script.onerror = () => reject();
        document.head.appendChild(script);
      });
    };

    const initEditor = async () => {
      try {
        // Cargar EditorJS y sus plugins
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/editorjs@2.28.2/dist/editor.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/header@2.8.1/dist/bundle.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/list@1.9.0/dist/bundle.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/image@2.9.0/dist/bundle.min.js');
        await loadScript('https://cdn.jsdelivr.net/npm/@editorjs/link@2.6.2/dist/bundle.min.js');

        // Inicializar el editor
        if (!editorRef.current) {
          const editor = new window.EditorJS({
            holder: "editor",
            placeholder: "Escribe tu artículo aquí...",
            data: value ? JSON.parse(value) : DEFAULT_INITIAL_DATA,
            onChange: async () => {
              const content = await editor.save();
              onChange(JSON.stringify(content));
            },
            tools: {
              header: {
                class: window.Header,
                config: {
                  levels: [1, 2, 3, 4],
                  defaultLevel: 2
                }
              },
              list: {
                class: window.List,
                inlineToolbar: true
              },
              image: {
                class: window.ImageTool,
                config: {
                  uploader: {
                    uploadByFile: uploadImage
                  }
                }
              },
              linkTool: {
                class: window.LinkTool,
                config: {
                  endpoint: '/api/fetchUrl'
                }
              }
            },
          });

          editorRef.current = editor;
        }
      } catch (error) {
        console.error('Error loading EditorJS:', error);
      }
    };

    initEditor();

    return () => {
      if (editorRef.current) {
        editorRef.current.destroy();
        editorRef.current = undefined;
      }
    };
  }, [value, onChange]);

  return (
    <div class="prose prose-lg max-w-none dark:prose-invert">
      <div id="editor" class="min-h-[500px]" />
    </div>
  );
} 