import React, { useState, useEffect, useRef } from 'react';
import { ViewState } from '../types';
import { ArrowLeft, Send, Loader2, Bot, User as UserIcon } from 'lucide-react';

interface Message {
  id: string;
  role: 'user' | 'bot';
  content: string;
  timestamp: Date;
}

interface WebhookTestProps {
  onNavigate: (view: ViewState) => void;
}

export const WebhookTest: React.FC<WebhookTestProps> = ({ onNavigate }) => {
  const [inputText, setInputText] = useState('');
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'bot',
      content: '안녕하세요! 무엇을 도와드릴까요?',
      timestamp: new Date()
    }
  ]);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim() || loading) return;

    const userText = inputText.trim();
    setInputText('');
    
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setLoading(true);

    try {
      const res = await fetch('/api/webhook-proxy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ text: userText }),
      });

      if (!res.ok) {
        throw new Error('서버 응답에 실패했습니다.');
      }

      const data = await res.json();
      const botContent = data.output || '응답 데이터에 "output" 필드가 없습니다.';

      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: botContent,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMessage]);
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'bot',
        content: `오류 발생: ${err.message}`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-[100dvh] bg-white max-w-full overflow-hidden">
      {/* Header */}
      <div className="bg-white px-4 py-3 flex items-center border-b border-gray-100 sticky top-0 z-10 pt-safe">
        <button 
          onClick={() => onNavigate(ViewState.HOME)}
          className="mr-3 p-2 hover:bg-gray-100 rounded-full transition-colors"
        >
          <ArrowLeft size={20} className="text-gray-700" />
        </button>
        <div className="flex flex-col">
          <h1 className="text-lg font-bold text-gray-900 leading-tight">패션 AI 어시스턴트</h1>
          <span className="text-[10px] text-green-500 flex items-center">
            <span className="w-1.5 h-1.5 bg-green-500 rounded-full mr-1"></span>
            Online
          </span>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div className={`flex max-w-[85%] ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'} items-start`}>
              <div className={`flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center mt-1 
                ${msg.role === 'user' ? 'ml-2 bg-black' : 'mr-2 bg-gray-200'}`}
              >
                {msg.role === 'user' ? <UserIcon size={14} color="white" /> : <Bot size={14} color="#666" />}
              </div>
              
              <div className={`relative px-4 py-2 rounded-2xl text-sm shadow-sm min-w-0
                ${msg.role === 'user' 
                  ? 'bg-black text-white rounded-tr-none' 
                  : 'bg-white text-gray-800 border border-gray-100 rounded-tl-none'}`}
              >
                <div className="whitespace-pre-wrap break-words overflow-wrap-anywhere">
                  {msg.content}
                </div>
                <div className={`text-[9px] mt-1 opacity-50 ${msg.role === 'user' ? 'text-right' : 'text-left'}`}>
                  {msg.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="flex max-w-[85%] flex-row items-start">
              <div className="flex-shrink-0 h-8 w-8 rounded-full bg-gray-200 flex items-center justify-center mr-2 mt-1">
                <Bot size={14} color="#666" />
              </div>
              <div className="bg-white border border-gray-100 px-4 py-3 rounded-2xl rounded-tl-none shadow-sm">
                <Loader2 size={16} className="animate-spin text-gray-400" />
              </div>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-gray-100 pb-safe">
        <form onSubmit={handleSubmit} className="flex items-center gap-2">
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            placeholder="메시지를 입력하세요..."
            className="flex-1 px-4 py-3 bg-gray-100 border-none rounded-2xl text-sm focus:ring-2 focus:ring-black outline-none transition-all"
            disabled={loading}
          />
          <button
            type="submit"
            disabled={loading || !inputText.trim()}
            className="flex-shrink-0 p-3 bg-black text-white rounded-xl disabled:opacity-30 transition-all active:scale-95"
          >
            <Send size={20} />
          </button>
        </form>
      </div>
    </div>
  );
};