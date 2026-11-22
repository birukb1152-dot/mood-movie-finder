import { useCallback } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, Film, Heart, Star, Trash2 } from "lucide-react";

import { useLocalStorage } from "../hooks/useLocalStorage";

const Favorites = () => {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  // Remove a movie from favorites
  const removeFavorite = useCallback(
    (id) => {
      setFavorites((currentFavorites) =>
        currentFavorites.filter((movie) => movie.id !== id),
      );
    },
    [setFavorites],
  );

  return (
    <main className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 pt-28 pb-16">
      {/* Page Header */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-red-500/10 border border-red-500/20 mb-4">
          <Heart size={27} className="text-red-400" />
        </div>

        <h1 className="text-3xl sm:text-4xl font-extrabold text-white">
          My Favorite Movies
        </h1>

        <p className="text-gray-400 text-sm sm:text-base mt-3">
          Your personal collection of movies worth watching.
        </p>

        {favorites.length > 0 && (
          <p className="text-blue-400 text-sm font-semibold mt-3">
            {favorites.length} {favorites.length === 1 ? "movie" : "movies"}{" "}
            saved
          </p>
        )}
      </div>

      {/* Empty State */}
      {favorites.length === 0 ? (
        <div className="max-w-lg mx-auto text-center bg-[#111827] border border-white/10 rounded-2xl px-6 py-14 shadow-xl">
          <div className="w-20 h-20 rounded-full bg-gray-800 flex items-center justify-center mx-auto mb-5">
            <Film size={38} className="text-gray-500" />
          </div>

          <h2 className="text-xl font-bold text-white">
            Your collection is empty
          </h2>

          <p className="text-gray-400 text-sm leading-6 mt-3">
            You haven't saved any movies yet. Explore MoodFlix and add movies
            you love to your favorites.
          </p>

          <Link
            to="/"
            className="inline-flex items-center justify-center gap-2 mt-7 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition duration-300 hover:shadow-lg hover:shadow-blue-500/20"
          >
            <Film size={17} />
            Discover Movies
          </Link>
        </div>
      ) : (
        /* Favorite Movies Grid */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {favorites.map((movie) => {
            const poster = movie.poster_path
              ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
              : null;

            const releaseYear = movie.release_date
              ? new Date(movie.release_date).getFullYear()
              : "Unknown";

            const isRated = movie.vote_count > 0 && movie.vote_average > 0;

            return (
              <article
                key={movie.id}
                className="group flex gap-4 bg-[#111827] border border-white/10 rounded-2xl p-4 shadow-lg shadow-black/20 hover:border-blue-500/40 hover:-translate-y-1 transition duration-300 min-w-0"
              >
                {/* Movie Poster */}
                <Link
                  to={`/movie/${movie.id}`}
                  title={movie.title}
                  className="relative w-24 sm:w-28 shrink-0 aspect-[2/3] rounded-xl overflow-hidden bg-[#1F2937]"
                >
                  {poster ? (
                    <img
                      src={poster}
                      alt={movie.title}
                      loading="lazy"
                      className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                    />
                  ) : (
                    <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                      <Film size={30} />
                      <span className="text-[10px] mt-2">No Poster</span>
                    </div>
                  )}
                </Link>

                {/* Movie Information */}
                <div className="flex-1 min-w-0 flex flex-col">
                  <Link
                    to={`/movie/${movie.id}`}
                    title={movie.title}
                    className="text-white font-bold text-base leading-6 line-clamp-2 hover:text-blue-400 transition"
                  >
                    {movie.title}
                  </Link>

                  {/* Rating */}
                  <div className="flex items-center gap-1.5 mt-3">
                    <Star
                      size={15}
                      className={
                        isRated
                          ? "text-yellow-400 fill-yellow-400"
                          : "text-gray-500"
                      }
                    />

                    <span className="text-sm font-semibold text-yellow-400">
                      {isRated ? movie.vote_average.toFixed(1) : "Unrated"}
                    </span>
                  </div>

                  {/* Release Year */}
                  <div className="flex items-center gap-1.5 text-gray-400 text-xs mt-2">
                    <CalendarDays size={14} />
                    {releaseYear}
                  </div>

                  {/* Overview */}
                  <p className="text-gray-400 text-xs leading-5 mt-3 line-clamp-2">
                    {movie.overview || "No description available."}
                  </p>

                  {/* Actions */}
                  <div className="flex items-center gap-2 mt-auto pt-4">
                    <Link
                      to={`/movie/${movie.id}`}
                      className="flex-1 text-center px-3 py-2 rounded-lg bg-blue-600/15 border border-blue-500/20 hover:bg-blue-600 text-blue-300 hover:text-white text-xs font-bold transition"
                    >
                      View Details
                    </Link>

                    <button
                      type="button"
                      onClick={() => removeFavorite(movie.id)}
                      aria-label={`Remove ${movie.title} from favorites`}
                      title="Remove from favorites"
                      className="inline-flex items-center justify-center w-9 h-9 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 hover:bg-red-600 hover:text-white transition"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </main>
  );
};

export default Favorites;
