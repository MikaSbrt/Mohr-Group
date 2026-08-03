/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    // Alle Bilder liegen lokal in /public – kein Remote-Loader nötig.
    formats: ['image/avif', 'image/webp'],
  },
};

export default nextConfig;
