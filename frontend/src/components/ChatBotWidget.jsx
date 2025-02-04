import React, { useState } from "react";
import ChatPage from "../pages/chatbot/ChatPage";
import { FaComments, FaTimes } from "react-icons/fa";

export default function ChatbotWidget() {
    const [open, setOpen] = useState(false);

    return (
        <>
            {/* Chat Widget */}
            {open && (
                <div className="fixed bottom-20 right-4 w-80 h-96 bg-white shadow-lg rounded-xl overflow-hidden z-50 border border-gray-300 flex flex-col">
                    {/* Header with Close Button */}
                    <div className="flex items-center justify-between bg-blue-600 text-white px-4 py-2">
                        <h3 className="text-lg font-semibold">Chat Support</h3>
                        <button 
                            onClick={() => setOpen(false)} 
                            className="p-2 rounded-full hover:bg-blue-700 transition"
                        >
                            <FaTimes size={18} />
                        </button>
                    </div>

                    {/* Chat Content */}
                    <div className="flex-1 overflow-y-auto">
                        <ChatPage />
                    </div>
                </div>
            )}

            {/* Floating Chat Button */}
            <button
                onClick={() => setOpen(!open)}
                className="fixed bottom-4 right-4 p-4 bg-blue-500 text-white rounded-full shadow-lg z-50 hover:bg-blue-600 transition transform hover:scale-110 animate-bounce"
            >
                <FaComments size={30} />
            </button>
        </>
    );
}
