import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
}

const services: ServiceCard[] = [
  {
    title: "Automatización de Procesos",
    description: "Optimiza tus flujos de trabajo con automatización inteligente basada en IA.",
    icon: "M13 10V3L4 14h7v7l9-11h-7z" // Rayo
  },
  {
    title: "Análisis Predictivo",
    description: "Anticipa tendencias y comportamientos con análisis avanzado de datos.",
    icon: "M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" // Gráfico
  },
  {
    title: "Chatbot IA",
    description: "Atención al cliente 24/7 con respuestas inteligentes y personalizadas.",
    icon: "M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" // Chat
  },
  {
    title: "Integración API",
    description: "Conecta Salesforce con tus sistemas existentes de forma seamless.",
    icon: "M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" // Conexiones
  }
];

export function SalesforceSection() {
  const scrollContainer = useSignal<HTMLDivElement | null>(null);
  const isDragging = useSignal(false);
  const startX = useSignal(0);
  const scrollLeft = useSignal(0);

  const handleMouseDown = (e: MouseEvent) => {
    if (!scrollContainer.value) return;
    isDragging.value = true;
    startX.value = e.pageX - scrollContainer.value.offsetLeft;
    scrollLeft.value = scrollContainer.value.scrollLeft;
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging.value || !scrollContainer.value) return;
    e.preventDefault();
    const x = e.pageX - scrollContainer.value.offsetLeft;
    const walk = (x - startX.value) * 2;
    scrollContainer.value.scrollLeft = scrollLeft.value - walk;
  };

  const handleMouseUp = () => {
    isDragging.value = false;
  };

  const handleTouchStart = (e: TouchEvent) => {
    if (!scrollContainer.value) return;
    isDragging.value = true;
    startX.value = e.touches[0].pageX - scrollContainer.value.offsetLeft;
    scrollLeft.value = scrollContainer.value.scrollLeft;
    e.preventDefault();
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging.value || !scrollContainer.value) return;
    e.preventDefault();
    const x = e.touches[0].pageX - scrollContainer.value.offsetLeft;
    const walk = (x - startX.value);
    scrollContainer.value.scrollLeft = scrollLeft.value - walk;
  };

  useEffect(() => {
    const container = scrollContainer.value;
    if (!container) return;

    container.addEventListener('mousedown', handleMouseDown);
    container.addEventListener('mousemove', handleMouseMove);
    container.addEventListener('mouseup', handleMouseUp);
    container.addEventListener('mouseleave', handleMouseUp);
    container.addEventListener('touchstart', handleTouchStart);
    container.addEventListener('touchmove', handleTouchMove);
    container.addEventListener('touchend', handleMouseUp);

    return () => {
      container.removeEventListener('mousedown', handleMouseDown);
      container.removeEventListener('mousemove', handleMouseMove);
      container.removeEventListener('mouseup', handleMouseUp);
      container.removeEventListener('mouseleave', handleMouseUp);
      container.removeEventListener('touchstart', handleTouchStart);
      container.removeEventListener('touchmove', handleTouchMove);
      container.removeEventListener('touchend', handleMouseUp);
    };
  }, [scrollContainer.value]);

  return (
    <section className="relative min-h-[100vh] flex items-center bg-gradient-to-b from-[#00A1E0] via-[#0077B5] to-[#9602A7]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center mb-12">
          <img
            src="/assets/images/salesforce-logo.png"
            alt="Salesforce"
            className="h-16 mb-6"
          />
          <h2 className="text-3xl font-bold text-white text-center">
            Soluciones Salesforce
          </h2>
        </div>

        <div
          ref={scrollContainer}
          className="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-8 px-4 -mx-4 touch-pan-x"
          style="scroll-padding: 1rem; scroll-behavior: smooth;"
        >
          <div className="flex gap-6">
            {services.map((service) => (
              <div className="flex-none w-[280px] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start">
                <div className="relative h-full p-6 rounded-xl bg-white border border-gray-200 shadow-lg transition-all duration-500 ease-out hover:shadow-2xl hover:scale-[1.02] hover:z-10">
                  <svg
                    className="w-8 h-8 text-[#00A1E0] mb-4 transition-colors duration-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d={service.icon} />
                  </svg>
                  <h3 className="text-xl font-semibold text-gray-800 mb-4">
                    {service.title}
                  </h3>
                  <p className="text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <style>
        {`
          .hide-scrollbar::-webkit-scrollbar {
            display: none;
          }
          .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
        `}
        </style>
      </div>
    </section>
  );
}