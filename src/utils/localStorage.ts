import { Movie } from '../types/movie';

export const getFavorites = (): Movie[] => {
  if (typeof window === 'undefined') return [];
  return JSON.parse(localStorage.getItem('favorites') || '[]');
};

export const toggleFavorite = (movie: Movie): void => {
  if (typeof window === 'undefined') return;
  const current = getFavorites();
  const exists = current.find((m) => m.id === movie.id);
  const updated = exists 
    ? current.filter((m) => m.id !== movie.id) 
    : [...current, movie];
  localStorage.setItem('favorites', JSON.stringify(updated));
};

export const isFavorite = (movieId: number): boolean => {
  if (typeof window === 'undefined') return false;
  const favorites = getFavorites();
  return favorites.some((movie) => movie.id === movieId);
}; 