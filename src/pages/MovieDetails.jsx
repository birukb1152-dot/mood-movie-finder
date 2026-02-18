import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchMovieDetails } from "../services/tmdbApi";
import Loader from "../components/Loader";
import { useLocalStorage } from "../hooks/useLocalStorage";

const MovieDetails = () => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(false);

  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  useEffect(() => {
    const loadDetails = async () => {
      setLoading(true);
      const data = await fetchMovieDetails(id);
      setMovie(data);
      setLoading(false);
    };

    loadDetails();
  }, [id]);

  const addToFavorites = () => {
    const exists = favorites.find((fav) => fav.id === movie.id);
    if (exists) return;

    setFavorites([...favorites, movie]);
  };

  if (loading) return <Loader />;
  if (!movie) return null;

  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/original${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <div className="max-w-5xl mx-auto px-5 pb-10">
      <div className="bg-[#111827] rounded-2xl overflow-hidden shadow-xl shadow-black/50">
        <img
          src={poster}
          alt={movie.title}
          className="w-full max-h-100 object-cover"
        />

        <div className="p-6">
          <h1 className="text-2xl md:text-3xl font-bold">{movie.title}</h1>

          <p className="text-yellow-400 font-semibold mt-2">
            ⭐ Rating: {movie.vote_average}
          </p>

          <p className="text-gray-400 text-sm mt-2">
            Release Date: {movie.release_date}
          </p>

          <p className="text-gray-400 text-sm mt-1">
            Genres: {movie.genres.map((g) => g.name).join(", ")}
          </p>

          <p className="text-sm text-gray-300 mt-4 leading-relaxed">
            {movie.overview}
          </p>

          <div className="flex gap-4 mt-6">
            <button className="px-5 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl text-sm font-semibold transition">
              Watch Trailer
            </button>

            <button
              onClick={addToFavorites}
              className="px-5 py-3 bg-red-500 hover:bg-red-600 rounded-xl text-sm font-semibold transition"
            >
              ❤️ Add to Favorites
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
