import type { Metadata } from 'next';
import { Space_Grotesk, Inter } from 'next/font/google';
import './globals.css';
import Preloader from '@/components/Preloader';
import MotionProvider from '@/components/MotionProvider';
import CommandPalette from '@/components/CommandPalette';

const spaceGrotesk = Space_Grotesk({
  subsets: ['latin'],
  variable: '--font-space-grotesk',
  display: 'swap',
});

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'TechNeeds IGDTUW — Premier Technical Society',
  description: 'Fostering technical innovation, hackathons, and software engineering proficiency at IGDTUW Delhi.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className={`${spaceGrotesk.variable} ${inter.variable}`}>
      <body className="bg-midnight text-gray-200 font-body antialiased selection:bg-cobalt/40 selection:text-lime">
        <Preloader />
        <MotionProvider>
          {children}
          <CommandPalette />
        </MotionProvider>
      </body>
    </html>
  );
}
