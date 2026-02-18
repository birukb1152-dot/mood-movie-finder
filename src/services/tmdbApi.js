import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;

const BASE_URL = "https://api.themoviedb.org/3";

export const fetchMoviesByGenre = async (genreId) => {
  const res = await axios.get(
    `${BASE_URL}/dicover/movie?api_key=${API_KEY}&with_genres=${genreId}&sort_by=popularity.desc,`,
  );

  return res.data.results;
};

export const fetchPopularMovies = async () => {
  const res = await axios.get(`${BASE_URL}/movie/popular?api_key=${API_KEY}`);

  return res.data.results;
};

export const searchMovies = async (query) => {
  const res = await axios.get(
    `${BASE_URL}/search/movie?api_key=${API_KEY}&query=${query},`,
  );

  return res.data.results;
};

export const fetchMovieDetails = async (id) => {
  const res = await axios.get(`${BASE_URL}/movie/${id}?api_key=${API_KEY}`);

  return res.data.results;
};
