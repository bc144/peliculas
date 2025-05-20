import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Header from '@/components/Header/Header';
import { GuestSessionProvider } from "@/providers/guestSessionContext";

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Movies DB',
  description: 'Your favorite movies database',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={inter.className}>
      <body>
        <GuestSessionProvider>
          <Header />
          <main className="p-6 mt-16">{children}</main>
        </GuestSessionProvider>
      </body>
    </html>
  );
}
