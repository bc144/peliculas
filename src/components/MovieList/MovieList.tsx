'use client';

import MovieCard from "../MovieCard/MovieCard";
import { IMovieDetail } from "@/types/IMovieDetail";

interface MovieProps {
    movies: IMovieDetail[]
} 

const MovieList = ({ movies }: MovieProps) => {
    const getYear = (dateString: string | undefined) => {
        if (!dateString) return 0;
        try {
            const date = new Date(dateString);
            if (isNaN(date.getTime())) {
                return 0;
            }
            return date.getFullYear();
        } catch {
            return 0;
        }
    };

    return (
        <div className="animate-fadeIn">
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 auto-rows-fr">
                {movies.map((movie, index) => {
                    const releaseYear = getYear(movie.release_date?.toString());
                    return (
                        <div
                            key={movie.id}
                            className="animate-slideUpFade"
                            style={{ animationDelay: `${index * 0.1}s` }}
                        >
                            <MovieCard
                                id={movie.id}
                                title={movie.title}
                                voteAverage={movie.vote_average || 0}
                                posterPath={movie.poster_path}
                                releaseYear={releaseYear || 0}
                                description={movie.overview || ''}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default MovieList;