'use client';

import { useEffect, useState } from 'react';
import { IMovieDetail } from '../../types/IMovieDetail';
import Image from 'next/image';
import Link from 'next/link';

interface MovieCarouselProps {
    movies: IMovieDetail[];
}

export default function MovieCarousel({ movies }: MovieCarouselProps) {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isImageLoading, setIsImageLoading] = useState(true);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentIndex((current) => (current + 1) % movies.length);
        }, 5000);

        return () => clearInterval(interval);
    }, [movies.length]);

    if (!movies.length) return null;

    const currentMovie = movies[currentIndex];

    return (
        <div className="relative w-full h-[80vh] overflow-hidden">
            <div className="absolute inset-0">
                {movies.map((movie, index) => (
                    <div key={movie.id} className={index !== currentIndex ? 'hidden' : ''}>
                        <Image
                            src={`https://image.tmdb.org/t/p/original${movie.backdrop_path}`}
                            alt={movie.title}
                            fill
                            className={`object-cover transition-opacity duration-300 ${
                                isImageLoading ? 'opacity-0' : 'opacity-100'
                            }`}
                            quality={100}
                            priority={index === currentIndex}
                            sizes="100vw"
                            onLoadingComplete={() => setIsImageLoading(false)}
                        />
                    </div>
                ))}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />
            </div>

            <div className="relative h-full container mx-auto px-4 flex items-end pb-20">
                <div className="max-w-2xl animate-slideUpFade">
                    <h2 className="text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        {currentMovie.title}
                    </h2>
                    <p className="text-lg text-gray-200 mb-6 line-clamp-2 drop-shadow-lg">
                        {currentMovie.overview}
                    </p>
                    <div className="flex items-center gap-4">
                        <Link
                            href={`/movie/${currentMovie.id}`}
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition-colors shadow-lg hover:shadow-xl transform hover:scale-105 duration-200"
                        >
                            View Details
                        </Link>
                        <div className="flex items-center bg-black/50 px-3 py-2 rounded-lg backdrop-blur-sm">
                            <svg className="w-5 h-5 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white font-semibold">
                                {currentMovie.vote_average.toFixed(1)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2">
                {movies.map((_, index) => (
                    <button
                        key={index}
                        onClick={() => setCurrentIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                            index === currentIndex
                                ? 'bg-white w-8'
                                : 'bg-white/50 hover:bg-white/75'
                        }`}
                    />
                ))}
            </div>
        </div>
    );
} 