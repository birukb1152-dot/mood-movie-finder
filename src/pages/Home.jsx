import { useEffect, useState } from "react";
import MoodSelector from "../components/MoodSelector";
import SearchBar from "../components/SearchBar";
import FilterBar from "../components/FilterBar";
import MovieList from "../components/MovieList";
import Loader from "../components/Loader";
import {
  fetchMoviesByGenre,
  fetchPopularMovies,
  searchMovies,
} from "../services/tmdbApi";

const Home = () => {
  const [selectedMood, setSelectedMood] = useState(null);
  const [movies, setMovies] = useState([]);
  const [query, setQuery] = useState("");
  const [rating, setRating] = useState("0");
  const [loading, setLoading] = useState(false);

  const loadPopularMovies = async () => {
    setLoading(true);
    const data = await fetchPopularMovies();
    setMovies(data);
    setLoading(false);
  };

  const loadMoodMovies = async () => {
    setLoading(true);
    const data = await fetchMoviesByGenre();
    setMovies(data);
    setLoading(false);
  };

  useEffect(() => {
    loadPopularMovies();
  }, []);

  useEffect(() => {
    if (selectedMood) {
      loadMoodMovies(selectedMood.genre);
    }
  }, [selectedMood]);

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    const data = await searchMovies(query);
    setMovies(data);
    setLoading(false);
  };

  const filteredMovies = movies.filter(
    (movie) => movie.vote_average >= Number(rating),
  );

  return (
    <div className="max-w-6xl mx-auto p-4 flex flex-col justify-between">
      <h2 className="text-center font-bold text-2xl py-3 pb-5"> Home Page</h2>
      <MoodSelector
        selectedMood={selectedMood}
        setSelectedMood={setSelectedMood}
      />
      <div className="mt-5 flex flex-col md:flex-row gap-4 md:items-center md:justify-center">
        <SearchBar
          query={query}
          setQuery={setQuery}
          handleSearch={handleSearch}
        />
        <FilterBar rating={rating} setRating={setRating} />
      </div>
      {loading ? <Loader /> : <MovieList movies={filteredMovies} />}
    </div>
  );
};

export default Home;
