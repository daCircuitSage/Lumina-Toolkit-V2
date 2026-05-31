import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Send, 
  Bot, 
  User, 
  Loader2, 
  Trash2, 
  Sparkles,
  MessageSquare,
  ChevronRight,
  Plus
} from 'lucide-react';
import { cn } from '../lib/utils';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export default function AiChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sessionId = useRef(`session_${Math.random().toString(36).substring(7)}`);

  // Auto-scroll to bottom with behavior: smooth
  useEffect(() => {
    if (scrollRef.current) {
      const { scrollHeight, clientHeight } = scrollRef.current;
      scrollRef.current.scrollTo({
        top: scrollHeight - clientHeight,
        behavior: 'smooth'
      });
    }
  }, [messages, isLoading]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput('');
    setIsLoading(true);

    try {
      const history = messages.map(msg => ({
        role: msg.role === 'user' ? 'user' : 'assistant',
        content: msg.content
      }));

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: userMessage.content,
          history: history
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || 'Failed to get AI response');
      }

      const data = await response.json();
      const aiResponse = data.response;
      
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: aiResponse || 'No response from AI',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, assistantMessage]);
    } catch (error) {
      console.error('Chat Error:', error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: error instanceof Error ? error.message : 'I encountered an error. Please check your connection or try again later.',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    if (window.confirm('Clear all messages?')) {
      setMessages([]);
    }
  };

  return (
    <div className="flex flex-col h-full bg-canvas transition-colors relative chat-container-bg">
      {/* Chat Header - Only visible on mobile */}
      <header className="md:hidden px-4 py-3 border-b border-hairline bg-canvas-card/90 backdrop-blur-md flex items-center justify-between shrink-0 z-20 relative sticky top-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-white/10 flex items-center justify-center text-white">
            <Bot size={16} />
          </div>
          <div>
            <h1 className="text-sm font-normal text-ink leading-tight">AI Assistant</h1>
            <div className="flex items-center gap-1.5">
              <span className="w-1 h-1 rounded-full bg-green-500 animate-pulse shrink-0" />
              <span className="text-[9px] font-normal text-body-mid uppercase tracking-wider">Mistral</span>
            </div>
          </div>
        </div>
        
        <button 
          onClick={clearHistory}
          className="p-1.5 text-body-mid hover:text-red-500 hover:bg-canvas-soft rounded-sm transition-all"
          title="Clear session history"
        >
          <Trash2 size={16} />
        </button>
      </header>

      {/* Messages Container */}
      <div 
        ref={scrollRef}
        className="flex-1 overflow-y-auto w-full px-4 md:px-6 py-4 md:py-6 space-y-4 md:space-y-6 custom-scrollbar relative z-10"
      >
        <div className="max-w-4xl mx-auto w-full">
          {messages.length === 0 ? (
            <div className="min-h-[60vh] flex flex-col items-center justify-center text-center space-y-4 md:space-y-6 px-4 py-8">
              <div className="w-14 h-14 md:w-16 md:h-16 rounded-sm bg-white/10 flex items-center justify-center text-white">
                <Sparkles size={28} className="w-7 h-7 md:w-8 md:h-8 animate-pulse" />
              </div>
              <div className="space-y-2">
                <h2 className="text-lg md:text-2xl font-normal text-ink">What's on your mind?</h2>
                <p className="text-body-mid text-sm md:text-base max-w-sm mx-auto">
                  I can help you build resumes, optimize PDF workflows, or explain complex code.
                </p>
              </div>
              
              {/* Suggestion Cards - Simplified */}
              <div className="w-full max-w-xl">
                <div className="grid grid-cols-1 gap-2">
                  {[
                    "Help me write a professional summary",
                    "Explain how PDF merging works",
                    "What skills are needed for a designer role?",
                    "Give me 5 motivational quotes"
                  ].map((suggestion, i) => (
                    <button 
                      key={i}
                      onClick={() => setInput(suggestion)}
                      className="p-3 bg-canvas-card border border-hairline rounded-sm text-left text-sm text-body-mid hover:border-white/30 transition-all flex items-center justify-between group"
                    >
                      <span className="line-clamp-1">{suggestion}</span>
                      <ChevronRight size={14} className="text-body-mid group-hover:text-white transition-colors shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-6 md:space-y-10 pb-24 md:pb-32">
              <AnimatePresence initial={false}>
                {messages.map((message) => (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn(
                      "flex gap-3 md:gap-4",
                      message.role === 'user' ? "flex-row-reverse" : "flex-row"
                    )}
                  >
                    <div className={cn(
                      "w-8 h-8 md:w-10 md:h-10 rounded-sm flex items-center justify-center shrink-0",
                      message.role === 'user' 
                        ? "bg-white text-black" 
                        : "bg-canvas-soft text-white"
                    )}>
                      {message.role === 'user' ? <User size={16} className="w-4 h-4 md:w-5 md:h-5" /> : <Bot size={16} className="w-4 h-4 md:w-5 md:h-5" />}
                    </div>
                    <div className={cn(
                      "flex flex-col space-y-1.5 max-w-[85%] sm:max-w-[80%] md:max-w-[70%]",
                      message.role === 'user' ? "items-end text-right" : "items-start text-left"
                    )}>
                      <div className={cn(
                        "px-4 md:px-6 py-3 md:py-4 rounded-sm text-sm md:text-base leading-relaxed whitespace-pre-wrap break-words",
                        message.role === 'user'
                          ? "bg-white text-black rounded-tr-none"
                          : "bg-canvas-card border border-hairline text-ink rounded-tl-none"
                      )}>
                        {message.content}
                      </div>
                      <span className="text-[10px] font-normal text-body-mid uppercase tracking-widest px-2">
                        {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                  </motion.div>
                ))}
              </AnimatePresence>
              {isLoading && (
                <motion.div 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3 md:gap-4"
                >
                  <div className="w-8 h-8 md:w-10 md:h-10 rounded-sm bg-canvas-soft text-white flex items-center justify-center shrink-0">
                    <Bot size={16} className="w-4 h-4 md:w-5 md:h-5" />
                  </div>
                  <div className="bg-canvas-card border border-hairline px-6 py-4 rounded-sm rounded-tl-none flex items-center gap-3">
                    <div className="flex gap-1.5">
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]" />
                      <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce" />
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Sticky Chat Input */}
      <div className="sticky bottom-0 left-0 right-0 p-3 md:p-4 border-t border-hairline bg-canvas-card/90 backdrop-blur-md z-30">
        <div className="relative group max-w-4xl mx-auto w-full">
          <input 
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Type your message here..."
            className="w-full h-10 md:h-12 pl-4 pr-12 md:pl-5 md:pr-14 bg-canvas border border-hairline rounded-sm text-sm md:text-base focus:outline-none focus:border-white focus:ring-2 focus:ring-white/20 transition-all text-ink"
          />
          <button 
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-1.5 top-1.5 bottom-1.5 w-8 h-8 md:w-10 md:h-10 bg-white text-black rounded-sm flex items-center justify-center hover:bg-gray-100 active:scale-95 transition-all disabled:opacity-50 disabled:active:scale-100"
          >
            {isLoading ? <Loader2 size={14} className="animate-spin" /> : <Send size={14} className="w-3.5 h-3.5 md:w-4 md:h-4" />}
          </button>
        </div>
        <p className="text-center mt-2 text-[8px] md:text-[9px] text-body-mid font-normal uppercase tracking-wider">
          AI generated content • {sessionId.current.split('_')[1]}
        </p>
      </div>
    </div>
  );
}
