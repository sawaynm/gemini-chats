module.exports = {
  env: {
    GEMINI_API_KEY: process.env.GEMINI_API_KEY || 'default-gemini-api-key',
    NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET || 'default-nextauth-secret',
    REACT_APP_GEMINI_API_KEY: process.env.REACT_APP_GEMINI_API_KEY || 'default-react-app-gemini-api-key',
    REACT_APP_API_ENDPOINT: process.env.REACT_APP_API_ENDPOINT || 'default-react-app-api-endpoint',
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
