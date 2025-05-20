"use client";

import { useEffect, useState } from 'react';
import { IMovieDetail } from '../../types/IMovieDetail';
import MovieList from '../../components/MovieList/MovieList';
import LoadingSpinner from '../../components/ui/LoadingSpinner';

export default function MyFavoritesPage() {
  const [favorites, setFavorites] = useState<Partial<IMovieDetail>[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const loadFavorites = () => {
    try {
      const storedFavorites = localStorage.getItem("favoriteMovies");
      
      if (!storedFavorites) {
        console.log('No favorites found in storage');
        localStorage.setItem("favoriteMovies", JSON.stringify([]));
        setFavorites([]);
        return;
      }

      try {
        const parsedFavorites = JSON.parse(storedFavorites);
        console.log('Parsed favorites:', parsedFavorites);
        
        if (Array.isArray(parsedFavorites)) {
          // Filter valid movies and ensure they have required properties
          const validFavorites = parsedFavorites.filter(movie => 
            movie && 
            typeof movie === 'object' && 
            'id' in movie && 
            'title' in movie && 
            'poster_path' in movie &&
            'vote_average' in movie &&
            'release_date' in movie &&
            'overview' in movie
          );
          
          // Convert the data to match IMovieDetail structure
          const moviesWithDefaults = validFavorites.map(movie => ({
            id: movie.id,
            title: movie.title,
            poster_path: movie.poster_path || '',
            vote_average: typeof movie.vote_average === 'number' ? movie.vote_average : 0,
            release_date: movie.release_date || '',
            overview: movie.overview || '',
            // Add required properties with default values
            adult: false,
            backdrop_path: '',
            genre_ids: [],
            original_language: '',
            original_title: movie.title,
            popularity: 0,
            video: false,
            vote_count: 0,
            genres: []
          }));
          
          console.log('Valid favorites with defaults:', moviesWithDefaults);
          setFavorites(moviesWithDefaults);
          
          // Update localStorage if needed
          if (validFavorites.length !== parsedFavorites.length) {
            console.log('Updating storage with valid favorites');
            localStorage.setItem("favoriteMovies", JSON.stringify(validFavorites));
          }
        } else {
          console.log('Stored favorites is not an array');
          localStorage.setItem("favoriteMovies", JSON.stringify([]));
          setFavorites([]);
        }
      } catch (error) {
        console.error('Error parsing favorites:', error);
        localStorage.setItem("favoriteMovies", JSON.stringify([]));
        setFavorites([]);
      }
    } catch (error) {
      console.error('Error accessing localStorage:', error);
      setFavorites([]);
    }
  };

  useEffect(() => {
    const initializeFavorites = () => {
      setIsLoading(true);
      loadFavorites();
      setIsLoading(false);
    };

    initializeFavorites();

    const handleFavoritesUpdate = () => {
      loadFavorites();
    };

    window.addEventListener('storage', handleFavoritesUpdate);
    window.addEventListener('favoritesUpdated', handleFavoritesUpdate);
    
    return () => {
      window.removeEventListener('storage', handleFavoritesUpdate);
      window.removeEventListener('favoritesUpdated', handleFavoritesUpdate);
    };
  }, []);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <div className="container mx-auto px-4 py-8 animate-fadeIn">
      <h1 className="text-4xl font-bold mb-8">My Favorite Movies</h1>
      
      {favorites.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 dark:bg-gray-800/50 rounded-xl">
          <svg
            className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-600 mb-4"
            fill="none"
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
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-2">
            No Favorite Movies Yet
          </p>
          <p className="text-gray-500 dark:text-gray-500">
            Start exploring and add movies to your favorites!
          </p>
        </div>
      ) : (
        <MovieList movies={favorites as IMovieDetail[]} />
      )}
    </div>
  );
}
