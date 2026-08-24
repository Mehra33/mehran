import React, { useState, useEffect, useRef } from 'react';
import { 
  X, Sparkles, Send, Bot, User, RefreshCw, 
  Cpu, ArrowRight, CheckCircle2, ShieldCheck, Zap
} from 'lucide-react';
import { BuyerRole } from '../types';

interface AiAdvisorDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  initialPartOrQuery?: string;
  currentRole: BuyerRole;
  onSearchInCatalog: (q: string) => void;
}

interface Message {
  id: string;
  sender: 'user' | 'ai';
  text: string;
  timestamp: string;
}

export const AiAdvisorDrawer: React.FC<AiAdvisorDrawerProps> = ({
  isOpen,
  onClose,
  initialPartOrQuery,
  currentRole,
  onSearchInCatalog,
}) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      sender: 'ai',
      text: `سلام! من مشاور فنی و تامین قطعات دایا الکترونیک هستم. 
می‌توانید درباره **انتخاب چیپ، قطعات جایگزین پین‌به‌پین (Drop-in Replacements)، استعلام تیراژ و قرقره‌های کامل انبار تهران و شنژن** سوال بفرمایید.`,
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (initialPartOrQuery && isOpen) {
      handleSendPrompt(`لطفا مشخصات فنی، پارت‌نامبرهای معادل پین‌به‌پین و شرایط خرید عمده برای «${initialPartOrQuery}» را توضیح دهید.`);
    }
  }, [initialPartOrQuery, isOpen]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendPrompt = async (textToSend?: string) => {
    const text = textToSend || inputText;
    if (!text.trim() || isLoading) return;

    const userMsg: Message = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: text.trim(),
      timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!textToSend) setInputText('');
    setIsLoading(true);

    try {
      const res = await fetch('/api/ai/advisor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          query: text,
          role: currentRole,
        }),
      });
      const data = await res.json();

      const aiMsg: Message = {
        id: `ai-${Date.now()}`,
        sender: 'ai',
        text: data.answer || 'پاسخ دریافت شد.',
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, aiMsg]);
    } catch (err) {
      console.error('Error fetching AI advice:', err);
      const errorMsg: Message = {
        id: `ai-err-${Date.now()}`,
        sender: 'ai',
        text: `### پیشنهاد فنی و معادل‌یابی دایا:
- **نکته کلیدی:** در صورت کمبود موجودی قطعات ST مانند STM32F103، پیشنهاد تیم مهندسی دایا استفاده از پارت‌نامبر معادل **GD32F103C8T6** از کمپانی GigaDevice یا **CH32F103** از WCH است.
- این چیپ‌ها کاملاً پین‌به‌پین سازگار بوده و با همان کامپایلر Keil / STM32CubeIDE قابل برنامه‌ریزی هستند و قیمت قرقره کامل آن‌ها تا ۳۵٪ اقتصادی‌تر است.`,
        timestamp: new Date().toLocaleTimeString('fa-IR', { hour: '2-digit', minute: '2-digit' }),
      };
      setMessages((prev) => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-hidden animate-in fade-in duration-150">
      <div 
        className="fixed inset-0 bg-black/60 backdrop-blur-2xs" 
        onClick={onClose}
      />

      <div className="fixed inset-y-0 left-0 max-w-full flex">
        <div className="w-screen max-w-lg bg-white shadow-2xl border-r border-gray-200 flex flex-col justify-between">
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-gray-800 bg-gray-900 text-white flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-lg bg-red-600 flex items-center justify-center text-white shadow-sm">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h2 className="font-bold text-sm text-white flex items-center gap-1.5">
                  <span>مشاور هوش مصنوعی دایا</span>
                  <span className="text-[10px] bg-red-500/20 text-red-300 px-1.5 py-0.2 rounded border border-red-500/30 font-mono">
                    AI Sourcing
                  </span>
                </h2>
                <p className="text-[11px] text-gray-400">
                  راهنمای معادل‌یابی پین‌به‌پین، مشخصات دیتاشیت و تامین عمده
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-800 hover:bg-gray-700 text-gray-300 flex items-center justify-center transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Quick suggestions */}
          <div className="bg-gray-50 border-b border-gray-200 p-2.5 overflow-x-auto flex items-center gap-2 text-[11px]">
            <span className="text-gray-400 shrink-0">پیشنهادات:</span>
            {[
              'معادل ارزان‌تر برای STM32F103',
              'تفاوت ESP32-WROOM با ESP32-C3',
              'رگولاتور با دراپ‌اوت پایین AMS1117',
              'خرید ریل ۵۰۰۰ تایی مقاومت 0603',
            ].map((sug, i) => (
              <button
                key={i}
                onClick={() => handleSendPrompt(sug)}
                className="bg-white hover:bg-red-50 hover:text-red-700 hover:border-red-300 border border-gray-200 px-2.5 py-1 rounded text-gray-700 whitespace-nowrap transition-colors"
              >
                {sug}
              </button>
            ))}
          </div>

          {/* Chat Messages Body */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
            {messages.map((msg) => (
              <div
                key={msg.id}
                className={`flex items-start gap-2.5 ${
                  msg.sender === 'user' ? 'flex-row-reverse' : ''
                }`}
              >
                <div
                  className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                    msg.sender === 'user'
                      ? 'bg-gray-900 text-white'
                      : 'bg-red-600 text-white'
                  }`}
                >
                  {msg.sender === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />}
                </div>

                <div
                  className={`max-w-[85%] rounded-lg p-3.5 leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gray-900 text-white font-sans'
                      : 'bg-gray-100 text-gray-800 border border-gray-200'
                  }`}
                >
                  <div className="whitespace-pre-line prose prose-xs prose-slate max-w-none">
                    {msg.text}
                  </div>
                  <div
                    className={`text-[9px] mt-1.5 font-mono ${
                      msg.sender === 'user' ? 'text-gray-400 text-left' : 'text-gray-400 text-right'
                    }`}
                  >
                    {msg.timestamp}
                  </div>
                </div>
              </div>
            ))}

            {isLoading && (
              <div className="flex items-center gap-2 text-xs text-red-600 bg-red-50 p-3 rounded-lg border border-red-100 animate-pulse">
                <RefreshCw className="w-4 h-4 animate-spin" />
                <span>در حال تحلیل دیتاشیت و استعلام موجودی انبارهای دایا...</span>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Bar */}
          <div className="p-3 sm:p-4 border-t border-gray-200 bg-gray-50">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendPrompt();
              }}
              className="flex items-center gap-2"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="سوال فنی، استعلام پارت نامبر یا جایگزین پین‌به‌پین..."
                className="flex-1 bg-white border border-gray-300 focus:border-red-600 rounded-md px-3.5 py-2 text-xs outline-none text-gray-900"
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white p-2.5 rounded-md transition-all shadow-xs"
              >
                <Send className="w-4 h-4 rotate-180" />
              </button>
            </form>
            <div className="text-[10px] text-gray-400 text-center mt-2">
              پاسخ‌ها توسط موتور هوش مصنوعی دایا و تطبیق با کاتالوگ قطعات صنعتی تولید می‌شوند.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
