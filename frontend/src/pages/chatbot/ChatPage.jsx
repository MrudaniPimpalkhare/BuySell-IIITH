import React, { useState } from 'react';
import axios from 'axios';
import { FaPaperPlane } from 'react-icons/fa';

export default function ChatPage() {
  const [messages, setMessages] = useState([]);
  const [userInput, setUserInput] = useState('');
  
  const backendUrl = 'http://localhost:4000';

  const sendMessage = async () => {
    if (!userInput.trim()) return;

    // Append user message immediately
    const newUserMessage = { role: 'user', text: userInput };
    setMessages(prev => [...prev, newUserMessage]);
    setUserInput('');

    try {
        const response = await axios.post(`${backendUrl}/api/chat`, { userMessage: userInput });
        console.log("Gemini API Response:", response.data);

        const botReply = response.data?.reply || "No response from Gemini.";
        setMessages(prev => [...prev, { role: 'assistant', text: botReply }]);

    } catch (error) {
        console.error("Error sending message:", error);
        alert("Failed to send request to Gemini.");
    }
  };

  return (
    <div className="flex flex-col h-full p-3 bg-gray-100">
      {/* Chat Area */}
      <div className="flex-1 overflow-y-auto space-y-2 px-2">
        {messages.map((m, i) => (
          <div key={i} className={`flex ${m.role === 'assistant' ? 'justify-start' : 'justify-end'}`}>
            <div className={`max-w-[75%] p-2 text-white rounded-lg shadow-md ${m.role === 'assistant' ? 'bg-blue-500' : 'bg-gray-800'}`}>
              {m.text}
            </div>
          </div>
        ))}
      </div>

      {/* Input Field */}
      <div className="mt-3 flex items-center bg-white p-2 rounded-lg shadow">
        <input
          type="text"
          className="flex-grow p-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          value={userInput}
          onChange={(e) => setUserInput(e.target.value)}
          placeholder="Type your message..."
          onKeyDown={(e) => { if (e.key === 'Enter') sendMessage(); }}
        />
        <button
          onClick={sendMessage}
          className="ml-2 p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
        >
          <FaPaperPlane />
        </button>
      </div>
    </div>
  );
}
