'use client';

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";

interface MovieCardProps {
    id: number;
    title: string;
    voteAverage: number;
    posterPath: string;
    releaseYear: number;
    description: string;
}

const MovieCard = ({ id, title, voteAverage, posterPath, releaseYear, description }: MovieCardProps) => {
    const [imageError, setImageError] = useState(false);
    const poster = posterPath ? `https://image.tmdb.org/t/p/w500${posterPath}` : '';

    return (
        <div
            className="relative group bg-gray-900 rounded-xl overflow-hidden shadow-lg transition-all duration-300 hover:shadow-2xl hover:scale-[1.02] border border-gray-800"
        >
            <Link href={`/movie/${id}`} className="block">
                <div className="relative aspect-[2/3] w-full">
                    {poster && !imageError ? (
                        <Image
                            src={poster}
                            alt={title}
                            fill
                            className="object-cover transition-transform duration-300 group-hover:scale-105"
                            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            onError={() => setImageError(true)}
                        />
                    ) : (
                        <div className="absolute inset-0 bg-gray-800 flex items-center justify-center">
                            <svg className="w-16 h-16 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                    )}

                    {/* Rating Badge */}
                    <div className="absolute top-2 right-2 bg-black/80 text-white px-2 py-1 rounded-md text-sm font-medium flex items-center">
                        <svg className="w-4 h-4 text-yellow-400 mr-1" fill="currentColor" viewBox="0 0 20 20">
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118l-2.8-2.034c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        {voteAverage.toFixed(1)}
                    </div>
                </div>

                {/* Movie Info */}
                <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1 line-clamp-1">{title}</h3>
                    <p className="text-gray-400 text-sm mb-2">{releaseYear}</p>
                    <p className="text-gray-300 text-sm line-clamp-2">{description}</p>
                </div>
            </Link>
        </div>
    );
}

export default MovieCard;