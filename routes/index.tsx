import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../components/layout/Navbar.tsx";
import { HeroSection } from "../components/HeroSection.tsx";
import { SalesforceSection } from "../components/SalesforceSection.tsx";
import { CommvaultSection } from "../components/CommvaultSection.tsx";
import { CTASection } from "../components/CTASection.tsx";
import { Footer } from "../components/layout/Footer.tsx";
import ClientsCarousel from "../islands/ClientsCarousel.tsx";

export default function Home() {
  return (
    <>
      <Head>
        <title>AT Vault - Soluciones de Seguridad y Gestión de Datos</title>
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Navbar />
      <main class="pt-16">
        <HeroSection />
        <SalesforceSection />
        <CommvaultSection />
        <ClientsCarousel />
        <CTASection />
      </main>
      <Footer />
    </>
  );
}
