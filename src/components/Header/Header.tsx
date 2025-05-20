"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import clsx from 'clsx';

const links = [
    {href: "/popular", label: "Popular"},
    {href: "/now-playing", label: "Now Playing"},
    {href: "/top-rated", label: "Top Rated"},
    {href: "/my-favorites", label: "My Favorites"},
];

const Header = () => {
    const pathname = usePathname();

    return(
        <header className="w-full border-b border-gray-800 bg-black">
            <div className='container mx-auto flex items-center justify-between px-4 py-3'>
                <Link href="/" className='text-xl font-bold text-white hover:text-blue-400 transition-colors'>
                    Movies DB
                </Link>

                <nav className="flex gap-6">
                    {links.map(({ href, label }) => (
                        <Link
                            key={href}
                            href={href}
                            className={clsx(
                                "text-sm font-medium transition-colors hover:text-blue-400",
                                pathname === href ? "text-blue-400 underline" : "text-gray-300"
                            )}
                        >
                            {label}
                        </Link>
                    ))}
                </nav>
            </div>
        </header>
    );
}

export default Header