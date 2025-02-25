import { useRef, useState } from "preact/hooks";
import type { MouseEvent, TouchEvent } from "preact/compat";

interface Client {
  name: string;
  logo: string;
}

const clients: Client[] = [
  { name: 'Worldline', logo: '/assets/images/clients/worldline-300x52.png' },
  { name: 'Wiixt', logo: '/assets/images/clients/wiixt.png' },
  { name: 'Tu Aval', logo: '/assets/images/clients/tu-aval.png' },
  { name: 'Tío Carlos', logo: '/assets/images/clients/tio-carlos.png' },
  { name: 'Supiscina', logo: '/assets/images/clients/supiscina-300x176.png' },
  { name: 'SIA', logo: '/assets/images/clients/soluciones-inform-ticas-argentinas-s-logo.png' },
  { name: 'Shinko', logo: '/assets/images/clients/shinko-300x300.jpg' },
  { name: 'Shell', logo: '/assets/images/clients/shell-logo-19A7AB5D69-seeklogo.com_.png' },
  { name: 'Serroplast', logo: '/assets/images/clients/serroplast_header.png' },
  { name: 'Saputo', logo: '/assets/images/clients/saputo-300x88.png' },
  { name: 'Raizen', logo: '/assets/images/clients/raizen-logo-300x124.png' },
  { name: 'Pulverlux', logo: '/assets/images/clients/pulverlux-grupo-weg-vector-logo-300x89.png' },
  { name: 'Paizen', logo: '/assets/images/clients/paizen-300x98.png' },
  { name: 'Originat', logo: '/assets/images/clients/originat-sourcing-export-food.png' },
  { name: 'Moveminds', logo: '/assets/images/clients/moveminds.png' },
  { name: 'Marcucci Guma', logo: '/assets/images/clients/logo-t-marcucci-guma2.png' },
  { name: 'Grupo Simpa', logo: '/assets/images/clients/grupo-simpa.png' },
  { name: 'Geosistemas', logo: '/assets/images/clients/geosistemas-300x100.png' },
  { name: 'Facogem', logo: '/assets/images/clients/facogem-logo-300x54.png' },
  { name: 'DirectTV', logo: '/assets/images/clients/directv-300x57.png' },
  { name: 'Century Link', logo: '/assets/images/clients/centurylink-vector-logo-300x75.png' },
  { name: 'Castle', logo: '/assets/images/clients/castle-logo.png' },
  { name: 'Caja', logo: '/assets/images/clients/caja.png' },
  { name: 'Buritica', logo: '/assets/images/clients/buritica.png' },
  { name: 'Banco del Sol', logo: '/assets/images/clients/banco-del-sol-300x163.png' },
  { name: 'ANK', logo: '/assets/images/clients/ank-logo-1-300x107.png' },
  { name: 'Andesia', logo: '/assets/images/clients/andesia-300x90.png' },
  { name: 'Yacireta', logo: '/assets/images/clients/YaciretaEBY-300x65.png' },
  { name: 'WEG', logo: '/assets/images/clients/Weg-Logo-300x208.png' },
  { name: 'Vector Smart Object', logo: '/assets/images/clients/Vector-Smart-Object-3.png' },
  { name: 'Telefónica', logo: '/assets/images/clients/Telefonica_Logo.svg_-300x82.png' },
  { name: 'Telecom', logo: '/assets/images/clients/Telecom_argentina_logo21-300x63.png' },
  { name: 'SENDATI', logo: '/assets/images/clients/SENDATI-300x76.png' },
  { name: 'Reciqlo', logo: '/assets/images/clients/Reciqlo-300x115.png' },
  { name: 'REDCO', logo: '/assets/images/clients/REDCO-LOGo-300x65.png' },
  { name: 'Neosecure', logo: '/assets/images/clients/Neosecure-300x56.png' },
  { name: 'Movistar', logo: '/assets/images/clients/Movistar-300x300.png' },
  { name: 'Metalurgica Potenza', logo: '/assets/images/clients/Metalurgica-Potenza-300x169.png' },
  { name: 'Mavila', logo: '/assets/images/clients/Mavila-logo-300x119.png' },
  { name: 'Mavicontrol', logo: '/assets/images/clients/Mavicontrol-300x53.png' },
  { name: 'Lumen', logo: '/assets/images/clients/Lumen-Logo-Blue_Black-RGB-300x78.png' },
  { name: 'Limptech', logo: '/assets/images/clients/Limptech.png' },
  { name: 'Lilah', logo: '/assets/images/clients/Lilah-300x128.png' },
  { name: 'Itaú', logo: '/assets/images/clients/Itau_logo.svg_-296x300.png' },
  { name: 'Igaltex', logo: '/assets/images/clients/Igaltex.png' },
  { name: 'Hotel Club Frances', logo: '/assets/images/clients/Hotel-club-frances.png' },
  { name: 'BT', logo: '/assets/images/clients/BT-04-copy-300x86.png' },
  { name: 'BBbypuchero', logo: '/assets/images/clients/BBbypuchero_small.png' }
];

export default function ClientsCarousel() {
  const scrollContainer = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  const handleMouseStart = (e: MouseEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (scrollContainer.current) {
      setStartX(e.pageX - scrollContainer.current.offsetLeft);
      setScrollLeft(scrollContainer.current.scrollLeft);
    }
  };

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainer.current) {
      const walk = (e.pageX - scrollContainer.current.offsetLeft) - startX;
      scrollContainer.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    setIsDragging(true);
    if (scrollContainer.current) {
      setStartX(e.touches[0].pageX - scrollContainer.current.offsetLeft);
      setScrollLeft(scrollContainer.current.scrollLeft);
    }
  };

  const handleTouchMove = (e: TouchEvent<HTMLDivElement>) => {
    if (!isDragging) return;
    e.preventDefault();
    if (scrollContainer.current) {
      const walk = (e.touches[0].pageX - scrollContainer.current.offsetLeft) - startX;
      scrollContainer.current.scrollLeft = scrollLeft - walk;
    }
  };

  const handleDragEnd = () => {
    setIsDragging(false);
  };

  return (
    <section className="relative py-20 bg-gradient-to-b from-white to-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-bold text-center mb-12">Nuestros Clientes</h2>
        <div
          ref={scrollContainer}
          className={`flex gap-12 overflow-x-auto snap-x snap-mandatory hide-scrollbar ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          }`}
          onMouseDown={handleMouseStart}
          onMouseMove={handleMouseMove}
          onMouseUp={handleDragEnd}
          onMouseLeave={handleDragEnd}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleDragEnd}
        >
          {clients.map((client) => (
            <div key={client.name} className="flex-shrink-0 hover-lift transition-all">
              <img
                src={client.logo}
                alt={`${client.name} logo`}
                className="h-20 w-auto object-contain filter grayscale hover:grayscale-0 transition-all duration-300"
                draggable="false"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
} 