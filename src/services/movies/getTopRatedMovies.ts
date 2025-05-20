import api from "../api"
import { IMovieDetail } from "../../types/IMovieDetail"

interface MovieResponse {
    page: number;
    results: IMovieDetail[];
    total_pages: number;
    total_results: number;
}

export async function getTopRatedMovies(page: number = 1): Promise<MovieResponse> {
    try {
        const response = await api.get<MovieResponse>(`/movie/top_rated?page=${page}`);
        return response.data;
    } catch (error) {
        console.error("Error fetching top rated movies:", error);
        return {
            page: 1,
            results: [],
            total_pages: 0,
            total_results: 0
        };
    }
}