import { useState, useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { chatService } from '../services/chatService';

interface LocalMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

const SESSION_KEY = 'ps_chat_session_id';
const MESSAGES_KEY = 'ps_chat_messages';

function renderContent(text: string) {
  const parts = text.split(/(\/products\/[a-z]+\/[a-z0-9-]+)/g);
  return parts.map((part, i) =>
    part.startsWith('/products/') ? (
      <Link
        key={i}
        to={part}
        className="text-green-600 underline hover:text-green-700 font-medium"
      >
        View product
      </Link>
    ) : (
      <span key={i}>{part}</span>
    ),
  );
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [sessionId, setSessionId] = useState<string | null>(
    () => sessionStorage.getItem(SESSION_KEY),
  );
  const [messages, setMessages] = useState<LocalMessage[]>(() => {
    const saved = sessionStorage.getItem(MESSAGES_KEY);
    try {
      return saved ? (JSON.parse(saved) as LocalMessage[]) : [];
    } catch {
      return [];
    }
  });
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isTyping, isOpen]);

  useEffect(() => {
    sessionStorage.setItem(MESSAGES_KEY, JSON.stringify(messages));
  }, [messages]);

  const ensureSession = useCallback(async (): Promise<string> => {
    if (sessionId) return sessionId;
    const result = await chatService.createSession();
    setSessionId(result.sessionId);
    sessionStorage.setItem(SESSION_KEY, result.sessionId);
    return result.sessionId;
  }, [sessionId]);

  const sendMessage = useCallback(async () => {
    const text = input.trim();
    if (!text || isTyping) return;

    setInput('');
    const userMsg: LocalMessage = { id: `u-${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let sid = await ensureSession();
      let result;
      try {
        result = await chatService.sendMessage(sid, text);
      } catch (err: unknown) {
        // Session may have expired (404) — create a fresh one and retry once
        const status = (err as { response?: { status?: number } })?.response?.status;
        if (status === 404) {
          setSessionId(null);
          sessionStorage.removeItem(SESSION_KEY);
          const newSession = await chatService.createSession();
          sid = newSession.sessionId;
          setSessionId(sid);
          sessionStorage.setItem(SESSION_KEY, sid);
          result = await chatService.sendMessage(sid, text);
        } else {
          throw err;
        }
      }
      setMessages(prev => [
        ...prev,
        { id: `a-${Date.now()}`, role: 'assistant', content: result.response },
      ]);
    } catch {
      setMessages(prev => [
        ...prev,
        {
          id: `a-${Date.now()}`,
          role: 'assistant',
          content: "Sorry, I'm having trouble right now. Please try again.",
        },
      ]);
    } finally {
      setIsTyping(false);
    }
  }, [input, isTyping, ensureSession]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col items-end gap-3">
      {/* Chat Panel */}
      {isOpen && (
        <div className="w-80 h-[420px] bg-white rounded-2xl shadow-2xl flex flex-col overflow-hidden border border-gray-200">
          {/* Header */}
          <div className="bg-green-600 px-4 py-3 flex items-center justify-between flex-shrink-0">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <span className="text-green-600 text-xs font-bold">PS</span>
              </div>
              <div>
                <p className="text-white text-sm font-semibold">Premier Sport</p>
                <p className="text-green-100 text-xs">AI Assistant</p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white hover:text-green-200 transition-colors p-1"
              aria-label="Close chat"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Messages */}
          <div className="flex-1 overflow-y-auto p-3 space-y-3 bg-gray-50">
            {messages.length === 0 && (
              <div className="text-center text-gray-500 text-sm mt-8 px-4">
                <p className="text-3xl mb-3">⚽</p>
                <p className="font-medium text-gray-700">Hi! I'm your Premier Sport assistant.</p>
                <p className="mt-1 text-xs text-gray-400">Ask me about boots, jerseys, or any sports gear!</p>
              </div>
            )}

            {messages.map(msg => (
              <div
                key={msg.id}
                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
              >
                <div
                  className={`max-w-[85%] px-3 py-2 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-green-600 text-white rounded-br-sm'
                      : 'bg-white text-gray-800 shadow-sm rounded-bl-sm'
                  }`}
                >
                  {msg.role === 'assistant' ? renderContent(msg.content) : msg.content}
                </div>
              </div>
            ))}

            {/* Typing indicator */}
            {isTyping && (
              <div className="flex justify-start">
                <div className="bg-white px-4 py-3 rounded-2xl rounded-bl-sm shadow-sm">
                  <div className="flex space-x-1 items-center">
                    {[0, 150, 300].map(delay => (
                      <div
                        key={delay}
                        className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"
                        style={{ animationDelay: `${delay}ms` }}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input */}
          <div className="p-3 border-t border-gray-200 bg-white flex gap-2 flex-shrink-0">
            <input
              type="text"
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about sports gear..."
              disabled={isTyping}
              className="flex-1 text-sm border border-gray-200 rounded-full px-4 py-2 focus:outline-none focus:border-green-500 disabled:opacity-50 transition-colors"
            />
            <button
              onClick={sendMessage}
              disabled={!input.trim() || isTyping}
              className="w-9 h-9 bg-green-600 rounded-full flex items-center justify-center text-white hover:bg-green-700 disabled:opacity-40 disabled:cursor-not-allowed transition-all flex-shrink-0"
              aria-label="Send message"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        className="w-14 h-14 bg-green-600 rounded-full shadow-lg flex items-center justify-center text-white hover:bg-green-700 transition-all duration-200 hover:scale-110 active:scale-95"
        aria-label={isOpen ? 'Close chat' : 'Open chat'}
      >
        {isOpen ? (
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
            <path d="M20 2H4c-1.1 0-2 .9-2 2v18l4-4h14c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-2 12H6v-2h12v2zm0-3H6V9h12v2zm0-3H6V6h12v2z" />
          </svg>
        )}
      </button>
    </div>
  );
}
