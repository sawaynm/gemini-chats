import React, { useState, useEffect, useCallback } from 'react';
import { v4 as uuidv4 } from "uuid";
import { ChatMessage as ChatMessageType, ChatStorage, Conversation } from "../utils/storage";
import { fetchGeminiResponse, GeminiConfig, GeminiError } from "../utils/api";
import { ErrorBoundary } from "./ErrorBoundary";
import ChatMessageComponent from "./ChatMessage";
import LoadingSpinner from "./LoadingSpinner";
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import * as emoji from 'emoji-dictionary';

type MarkdownProps = {
  children?: React.ReactNode;
  className?: string;
  node?: any;
  [key: string]: any;
};

interface ChatMessageProps {
  key: string;
  message: React.ReactNode;
  role: 'user' | 'assistant';
  error?: boolean;
  onRetry?: () => void;
}

export default function ChatBox() {
  const [conversation, setConversation] = useState<Conversation>({
    id: uuidv4(),
    messages: [],
    lastUpdated: Date.now()
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [filters, setFilters] = useState(true); // Default to true for safety
  const [model, setModel] = useState("gemini-pro");
  const [theme, setTheme] = useState("light");
  const [textSize, setTextSize] = useState("text-base");
  const [highContrast, setHighContrast] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const conversations = ChatStorage.getConversations();
    if (conversations.length > 0) {
      setConversation(conversations[conversations.length - 1]);
    }
  }, []);

  const handleError = (error: unknown) => {
    if (error instanceof GeminiError) {
      return `Error: ${error.message}${error.status ? ` (Status: ${error.status})` : ''}`;
    }
    return "An unexpected error occurred. Please try again.";
  };

  const sendMessage = async (retryMessageId?: string) => {
    if (!input.trim() && !retryMessageId) return;

    setError(null);
    const messageText = retryMessageId 
      ? conversation.messages.find(m => m.id === retryMessageId)?.message || input
      : input;

    const newMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      message: messageText,
      timestamp: Date.now()
    };

    const updatedConversation = retryMessageId
      ? {
          ...conversation,
          messages: conversation.messages.filter(m => m.id !== retryMessageId),
          lastUpdated: Date.now()
        }
      : {
          ...conversation,
          messages: [...conversation.messages, newMessage],
          lastUpdated: Date.now()
        };

    setConversation(updatedConversation);
    ChatStorage.saveConversation(updatedConversation);
    if (!retryMessageId) setInput("");
    setIsTyping(true);

    try {
      const config: GeminiConfig = {
        model,
        filters,
        temperature: 0.7,
        maxTokens: 2048
      };

      const response = await fetchGeminiResponse(messageText, config);

      const assistantMessage: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        message: response.text,
        timestamp: Date.now()
      };

      const finalConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, assistantMessage],
        lastUpdated: Date.now()
      };

      setConversation(finalConversation);
      ChatStorage.saveConversation(finalConversation);
    } catch (error) {
      const errorMessage = handleError(error);
      setError(errorMessage);
      
      const errorResponse: ChatMessageType = {
        id: uuidv4(),
        role: 'assistant',
        message: errorMessage,
        timestamp: Date.now(),
        error: true
      };

      const errorConversation = {
        ...updatedConversation,
        messages: [...updatedConversation.messages, errorResponse],
        lastUpdated: Date.now()
      };

      setConversation(errorConversation);
      ChatStorage.saveConversation(errorConversation);
    } finally {
      setIsTyping(false);
    }
  };

  const handleRetry = useCallback((messageId: string) => {
    const messageToRetry = conversation.messages.find(m => m.id === messageId);
    if (messageToRetry) {
      setInput(messageToRetry.message);
      sendMessage(messageId);
    }
  }, [conversation.messages]);

  const renderMessage = (message: string): React.ReactNode => {
    return (
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        children={message}
        transformImageUri={(uri: string) => uri.startsWith('http') ? uri : `${process.env.PUBLIC_URL}/${uri}`}
        components={{
          p: ({node, children, ...props}: MarkdownProps) => (
            <p className="mb-2" {...props}>{children}</p>
          ),
          code: ({node, inline, children, ...props}: MarkdownProps) => (
            <code 
              className={`${inline ? 'bg-gray-100 rounded px-1' : 'block bg-gray-100 p-2 rounded'}`} 
              {...props}
            >
              {children}
            </code>
          ),
          text: ({children}: MarkdownProps) => {
            if (typeof children === 'string') {
              return children.replace(/:\w+:/gi, name => emoji.getUnicode(name) || name);
            }
            return children;
          }
        }}
      />
    );
  };

  return (
    <ErrorBoundary>
      <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${
        theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
      } ${highContrast ? "high-contrast" : ""}`}>
        <div className="mb-4 max-h-[60vh] overflow-y-auto" role="log" aria-live="polite">
          {conversation.messages.map((msg) => (
            <ChatMessageComponent
              key={msg.id}
              message={renderMessage(msg.message)}
              role={msg.role}
              error={msg.error}
              onRetry={msg.error ? () => handleRetry(msg.id) : undefined}
            />
          ))}
          {isTyping && (
            <div className="text-center" aria-label="Loading response">
              <LoadingSpinner />
            </div>
          )}
        </div>
        
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !e.shiftKey && sendMessage()}
            className={`flex-1 p-2 border rounded-md ${textSize} ${
              theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
            }`}
            placeholder="Type a message..."
            aria-label="Message input"
            disabled={isTyping}
          />
          <button
            onClick={() => sendMessage()}
            className={`bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors ${
              isTyping ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            disabled={isTyping}
            aria-label="Send message"
          >
            Send
          </button>
        </div>

        <div className="mt-4 flex flex-wrap gap-4">
          <div className="flex items-center space-x-2">
            <label htmlFor="modelSelect" className="text-sm font-medium">Model:</label>
            <select
              id="modelSelect"
              value={model}
              onChange={(e) => setModel(e.target.value)}
              className={`p-2 border rounded-md text-sm ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="gemini-pro">Gemini Pro</option>
              <option value="gemini-pro-vision">Gemini Pro Vision</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="filterCheckbox" className="text-sm font-medium">
              Safety Filters:
            </label>
            <input
              id="filterCheckbox"
              type="checkbox"
              checked={filters}
              onChange={() => setFilters(!filters)}
              className="rounded-md"
            />
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="themeSelect" className="text-sm font-medium">Theme:</label>
            <select
              id="themeSelect"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className={`p-2 border rounded-md text-sm ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="light">Light</option>
              <option value="dark">Dark</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="textSizeSelect" className="text-sm font-medium">Text Size:</label>
            <select
              id="textSizeSelect"
              value={textSize}
              onChange={(e) => setTextSize(e.target.value)}
              className={`p-2 border rounded-md text-sm ${
                theme === "dark" ? "bg-gray-700 text-white" : "bg-white text-black"
              }`}
            >
              <option value="text-sm">Small</option>
              <option value="text-base">Medium</option>
              <option value="text-lg">Large</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <label htmlFor="highContrastCheckbox" className="text-sm font-medium">
              High Contrast:
            </label>
            <input
              id="highContrastCheckbox"
              type="checkbox"
              checked={highContrast}
              onChange={() => setHighContrast(!highContrast)}
              className="rounded-md"
            />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
