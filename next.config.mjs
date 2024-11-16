/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  images: {
    domains: ['i.imgur.com'],  // Permite imágenes desde Imgur
  },
};

export default nextConfig;
