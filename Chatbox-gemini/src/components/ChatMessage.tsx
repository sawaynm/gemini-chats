import React from 'react';

interface ChatMessageProps {
  message: string;
  role: 'user' | 'assistant';
}

const ChatMessage: React.FC<ChatMessageProps> = ({ message, role }) => {
  return (
    <div
      className={`mb-4 p-4 rounded-lg shadow-md ${
        role === "user"
          ? "bg-blue-100 text-blue-900"
          : "bg-gray-100 text-gray-800"
      }`}
    >
      <p className="whitespace-pre-wrap break-words">{message}</p>
    </div>
  );
};

export default ChatMessage;
