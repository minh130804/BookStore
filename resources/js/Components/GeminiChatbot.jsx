import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { TypeAnimation } from 'react-type-animation';

const GeminiChatbot = () => {
    // --- STATE MANAGEMENT ---
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        { sender: 'ai', text: 'Dạ, Shop chào bạn! Mình là Trợ lý AI của BookStore. Mình có thể giúp bạn tìm loại sách gì hôm nay ạ? 😊' }
    ]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    
    const messagesEndRef = useRef(null);

    // Link ảnh Avatar của nhân viên tư vấn
    const avatarUrl = "https://cdn-icons-png.flaticon.com/512/4140/4140037.png";

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [messages, isLoading]);

    // --- HÀM XỬ LÝ GỬI TIN NHẮN ---
    const handleSendMessage = async (e) => {
        e.preventDefault();
        
        const trimmedMessage = inputMessage.trim();
        if (!trimmedMessage || isLoading) return; 

        // 1. Thêm tin nhắn USER
        const newUserMessage = { sender: 'user', text: trimmedMessage };
        setMessages(prev => [...prev, newUserMessage]);
        
        // 2. Dọn sạch ô nhập và hiện Loading
        setInputMessage('');
        setIsLoading(true);

        try {
            // 3. GỌI API BACKEND
            const response = await axios.get('/ai/chat', {
                params: { message: trimmedMessage }
            });

            // 4. Thêm tin nhắn AI
            const aiReplyMessage = { sender: 'ai', text: response.data.reply };
            setMessages(prev => [...prev, aiReplyMessage]);

        } catch (error) {
            console.error("AI Chat Error:", error);
            const errorMessage = { sender: 'ai', text: 'Dạ rất tiếc, kết nối của Shop đang bị gián đoạn. Bạn thử lại sau vài giây nhé! 😥' };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50 font-sans">
            {/* --- NÚT BẬT/TẮT CHAT CÓ HÌNH AVATAR --- */}
            <button 
                onClick={() => setIsOpen(!isOpen)}
                className={`relative rounded-full shadow-2xl transition-transform hover:scale-110 duration-300 ${isOpen ? 'scale-90' : ''}`}
            >
                {isOpen ? (
                    <div className="w-14 h-14 bg-red-500 rounded-full flex items-center justify-center text-white shadow-lg rotate-90 transition-transform">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </div>
                ) : (
                    <div className="relative">
                        <img src={avatarUrl} alt="Chat" className="w-16 h-16 rounded-full border-2 border-white shadow-xl bg-blue-50 object-cover" />
                        <span className="absolute bottom-1 right-0 w-4 h-4 bg-green-500 border-2 border-white rounded-full"></span>
                    </div>
                )}
            </button>

            {/* --- KHUNG CHAT AI --- */}
            {isOpen && (
                <div className="absolute bottom-20 right-0 w-[360px] h-[550px] bg-[#F9FAFB] rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200 transition-all duration-300 animate-slide-in">
                    
                    {/* 1. Header Khung Chat */}
                    <div className="p-4 bg-gradient-to-r from-blue-600 to-blue-500 text-white flex items-center justify-between shadow-md z-10">
                        <div className="flex items-center gap-3">
                            <div className="relative">
                                <img src={avatarUrl} alt="Avatar" className="w-11 h-11 rounded-full bg-white border border-white/50 shadow-sm" />
                                <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-400 border-2 border-blue-600 rounded-full"></span>
                            </div>
                            <div>
                                <h3 className="font-bold text-[16px] leading-tight">Trợ lý BookStore</h3>
                                <p className="text-[12px] text-blue-100 flex items-center gap-1">
                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full inline-block"></span> Đang trực tuyến
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* 2. Nội dung Tin nhắn */}
                    <div className="flex-1 p-4 space-y-5 overflow-y-auto bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] custom-scrollbar">
                        {messages.map((msg, index) => (
                            <div key={index} className={`flex gap-2 items-end ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                                
                                {/* Avatar cho AI */}
                                {msg.sender === 'ai' && (
                                    <img src={avatarUrl} alt="AI" className="w-8 h-8 rounded-full shadow-sm mb-1 bg-white border border-gray-100" />
                                )}

                                {/* Bong bóng Chat */}
                                <div className={`max-w-[75%] p-3.5 shadow-sm text-[14.5px] leading-relaxed relative ${
                                    msg.sender === 'user' 
                                        ? 'bg-blue-600 text-white rounded-2xl rounded-br-sm' 
                                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-sm border border-gray-100'
                                }`}>
                                    {msg.sender === 'ai' && index === messages.length - 1 && index !== 0 && !isLoading ? (
                                        <TypeAnimation
                                            sequence={[msg.text]}
                                            speed={85}
                                            cursor={false}
                                            wrapper="span"
                                        />
                                    ) : (
                                        <span>{msg.text}</span>
                                    )}
                                </div>
                            </div>
                        ))}
                        
                        {/* 3. Hiệu ứng "Shop đang gõ..." */}
                        {isLoading && (
                            <div className="flex items-end gap-2 mb-2">
                                <img src={avatarUrl} alt="AI" className="w-8 h-8 rounded-full shadow-sm mb-1 bg-white border border-gray-100" />
                                <div className="px-4 py-3 bg-white rounded-2xl rounded-bl-sm border border-gray-100 shadow-sm flex items-center gap-2">
                                    <div className="flex gap-1.5 items-center h-4">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} className="h-1" />
                    </div>

                    {/* 4. Ô Nhập Form */}
                    <form onSubmit={handleSendMessage} className="p-3 bg-white border-t border-gray-100 flex items-center gap-2 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)]">
                        <input 
                            type="text" 
                            value={inputMessage}
                            onChange={(e) => setInputMessage(e.target.value)}
                            placeholder="Nhắn tin cho shop..."
                            className="flex-1 px-4 py-2.5 bg-gray-100 border-transparent rounded-full focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none text-[14.5px] transition-all"
                            disabled={isLoading}
                        />
                        <button 
                            type="submit" 
                            className={`p-2.5 rounded-full flex items-center justify-center transition-all ${
                                inputMessage.trim() && !isLoading 
                                ? 'bg-blue-600 text-white hover:bg-blue-700 shadow-md transform hover:scale-105' 
                                : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            }`}
                            disabled={!inputMessage.trim() || isLoading}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 rotate-90" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                            </svg>
                        </button>
                    </form>
                </div>
            )}
            
            {/* CSS Animation */}
            <style dangerouslySetInnerHTML={{__html: `
                @keyframes slide-in {
                    0% { opacity: 0; transform: translateY(20px) scale(0.95); }
                    100% { opacity: 1; transform: translateY(0) scale(1); }
                }
                .animate-slide-in {
                    animation: slide-in 0.25s cubic-bezier(0.16, 1, 0.3, 1) forwards;
                }
                .custom-scrollbar::-webkit-scrollbar {
                    width: 5px;
                }
                .custom-scrollbar::-webkit-scrollbar-thumb {
                    background-color: #CBD5E1;
                    border-radius: 10px;
                }
            `}} />
        </div>
    );
};

export default GeminiChatbot;