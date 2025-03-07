import { useSignal } from "@preact/signals";
import { useEffect } from "preact/hooks";

interface ServiceCard {
  title: string;
  description: string;
  icon: string;
}

const services: ServiceCard[] = [
  {
    title: "Backup & Recovery",
    description: "Protección de datos empresariales con recuperación instantánea.",
    icon: "M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4"
  },
  {
    title: "Disaster Recovery",
    description: "Continuidad del negocio con replicación y recuperación ante desastres.",
    icon: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  },
  {
    title: "Cloud Data Management",
    description: "Gestión unificada de datos en la nube y on-premise.",
    icon: "M3 15a4 4 0 004 4h9a5 5 0 10-.1-9.999 5.002 5.002 0 10-9.78 2.096A4.001 4.001 0 003 15z"
  },
  {
    title: "Ransomware Protection",
    description: "Protección avanzada contra amenazas y recuperación inmediata.",
    icon: "M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
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
    <section className="relative min-h-[100vh] flex items-center bg-gradient-to-b from-[#9602A7] via-[#7A1B8B] to-[#4F1155]">
      <div className="container mx-auto px-4 py-20">
        <div className="flex flex-col items-center mb-12">
          <img
            src="/assets/images/commvault-logo.png"
            alt="Commvault"
            className="h-16 mb-6 filter brightness-0 invert"
          />
          <h2 className="text-3xl font-bold text-white text-center">
            Soluciones Commvault
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
                    className="w-8 h-8 text-[#9602A7] mb-4 transition-colors duration-500"
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