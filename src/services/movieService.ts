import axios from "axios";
import type { Movie } from "../types/movie";

const token = import.meta.env.VITE_TMDB_TOKEN;

interface MovieHttpResponse {
  page: number;
  results: Movie[];
  total_pages: number;
  total_results: number;
}

export const fetchMovies = async (
  query: string,
  page: number
): Promise<MovieHttpResponse> => {
  try {
    const { data } = await axios.get<MovieHttpResponse>(
      "https://api.themoviedb.org/3/search/movie",
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          query: query,
          include_adult: false,
          language: "en-US",
          page,
        },
      }
    );

    return data;
  } catch (error) {
    console.error("Error fetching movies:", error);
    return { page: 1, results: [], total_pages: 0, total_results: 0 };
  }
};
