import React, { useState, useEffect, useRef } from 'react';
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { GoogleGenerativeAI } from '@google/generative-ai';

export default function Home() {
  const { user } = useContext(AuthContext);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const genAI = new GoogleGenerativeAI(import.meta.env.VITE_API_KEY);
  const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash"});

  // Function to scroll to the bottom of messages
  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Start a new chat session
  const startNewSession = () => {
    setMessages([
      {
        role: 'assistant', 
        content: 'Hello! I am your support assistant for the Buy/Sell @IIIT platform. How can I help you today?'
      }
    ]);
  };

  // Toggle chat open/close
  const toggleChat = () => {
    setIsChatOpen(!isChatOpen);
    if (!isChatOpen) {
      startNewSession();
    }
  };

  // Handle sending messages
  const handleSendMessage = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const userMessage = { role: 'user', content: inputMessage };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);
    setInputMessage('');
    setIsLoading(true);

    try {
      // Generate context from previous messages
      const chatHistory = updatedMessages
        .slice(0, -1)
        .map(msg => `${msg.role}: ${msg.content}`)
        .join('\n');

      // Send message to Gemini
      const result = await model.generateContent(
        `Context of previous conversation:\n${chatHistory}\n\nLatest user query: ${inputMessage}\n\nRespond as a helpful e-commerce support assistant.`
      );
      
      const response = await result.response.text();
      
      // Add AI response to messages
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: response }
      ]);
    } catch (error) {
      console.error('Error generating response:', error);
      setMessages(prev => [
        ...prev, 
        { role: 'assistant', content: 'Sorry, I encountered an error. Could you please try again?' }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 relative">
      <h1 className="text-4xl font-bold text-blue-600">Welcome to the Buy/Sell @IIIT</h1>
      <p className="mt-2 text-lg text-gray-700">
        Take a look while you are here!
      </p>

      <div className="mt-6 space-x-4">
        {user ? (
          <>
            <Link to="/dashboard" className="bg-blue-500 text-white px-4 py-2 rounded shadow">
              Go to Dashboard
            </Link>
          </>
        ) : (
          <>
            <Link to="/login" className="bg-green-500 text-white px-4 py-2 rounded shadow">
              Login
            </Link>
            <Link to="/register" className="bg-blue-500 text-white px-4 py-2 rounded shadow">
              Register
            </Link>
          </>
        )}
      </div>

      {/* Support Chat Widget */}
      <div className="fixed bottom-4 right-4 z-50">
        {/* Chat Popup */}
        {isChatOpen && (
          <div className="w-96 h-[500px] bg-white shadow-xl rounded-lg flex flex-col">
            {/* Chat Header */}
            <div className="bg-blue-600 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Support Chat</h2>
              <button 
                onClick={toggleChat} 
                className="text-white hover:bg-blue-700 rounded-full p-1"
              >
                ✕
              </button>
            </div>

            {/* Messages Container */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {messages.map((msg, index) => (
                <div 
                  key={index} 
                  className={`flex ${
                    msg.role === 'user' ? 'justify-end' : 'justify-start'
                  }`}
                >
                  <div 
                    className={`max-w-[70%] p-3 rounded-lg ${
                      msg.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-gray-200 text-black'
                    }`}
                  >
                    {msg.content}
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start">
                  <div className="bg-gray-200 p-3 rounded-lg animate-pulse">
                    Typing...
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Message Input */}
            <div className="bg-white p-4 border-t flex items-center">
              <input 
                type="text" 
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Type your message..."
                className="flex-1 p-2 border rounded-lg mr-2"
              />
              <button 
                onClick={handleSendMessage}
                disabled={isLoading}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Send
              </button>
            </div>
          </div>
        )}

        {/* Chat Launcher Button */}
        <button 
          onClick={toggleChat}
          className="bg-blue-600 text-white p-4 rounded-full shadow-xl hover:bg-blue-700 transition-all"
        >
          {isChatOpen ? 'Close Chat' : 'Support Chat'}
        </button>
      </div>
    </div>
  );
}