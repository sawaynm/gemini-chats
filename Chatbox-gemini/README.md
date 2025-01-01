# Gemini Chatbox

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Fgemini-chatbox&env=GEMINI_API_KEY,NEXTAUTH_SECRET&envDescription=API%20keys%20required%20for%20the%20application&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Fgemini-chatbox%23environment-variables&project-name=gemini-chatbox&repository-name=gemini-chatbox&demo-title=Gemini%20Chatbox&demo-description=AI%20Chat%20Interface%20powered%20by%20Google%20Gemini&demo-url=https%3A%2F%2Fgemini-chatbox.vercel.app&demo-image=https%3A%2F%2Fgemini-chatbox.vercel.app%2Fdemo.png)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.3.3-blue.svg)](https://www.typescriptlang.org/)
[![Next.js](https://img.shields.io/badge/Next.js-14.2.22-black.svg)](https://nextjs.org/)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Next.js-based chat interface for the Google Gemini AI model with TypeScript support, real-time updates, and error handling.

## One-Click Deployment

1. Click the "Deploy with Vercel" button above
2. Configure the required environment variables:
   - `GEMINI_API_KEY`: Your Google Gemini API key ([Get one here](https://makersuite.google.com/app/apikey))
   - `NEXTAUTH_SECRET`: A random string for NextAuth.js (you can generate one using `openssl rand -base64 32`)
3. Click "Deploy" and wait for the build to complete

## Features

- 🤖 Google Gemini AI Integration
- 💬 Real-time Chat Interface
- 🎨 Theme Customization (Light/Dark)
- 🔒 Safety Filters
- ♿ Accessibility Support
- 🔄 Automatic Retries
- 📱 Responsive Design

## Local Development

### Prerequisites

- Node.js 16.x or higher
- A Google Gemini API key

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd gemini-chatbox
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env.local` file:
```env
GEMINI_API_KEY=your_api_key_here
NEXTAUTH_SECRET=your_nextauth_secret_here
```

4. Run the development server:
```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to see the application.

## Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `GEMINI_API_KEY` | Google Gemini API key | Yes |
| `NEXTAUTH_SECRET` | NextAuth.js secret key | Yes |
| `NEXTAUTH_URL` | NextAuth.js URL (set automatically by Vercel) | Production only |

## Project Structure

```
src/
├── components/        # React components
│   ├── ChatBox.tsx   # Main chat interface
│   ├── ChatMessage.tsx # Message component
│   └── ...
├── pages/            # Next.js pages
│   ├── api/          # API routes
│   └── ...
├── utils/            # Utility functions
│   ├── api.ts        # Gemini API integration
│   └── ...
├── types/            # TypeScript types
└── styles/           # CSS styles
```

## Configuration

### API Configuration (`src/utils/config.ts`)

```typescript
export const config = {
  MAX_MESSAGES: 50,
  RETRY_CONFIG: {
    maxRetries: 3,
    initialDelay: 1000,
    maxDelay: 5000
  }
};
```

### Safety Filters

Safety filters can be toggled in the UI and are configured to block:
- Harassment
- Hate Speech
- Sexually Explicit Content
- Violence

## Error Handling

The application includes comprehensive error handling:
- API Authentication Errors
- Rate Limiting
- Network Issues
- Invalid Responses
- Timeout Handling

Error recovery includes:
- Automatic retries with exponential backoff
- User-friendly error messages
- Manual retry option for failed messages

## Deployment Environments

| Environment | URL | Description |
|-------------|-----|-------------|
| Production | https://gemini-chatbox.vercel.app | Production deployment |
| Preview | https://gemini-chatbox-git-main.vercel.app | Preview deployment for main branch |
| Development | http://localhost:3000 | Local development |

## Monitoring & Analytics

The application is configured with:
- Vercel Analytics for performance monitoring
- Error tracking
- Real-time alerts
- Usage statistics

## Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit your changes: `git commit -m 'Add amazing feature'`
4. Push to the branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## Support

- Documentation: [Wiki](https://github.com/your-username/gemini-chatbox/wiki)
- Issues: [GitHub Issues](https://github.com/your-username/gemini-chatbox/issues)
- Discussions: [GitHub Discussions](https://github.com/your-username/gemini-chatbox/discussions)

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Acknowledgments

- Google Gemini AI
- Next.js Team
- Vercel Platform
- Open Source Community
