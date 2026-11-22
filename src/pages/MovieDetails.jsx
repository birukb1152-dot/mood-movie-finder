import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import {
  CalendarDays,
  Clock3,
  Film,
  Heart,
  Play,
  Star,
  UserRound,
  Users,
  Check,
} from "lucide-react";

import {
  fetchMovieDetails,
  fetchMovieVideos,
  fetchMovieCredits,
  fetchSimilarMovies,
} from "../services/tmdbApi";

import Loader from "../components/Loader";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MovieDetails = () => {
  const { id } = useParams();

  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);
  const [trailer, setTrailer] = useState(null);
  const [credits, setCredits] = useState(null);
  const [similarMovies, setSimilarMovies] = useState([]);
  const [similarLoading, setSimilarLoading] = useState(false);

  const [favorites, setFavorites] = useLocalStorage("favorites", []);
  const [notification, setNotification] = useState("");

  // Clear notification automatically
  useEffect(() => {
    if (!notification) return;

    const timer = setTimeout(() => {
      setNotification("");
    }, 2500);

    return () => clearTimeout(timer);
  }, [notification]);

  // Fetch movie details, trailer, and credits
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadDetails = async () => {
      setLoading(true);
      setMovie(null);
      setTrailer(null);
      setCredits(null);

      try {
        // Fetch the main movie information first
        const data = await fetchMovieDetails(id, signal);

        if (signal.aborted) return;

        setMovie(data);

        // Fetch trailer and credits concurrently
        const [videosResult, creditsResult] = await Promise.allSettled([
          fetchMovieVideos(id, signal),
          fetchMovieCredits(id, signal),
        ]);

        if (signal.aborted) return;

        // Process trailer response
        if (videosResult.status === "fulfilled") {
          const videos = videosResult.value || [];

          const selectedTrailer =
            videos.find(
              (video) =>
                video.site === "YouTube" &&
                video.type === "Trailer" &&
                video.official,
            ) ||
            videos.find(
              (video) => video.site === "YouTube" && video.type === "Trailer",
            );

          setTrailer(selectedTrailer || null);
        } else {
          if (videosResult.reason?.code !== "ERR_CANCELED") {
            console.error("Failed to load movie trailer:", videosResult.reason);
          }

          setTrailer(null);
        }

        // Process cast and crew response
        if (creditsResult.status === "fulfilled") {
          setCredits(creditsResult.value);
        } else {
          if (creditsResult.reason?.code !== "ERR_CANCELED") {
            console.error(
              "Failed to load movie credits:",
              creditsResult.reason,
            );
          }

          setCredits(null);
        }
      } catch (error) {
        if (signal.aborted || error.code === "ERR_CANCELED") return;

        console.error("Failed to load movie details:", error);
        setMovie(null);
      } finally {
        if (!signal.aborted) {
          setLoading(false);
        }
      }
    };

    loadDetails();

    return () => {
      controller.abort();
    };
  }, [id]);

  // Fetch similar movies with independent cancellation
  useEffect(() => {
    const controller = new AbortController();
    const { signal } = controller;

    const loadSimilarMovies = async () => {
      setSimilarLoading(true);
      setSimilarMovies([]);

      try {
        const data = await fetchSimilarMovies(id, 1, signal);

        if (!signal.aborted) {
          setSimilarMovies(data || []);
        }
      } catch (error) {
        if (signal.aborted || error.code === "ERR_CANCELED") return;

        console.error("Failed to load similar movies:", error);
        setSimilarMovies([]);
      } finally {
        if (!signal.aborted) {
          setSimilarLoading(false);
        }
      }
    };

    loadSimilarMovies();

    return () => {
      controller.abort();
    };
  }, [id]);

  const isFavorite = favorites.some((fav) => fav.id === movie?.id);

  // Watch trailer
  const watchTrailer = () => {
    if (!trailer) {
      setNotification("Sorry, no trailer is available.");
      return;
    }

    window.open(
      `https://www.youtube.com/watch?v=${trailer.key}`,
      "_blank",
      "noopener,noreferrer",
    );
  };

  // Add movie to favorites
  const addToFavorites = () => {
    if (!movie) return;

    if (isFavorite) {
      setNotification("Already in your favorites!");
      return;
    }

    setFavorites([...favorites, movie]);
    setNotification("Added to favorites successfully!");
  };

  if (loading) return <Loader />;

  if (!movie) {
    return (
      <div className="min-h-screen bg-[#0B1120] flex flex-col items-center justify-center text-white px-5">
        <Film size={45} className="text-blue-500 mb-5" />

        <h2 className="text-xl font-bold mb-3">
          Movie details could not be loaded.
        </h2>

        <Link to="/" className="text-blue-400 hover:text-blue-300 transition">
          Return to Home
        </Link>
      </div>
    );
  }

  // Movie information
  const releaseYear = movie.release_date
    ? new Date(movie.release_date).getFullYear()
    : "Unknown";

  const runtime = movie.runtime
    ? `${Math.floor(movie.runtime / 60)}h ${movie.runtime % 60}m`
    : "Unknown";

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : null;

  const backdrop = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : null;

  const director = credits?.crew?.find((person) => person.job === "Director");

  const cast = credits?.cast?.slice(0, 12) || [];

  // Get initials for actor fallback portraits
  const getInitials = (name) => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#0B1120]">
      {/* Cinematic Backdrop */}
      {backdrop && (
        <div
          className="absolute inset-x-0 top-0 h-[650px] bg-cover bg-center opacity-[1]"
          style={{
            backgroundImage: `url(${backdrop})`,
          }}
        />
      )}

      {/* Background Gradient */}
      <div className="absolute inset-0 bg-gradient-to-b from-[#0B1120]/60 via-[#0B1120]/85 to-[#0B1120]" />

      {/* Toast Notification */}
      {notification && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-20 right-5 z-50 bg-[#111827] border border-green-500/40 text-white px-5 py-4 rounded-xl shadow-2xl flex items-center gap-3"
        >
          <Check size={20} className="text-green-400" />
          <span className="text-sm font-semibold">{notification}</span>
        </div>
      )}

      <main className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 pt-28 pb-20">
        {/* Main Movie Hero */}
        <section className="flex flex-col md:flex-row items-center md:items-start gap-8 lg:gap-12">
          {/* Movie Poster */}
          <div className="w-full max-w-[300px] md:w-[280px] lg:w-[320px] shrink-0">
            {poster ? (
              <img
                src={poster}
                alt={movie.title}
                className="w-full aspect-[2/3] object-cover rounded-2xl shadow-2xl shadow-black/60 border border-white/10"
              />
            ) : (
              <div className="w-full aspect-[2/3] rounded-2xl bg-[#1F2937] flex flex-col items-center justify-center text-gray-500">
                <Film size={55} />
                <p className="mt-3 text-sm">No Poster Available</p>
              </div>
            )}
          </div>

          {/* Movie Information */}
          <div className="flex-1 w-full min-w-0 bg-[#111827]/85 backdrop-blur-xl border border-white/10 rounded-2xl p-5 sm:p-7 md:p-8 shadow-2xl">
            {/* Title */}
            <div>
              <span className="text-blue-400 text-xs font-bold tracking-[0.2em] uppercase">
                Movie Details
              </span>

              <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-tight mt-3">
                {movie.title}
              </h1>

              {movie.tagline && (
                <p className="text-gray-400 italic text-sm md:text-base mt-3">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex flex-wrap items-center gap-3 mt-6">
              <div className="flex items-center gap-2 bg-yellow-500/10 border border-yellow-500/30 px-4 py-2 rounded-xl">
                <Star size={19} className="text-yellow-400 fill-yellow-400" />

                <span className="text-yellow-400 font-bold text-lg">
                  {movie.vote_count > 0 ? movie.vote_average.toFixed(1) : "N/A"}
                </span>

                <span className="text-gray-400 text-xs">/ 10</span>
              </div>

              <span className="text-gray-400 text-sm">TMDB Rating</span>
            </div>

            {/* Movie Metadata */}
            <div className="flex flex-wrap items-center gap-x-4 gap-y-3 mt-6 text-sm text-gray-300">
              <span className="inline-flex items-center gap-2">
                <CalendarDays size={16} className="text-blue-400" />
                {releaseYear}
              </span>

              <span className="hidden sm:block text-gray-600">•</span>

              <span className="inline-flex items-center gap-2">
                <Clock3 size={16} className="text-blue-400" />
                {runtime}
              </span>

              <span className="hidden sm:block text-gray-600">•</span>

              <span className="inline-flex items-center gap-2">
                <Users size={16} className="text-blue-400" />
                {movie.vote_count?.toLocaleString() || 0} votes
              </span>
            </div>

            {/* Genre Tags */}
            <div className="flex flex-wrap gap-2 mt-6">
              {movie.genres?.map((genre) => (
                <span
                  key={genre.id}
                  className="px-3 py-1.5 bg-white/5 border border-white/10 text-gray-300 rounded-lg text-xs font-medium hover:border-blue-400/40 hover:text-blue-300 transition"
                >
                  {genre.name}
                </span>
              ))}
            </div>

            {/* Overview */}
            <div className="mt-8">
              <h2 className="text-white text-xl font-bold mb-3">Overview</h2>

              <p className="text-gray-300 text-sm md:text-base leading-7">
                {movie.overview || "No movie description available."}
              </p>
            </div>

            {/* Primary Actions */}
            <div className="flex flex-col sm:flex-row flex-wrap gap-3 mt-8">
              <button
                onClick={watchTrailer}
                disabled={!trailer}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold transition duration-300 ${
                  trailer
                    ? "bg-blue-600 hover:bg-blue-500 hover:shadow-lg hover:shadow-blue-500/20 text-white"
                    : "bg-gray-700 text-gray-400 opacity-60 cursor-not-allowed"
                }`}
              >
                <Play size={17} fill="currentColor" />
                {trailer ? "Watch Trailer" : "Trailer Unavailable"}
              </button>

              <button
                onClick={addToFavorites}
                className={`inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl text-sm font-bold border transition duration-300 ${
                  isFavorite
                    ? "bg-green-500/10 border-green-500/40 text-green-400"
                    : "bg-white/5 border-white/15 text-white hover:bg-white/10 hover:border-white/30"
                }`}
              >
                <Heart
                  size={17}
                  className={isFavorite ? "fill-green-400" : ""}
                />

                {isFavorite ? "Added to Favorites" : "Add to Favorites"}
              </button>
            </div>
          </div>
        </section>

        {/* Cast & Crew */}
        {credits && (
          <section className="mt-16">
            <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-7">
              <div>
                <h2 className="text-2xl md:text-3xl font-bold text-white">
                  Cast & Crew
                </h2>

                <p className="text-gray-400 text-sm mt-2">
                  Meet the people behind this movie.
                </p>
              </div>

              {director && (
                <div className="text-sm text-gray-400">
                  Director:{" "}
                  <span className="text-blue-400 font-semibold">
                    {director.name}
                  </span>
                </div>
              )}
            </div>

            {cast.length > 0 ? (
              <div
                className="grid gap-4"
                style={{
                  gridTemplateColumns: "repeat(auto-fill, minmax(140px, 1fr))",
                }}
              >
                {cast.map((actor) => (
                  <div
                    key={actor.id}
                    className="group bg-[#111827] border border-white/10 rounded-xl overflow-hidden hover:-translate-y-1 hover:border-blue-500/40 transition duration-300 shadow-lg"
                  >
                    {/* Actor Portrait */}
                    <div className="relative aspect-[2/3] bg-[#1F2937] overflow-hidden">
                      {actor.profile_path ? (
                        <img
                          src={`https://image.tmdb.org/t/p/w342${actor.profile_path}`}
                          alt={actor.name}
                          loading="lazy"
                          className="w-full h-full object-cover object-top group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <UserRound size={45} strokeWidth={1.3} />

                          <span className="text-lg font-bold mt-2">
                            {getInitials(actor.name)}
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Actor Information */}
                    <div className="p-3">
                      <h3
                        className="text-white text-sm font-bold leading-5 line-clamp-2"
                        title={actor.name}
                      >
                        {actor.name}
                      </h3>

                      <p
                        className="text-gray-400 text-xs mt-2 line-clamp-2 leading-4"
                        title={actor.character}
                      >
                        {actor.character || "Character unknown"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-400 text-sm">
                Cast information is currently unavailable.
              </p>
            )}
          </section>
        )}

        {/* Similar Movies */}
        <section className="mt-16">
          <div className="mb-7">
            <h2 className="text-2xl md:text-3xl font-bold text-white">
              Similar Movies
            </h2>

            <p className="text-gray-400 text-sm mt-2">
              Discover more movies you might enjoy.
            </p>
          </div>

          {similarLoading ? (
            <div className="py-10 text-center text-gray-400">
              Loading similar movies...
            </div>
          ) : similarMovies.length > 0 ? (
            <div
              className="grid gap-5"
              style={{
                gridTemplateColumns: "repeat(auto-fill, minmax(170px, 1fr))",
              }}
            >
              {similarMovies.slice(0, 12).map((similar) => {
                const similarPoster = similar.poster_path
                  ? `https://image.tmdb.org/t/p/w500${similar.poster_path}`
                  : null;

                const isRated =
                  similar.vote_count > 0 && similar.vote_average > 0;

                const similarYear = similar.release_date
                  ? new Date(similar.release_date).getFullYear()
                  : "Unknown";

                return (
                  <Link
                    key={similar.id}
                    to={`/movie/${similar.id}`}
                    title={similar.title}
                    className="group min-w-0 bg-[#111827] border border-white/10 rounded-xl overflow-hidden hover:border-blue-500/50 hover:-translate-y-1 transition duration-300 shadow-lg hover:shadow-blue-500/5"
                  >
                    {/* Similar Movie Poster */}
                    <div className="relative aspect-[2/3] overflow-hidden bg-[#1F2937]">
                      {similarPoster ? (
                        <img
                          src={similarPoster}
                          alt={similar.title}
                          loading="lazy"
                          className="w-full h-full object-cover group-hover:scale-105 transition duration-500"
                        />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center text-gray-500">
                          <Film size={40} />
                          <span className="text-xs mt-2">No Poster</span>
                        </div>
                      )}

                      {/* Rating Badge */}
                      <div className="absolute top-2 right-2 bg-black/80 backdrop-blur-md border border-white/10 px-2 py-1 rounded-lg flex items-center gap-1">
                        {isRated && (
                          <Star
                            size={12}
                            className="text-yellow-400 fill-yellow-400"
                          />
                        )}

                        <span className="text-white text-xs font-bold">
                          {isRated
                            ? similar.vote_average.toFixed(1)
                            : "Unrated"}
                        </span>
                      </div>
                    </div>

                    {/* Similar Movie Information */}
                    <div className="p-3">
                      <h3
                        className="text-white text-sm font-bold truncate group-hover:text-blue-400 transition"
                        title={similar.title}
                      >
                        {similar.title}
                      </h3>

                      <p className="text-gray-400 text-xs mt-2">
                        {similarYear}
                      </p>
                    </div>
                  </Link>
                );
              })}
            </div>
          ) : (
            <div className="py-10 text-center bg-[#111827]/70 border border-white/10 rounded-xl">
              <Film size={35} className="mx-auto text-gray-500 mb-3" />

              <p className="text-gray-400">
                No similar movies are available for this movie.
              </p>
            </div>
          )}
        </section>
      </main>
    </div>
  );
};

export default MovieDetails;
