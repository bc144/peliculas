import api from "../api";
import { IMovieDetail } from "../../types/IMovieDetail";

interface SimilarMoviesResponse {
  page: number;
  results: IMovieDetail[];
  total_pages: number;
  total_results: number;
}

export const getSimilarMovies = async (movieId: string): Promise<IMovieDetail[]> => {
  try {
    const { data } = await api.get<SimilarMoviesResponse>(`/movie/${movieId}/similar`, {
      params: {
        language: "en-US",
        page: 1
      }
    });
    return data.results.slice(0, 5); // Return only first 5 similar movies
  } catch (error) {
    console.error('Error fetching similar movies:', error);
    return [];
  }
}; 