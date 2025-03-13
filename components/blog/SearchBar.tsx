import { JSX } from "preact";

interface SearchBarProps {
  searchTerm: string;
}

export function SearchBar({ searchTerm }: SearchBarProps): JSX.Element {
  return (
    <form class="max-w-2xl mx-auto mb-12" method="GET">
      <div class="relative">
        <input
          type="text"
          name="search"
          value={searchTerm}
          placeholder="Buscar artículos..."
          class="w-full px-6 py-3 pl-12 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-primary-500 shadow-sm"
        />
        <svg
          class="absolute left-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
          />
        </svg>
        {searchTerm && (
          <a
            href="/blog"
            class="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
          >
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </a>
        )}
      </div>
    </form>
  );
} 