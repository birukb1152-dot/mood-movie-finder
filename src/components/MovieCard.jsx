import { memo, useCallback, useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Heart, Star, CalendarDays, Film } from "lucide-react";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MovieCard = memo(({ movie }) => {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [notification, setNotification] = useState("");
  const [posterError, setPosterError] = useState(false);

  const isFavorite = favorites.some((fav) => fav.id === movie.id);

  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  // Toggle favorite status safely
  const toggleFavorite = useCallback(
    (e) => {
      e.preventDefault();
      e.stopPropagation();

      const currentlyFavorite = favorites.some((fav) => fav.id === movie.id);

      setFavorites((currentFavorites) => {
        const exists = currentFavorites.some((fav) => fav.id === movie.id);

        if (exists) {
          return currentFavorites.filter((fav) => fav.id !== movie.id);
        }

        return [...currentFavorites, movie];
      });

      setNotification(
        currentlyFavorite
          ? "Removed from favorites!"
          : "Added to favorites successfully!",
      );
    },
    [favorites, movie, setFavorites],
  );

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : null;

  const rating =
    movie.vote_average && movie.vote_average > 0
      ? movie.vote_average.toFixed(1)
      : "N/A";

  return (
    <div className="relative group bg-[#111827] border border-white/[0.08] rounded-2xl overflow-hidden shadow-lg shadow-black/20 hover:-translate-y-1 hover:border-blue-500/40 hover:shadow-xl hover:shadow-blue-950/30 transition-all duration-300">
      {/* Movie Poster */}
      <Link
        to={`/movie/${movie.id}`}
        className="block"
        aria-label={`View details for ${movie.title}`}
      >
        <div className="relative aspect-[2/3] overflow-hidden bg-[#1F2937]">
          {poster && !posterError ? (
            <img
              src={poster}
              alt={movie.title || "Movie poster"}
              loading="lazy"
              decoding="async"
              className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              onError={() => setPosterError(true)}
            />
          ) : null}

          {/* Poster Fallback */}
          {(posterError || !poster) && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-gray-500">
              <Film size={42} strokeWidth={1.3} />
              <span className="text-xs">No Poster Available</span>
            </div>
          )}

          {/* Rating Badge */}
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-black/75 backdrop-blur-md border border-white/10">
            <Star size={14} className="text-yellow-400" fill="currentColor" />
            <span className="text-white text-xs font-bold">{rating}</span>
          </div>
        </div>

        {/* Movie Information */}
        <div className="p-3.5">
          <h2
            title={movie.title}
            className="text-sm font-bold text-white truncate group-hover:text-blue-400 transition-colors duration-300"
          >
            {movie.title}
          </h2>

          <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
            <CalendarDays size={13} className="text-gray-500" />
            <span>{releaseYear || "Release year unknown"}</span>

            {movie.vote_count > 0 && (
              <>
                <span className="text-gray-600">•</span>
                <span>{movie.vote_count.toLocaleString()} votes</span>
              </>
            )}
          </div>
        </div>
      </Link>

      {/* Favorite Button */}
      <button
        onClick={toggleFavorite}
        type="button"
        aria-label={
          isFavorite
            ? `Remove ${movie.title} from favorites`
            : `Add ${movie.title} to favorites`
        }
        aria-pressed={isFavorite}
        title={isFavorite ? "Remove from favorites" : "Add to favorites"}
        className={`absolute top-3 right-3 w-10 h-10 rounded-full flex items-center justify-center backdrop-blur-md border border-white/20 shadow-lg transition-all duration-300 hover:scale-110 ${
          isFavorite
            ? "bg-red-500/90 text-white"
            : "bg-black/50 text-white hover:bg-red-500/90"
        }`}
      >
        <Heart
          size={19}
          fill={isFavorite ? "currentColor" : "none"}
          strokeWidth={2}
        />
      </button>

      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-50 bg-[#111827] border border-green-500/40 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <span className="text-green-400 text-xl">✓</span>
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}
    </div>
  );
});

MovieCard.displayName = "MovieCard";

export default MovieCard;
