import { MongoClient, Database } from "mongodb";
import "https://deno.land/std@0.216.0/dotenv/load.ts";
import { IPost } from "../models/Post.ts";

const MONGODB_URI = Deno.env.get("MONGODB_URI") || "mongodb://localhost:27017";
const MONGODB_DB = Deno.env.get("MONGODB_DB") || "webatvault";

let db: Database | null = null;

export async function connectDB(): Promise<Database> {
  if (db) return db;

  try {
    const client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log("🚀 Conectado a MongoDB");
    
    db = client.db(MONGODB_DB);
    return db;
  } catch (error) {
    console.error("❌ Error conectando a MongoDB:", error);
    throw error;
  }
}

export async function disconnectDB(): Promise<void> {
  if (!db) return;

  try {
    const client = (db as any).client;
    await client.close();
    db = null;
    console.log("👋 Desconectado de MongoDB");
  } catch (error) {
    console.error("❌ Error desconectando de MongoDB:", error);
    throw error;
  }
}

async function initializeDB() {
  if (!db) return;

  const postsCollection = db.collection('posts');
  const postsCount = await postsCollection.countDocuments();

  if (postsCount === 0) {
    const samplePosts: IPost[] = [
      {
        title: "Introducción a Deno Fresh",
        slug: "introduccion-a-deno-fresh",
        excerpt: "Descubre cómo construir aplicaciones web modernas con Deno Fresh, el framework web full-stack para Deno.",
        content: `
# Introducción a Deno Fresh

Fresh es un framework web full-stack para Deno que ofrece renderizado en el servidor, enrutamiento basado en archivos y una excelente experiencia de desarrollo.

## Características principales

- Renderizado en el servidor por defecto
- Enrutamiento basado en archivos
- Islands Architecture para interactividad
- Zero runtime overhead
- No build step

## Primeros pasos

Para comenzar con Fresh, necesitas tener Deno instalado. Luego, puedes crear un nuevo proyecto con:

\`\`\`bash
deno run -A -r https://fresh.deno.dev my-project
cd my-project
deno task start
\`\`\`

## Conclusión

Fresh es una excelente opción para construir aplicaciones web modernas con Deno, ofreciendo un equilibrio perfecto entre rendimiento y facilidad de uso.
        `,
        coverImage: "https://fresh.deno.dev/illustration/lemon-squash.svg",
        publishedAt: new Date("2024-03-15"),
        author: {
          name: "Juan Pérez",
          avatar: "https://ui-avatars.com/api/?name=Juan+Perez"
        }
      },
      {
        title: "Mejores prácticas en MongoDB con Deno",
        slug: "mejores-practicas-mongodb-deno",
        excerpt: "Aprende las mejores prácticas para trabajar con MongoDB en aplicaciones Deno, incluyendo patrones de diseño y optimización.",
        content: `
# Mejores prácticas en MongoDB con Deno

MongoDB es una excelente opción para aplicaciones Deno. Veamos algunas mejores prácticas para su uso efectivo.

## Conexión a la base de datos

Es importante manejar las conexiones de manera eficiente:

\`\`\`typescript
const client = new MongoClient();
await client.connect(MONGODB_URI);
\`\`\`

## Modelado de datos

El modelado de datos es crucial para el rendimiento:

- Usar índices apropiadamente
- Evitar documentos demasiado grandes
- Normalizar cuando sea necesario

## Conclusión

Siguiendo estas prácticas, podrás construir aplicaciones robustas y escalables con Deno y MongoDB.
        `,
        coverImage: "https://webimages.mongodb.com/_com_assets/cms/kuzt9r42or1fxvlq2-Meta_Generic.png",
        publishedAt: new Date("2024-03-14"),
        author: {
          name: "María García",
          avatar: "https://ui-avatars.com/api/?name=Maria+Garcia"
        }
      },
      {
        title: "Seguridad en aplicaciones web con Deno",
        slug: "seguridad-aplicaciones-web-deno",
        excerpt: "Explora las características de seguridad de Deno y cómo implementar las mejores prácticas de seguridad en tus aplicaciones.",
        content: `
# Seguridad en aplicaciones web con Deno

La seguridad es fundamental en cualquier aplicación web. Deno ofrece varias características que nos ayudan a construir aplicaciones seguras.

## Permisos

Deno utiliza un sistema de permisos que nos ayuda a controlar qué puede hacer nuestro código:

\`\`\`typescript
// Necesita permisos explícitos
deno run --allow-net app.ts
\`\`\`

## HTTPS

Siempre usa HTTPS en producción:

\`\`\`typescript
await serve(handler, { port: 443, cert: "cert.pem", key: "key.pem" });
\`\`\`

## Conclusión

La seguridad debe ser una prioridad desde el inicio del desarrollo.
        `,
        coverImage: "https://deno.land/logo.svg",
        publishedAt: new Date("2024-03-13"),
        author: {
          name: "Ana Martínez",
          avatar: "https://ui-avatars.com/api/?name=Ana+Martinez"
        }
      }
    ];

    await postsCollection.insertMany(samplePosts);
    console.log("🌱 Base de datos inicializada con posts de ejemplo");
  }
} 