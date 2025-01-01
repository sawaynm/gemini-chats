# Gemini Chat

A modern chat interface powered by Google's Gemini AI models, built with Next.js and React.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsawaynm%2Fgemini-chat)

## Features

- Real-time chat interface
- Integration with Google's Gemini AI
- Clean and responsive UI with Tailwind CSS
- Safety filter toggle
- Mobile-friendly design

## Getting Started

### Prerequisites
- Node.js (v16+ recommended)  
- npm or yarn  
- A valid Google API key for Gemini  

### Installation
```bash
git clone https://github.com/sawaynm/gemini-chat.git
cd gemini-chat
npm install
```

### Environment Variables
Create a `.env.local` file in the root of your project and add the following environment variables:
```
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here
GEMINI_API_KEY=your-gemini-api-key-here
```

### Running the Development Server
```bash
npm run dev
```

### Building for Production
```bash
npm run build
npm start
```

### Deploying to Vercel
You can deploy this project to Vercel by clicking the button below:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsawaynm%2Fgemini-chat)
