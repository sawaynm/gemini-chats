# Gemini Chat

A modern chat interface powered by Google's Gemini AI models, built with Next.js and React.

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fsawaynm%2Fgemini-chat)

## Features

- Real-time chat interface
- Integration with Google's Gemini AI
- Clean and responsive UI with Tailwind CSS
- Safety filter toggle
- Mobile-friendly design
- File attachment support
- User customization options for theme, font size, and layout
- Enhanced error handling

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

## Using the Attachment Feature

The chatbox now supports file attachments. You can upload files during your chat session. Here's how to use the attachment feature:

1. Click on the file input button next to the message input field.
2. Select the file you want to attach.
3. Type your message (optional).
4. Click the "Send" button to send your message along with the attachment.

The attachment will be processed and included in the conversation.

## User Customization Options

The chatbox now includes several user customization options to enhance your experience:

1. **Theme**: You can switch between light and dark themes.
2. **Font Size**: Adjust the font size to small, medium, or large for better readability.
3. **Layout**: Choose between different chatbox layouts (e.g., compact, expanded).
4. **High Contrast**: Enable high contrast mode for better accessibility.

## Mobile-Friendly Design

The chatbox is designed to be mobile-friendly, ensuring a seamless user experience across different devices. It uses responsive design techniques with Tailwind CSS to adapt to various screen sizes and provide touch-friendly interactions.

## Enhanced Error Handling

The chatbox includes enhanced error handling to provide a better user experience:

1. **User-Friendly Error Messages**: Inform users about issues with clear and concise error messages.
2. **Error Boundary Component**: Catch and handle errors in the React component tree.
3. **Fallback UI**: Provide a fallback UI to inform users when something goes wrong.
4. **Input Validation**: Validate user input and handle cases where the input is invalid or empty.

## Optimized Performance

The chatbox performance is optimized by:

1. **Minimizing API Calls**: Reduce the number of API calls by batching requests or using debouncing techniques.
2. **Optimizing Image Loading**: Use optimized images and lazy loading techniques.
3. **Efficient State Management**: Ensure efficient state updates and avoid unnecessary re-renders.
4. **Caching**: Use caching mechanisms to store frequently accessed data.
5. **Optimizing CSS and JavaScript**: Minimize and compress CSS and JavaScript files.
6. **Using a CDN**: Serve static assets from a Content Delivery Network (CDN).
7. **Optimizing Server-Side Rendering**: Ensure optimized server-side rendering.
8. **Monitoring and Analyzing Performance**: Use performance monitoring tools to identify and fix bottlenecks.
9. **Optimizing Database Queries**: Ensure optimized database queries if the chatbox interacts with a database.
10. **Using Efficient Data Structures**: Choose appropriate data structures for storing and managing chat messages.
