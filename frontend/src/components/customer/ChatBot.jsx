import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Send, Bot, Trash2 } from 'lucide-react';
import { chatbotApi } from '../../api';
import '../../styles/ChatBot.css';

const STORAGE_KEY = 'marketlink_chat_history';

const DEFAULT_MESSAGES = [
  {
    from: 'bot',
    text: "Hello! 👋 I'm your MarketLink assistant. Ask me things like 'cart total', 'how many orders', 'pending orders', or type 'help'.",
  },
];

const ChatBot = () => {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState(() => {
    // Load from localStorage on first render
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Failed to load chat history:', e);
    }
    return DEFAULT_MESSAGES;
  });
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef(null);

  // Event listener for toggle
  useEffect(() => {
    const handleToggle = () => setOpen((o) => !o);
    window.addEventListener('toggleChatbot', handleToggle);
    return () => window.removeEventListener('toggleChatbot', handleToggle);
  }, []);

  // Save messages to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
    } catch (e) {
      console.error('Failed to save chat history:', e);
    }
  }, [messages]);

  // Auto-scroll to bottom
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing, open]);

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim() || typing) return;

    const userMsg = input.trim();
    setMessages((prev) => [...prev, { from: 'user', text: userMsg }]);
    setInput('');
    setTyping(true);

    try {
      const res = await chatbotApi.sendMessage(userMsg);
      setMessages((prev) => [...prev, { from: 'bot', text: res.reply }]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          from: 'bot',
          text: '❌ Sorry, something went wrong. Please try again.',
        },
      ]);
    } finally {
      setTyping(false);
    }
  };

  const handleClearChat = () => {
    if (window.confirm('Clear chat history?')) {
      setMessages(DEFAULT_MESSAGES);
      localStorage.removeItem(STORAGE_KEY);
    }
  };

  const suggestions = [
    'Cart total',
    'How many orders?',
    'Pending orders',
    'Products I ordered',
    'Help',
  ];

  const handleSuggestion = (text) => {
    setInput(text);
    setTimeout(() => {
      const sendBtn = document.querySelector(
        '.chatbot-input-row button[type="submit"]'
      );
      if (sendBtn) sendBtn.click();
    }, 100);
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="chatbot-window"
          initial={{ opacity: 0, y: 40, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 40, scale: 0.9 }}
          transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
        >
          {/* Header */}
          <div className="chatbot-header">
            <div className="chatbot-header-left">
              <motion.div
                className="chatbot-avatar"
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              >
                <Bot size={18} />
              </motion.div>
              <div>
                <h4>MarketLink Assistant</h4>
                <span className="chatbot-status">
                  <span className="chatbot-dot" /> Online
                </span>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <button
                type="button"
                className="chatbot-close"
                onClick={handleClearChat}
                aria-label="Clear chat"
                title="Clear chat"
              >
                <Trash2 size={16} />
              </button>
              <button
                type="button"
                className="chatbot-close"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
              >
                <X size={18} />
              </button>
            </div>
          </div>

          {/* Messages */}
          <div className="chatbot-body">
            {messages.map((msg, i) => (
              <motion.div
                key={i}
                className={`chatbot-msg ${msg.from}`}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
              >
                <div className="chatbot-bubble">{msg.text}</div>
              </motion.div>
            ))}

            {typing && (
              <motion.div
                className="chatbot-msg bot"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="chatbot-bubble chatbot-typing">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </motion.div>
            )}

            <div ref={endRef} />
          </div>

          {/* Suggestions */}
          {messages.length <= 2 && (
            <div className="chatbot-suggestions">
              {suggestions.map((s, i) => (
                <motion.button
                  key={s}
                  type="button"
                  className="chatbot-chip"
                  onClick={() => handleSuggestion(s)}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.05 }}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {s}
                </motion.button>
              ))}
            </div>
          )}

          {/* Input */}
          <form className="chatbot-input-row" onSubmit={handleSend}>
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              disabled={typing}
            />
            <motion.button
              type="submit"
              disabled={!input.trim() || typing}
              whileHover={{ scale: 1.08 }}
              whileTap={{ scale: 0.92 }}
            >
              <Send size={16} />
            </motion.button>
          </form>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ChatBot;