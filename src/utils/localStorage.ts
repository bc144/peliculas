import { IMovieDetail } from '../types/IMovieDetail';

export const getFavorites = (): IMovieDetail[] => {
  if (typeof window === 'undefined') return [];
  
  const storedFavorites = localStorage.getItem("favoriteMovies");
  if (!storedFavorites) {
    return [];
  }

  try {
    const favorites = JSON.parse(storedFavorites);
    return Array.isArray(favorites) ? favorites : [];
  } catch (error) {
    console.error('Error parsing favorites:', error);
    return [];
  }
};

export const addToFavorites = (movie: IMovieDetail): void => {
  const favorites = getFavorites();
  if (!favorites.some(fav => fav.id === movie.id)) {
    favorites.push(movie);
    localStorage.setItem("favoriteMovies", JSON.stringify(favorites));
  }
};

export const removeFromFavorites = (movieId: number): void => {
  const favorites = getFavorites();
  const updatedFavorites = favorites.filter(movie => movie.id !== movieId);
  localStorage.setItem("favoriteMovies", JSON.stringify(updatedFavorites));
};

export const isFavorite = (movieId: number): boolean => {
  const favorites = getFavorites();
  return favorites.some(movie => movie.id === movieId);
}; 