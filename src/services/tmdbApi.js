import axios from "axios";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const tmdbApi = axios.create({
  baseURL: BASE_URL,
  timeout: 15000,
  params: {
    api_key: API_KEY,
  },
});

// Fetch movies with advanced filters and cancellation support
export const fetchDiscoverMoviesPage = async ({
  page = 1,
  genreId = null,
  rating = "0",
  releasePeriod = "all",
  sortBy = "popularity.desc",
  signal,
} = {}) => {
  const params = {
    page,
    sort_by: sortBy,
  };

  if (genreId) {
    params.with_genres = genreId;
  }

  if (Number(rating) > 0) {
    params["vote_average.gte"] = Number(rating);
  }

  if (releasePeriod !== "all") {
    const [startYear, endYear] = releasePeriod.split("-");

    params["primary_release_date.gte"] = `${startYear}-01-01`;
    params["primary_release_date.lte"] = `${endYear}-12-31`;
  }

  if (sortBy === "vote_average.desc") {
    params["vote_count.gte"] = 100;
  }

  const res = await tmdbApi.get("/discover/movie", {
    params,
    signal,
  });

  return res.data;
};

// Fetch popular movies with pagination
export const fetchPopularMoviesPage = async (page = 1, signal) => {
  const res = await tmdbApi.get("/movie/popular", {
    params: { page },
    signal,
  });

  return res.data;
};

// Fetch movies by genre with pagination
export const fetchMoviesByGenrePage = async (genreId, page = 1, signal) => {
  const res = await tmdbApi.get("/discover/movie", {
    params: {
      with_genres: genreId,
      sort_by: "popularity.desc",
      page,
    },
    signal,
  });

  return res.data;
};

// Fetch popular movies
export const fetchPopularMovies = async (signal) => {
  const data = await fetchPopularMoviesPage(1, signal);
  return data.results;
};

// Fetch movies by genre
export const fetchMoviesByGenre = async (genreId, signal) => {
  const data = await fetchMoviesByGenrePage(genreId, 1, signal);
  return data.results;
};

// Search movies
export const searchMovies = async (query, signal) => {
  const res = await tmdbApi.get("/search/movie", {
    params: { query },
    signal,
  });

  return res.data.results;
};

// Fetch movie details
export const fetchMovieDetails = async (id, signal) => {
  const res = await tmdbApi.get(`/movie/${id}`, { signal });
  return res.data;
};

// Fetch movie videos
export const fetchMovieVideos = async (id, signal) => {
  const res = await tmdbApi.get(`/movie/${id}/videos`, { signal });
  return res.data.results;
};

// Fetch movie cast and crew
export const fetchMovieCredits = async (id, signal) => {
  const res = await tmdbApi.get(`/movie/${id}/credits`, { signal });
  return res.data;
};

// Fetch similar movies
export const fetchSimilarMovies = async (id, page = 1, signal) => {
  const res = await tmdbApi.get(`/movie/${id}/similar`, {
    params: { page },
    signal,
  });

  return res.data.results;
};
