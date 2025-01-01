module.exports = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'default-gemini-api-key',
  },
  async redirects() {
    return [
      {
        source: '/',
        destination: '/chat',
        permanent: true,
      },
    ];
  },
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: '/api/:path*',
      },
    ];
  },
  images: {
    domains: ['example.com'],
  },
};
