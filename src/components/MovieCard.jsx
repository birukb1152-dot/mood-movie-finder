import { Link } from "react-router-dom";

const MovieCard = ({ movie }) => {
  const poster = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : "https://via.placeholder.com/300x450?text=No+Image";

  return (
    <Link
      to={`/movie/${movie.id}`}
      className="bg-[#1F2937] rounded-2xl overflow-hidden shadow-xl shadow-black/40 hover:scale-105 transition duration-300"
    >
      <img
        src={poster}
        alt={movie.title}
        className="w-full h-62.5 object-cover"
      />

      <div className="p-3">
        <h2 className="text-sm font-semibold truncate">{movie.title}</h2>

        <p className="text-xs text-gray-400 mt-1">
          ⭐ <span className="text-yellow-400">{movie.vote_average}</span>
        </p>
      </div>
    </Link>
  );
};

export default MovieCard;
