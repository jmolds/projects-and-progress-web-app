// next.config.js
module.exports = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'firebasestorage.googleapis.com',
        port: '',
        pathname: '/v0/b/projects-and-progress.appspot.com/o/**',
      },
    ],
  },
  // Other Next.js config options...
};
