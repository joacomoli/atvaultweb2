import { JSX } from "preact";
import { IS_BROWSER } from "$fresh/runtime.ts";

export function Navbar(): JSX.Element {
  return (
    <nav class="fixed w-full bg-white shadow-md z-50">
      <div class="container mx-auto px-4">
        <div class="flex justify-between items-center h-16">
          <a href="/" class="flex items-center space-x-3">
            <img src="/assets/images/at-vault-logo.png" alt="AT Vault Logo" class="h-12 w-auto" />
            
          </a>

          <div class="hidden md:flex items-center space-x-8">
            <a href="/" class="text-gray-700 hover:text-primary-600">Inicio</a>
            <a href="/blog" class="text-gray-700 hover:text-primary-600">Blog</a>
            <a href="/about" class="text-gray-700 hover:text-primary-600">Nosotros</a>
            <div class="flex items-center space-x-4">
              <a
                href="/login"
                class="text-gray-700 hover:text-primary-600"
              >
                Iniciar Sesión
              </a>
              <a
                href="/register"
                class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
              >
                Registrarse
              </a>
            </div>
          </div>

          <button
            class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
            onClick={() => {
              if (IS_BROWSER) {
                const mobileMenu = document.getElementById("mobile-menu");
                if (mobileMenu) {
                  mobileMenu.classList.toggle("hidden");
                }
              }
            }}
          >
            <svg
              class="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16M4 18h16"
              />
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div id="mobile-menu" class="hidden md:hidden">
        <div class="px-2 pt-2 pb-3 space-y-1">
          <a
            href="/"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            Inicio
          </a>
          <a
            href="/blog"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            Blog
          </a>
          <a
            href="/about"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            Nosotros
          </a>
          <a
            href="/login"
            class="block px-3 py-2 rounded-md text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-100"
          >
            Iniciar Sesión
          </a>
          <a
            href="/register"
            class="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
          >
            Registrarse
          </a>
        </div>
      </div>
    </nav>
  );
} 