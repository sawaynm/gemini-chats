import React from 'react';

interface ChatMessageProps {
  message: React.ReactNode;
  role: 'user' | 'assistant';
  error?: boolean;
  onRetry?: () => void;
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, role, error, onRetry }) => {
  return (
    <div
      className={`mb-4 p-4 rounded-lg shadow-md ${
        role === "user"
          ? "bg-blue-100 text-blue-900"
          : error 
            ? "bg-red-100 text-red-900"
            : "bg-gray-100 text-gray-800"
      }`}
    >
      <div className="whitespace-pre-wrap break-words">
        {message}
        {error && onRetry && (
          <div className="mt-2">
            <button
              onClick={onRetry}
              className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded-md text-sm transition-colors"
              aria-label="Retry message"
            >
              Retry
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ChatMessage;
