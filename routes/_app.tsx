import { type PageProps } from "$fresh/server.ts";
import { Head } from "$fresh/runtime.ts";

export default function App({ Component }: PageProps) {
  return (
    <html lang="es">
      <Head>
        <meta charset="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <title>AT Vault - Tecnología Amiga</title>
        <meta name="description" content="AT Vault es tu socio tecnológico de confianza, ofreciendo soluciones innovadoras en Salesforce y automatización." />
        <link rel="stylesheet" href="/styles.css" />
        <link rel="icon" href="/favicon.ico" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap" rel="stylesheet" />
      </Head>
      <body class="min-h-screen bg-white">
        <Component />
      </body>
    </html>
  );
}
