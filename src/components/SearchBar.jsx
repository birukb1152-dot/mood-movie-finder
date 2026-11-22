import { memo, useCallback } from "react";
import { Search, X } from "lucide-react";

const SearchBar = ({ query, setQuery, handleSearch }) => {
  const clearSearch = useCallback(() => {
    setQuery("");
  }, [setQuery]);

  return (
    <form
      onSubmit={handleSearch}
      className="w-full min-w-0 md:flex-1"
      role="search"
    >
      <div className="flex items-center gap-3 w-full min-w-0">
        <div className="relative flex-1 min-w-0 group">
          <Search
            size={19}
            aria-hidden="true"
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-400 transition-colors duration-300"
          />

          <input
            type="text"
            placeholder="Search for a movie..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            aria-label="Search movies"
            autoComplete="off"
            className="w-full min-w-0 h-11 pl-11 pr-10 bg-[#111827] border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 outline-none focus:border-blue-500/70 focus:ring-2 focus:ring-blue-500/10 transition-all duration-300"
          />

          {query.length > 0 && (
            <button
              type="button"
              onClick={clearSearch}
              aria-label="Clear search"
              title="Clear search"
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white focus-visible:outline-none transition-colors duration-200"
            >
              <X size={17} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="h-11 shrink-0 flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-700 active:scale-95 px-5 rounded-xl text-white text-sm font-semibold shadow-lg shadow-blue-600/10 transition-all duration-300 whitespace-nowrap"
        >
          <Search size={16} aria-hidden="true" />
          <span>Search</span>
        </button>
      </div>
    </form>
  );
};

SearchBar.displayName = "SearchBar";

export default memo(SearchBar);
