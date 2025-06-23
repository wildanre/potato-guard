import React, { useState, useRef, useEffect } from 'react';
import { MessageCircle, Send, X, RotateCcw } from 'lucide-react';
import { ChatMessage, ChatStatus } from '../types';
import { chatbotService } from '../utils/chatbotService';

const Chatbot: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [chatStatus, setChatStatus] = useState<ChatStatus>({
    isLoading: false,
    error: null,
  });
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Function to format message content with markdown-like styling
  const formatMessage = (content: string) => {
    const lines = content.split('\n');
    
    return lines.map((line, lineIndex) => {
      // Handle list items (lines starting with *)
      if (line.trim().startsWith('* ')) {
        const listContent = line.trim().substring(2);
        const formattedContent = formatBoldText(listContent);
        return (
          <div key={lineIndex} className="flex items-start mb-1">
            <span className="text-green-500 mr-2 mt-0.5">•</span>
            <span>{formattedContent}</span>
          </div>
        );
      }
      
      // Handle regular lines with bold formatting
      const formattedContent = formatBoldText(line);
      return (
        <div key={lineIndex} className={lineIndex > 0 ? "mt-1" : ""}>
          {formattedContent}
        </div>
      );
    });
  };

  // Function to handle bold text formatting (**text**)
  const formatBoldText = (text: string) => {
    const parts = text.split(/(\*\*.*?\*\*)/g);
    
    return parts.map((part, index) => {
      if (part.startsWith('**') && part.endsWith('**')) {
        const boldText = part.slice(2, -2);
        return <strong key={index} className="font-semibold">{boldText}</strong>;
      }
      return part;
    });
  };

  // Initialize messages based on service availability
  useEffect(() => {
    if (chatbotService.isServiceAvailable()) {
      setMessages([
        {
          id: '1',
          content: 'Halo! Saya adalah asisten AI untuk deteksi penyakit daun kentang. Bagaimana saya bisa membantu Anda hari ini?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    } else {
      setMessages([
        {
          id: '1',
          content: 'Maaf, layanan chatbot belum dikonfigurasi. Silakan tambahkan API key Gemini di file .env untuk menggunakan fitur ini.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
    }
  }, []);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);
  const handleSendMessage = async () => {
    if (!inputMessage.trim() || chatStatus.isLoading) return;

    // Check if service is available
    if (!chatbotService.isServiceAvailable()) {
      setChatStatus({
        isLoading: false,
        error: 'Layanan chatbot belum dikonfigurasi. Silakan tambahkan API key Gemini.',
      });
      return;
    }

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      content: inputMessage,
      isUser: true,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputMessage('');
    setChatStatus({ isLoading: true, error: null });

    try {
      const response = await chatbotService.sendMessage(inputMessage);
      const botMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        content: response,
        isUser: false,
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, botMessage]);
    } catch (error) {
      setChatStatus({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengirim pesan',
      });
    } finally {
      setChatStatus({ isLoading: false, error: null });
    }
  };
  const handleResetChat = async () => {
    if (!chatbotService.isServiceAvailable()) {
      setMessages([
        {
          id: '1',
          content: 'Maaf, layanan chatbot belum dikonfigurasi. Silakan tambahkan API key Gemini di file .env untuk menggunakan fitur ini.',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setChatStatus({ isLoading: false, error: null });
      return;
    }

    try {
      await chatbotService.resetChat();
      setMessages([
        {
          id: '1',
          content: 'Percakapan telah direset. Bagaimana saya bisa membantu Anda?',
          isUser: false,
          timestamp: new Date(),
        },
      ]);
      setChatStatus({ isLoading: false, error: null });
    } catch (error) {
      setChatStatus({
        isLoading: false,
        error: error instanceof Error ? error.message : 'Gagal mereset percakapan',
      });
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };  return (
    <>
      {/* Floating Chat Button */}
      <div className="fixed bottom-20 right-4 sm:bottom-20 sm:right-4 md:bottom-20 md:right-6 lg:bottom-20 lg:right-12 z-30">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="bg-green-600 hover:bg-green-700 text-white rounded-full p-3 shadow-lg transition-all duration-300 hover:scale-110 dark:bg-green-700 dark:hover:bg-green-800"
          aria-label="Toggle chatbot"
        >
          {isOpen ? <X className="h-6 w-6" /> : <MessageCircle className="h-6 w-6" />}
        </button>
      </div>

      {/* Chat Window */}
      {isOpen && (
        <div className="fixed bottom-20 left-4 right-4 sm:bottom-32 sm:left-auto sm:right-6 md:bottom-32 md:right-8 lg:bottom-32 lg:right-6 sm:w-80 md:w-96 lg:w-80 h-[600px] sm:h-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 flex flex-col z-30">
          {/* Header */}
          <div className="bg-green-600 dark:bg-green-700 text-white p-4 rounded-t-lg flex justify-between items-center">
            <h3 className="font-semibold">Asisten Kentang</h3>
            <div className="flex items-center space-x-2">
              <button
                onClick={handleResetChat}
                className="text-green-100 hover:text-white transition-colors p-1"
                aria-label="Reset chat"
              >
                <RotateCcw size={16} />
              </button>
              <button
                onClick={() => setIsOpen(false)}
                className="text-white bg-red-500 hover:bg-red-600 dark:bg-red-600 dark:hover:bg-red-700 p-2 rounded-full shadow-md transition-colors"
                aria-label="Close chat"
              >
                <X size={20} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-xs p-3 rounded-lg ${
                    message.isUser
                      ? 'bg-green-600 text-white'
                      : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <div className="text-sm">
                    {formatMessage(message.content)}
                  </div>
                  <p className="text-xs opacity-70 mt-1">
                    {message.timestamp.toLocaleTimeString([], { 
                      hour: '2-digit', 
                      minute: '2-digit' 
                    })}
                  </p>
                </div>
              </div>
            ))}
            
            {chatStatus.isLoading && (
              <div className="flex justify-start">
                <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-lg">
                  <div className="flex space-x-2">
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                    <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                  </div>
                </div>
              </div>
            )}
            
            {chatStatus.error && (
              <div className="bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 p-3 rounded-lg text-sm">
                {chatStatus.error}
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex space-x-2">
              <input
                type="text"
                value={inputMessage}
                onChange={(e) => setInputMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Ketik pesan Anda..."
                className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 dark:bg-gray-700 dark:text-white text-sm"
                disabled={chatStatus.isLoading}
              />
              <button
                onClick={handleSendMessage}
                disabled={!inputMessage.trim() || chatStatus.isLoading}
                className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white p-2 rounded-lg transition-colors"
              >
                <Send size={16} />
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Chatbot;
