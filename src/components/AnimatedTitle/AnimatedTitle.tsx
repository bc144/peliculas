'use client';

import { useEffect, useState } from 'react';

export default function AnimatedTitle() {
    const [isVisible, setIsVisible] = useState(false);

    useEffect(() => {
        setIsVisible(true);
    }, []);

    return (
        <div className="relative py-20 overflow-hidden bg-black">
            <div className="container mx-auto px-4">
                <h1 className={`text-6xl md:text-8xl font-bold text-center transition-all duration-1000 transform
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    <span className="bg-gradient-to-r from-blue-600 via-purple-500 to-pink-500 text-transparent bg-clip-text">
                        Movies
                    </span>
                    <span className="text-white ml-4">DB</span>
                </h1>
                <p className={`text-xl md:text-2xl text-gray-400 text-center mt-6 transition-all delay-500 duration-1000
                    ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0'}`}>
                    Discover your next favorite movie
                </p>
            </div>
            
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <div className="absolute w-96 h-96 -top-48 -left-48 bg-blue-500/20 rounded-full blur-3xl animate-blob" />
                <div className="absolute w-96 h-96 -top-48 -right-48 bg-purple-500/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute w-96 h-96 -bottom-48 -left-48 bg-pink-500/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
                <div className="absolute w-96 h-96 -bottom-48 -right-48 bg-blue-500/20 rounded-full blur-3xl animate-blob animation-delay-6000" />
            </div>
        </div>
    );
} 