import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { v4 as uuidv4 } from 'uuid';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatPage() {
  const [sessionId, setSessionId] = useState('');
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  
  // use environment variable for backend URL if available
  const backendUrl = 'http://localhost:4000';

  useEffect(() => {
    setSessionId(uuidv4()); // Generate unique session ID
  }, []);

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Append user message immediately
    console.log("User:", userInput);
    setMessages(prev => [...prev, { role: 'user', message: userInput }]);

    try {
      const res = await axios.post(
        `${backendUrl}/api/chat`,
        { sessionId, userMessage: userInput },
        { withCredentials: true }
      );

      console.log("API Response:", res.data.conversation);

      // New: extract reply from candidates if available
      if (res.data.candidates && res.data.candidates.length > 0) {
        const replyText =
          res.data.candidates[0].content.parts &&
          res.data.candidates[0].content.parts[0].text;
        setMessages(prev => [...prev, { role: 'assistant', message: replyText }]);
      }
      // Fallback: if conversation array exists or reply property exists
      else if (res.data.conversation) {
        console.log("Conversation:", res.data.conversation);
        setMessages(res.data.conversation);
      } else if (res.data.reply) {
        setMessages(prev => [...prev, { role: 'assistant', message: res.data.reply }]);
      }
      setUserInput('');
    } catch (error) {
      console.error('Error sending message:', error);
      alert('Failed to send request to Gemini.');
    }
  };

  return (
    <div className="flex flex-col h-screen p-6 bg-gray-100">
      <h1 className="text-xl font-semibold text-center mb-4">Chat with Gemini</h1>

      <div className="border p-2 h-64 overflow-y-auto">
        {messages.map((m, i) => (
          <div key={i} className={`p-2 ${m.role === 'assistant' ? 'text-blue-500' : 'text-gray-800'}`}>
            <strong>{m.role === 'assistant' ? 'Gemini' : 'You'}:</strong> {m.text}
          </div>
        ))}
      </div>

      <div className="mt-4 flex">
        <input
          type="text"
          className="flex-grow border p-2 rounded-lg shadow-sm focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Ask something..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 px-4 py-2 bg-blue-500 text-white rounded-lg flex items-center hover:bg-blue-600"
        >
          <FaPaperPlane className="mr-1" /> Send
        </button>
      </div>
    </div>
  );
}
