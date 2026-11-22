import { useCallback, useEffect, useRef, useState } from "react";
import { RotateCcw, SlidersHorizontal } from "lucide-react";
import MoodSelector from "../components/MoodSelector";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MovieList from "../components/MovieList";
import Loader from "../components/Loader";
import { fetchDiscoverMoviesPage, searchMovies } from "../services/tmdbApi";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");

  const [rating, setRating] = useState("0");
  const [releasePeriod, setReleasePeriod] = useState("all");
  const [sortBy, setSortBy] = useState("popularity.desc");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [currentMode, setCurrentMode] = useState("discover");
  const [hasMore, setHasMore] = useState(true);

  const observerRef = useRef(null);
  const requestLock = useRef(false);
  const requestIdRef = useRef(0);

  const firstPageControllerRef = useRef(null);
  const nextPageControllerRef = useRef(null);
  const searchControllerRef = useRef(null);

  const removeDuplicates = (movieList) => {
    return Array.from(
      new Map(movieList.map((movie) => [movie.id, movie])).values(),
    );
  };

  useEffect(() => {
    return () => {
      firstPageControllerRef.current?.abort();
      nextPageControllerRef.current?.abort();
      searchControllerRef.current?.abort();
    };
  }, []);

  // Load first discovery page
  const loadFirstPage = useCallback(async () => {
    firstPageControllerRef.current?.abort();
    nextPageControllerRef.current?.abort();

    const controller = new AbortController();
    firstPageControllerRef.current = controller;

    const requestId = ++requestIdRef.current;

    requestLock.current = true;
    setLoading(true);
    setError("");
    setMovies([]);
    setPage(1);
    setHasMore(true);

    try {
      const data = await fetchDiscoverMoviesPage({
        page: 1,
        genreId: selectedMood?.genre || null,
        rating,
        releasePeriod,
        sortBy,
        signal: controller.signal,
      });

      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      setMovies(removeDuplicates(data.results || []));
      setPage(data.page || 1);
      setTotalPages(data.total_pages || 1);
      setHasMore((data.page || 1) < (data.total_pages || 1));
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      console.error("Failed to load movies:", err);
      setError("Failed to load movies. Please try again.");
    } finally {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        requestLock.current = false;
        setLoading(false);
      }
    }
  }, [selectedMood, rating, releasePeriod, sortBy]);

  // Load next discovery page
  const loadNextPage = useCallback(async () => {
    if (
      requestLock.current ||
      loading ||
      !hasMore ||
      page >= totalPages ||
      currentMode === "search"
    ) {
      return;
    }

    const controller = new AbortController();
    nextPageControllerRef.current = controller;

    requestLock.current = true;
    setLoading(true);
    setError("");

    const requestId = requestIdRef.current;
    const nextPage = page + 1;

    try {
      const data = await fetchDiscoverMoviesPage({
        page: nextPage,
        genreId: selectedMood?.genre || null,
        rating,
        releasePeriod,
        sortBy,
        signal: controller.signal,
      });

      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      setMovies((previousMovies) =>
        removeDuplicates([...previousMovies, ...(data.results || [])]),
      );

      setPage(data.page || nextPage);
      setTotalPages(data.total_pages || totalPages);
      setHasMore(nextPage < (data.total_pages || totalPages));
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      console.error("Failed to load more movies:", err);
      setError("Couldn't load more movies. Please try again.");
    } finally {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        requestLock.current = false;
        setLoading(false);
      }
    }
  }, [
    loading,
    hasMore,
    page,
    totalPages,
    currentMode,
    selectedMood,
    rating,
    releasePeriod,
    sortBy,
  ]);

  // Reload discovery when filters or mood change
  useEffect(() => {
    if (currentMode === "search") return;

    loadFirstPage();

    return () => {
      firstPageControllerRef.current?.abort();
      nextPageControllerRef.current?.abort();
      requestLock.current = false;
    };
  }, [loadFirstPage, currentMode]);

  // Infinite scroll observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      },
      {
        root: null,
        rootMargin: "300px",
        threshold: 0,
      },
    );

    const currentElement = observerRef.current;

    if (currentElement && hasMore && currentMode !== "search") {
      observer.observe(currentElement);
    }

    return () => observer.disconnect();
  }, [loadNextPage, hasMore, currentMode]);

  // Search movies
  const runSearch = async () => {
    if (!query.trim()) return;

    searchControllerRef.current?.abort();
    firstPageControllerRef.current?.abort();
    nextPageControllerRef.current?.abort();

    const controller = new AbortController();
    searchControllerRef.current = controller;

    const requestId = ++requestIdRef.current;

    requestLock.current = true;
    setLoading(true);
    setError("");
    setMovies([]);
    setCurrentMode("search");
    setHasMore(false);

    try {
      const data = await searchMovies(query.trim(), controller.signal);

      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      setMovies(removeDuplicates(data || []));
    } catch (err) {
      if (controller.signal.aborted || requestId !== requestIdRef.current) {
        return;
      }

      console.error("Search failed:", err);
      setError("Search failed. Please try again.");
    } finally {
      if (!controller.signal.aborted && requestId === requestIdRef.current) {
        requestLock.current = false;
        setLoading(false);
      }
    }
  };

  const handleSearch = (e) => {
    e.preventDefault();
    runSearch();
  };

  // Mood selection
  const handleMoodChange = (mood) => {
    searchControllerRef.current?.abort();
    setSelectedMood(mood);
    setCurrentMode("discover");
  };

  // Reset filters
  const resetFilters = () => {
    searchControllerRef.current?.abort();

    setSelectedMood(null);
    setRating("0");
    setReleasePeriod("all");
    setSortBy("popularity.desc");
    setQuery("");
    setCurrentMode("discover");
    setError("");
  };

  // Clear search and return to discovery
  const handleClearSearch = () => {
    searchControllerRef.current?.abort();
    setQuery("");
    setCurrentMode("discover");
    setError("");
  };

  const hasActiveFilters =
    selectedMood !== null ||
    rating !== "0" ||
    releasePeriod !== "all" ||
    sortBy !== "popularity.desc";

  // Retry failed requests
  const handleRetry = () => {
    if (currentMode === "search") {
      runSearch();
    } else if (movies.length === 0) {
      loadFirstPage();
    } else {
      loadNextPage();
    }
  };

  // Apply filters to displayed results
  const filteredMovies = movies
    .filter((movie) => {
      const matchesRating = movie.vote_average >= Number(rating);

      let matchesReleasePeriod = true;

      if (releasePeriod !== "all") {
        const [startYear, endYear] = releasePeriod.split("-");

        const movieYear = movie.release_date
          ? new Date(movie.release_date).getFullYear()
          : null;

        matchesReleasePeriod =
          movieYear !== null &&
          movieYear >= Number(startYear) &&
          movieYear <= Number(endYear);
      }

      return matchesRating && matchesReleasePeriod;
    })
    .sort((a, b) => {
      switch (sortBy) {
        case "vote_average.desc":
          return (b.vote_average || 0) - (a.vote_average || 0);

        case "primary_release_date.desc":
          return (
            new Date(b.release_date || "1900-01-01") -
            new Date(a.release_date || "1900-01-01")
          );

        case "revenue.desc":
          return (b.revenue || 0) - (a.revenue || 0);

        case "popularity.desc":
        default:
          return (b.popularity || 0) - (a.popularity || 0);
      }
    });

  const sectionTitle =
    currentMode === "search"
      ? `Search Results for "${query.trim()}"`
      : selectedMood
        ? `${selectedMood.name} Movies`
        : "Popular Movies";

  return (
    <div className="relative min-h-screen w-full min-w-0 overflow-x-clip">
      {/* Ambient background glow */}
      <div
        className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[550px] pointer-events-none"
        style={{
          background:
            "radial-gradient(circle at top, rgba(59, 130, 246, 0.12), transparent 60%)",
        }}
      />

      <main className="relative w-full max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-12 min-w-0">
        {/* Discovery Hero */}
        <section className="text-center mb-9">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
            Discover Movies{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
              by Mood
            </span>
          </h1>

          <p className="text-gray-400 text-sm sm:text-base mt-3 max-w-xl mx-auto leading-relaxed">
            Pick a vibe or filter by rating and release year. Your next favorite
            movie is just a click away.
          </p>
        </section>

        {/* Mood Selection */}
        <section className="mb-8 min-w-0">
          <div className="flex items-center justify-center sm:justify-start gap-2 mb-4">
            <SlidersHorizontal size={17} className="text-blue-400" />
            <h2 className="text-white font-semibold text-sm">
              Choose your mood
            </h2>
          </div>

          <MoodSelector
            selectedMood={selectedMood}
            setSelectedMood={handleMoodChange}
          />
        </section>

        {/* Search and Filters */}
        <section className="w-full min-w-0 p-3 sm:p-4 rounded-2xl border border-gray-700/70 bg-[#111827]/75 backdrop-blur-xl shadow-xl">
          <div className="flex flex-col gap-3 w-full min-w-0">
            {/* Search Row */}
            <div className="w-full min-w-0">
              <SearchBar
                query={query}
                setQuery={setQuery}
                handleSearch={handleSearch}
                clearSearch={handleClearSearch}
              />
            </div>

            {/* Filter Row */}
            <div className="w-full min-w-0">
              <FilterBar
                rating={rating}
                setRating={setRating}
                releasePeriod={releasePeriod}
                setReleasePeriod={setReleasePeriod}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </div>
          </div>
        </section>

        {/* Results Heading */}
        <section className="flex flex-wrap items-center justify-between gap-3 mt-9 mb-5 min-w-0">
          <div className="min-w-0">
            <h2 className="text-xl sm:text-2xl font-bold text-white break-words">
              {sectionTitle}
            </h2>

            <p className="text-gray-500 text-sm mt-1">
              {currentMode === "search"
                ? `${filteredMovies.length} matching movies`
                : selectedMood
                  ? `Explore movies that match your ${selectedMood.name.toLowerCase()} mood`
                  : "Explore what's trending and popular"}
            </p>
          </div>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={resetFilters}
              className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-blue-400 transition-colors shrink-0"
            >
              <RotateCcw size={15} />
              Reset all
            </button>
          )}
        </section>

        {/* Initial Loading */}
        {loading && movies.length === 0 ? (
          <Loader />
        ) : (
          <MovieList movies={filteredMovies} />
        )}

        {/* Error and Retry */}
        {error && (
          <div className="text-center py-8">
            <p className="text-red-400 mb-3">{error}</p>

            <button
              onClick={handleRetry}
              className="bg-blue-600 hover:bg-blue-500 text-white px-5 py-2 rounded-lg transition"
            >
              Try Again
            </button>
          </div>
        )}

        {/* No Results */}
        {!loading &&
          !error &&
          filteredMovies.length === 0 &&
          movies.length > 0 && (
            <p className="text-center text-gray-400 py-10">
              No movies match your selected filters.
            </p>
          )}

        {/* Bottom Loading Indicator */}
        {loading && movies.length > 0 && (
          <div className="py-6">
            <Loader />
          </div>
        )}

        {/* Infinite Scroll Observer */}
        {currentMode !== "search" && hasMore && (
          <div ref={observerRef} className="h-10 w-full" aria-hidden="true" />
        )}

        {/* End of Movies */}
        {!hasMore && movies.length > 0 && currentMode !== "search" && (
          <p className="text-center text-gray-400 py-6">
            You've reached the end of the movies.
          </p>
        )}
      </main>
    </div>
  );
};

export default Home;
