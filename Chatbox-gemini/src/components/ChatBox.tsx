import React from 'react';
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";
import { ChatMessage as ChatMessageType, ChatStorage, Conversation } from "../utils/storage";
import { fetchGeminiResponse, GeminiConfig } from "../utils/api";
import { ErrorBoundary } from "./ErrorBoundary";
import ChatMessageComponent from "./ChatMessage";
import LoadingSpinner from "./LoadingSpinner";

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
  const [filters, setFilters] = useState(true);
  const [model, setModel] = useState("gemini-pro");

  useEffect(() => {
    const conversations = ChatStorage.getConversations();
    if (conversations.length > 0) {
      setConversation(conversations[conversations.length - 1]);
    }
  }, []);

  const sendMessage = async () => {
    if (!input.trim()) return;

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

      const response = await fetchGeminiResponse(input, config);

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
    }
  };

  return (
    <div className="max-w-lg mx-auto bg-white p-6 rounded-lg shadow-md">
      <div className="mb-4 max-h-[60vh] overflow-y-auto">
        {conversation.messages.map((msg) => (
          <ChatMessageComponent key={msg.id} message={msg.message} role={msg.role} />
        ))}
        {isTyping && <div className="text-center"><LoadingSpinner /></div>}
      </div>
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
          className="flex-1 p-2 border rounded-md"
          placeholder="Type a message..."
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
          <label htmlFor="modelSelect" className="text-sm font-medium text-gray-700">Model:</label>
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
          <label htmlFor="filterCheckbox" className="text-sm font-medium text-gray-700">Safety Filters:</label>
          <input
            id="filterCheckbox"
            type="checkbox"
            checked={filters}
            onChange={() => setFilters(!filters)}
            className="rounded-md"
          />
        </div>
      </div>
    </div>
  );
}
