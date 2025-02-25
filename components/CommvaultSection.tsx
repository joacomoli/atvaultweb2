import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
}

const services: ServiceCard[] = [
  {
    title: "Backup y Recuperación",
    description: "Protege tus datos críticos con soluciones de backup automatizadas y recuperación rápida.",
    icon: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" // Backup
  },
  {
    title: "Gestión en la Nube",
    description: "Administra tus datos en múltiples nubes con una única plataforma centralizada.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z" // Nube
  },
  {
    title: "Protección Endpoints",
    description: "Asegura los datos en dispositivos finales con protección continua y automatizada.",
    icon: "M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" // Laptop
  },
  {
    title: "Automatización",
    description: "Optimiza operaciones con flujos de trabajo automatizados y orquestación inteligente.",
    icon: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" // Ciclo
  }
];

export function CommvaultSection() {
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
    <section class="relative min-h-[100vh] flex items-center bg-gradient-to-b from-[#9602A7] via-[#7A1B8B] to-[#4F1155]">
      <div class="container mx-auto px-4 py-20">
        <div class="flex flex-col items-center mb-12">
          <img
            src="/assets/images/commvault-logo.png"
            alt="Commvault"
            class="h-16 mb-6 filter brightness-0 invert"
          />
          <h2 class="text-3xl font-bold text-white text-center">
            Soluciones Commvault
          </h2>
        </div>

        <div
          ref={scrollContainer}
          class="flex overflow-x-auto gap-6 snap-x snap-mandatory hide-scrollbar pb-8 px-4 -mx-4 touch-pan-x"
          style="scroll-padding: 1rem; scroll-behavior: smooth;"
        >
          {services.map((service) => (
            <div class="flex-none w-[85%] md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)] snap-start">
              <div class="group h-full relative isolate">
                <div class="relative h-full p-6 rounded-xl backdrop-blur-md bg-white/10 border border-white/20 shadow-xl transition-all duration-500 ease-out hover:bg-white/80 group-hover:scale-[1.01] group-hover:shadow-2xl hover:border-[#9602A7] z-10">
                  <svg
                    class="w-8 h-8 text-white mb-4 transition-colors duration-500 group-hover:text-[#9602A7]"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    stroke-width="2"
                  >
                    <path stroke-linecap="round" stroke-linejoin="round" d={service.icon} />
                  </svg>
                  <h3 class="text-xl font-semibold text-white mb-4 transition-colors duration-500 group-hover:text-gray-800">
                    {service.title}
                  </h3>
                  <p class="text-white/90 transition-colors duration-500 group-hover:text-gray-600">
                    {service.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 