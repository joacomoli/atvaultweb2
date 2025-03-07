import { Head } from "$fresh/runtime.ts";
import { Navbar } from "../components/layout/Navbar.tsx";
import { HeroSection } from "../components/HeroSection.tsx";
import { SalesforceSection } from "../components/SalesforceSection.tsx";
import { CommvaultSection } from "../components/CommvaultSection.tsx";
import { CTASection } from "../components/CTASection.tsx";
import { Footer } from "../components/layout/Footer.tsx";
import ClientsCarousel from "../islands/ClientsCarousel.tsx";
import { Handlers, PageProps } from "$fresh/server.ts";
import { getUserFromRequest } from "../utils/auth.ts";
import { User } from "../models/User.ts";

interface Data {
  user: User | null;
}

export const handler: Handlers<Data> = {
  async GET(req, ctx) {
    const user = await getUserFromRequest(req);
    return ctx.render({ user });
  },
};

export default function Home({ data }: PageProps<Data>) {
  const { user } = data;
  return (
    <>
      <Head>
        <title>AT Vault - Tecnología y Soluciones</title>
        <meta name="description" content="AT Vault" />
        <link rel="stylesheet" href="/styles.css" />
      </Head>
      <Navbar user={user} />
      <main>
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
