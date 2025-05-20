'use client';

import { useEffect, useState } from 'react';
import { getPopularMovies } from '../services/movies/getPopularMovies';
import { getTopRatedMovies } from '../services/movies/getTopRatedMovies';
import { getNowPlayingMovies } from '../services/movies/getNowPlayingMovies';
import MovieList from '../components/MovieList/MovieList';
import Link from 'next/link';
import AnimatedTitle from '@/components/AnimatedTitle/AnimatedTitle';
import MovieCarousel from '@/components/MovieCarousel/MovieCarousel';
import { IMovieDetail } from '@/types/IMovieDetail';

export default function Home() {
  const [featuredMovies, setFeaturedMovies] = useState<IMovieDetail[]>([]);
  const [popular, setPopular] = useState<IMovieDetail[]>([]);
  const [topRated, setTopRated] = useState<IMovieDetail[]>([]);
  const [nowPlaying, setNowPlaying] = useState<IMovieDetail[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadMovies = async () => {
      try {
        const [popularData, topRatedData, nowPlayingData] = await Promise.all([
          getPopularMovies(),
          getTopRatedMovies(),
          getNowPlayingMovies()
        ]);

        const allMovies = [...popularData.results, ...topRatedData.results, ...nowPlayingData.results];
        const uniqueMovies = Array.from(new Set(allMovies.map(m => m.id)))
          .map(id => allMovies.find(m => m.id === id))
          .filter(m => m?.backdrop_path) as IMovieDetail[];
        const randomMovies = uniqueMovies
          .sort(() => Math.random() - 0.5)
          .slice(0, 5);

        setFeaturedMovies(randomMovies);
        setPopular(popularData.results.slice(0, 5));
        setTopRated(topRatedData.results.slice(0, 5));
        setNowPlaying(nowPlayingData.results.slice(0, 5));
      } catch (error) {
        console.error('Error loading movies:', error);
      }
      setIsLoading(false);
    };

    loadMovies();
  }, []);

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-400"></div>
      </div>
    );
  }

  return (
    <main className="bg-black min-h-screen">
      <AnimatedTitle />
      <MovieCarousel movies={featuredMovies} />
      
      <div className="container mx-auto px-4 py-12">
        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Popular Movies</h2>
            <Link 
              href="/popular"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <MovieList movies={popular} />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Top Rated Movies</h2>
            <Link 
              href="/top-rated"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <MovieList movies={topRated} />
        </section>

        <section className="mb-12">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-semibold text-white">Now Playing</h2>
            <Link 
              href="/now-playing"
              className="text-blue-400 hover:text-blue-300 transition-colors"
            >
              View All →
            </Link>
          </div>
          <MovieList movies={nowPlaying} />
        </section>
      </div>
    </main>
  );
}
