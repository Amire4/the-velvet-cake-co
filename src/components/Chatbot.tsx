import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { MessageSquare, X, Send, Sparkles, Trash2, Bot, User, HelpCircle, CheckCircle2 } from 'lucide-react';
import { sendChatMessageApi } from '../services/chatService.ts';
import { getSmartBakeryResponse } from '../services/smartChatEngine.ts';
import { ChatMessage } from '../types.ts';

const CATEGORIZED_SUGGESTIONS = [
  { label: '🍰 32 Flavors', query: 'What cake flavors do you offer?' },
  { label: '💰 Cake Prices & Menu', query: 'What are the prices of your signature cakes?' },
  { label: '🚚 Same-Day Delivery', query: 'Do you offer same-day delivery in Manhattan & NYC?' },
  { label: '🎂 Custom Cake Studio', query: 'How do I order a custom multi-tier cake?' },
  { label: '🌿 Vegan & Eggless', query: 'Do you offer vegan and eggless cakes?' },
  { label: '📍 Store Location & Hours', query: 'Where is your bakery located and what are your hours?' },
  { label: '📦 Track My Order', query: 'How do I track my order and email receipt?' },
  { label: 'Urdu: Cake ka rate kya hai?', query: 'Cake price kya hai aur order kaise hoga?' }
];

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: 'ASSISTANT',
      message: 'Hello! I am your AI Concierge for The Velvet Cake Co. at 245 Lexington Ave, Manhattan.\n\nAsk me anything about our 32 signature flavors, custom tiered wedding cakes, same-day NYC delivery, or eggless & vegan options!',
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

    const currentHistory = [...messages, userMsg];
    setMessages(currentHistory);
    if (!textToSend) setInput('');
    setLoading(true);

    try {
      const response = await sendChatMessageApi(messageText, sessionId, currentHistory);
      if (response && response.message) {
        setMessages(prev => [...prev, response.message]);
      } else {
        throw new Error('Empty response');
      }
    } catch (err) {
      console.warn('Chatbot API communication fallback:', err);
      const smartReply = getSmartBakeryResponse(messageText, currentHistory);
      setMessages(prev => [
        ...prev,
        {
          role: 'ASSISTANT',
          message: smartReply,
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
        message: 'Hello! I am your AI Concierge for The Velvet Cake Co. at 245 Lexington Ave, Manhattan.\n\nAsk me anything about our 32 signature flavors, custom tiered wedding cakes, same-day NYC delivery, or eggless & vegan options!',
        createdAt: new Date().toISOString()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      {/* Launcher Button */}
      {!isOpen && (
        <motion.button
          id="chatbot-launcher-btn"
          onClick={() => setIsOpen(true)}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-[#7D0A0A] text-white shadow-2xl hover:bg-[#5E0707] transition-colors focus:outline-none ring-4 ring-[#B8860B]/20"
          aria-label="Open AI Customer Concierge"
        >
          <MessageSquare className="w-6 h-6 text-[#FDFCF0]" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B8860B] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-4 w-4 bg-[#B8860B] text-[9px] font-bold text-[#FDFCF0] items-center justify-center">
              AI
            </span>
          </span>
          <span className="absolute right-16 bg-[#2D2926] text-[#FDFCF0] text-xs font-medium py-1.5 px-3 rounded-lg shadow-xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none border border-[#E8E1D5]/20">
            Ask The Velvet Cake Co. Concierge
          </span>
        </motion.button>
      )}

      {/* Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 25, scale: 0.92 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.94 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="w-[92vw] sm:w-[400px] md:w-[440px] h-[600px] max-h-[85vh] bg-[#FDFCF0] rounded-3xl shadow-2xl border border-[#E8E1D5] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="bg-[#7D0A0A] text-[#FDFCF0] p-4 flex items-center justify-between shadow-md">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#5E0707] border border-[#B8860B]/60 flex items-center justify-center shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#B8860B]" />
                </div>
                <div>
                  <h3 className="font-serif text-sm font-bold tracking-wide text-white flex items-center gap-1.5">
                    Velvet AI Concierge
                  </h3>
                  <p className="text-[11px] text-[#E8E1D5]/90 flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    Online • Gemini Powered Concierge
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  id="chatbot-clear-btn"
                  onClick={clearChat}
                  title="Clear conversation"
                  className="p-1.5 text-[#E8E1D5]/70 hover:text-white hover:bg-[#5E0707] rounded-lg transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
                <button
                  id="chatbot-close-btn"
                  onClick={() => setIsOpen(false)}
                  className="p-1.5 text-[#E8E1D5]/70 hover:text-white hover:bg-[#5E0707] rounded-lg transition-colors"
                  aria-label="Close chat"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages Body */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 bg-[#FAF8F5]">
              {messages.map((msg, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.25 }}
                  className={`flex gap-2.5 ${msg.role === 'USER' ? 'justify-end' : 'justify-start'}`}
                >
                  {msg.role === 'ASSISTANT' && (
                    <div className="w-7 h-7 rounded-full bg-[#7D0A0A] text-[#B8860B] flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                      <Bot className="w-4 h-4" />
                    </div>
                  )}
                  <div
                    className={`max-w-[84%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-xs ${
                      msg.role === 'USER'
                        ? 'bg-[#7D0A0A] text-white rounded-tr-none font-medium'
                        : 'bg-white text-[#2D2926] border border-[#E8E1D5] rounded-tl-none font-normal'
                    }`}
                  >
                    <p className="whitespace-pre-wrap">
                      {msg.message
                        .replace(/\*\*(.*?)\*\*/g, '$1')
                        .replace(/\*(.*?)\*/g, '$1')
                        .replace(/\*{1,}/g, '')}
                    </p>
                  </div>
                  {msg.role === 'USER' && (
                    <div className="w-7 h-7 rounded-full bg-[#E8E1D5] text-[#7D0A0A] flex items-center justify-center shrink-0 text-xs shadow-xs mt-0.5">
                      <User className="w-4 h-4" />
                    </div>
                  )}
                </motion.div>
              ))}

              {loading && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-2.5 justify-start"
                >
                  <div className="w-7 h-7 rounded-full bg-[#7D0A0A] text-[#B8860B] flex items-center justify-center shrink-0 text-xs shadow-xs">
                    <Bot className="w-4 h-4" />
                  </div>
                  <div className="bg-white text-[#2D2926] border border-[#E8E1D5] px-4 py-3 rounded-2xl rounded-tl-none flex items-center gap-1.5 shadow-xs">
                    <div className="w-2 h-2 bg-[#7D0A0A] rounded-full animate-bounce"></div>
                    <div className="w-2 h-2 bg-[#7D0A0A] rounded-full animate-bounce [animation-delay:0.2s]"></div>
                    <div className="w-2 h-2 bg-[#7D0A0A] rounded-full animate-bounce [animation-delay:0.4s]"></div>
                  </div>
                </motion.div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Questions Chips */}
            <div className="px-3 py-2.5 bg-[#FDFCF0] border-t border-[#E8E1D5] overflow-x-auto whitespace-nowrap scrollbar-none flex gap-1.5">
              {CATEGORIZED_SUGGESTIONS.map((item, idx) => (
                <button
                  key={idx}
                  id={`chatbot-quick-${idx}`}
                  onClick={() => handleSendMessage(item.query)}
                  className="inline-block px-3 py-1.5 text-[11px] rounded-full bg-[#F5EFE6] text-[#7D0A0A] hover:bg-[#7D0A0A] hover:text-white border border-[#E8E1D5] font-medium transition-all shrink-0 active:scale-95 shadow-2xs"
                >
                  {item.label}
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
                  placeholder="Ask anything in English or Roman Urdu..."
                  className="flex-1 bg-[#FDFCF0] text-[#2D2926] placeholder-[#8E877D] text-xs sm:text-sm px-4 py-2.5 rounded-full border border-[#E8E1D5] focus:outline-none focus:border-[#7D0A0A] transition-colors"
                />
                <motion.button
                  id="chatbot-send-btn"
                  onClick={() => handleSendMessage()}
                  disabled={!input.trim() || loading}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.92 }}
                  className="p-2.5 bg-[#7D0A0A] text-white rounded-full hover:bg-[#5E0707] disabled:opacity-40 disabled:cursor-not-allowed transition-colors shadow-md"
                  aria-label="Send message"
                >
                  <Send className="w-4 h-4" />
                </motion.button>
              </div>
              <p className="text-[10px] text-center text-[#8E877D] mt-1.5 flex items-center justify-center gap-1 font-light">
                <Sparkles className="w-3 h-3 text-[#B8860B]" />
                Trained for The Velvet Cake Co. • 245 Lexington Ave, Manhattan
              </p>
            </div>

          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
