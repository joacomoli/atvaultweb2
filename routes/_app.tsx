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
        <link rel="icon" href="/favicon.ico" />
        <link rel="stylesheet" href="/styles.css" />
        {/* Google Analytics 4 */}
        <script async src="https://www.googletagmanager.com/gtag/js?id=G-5RQMWQ6X0D"></script>
        <script dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'G-5RQMWQ6X0D');
          `
        }} />
      </Head>
      <body class="min-h-screen bg-gray-100 text-gray-900 font-sans">
        <Component />
      </body>
    </html>
  );
}
