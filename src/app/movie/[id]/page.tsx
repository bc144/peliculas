"use client";

import { useEffect, useState, use } from "react";
import Image from "next/image";
import { IMovieDetail } from "../../../types/IMovieDetail";
import { getMovieById } from "../../../services/movies/getMovieById";
import { getSimilarMovies } from "../../../services/movies/getSimilarMovies";
import LoadingSpinner from "../../../components/ui/LoadingSpinner";
import MovieCard from "../../../components/MovieCard/MovieCard";

export default function MovieDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const [movie, setMovie] = useState<IMovieDetail | null>(null);
  const [similarMovies, setSimilarMovies] = useState<IMovieDetail[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);

  // Function to check if a movie is in favorites
  const checkFavoriteStatus = (movieId: number) => {
    try {
      const storedFavorites = localStorage.getItem("favoriteMovies");
      let favorites: Partial<IMovieDetail>[] = [];

      if (storedFavorites) {
        try {
          const parsed = JSON.parse(storedFavorites);
          if (Array.isArray(parsed)) {
            favorites = parsed;
          }
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }

      // Set initial favorites if empty
      if (!storedFavorites) {
        localStorage.setItem("favoriteMovies", JSON.stringify([]));
      }

      const isFav = favorites.some(fav => fav.id === movieId);
      console.log('Checking favorite status for movie:', movieId, 'Result:', isFav);
      setIsFavorite(isFav);
    } catch (error) {
      console.error('Error checking favorite status:', error);
      localStorage.setItem("favoriteMovies", JSON.stringify([]));
      setIsFavorite(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError("");
        const movieData = await getMovieById(resolvedParams.id);
        setMovie(movieData);
        checkFavoriteStatus(movieData.id);
        const similar = await getSimilarMovies(resolvedParams.id);
        setSimilarMovies(similar);
      } catch (err) {
        setError("Failed to fetch movie details");
        console.error("Error fetching movie:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [resolvedParams.id]);

  // Function to toggle favorite status
  const toggleFavorite = () => {
    if (!movie) return;
    
    try {
      let favorites: Partial<IMovieDetail>[] = [];
      const storedFavorites = localStorage.getItem("favoriteMovies");
      
      if (storedFavorites) {
        try {
          const parsed = JSON.parse(storedFavorites);
          if (Array.isArray(parsed)) {
            favorites = parsed;
          }
        } catch (e) {
          console.error('Error parsing favorites:', e);
        }
      }

      if (isFavorite) {
        // Remove from favorites
        favorites = favorites.filter(fav => fav.id !== movie.id);
        console.log('Removing movie from favorites:', movie.id);
      } else {
        // Add to favorites
        if (!favorites.some(fav => fav.id === movie.id)) {
          // Create a new object with only the necessary properties
          const movieToAdd = {
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path || '',
            vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
            release_date: movie.release_date || '',
            overview: movie.overview || ''
          };
          favorites.push(movieToAdd);
          console.log('Adding movie to favorites:', movieToAdd);
        }
      }

      // Remove any potential duplicates and invalid entries
      favorites = favorites.filter((fav, index, self) => 
        fav && 
        typeof fav === 'object' &&
        'id' in fav &&
        'title' in fav &&
        'poster_path' in fav &&
        index === self.findIndex((t) => t.id === fav.id)
      );

      console.log('Saving favorites:', favorites);
      localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
      setIsFavorite(!isFavorite);
      
      // Dispatch custom event for same-tab updates
      window.dispatchEvent(new Event('favoritesUpdated'));
    } catch (error) {
      console.error('Error updating favorites:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <LoadingSpinner />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen text-red-500">
        {error}
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        Movie not found
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-transparent to-gray-100 dark:to-gray-900">
      {/* Backdrop Image */}
      <div className="absolute top-0 left-0 w-full h-[70vh] overflow-hidden z-0 pointer-events-none">
        {movie.backdrop_path && (
          <Image
            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
            alt={movie.title}
            fill
            className="object-cover opacity-30 dark:opacity-20"
            priority
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-white/60 to-white dark:via-gray-900/60 dark:to-gray-900" />
      </div>

      {/* Main content */}
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 animate-fadeIn">
          {/* Movie Poster */}
          <div className="md:col-span-1">
            <div className="sticky top-8">
              <div className="relative w-full max-w-[300px] mx-auto aspect-[2/3] rounded-xl overflow-hidden shadow-2xl animate-scaleIn">
                {movie.poster_path ? (
                  <Image
                    src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                    alt={movie.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 300px"
                    priority
                  />
                ) : (
                  <div className="absolute inset-0 bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                    <svg className="w-16 h-16 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                )}
              </div>
            </div>
          </div>
          
          {/* Movie Details */}
          <div className="md:col-span-2 animate-slideUpFade">
            <div className="flex justify-between items-start">
              <h1 className="text-4xl md:text-5xl font-bold mb-4 text-gray-900 dark:text-white">
                {movie.title}
              </h1>
              <button
                onClick={toggleFavorite}
                className={`p-3 rounded-full transition-all duration-300 ${
                  isFavorite 
                    ? 'bg-red-500 text-white hover:bg-red-600' 
                    : 'bg-gray-200 text-gray-600 hover:bg-gray-300 dark:bg-gray-700 dark:text-gray-300'
                }`}
              >
                <svg
                  className="w-6 h-6"
                  fill={isFavorite ? 'currentColor' : 'none'}
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </button>
            </div>

            {movie.tagline && (
              <p className="text-xl text-gray-600 dark:text-gray-400 italic mb-6">
                &quot;{movie.tagline}&quot;
              </p>
            )}

            <div className="mb-8">
              <div className="flex flex-wrap items-center gap-4 text-gray-600 dark:text-gray-300 mb-4">
                <span>{new Date(movie.release_date).getFullYear()}</span>
                <span>•</span>
                <span>{movie.runtime} minutes</span>
                <span>•</span>
                <div className="flex items-center">
                  <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                  <span>{movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A'}</span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-6">
                {movie.genres.map((genre) => (
                  <span
                    key={genre.id}
                    className="px-4 py-1.5 bg-gray-200 dark:bg-gray-700 rounded-full text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    {genre.name}
                  </span>
                ))}
              </div>
            </div>

            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h2 className="text-2xl font-semibold mb-4">Overview</h2>
              <p className="text-gray-600 dark:text-gray-300 leading-relaxed">
                {movie.overview}
              </p>
            </div>
          </div>
        </div>

        {/* Similar Movies Section */}
        {similarMovies.length > 0 && (
          <div className="mt-16 animate-fadeIn">
            <h2 className="text-3xl font-bold mb-8">Similar Movies</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {similarMovies.map((movie) => {
                // Ensure all required props are valid numbers or strings
                const voteAverage = typeof movie.vote_average === 'number' ? movie.vote_average : 0;
                const releaseYear = movie.release_date ? new Date(movie.release_date).getFullYear() : 0;
                
                return (
                  <MovieCard
                    key={movie.id}
                    id={movie.id}
                    title={movie.title}
                    voteAverage={voteAverage}
                    posterPath={movie.poster_path || ''}
                    releaseYear={releaseYear}
                    description={movie.overview || ''}
                  />
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
