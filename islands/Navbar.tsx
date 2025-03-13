import { JSX } from "preact";
import { useState, useEffect } from "preact/hooks";
import { User } from "../models/User.ts";

interface Props {
  user?: User | null;
  active?: string;
}

export default function NavbarIsland({ user, active }: Props): JSX.Element {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const fetchUserData = async () => {
    try {
      const response = await fetch("/api/user", {
        credentials: 'include'
      });
      
      if (!response.ok) {
        console.log("No hay sesión activa");
        setCurrentUser(null);
        return;
      }

      const data = await response.json();
      console.log("Datos del usuario obtenidos:", data);
      
      if (data.user) {
        setCurrentUser(data.user);
      }
    } catch (error) {
      console.error("Error al obtener datos del usuario:", error);
      setCurrentUser(null);
    }
  };

  useEffect(() => {
    // Escuchar evento de login exitoso
    const handleLoginSuccess = (event: CustomEvent) => {
      console.log("Login exitoso detectado:", event.detail);
      fetchUserData();
    };

    window.addEventListener("loginSuccess", handleLoginSuccess as EventListener);

    // Si hay un usuario en las props, usarlo
    if (user) {
      console.log("Usando usuario de props:", user);
      setCurrentUser(user);
    } else {
      // Si no hay usuario en props, intentar obtenerlo del endpoint
      console.log("No hay usuario en props, consultando API");
      fetchUserData();
    }

    // Limpiar listener al desmontar
    return () => {
      window.removeEventListener("loginSuccess", handleLoginSuccess as EventListener);
    };
  }, [user]);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const getGreeting = () => {
    const hour = new Date().getHours();
    console.log("Hora actual:", hour);
    if (hour >= 5 && hour < 14) return "¡Buenos días";
    if (hour >= 14 && hour < 20) return "¡Buenas tardes";
    return "¡Buenas noches";
  };

  const handleLogout = async () => {
    try {
      console.log("Iniciando proceso de logout");
      const response = await fetch("/api/logout", {
        method: "POST",
        credentials: 'include'
      });

      if (!response.ok) {
        throw new Error("Error en el logout");
      }

      console.log("Logout exitoso");
      setCurrentUser(null);
      window.location.href = "/";
    } catch (error) {
      console.error("Error en logout:", error);
    }
  };

  // Debug: Renderizado
  console.log("Renderizando Navbar con usuario:", currentUser?.name);

  return (
    <>
      <nav class="fixed w-full bg-white dark:bg-gray-800 shadow-md z-50">
        <div class="container mx-auto px-4">
          <div class="flex justify-between items-center h-20">
            <a href="/" class="flex items-center space-x-3">
              <img src="/assets/images/at-vault-logo.png" alt="AT Vault Logo" class="h-24 w-auto" />
            </a>

            <div class="hidden md:flex items-center space-x-8">
              <a href="/" class={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${active === 'home' ? 'text-primary-600 dark:text-primary-400' : ''}`}>Inicio</a>
              <a href="/blog" class={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${active === 'blog' ? 'text-primary-600 dark:text-primary-400' : ''}`}>Blog</a>
              {currentUser && (
                <a href="/chat" class={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${active === 'chat' ? 'text-primary-600 dark:text-primary-400' : ''}`}>Chat</a>
              )}
              {currentUser?.role === 'admin' && (
                <a href="/admin/blog" class={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${active === 'admin' ? 'text-primary-600 dark:text-primary-400' : ''}`}>Post</a>
              )}
              <div class="flex items-center space-x-4">
                {currentUser ? (
                  <div class="flex items-center space-x-4">
                    <span class="text-gray-700 dark:text-gray-200">{getGreeting()}, {currentUser.name}!</span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href="/login"
                      class={`text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 transition-colors duration-200 ${active === 'login' ? 'text-primary-600 dark:text-primary-400' : ''}`}
                    >
                      Iniciar Sesión
                    </a>
                    <a
                      href="/register"
                      class="bg-primary-600 text-white px-4 py-2 rounded-md hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
                    >
                      Registrarse
                    </a>
                  </>
                )}
              </div>
            </div>

            <button
              type="button"
              class="md:hidden p-2 rounded-md text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              onClick={toggleMenu}
            >
              <span class="sr-only">Abrir menú</span>
              {!isMenuOpen ? (
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              ) : (
                <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              )}
            </button>
          </div>

          {/* Mobile menu */}
          {isMenuOpen && (
            <div class="md:hidden">
              <div class="px-2 pt-2 pb-3 space-y-1 bg-white dark:bg-gray-800 shadow-lg">
                <a
                  href="/"
                  class={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${active === 'home' ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  Inicio
                </a>
                <a
                  href="/blog"
                  class={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${active === 'blog' ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700' : ''}`}
                >
                  Blog
                </a>
                {currentUser && (
                  <a
                    href="/chat"
                    class={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${active === 'chat' ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    Chat
                  </a>
                )}
                {currentUser?.role === 'admin' && (
                  <a
                    href="/admin/blog"
                    class={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${active === 'admin' ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700' : ''}`}
                  >
                    Post
                  </a>
                )}

                {currentUser ? (
                  <div class="px-3 py-2">
                    <span class="block text-base font-medium text-gray-700 dark:text-gray-200 mb-2">{getGreeting()}, {currentUser.name}!</span>
                    <button
                      type="button"
                      onClick={handleLogout}
                      class="block w-full text-left px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
                    >
                      Cerrar Sesión
                    </button>
                  </div>
                ) : (
                  <>
                    <a
                      href="/login"
                      class={`block px-3 py-2 rounded-md text-base font-medium text-gray-700 dark:text-gray-200 hover:text-primary-600 dark:hover:text-primary-400 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 ${active === 'login' ? 'text-primary-600 dark:text-primary-400 bg-gray-100 dark:bg-gray-700' : ''}`}
                    >
                      Iniciar Sesión
                    </a>
                    <a
                      href="/register"
                      class="block px-3 py-2 rounded-md text-base font-medium bg-primary-600 text-white hover:bg-primary-700 dark:hover:bg-primary-500 transition-colors duration-200"
                    >
                      Registrarse
                    </a>
                  </>
                )}
              </div>
            </div>
          )}
        </div>
      </nav>
      <div class="h-20" />
    </>
  );
} 