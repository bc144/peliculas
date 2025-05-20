import { useEffect, useState } from 'react';
import { IMovieDetail } from '../types/IMovieDetail';
import { getPopularMovies } from '../services/movies/getPopularMovies';
import { getTopRatedMovies } from '../services/movies/getTopRatedMovies';
import { getNowPlayingMovies } from '../services/movies/getNowPlayingMovies';
import MovieList from './MovieList/MovieList';
import Pagination from './Pagination';

interface CategoryPageProps {
  category: string;
  title: string;
}

export default function CategoryPage({ category, title }: CategoryPageProps) {
  const [movies, setMovies] = useState<IMovieDetail[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      setIsLoading(true);
      try {
        let data;
        switch (category) {
          case 'popular':
            data = await getPopularMovies(currentPage);
            break;
          case 'top_rated':
            data = await getTopRatedMovies(currentPage);
            break;
          case 'now_playing':
            data = await getNowPlayingMovies(currentPage);
            break;
          default:
            data = { results: [], total_pages: 1 };
        }
        setMovies(data.results);
        setTotalPages(Math.min(data.total_pages, 500)); // TMDb API limit
      } catch (error) {
        console.error('Error loading movies:', error);
        setMovies([]);
        setTotalPages(1);
      }
      setIsLoading(false);
    };

    loadMovies();
  }, [category, currentPage]);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-black">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 bg-black min-h-screen">
      <h1 className="text-4xl font-bold mb-8 text-white">{title}</h1>
      <MovieList movies={movies} />
      <Pagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />
    </div>
  );
} 