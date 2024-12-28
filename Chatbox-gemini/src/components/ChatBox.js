import React, { useState, useEffect } from 'react';
import { sendMessageToGemini } from '../utils/api';
import { useSession } from 'next-auth/react';

const ChatBox = () => {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const { data: session } = useSession();

  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const response = await fetch('/api/messages');
        if (response.ok) {
          const data = await response.json();
          setMessages(data);
        } else {
          console.error('Failed to fetch messages');
        }
      } catch (error) {
        console.error('Error fetching messages:', error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendMessage = async () => {
    if (!session) {
      alert('Please sign in to send a message.');
      return;
    }

    if (message.trim()) {
      try {
        // Send message to Gemini
        const geminiResponse = await sendMessageToGemini(message);
        setMessages([...messages, { role: 'user', content: message }, geminiResponse]);
        setMessage('');

        // Persist message to backend
        const response = await fetch('/api/messages', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ message }),
        });

        if (!response.ok) {
          console.error('Failed to save message');
        }
      } catch (error) {
        console.error('Error:', error);
        // Handle error, e.g., display an error message to the user
      }
    }
  };

  if (!session) {
    return (
      <div className="p-4">
        Please sign in to use the chat.
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-grow overflow-y-auto p-4">
        {messages.map((msg, index) => (
          <div key={index}>
            {msg.role ? (
              <div>
                <strong>{msg.role}:</strong> {msg.content}
              </div>
            ) : (
              <div>{msg}</div>
            )}
          </div>
        ))}
      </div>
      <div className="p-4 flex">
        <input
          type="text"
          className="flex-grow rounded-l-md border-gray-300 border p-2"
          placeholder="Enter your message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
        />
        <button
          className="bg-blue-500 text-white rounded-r-md px-4 py-2"
          onClick={handleSendMessage}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default ChatBox;
