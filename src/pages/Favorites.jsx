import { useLocalStorage } from "../hooks/useLocalStorage";
import { Link } from "react-router-dom";

const Favorites = () => {
  const [favorites, setFavorites] = useLocalStorage("favorites", []);

  const removeFavorite = (id) => {
    setFavorites(favorites.filter((movie) => movie.id !== id));
  };

  return (
    <div className="max-w-6xl mx-auto px-5 pb-10">
      <h1 className="text-3xl font-bold text-center mt-6 mb-6">
        My Favorite Movies
      </h1>

      {favorites.length === 0 ? (
        <p className="text-center text-gray-400">No favorite movies yet 😢</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mt-6">
          {favorites.map((movie) => (
            <div
              key={movie.id}
              className="bg-[#1F2937] p-4 rounded-2xl flex gap-4 shadow-xl shadow-black/40"
            >
              <img
                src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                alt={movie.title}
                className="w-20 h-28 object-cover rounded-xl"
              />

              <div className="flex-1">
                <Link
                  to={`/movie/${movie.id}`}
                  className="font-semibold hover:text-blue-400"
                >
                  {movie.title}
                </Link>

                <p className="text-sm text-yellow-400 mt-1">
                  ⭐ {movie.vote_average}
                </p>

                <button
                  onClick={() => removeFavorite(movie.id)}
                  className="mt-3 px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
