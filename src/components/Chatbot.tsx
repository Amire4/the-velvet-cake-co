import React, { useState, useEffect, useRef } from 'react';
import { MessageSquare, X, Send, Sparkles, Trash2, Bot, User, Minimize2 } from 'lucide-react';
import { sendChatMessageApi } from '../services/chatService.ts';
import { ChatMessage } from '../types.ts';

const SUGGESTED_QUESTIONS = [
  'What cake flavors do you offer?',
  'Do you offer vegan cakes?',
  'Can I get same-day delivery?',
  'How much is delivery?',
  'How do I order a custom cake?',
  'Do you make wedding cakes?',
  'What are your opening hours?',
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ASSISTANT',
      message: 'Hi! Welcome to The Velvet Cake Co. How can I help you today?',
      createdAt: new Date().toISOString()
    }
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [sessionId] = useState(() => `sess-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [messages, isOpen, loading]);

  const handleSendMessage = async (textToSend?: string) => {
    const messageText = textToSend || input.trim();
    if (!messageText || loading) return;

    const userMsg: ChatMessage = {
      role: 'USER',
      message: messageText,
      createdAt: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessageApi(messageText, sessionId);
      if (response && response.message) {
        setMessages(prev => [...prev, response.message]);
      }
    } catch (err) {
      console.error('Chatbot error:', err);
      setMessages(prev => [
        ...prev,
        {
          role: 'ASSISTANT',
          message: 'I apologize for the delay. We are available at 245 Lexington Ave, Manhattan, or you can call us directly at +1 (212) 555-0187 between 8:00 AM - 9:00 PM.',
          createdAt: new Date().toISOString()
        }
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const clearChat = () => {
    setMessages([
      {
        role: 'ASSISTANT',
        message: 'Hi! Welcome to The Velvet Cake Co. How can I help you today?',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Launcher Button */}
      {!isOpen && (
        <button
          id="chatbot-launcher-btn"
          onClick={() => setIsOpen(true)}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#7D0A0A] text-white shadow-xl hover:bg-[#5E0707] transition-all transform hover:scale-105 focus:outline-none"
          aria-label="Open AI Customer Concierge"
        >
          <MessageSquare className="w-6 h-6 text-[#FDFCF0]" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8860B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B8860B] text-[9px] font-bold text-[#FDFCF0] items-center justify-center">
              AI
            </span>
          </span>
          <span className="absolute right-16 bg-[#2D2926] text-[#FDFCF0] text-xs font-medium py-1.5 px-3 rounded-lg shadow-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#E8E1D5]/20">
            Ask The Velvet Cake Co. Concierge
          </span>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div className="w-[92vw] sm:w-[380px] md:w-[420px] h-[580px] max-h-[85vh] bg-[#FDFCF0] rounded-2xl shadow-2xl border border-[#E8E1D5] flex flex-col overflow-hidden animate-in fade-in slide-in-from-bottom-5 duration-200">
          
          {/* Header */}
          <div className="bg-[#7D0A0A] text-[#FDFCF0] p-4 flex items-center justify-between shadow-sm">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-full bg-[#5E0707] border border-[#B8860B]/50 flex items-center justify-center">
                <Sparkles className="w-4 h-4 text-[#B8860B]" />
              </div>
              <div>
                <h3 className="font-serif text-sm font-bold tracking-wide text-white">
                  The Velvet Cake Co. Assistant
                </h3>
                <p className="text-[11px] text-[#E8E1D5]/80 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  Online • Manhattan Bakery Concierge
                </p>
              </div>
            </div>

            <div className="flex items-center gap-1">
              <button
                id="chatbot-clear-btn"
                onClick={clearChat}
                title="Clear conversation"
                className="p-1.5 text-[#E8E1D5]/70 hover:text-white hover:bg-[#5E0707] rounded transition-colors"
              >
                <Trash2 className="w-4 h-4" />
              </button>
              <button
                id="chatbot-close-btn"
                onClick={() => setIsOpen(false)}
                className="p-1.5 text-[#E8E1D5]/70 hover:text-white hover:bg-[#5E0707] rounded transition-colors"
                aria-label="Close chat"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Messages Body */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]">
            {messages.map((msg, index) => (
              <div
                key={index}
                className={`flex gap-2.5 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
              >
                {msg.role === 'ASSISTANT' && (
                  <div className="w-7 h-7 rounded-full bg-[#7D0A0A] text-[#B8860B] flex items-center justify-center shrink-0 text-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                )}
                <div
                  className={`max-w-[82%] px-3.5 py-2.5 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                    msg.role === 'USER'
                      ? 'bg-[#7D0A0A] text-white rounded-tr-none'
                      : 'bg-white text-[#2D2926] border border-[#E8E1D5] rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.message}</p>
                </div>
                {msg.role === 'USER' && (
                  <div className="w-7 h-7 rounded-full bg-[#E8E1D5] text-[#7D0A0A] flex items-center justify-center shrink-0 text-xs">
                    <User className="w-4 h-4" />
                  </div>
                )}
              </div>
            ))}

            {loading && (
              <div className="flex gap-2.5 justify-start">
                <div className="w-7 h-7 rounded-full bg-[#7D0A0A] text-[#B8860B] flex items-center justify-center shrink-0 text-xs">
                  <Bot className="w-4 h-4" />
                </div>
                <div className="bg-white text-[#2D2926] border border-[#E8E1D5] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5">
                  <div className="w-1.5 h-1.5 bg-[#7D0A0A] rounded-full animate-bounce"></div>
                  <div className="w-1.5 h-1.5 bg-[#7D0A0A] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                  <div className="w-1.5 h-1.5 bg-[#7D0A0A] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick Questions Chips */}
          <div className="px-3 py-2 bg-[#FDFCF0] border-t border-[#E8E1D5] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
            {SUGGESTED_QUESTIONS.map((q, idx) => (
              <button
                key={idx}
                id={`chatbot-quick-${idx}`}
                onClick={() => handleSendMessage(q)}
                className="inline-block px-2.5 py-1 text-[11px] rounded-full bg-[#F5EFE6] text-[#7D0A0A] hover:bg-[#E8E1D5] font-medium transition-colors shrink-0"
              >
                {q}
              </button>
            ))}
          </div>

          {/* Input Area */}
          <div className="p-3 bg-white border-t border-[#E8E1D5]">
            <div className="flex items-center gap-2">
              <input
                id="chatbot-input-field"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Ask about flavors, delivery, or custom cakes..."
                className="flex-1 bg-[#FDFCF0] text-[#2D2926] placeholder-[#8E877D] text-xs sm:text-sm px-3.5 py-2.5 rounded-full border border-[#E8E1D5] focus:outline-none focus:border-[#7D0A0A] transition-colors"
              />
              <button
                id="chatbot-send-btn"
                onClick={() => handleSendMessage()}
                disabled={!input.trim() || loading}
                className="p-2.5 bg-[#7D0A0A] text-white rounded-full hover:bg-[#5E0707] disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                aria-label="Send message"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
            <p className="text-[10px] text-center text-[#8E877D] mt-1.5">
              Powered by Gemini AI • Manhattan Bakery Concierge
            </p>
          </div>

        </div>
      )}
    </div>
  );
}
