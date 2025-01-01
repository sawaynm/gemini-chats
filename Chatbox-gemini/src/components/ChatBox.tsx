import React from 'react';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage as ChatMessageType, ChatStorage, Conversation } from "../utils/storage";
import { fetchGeminiResponse, GeminiConfig } from "../utils/api";
import { ErrorBoundary } from "./ErrorBoundary";
import ChatMessageComponent from "./ChatMessage";
import LoadingSpinner from "./LoadingSpinner";
import ReactMarkdown from 'react-markdown';
import gfm from 'remark-gfm';
import emoji from 'emoji-dictionary';

interface ChatMessageProps {
  key: string;
  message: string;
  role: 'user' | 'assistant';
}

export default function ChatBox() {
  const [conversation, setConversation] = useState<Conversation>({
    id: uuidv4(),
    messages: [],
    lastUpdated: Date.now()
  });
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [filters, setFilters] = useState(false);
  const [model, setModel] = useState("gemini-pro");
  const [theme, setTheme] = useState("light");
  const [textSize, setTextSize] = useState("text-base");
  const [highContrast, setHighContrast] = useState(false);
  const [attachment, setAttachment] = useState<File | null>(null);

  useEffect(() => {
    const conversations = ChatStorage.getConversations();
    if (conversations.length > 0) {
      setConversation(conversations[conversations.length - 1]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim() && !attachment) return;

    const newMessage: ChatMessageType = {
      id: uuidv4(),
      role: 'user',
      message: input,
      timestamp: Date.now()
    };

    const updatedConversation = {
      ...conversation,
      messages: [...conversation.messages, newMessage],
      lastUpdated: Date.now()
    };

    setConversation(updatedConversation);
    ChatStorage.saveConversation(updatedConversation);
    setInput("");
    setIsTyping(true);

    try {
      const config: GeminiConfig = {
        model,
        filters,
        temperature: 0.7
      };

      const response = await fetchGeminiResponse(input, config, attachment);

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
      setConversation({
        ...updatedConversation,
        messages: [...updatedConversation.messages, {
          id: uuidv4(),
          role: 'assistant',
          message: "Sorry, there was an error processing your request.",
          timestamp: Date.now()
        }],
        lastUpdated: Date.now()
      });
    } finally {
      setIsTyping(false);
      setAttachment(null);
    }
  };

  const renderMessage = (message: string) => {
    return (
      <ReactMarkdown
        plugins={[gfm]}
        children={message}
        transformImageUri={(uri) => uri.startsWith('http') ? uri : `${process.env.PUBLIC_URL}/${uri}`}
        renderers={{
          text: ({ value }) => value.replace(/:\w+:/gi, (name) => emoji.getUnicode(name) || name),
        }}
      />
    );
  };

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTheme(e.target.value);
  };

  const handleTextSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setTextSize(e.target.value);
  };

  const handleHighContrastChange = () => {
    setHighContrast(!highContrast);
  };

  return (
    <div className={`max-w-lg mx-auto p-6 rounded-lg shadow-md ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"} ${highContrast ? "high-contrast" : ""}`}>
      <div className="mb-4 max-h-[60vh] overflow-y-auto">
        {conversation.messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={renderMessage(msg.message)} role={msg.role} />
        ))}
        {isTyping && <div className="text-center"><LoadingSpinner /></div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className={`flex-1 p-2 border rounded-md ${textSize}`}
          placeholder="Type a message..."
        />
        <input
          type="file"
          onChange={(e) => setAttachment(e.target.files ? e.target.files[0] : null)}
          className="p-2 border rounded-md"
        />
        <button
          onClick={sendMessage}
          className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-md transition-colors"
        >
          Send
        </button>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="modelSelect" className="text-sm font-medium">Model:</label>
          <select
            id="modelSelect"
            value={model}
            onChange={(e) => setModel(e.target.value)}
            className="p-2 border rounded-md text-sm"
          >
            <option value="gemini-pro">Gemini Pro</option>
            <option value="gemini-pro-vision">Gemini Pro Vision</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="filterCheckbox" className="text-sm font-medium">Safety Filters:</label>
          <input
            id="filterCheckbox"
            type="checkbox"
            checked={filters}
            onChange={() => setFilters(!filters)}
            className="rounded-md"
          />
        </div>
      </div>
      <div className="mt-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <label htmlFor="themeSelect" className="text-sm font-medium">Theme:</label>
          <select
            id="themeSelect"
            value={theme}
            onChange={handleThemeChange}
            className="p-2 border rounded-md text-sm"
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
            onChange={handleTextSizeChange}
            className="p-2 border rounded-md text-sm"
          >
            <option value="text-sm">Small</option>
            <option value="text-base">Medium</option>
            <option value="text-lg">Large</option>
          </select>
        </div>
        <div className="flex items-center space-x-2">
          <label htmlFor="highContrastCheckbox" className="text-sm font-medium">High Contrast:</label>
          <input
            id="highContrastCheckbox"
            type="checkbox"
            checked={highContrast}
            onChange={handleHighContrastChange}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
