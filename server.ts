import { start } from "$fresh/server.ts";
import manifest from "./fresh.gen.ts";
import config from "./fresh.config.ts";

// Configura el puerto para producción
const port = 8000; // Usaremos 8000 en lugar de 443 y dejaremos que Apache maneje SSL

await start(manifest, { port, hostname: "0.0.0.0", config }); 