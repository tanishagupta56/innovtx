/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: ['framer-motion', 'lenis', 'gsap', 'three', '@react-three/fiber', '@react-three/drei'],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

module.exports = nextConfig;
