import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";

export default function Navbar(): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const checkAuth = () => {
    const cookies = document.cookie;
    const hasUserEmail = cookies.includes('userEmail=');
    setIsAuthenticated(hasUserEmail);
  };

  useEffect(() => {
    checkAuth();
    document.addEventListener('visibilitychange', checkAuth);
    return () => {
      document.removeEventListener('visibilitychange', checkAuth);
    };
  }, []);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    document.cookie = "userEmail=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    document.cookie = "userName=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 UTC;";
    setIsAuthenticated(false);
    window.location.reload();
  };

  return (
    <>
      <nav class="fixed w-full bg-white shadow-md z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-20">
            <a href="/" class="flex items-center space-x-3">
              <img src="/assets/images/at-vault-logo.png" alt="AT Vault Logo" class="h-16 w-auto" />
            </a>

            <div class="hidden md:flex items-center space-x-8">
              <a href="/" class="text-gray-700 hover:text-primary-600">Inicio</a>
              <a href="/blog" class="text-gray-700 hover:text-primary-600">Blog</a>
              <div class="flex items-center space-x-4">
                {isAuthenticated ? (
                  <button
                    onClick={handleLogout}
                    class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700"
                  >
                    Cerrar Sesión
                  </button>
                ) : (
                  <>
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
                  </>
                )}
              </div>
            </div>

            <button
              class="md:hidden p-2 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100"
              onClick={toggleMenu}
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
        <div class={`md:hidden transition-all duration-300 ease-in-out ${isMenuOpen ? "opacity-100 visible" : "opacity-0 invisible h-0"}`}>
          <div class="px-2 pt-2 pb-3 space-y-1 bg-white shadow-lg">
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

            {isAuthenticated ? (
              <button
                onClick={handleLogout}
                class="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700"
              >
                Cerrar Sesión
              </button>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </nav>
      <div class="h-20" />
    </>
  );
} 