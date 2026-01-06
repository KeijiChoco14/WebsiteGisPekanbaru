/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'upload.wikimedia.org',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'www.pekanbaru.go.id',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'celotehriau.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'encrypted-tbn0.gstatic.com',
        pathname: '**',
      },
      {
        protocol: 'https',
        hostname: 'riaucrimenews.com',
        pathname: '**',
      },
    ],
  },
};

export default nextConfig;