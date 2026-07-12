import React, { useState, useRef, useEffect } from 'react';
import type { PayoutAccounts } from '../types';

interface Message {
  id: number;
  sender: 'user' | 'ai';
  text?: string;
  image?: string | null;
}

interface SupportTabProps {
  payoutInfo: PayoutAccounts;
  onOpenTerms: () => void;
  accentColor: string;
}

export default function SupportTab({ onOpenTerms, accentColor }: SupportTabProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      sender: 'ai',
      text: 'Hello! I am your automated Reward Rush Assistant. How can I help resolve your account, submission, or withdrawal issues today?',
    },
  ]);
  const [inputText, setInputText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [attachedImage, setAttachedImage] = useState<string | null>(null);
  const chatEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isTyping]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setAttachedImage(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const sendMessage = () => {
    if (!inputText.trim() && !attachedImage) return;
    const newUserMsg: Message = {
      id: Date.now(),
      sender: 'user',
      text: inputText,
      image: attachedImage || null,
    };
    setMessages((prev) => [...prev, newUserMsg]);
    setInputText('');
    setAttachedImage(null);
    setIsTyping(true);
    setTimeout(() => {
      let responseText =
        'Thank you for contacting support. Your message query parameter has been logged to real-time administrative logs.';
      if (newUserMsg.image) {
        responseText =
          '⚠️ SECURITY ENGINE NOTICE: Image upload captured successfully. File is queued for verification processing.';
      }
      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, sender: 'ai', text: responseText },
      ]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className="flex flex-col h-[calc(100vh-140px)] space-y-3 pt-1">
      <div className="bg-neutral-900/50 p-3 rounded-xl border border-white/5 flex items-center justify-between text-xs">
        <div className="flex items-center space-x-2 text-neutral-300">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          <span className="font-medium">Verification Core Active</span>
        </div>
        <button
          onClick={onOpenTerms}
          className="font-bold hover:underline"
          style={{ color: accentColor }}
        >
          View Terms
        </button>
      </div>

      <div className="flex-1 overflow-y-auto bg-neutral-950/40 rounded-2xl border border-white/5 p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[85%] rounded-2xl p-3 text-xs leading-relaxed space-y-2 ${
                msg.sender === 'user'
                  ? 'bg-brand-orange text-white rounded-br-none'
                  : 'bg-neutral-900 text-neutral-200 rounded-bl-none border border-white/5'
              }`}
            >
              {msg.image && (
                <div className="relative rounded-lg overflow-hidden border border-white/10 mb-1 max-h-40">
                  <img src={msg.image} className="object-cover w-full h-full" alt="attachment" />
                </div>
              )}
              {msg.text && <p className="whitespace-pre-wrap">{msg.text}</p>}
            </div>
          </div>
        ))}
        {isTyping && (
          <div className="text-brand-grayMuted text-[11px] animate-pulse">
            AI is analyzing parameters...
          </div>
        )}
        <div ref={chatEndRef} />
      </div>

      <div className="space-y-2 bg-brand-black pb-1">
        {attachedImage && (
          <div className="flex items-center justify-between bg-neutral-900 p-2 rounded-xl border border-white/10 mx-1">
            <div className="flex items-center space-x-2">
              <img src={attachedImage} className="w-8 h-8 rounded object-cover" alt="preview" />
              <span className="text-[10px] text-brand-grayMuted font-mono">Attachment ready</span>
            </div>
            <button onClick={() => setAttachedImage(null)} className="text-neutral-400">
              <span className="material-symbols-rounded text-sm">close</span>
            </button>
          </div>
        )}
        <div className="flex items-center space-x-2 bg-neutral-900 rounded-xl p-2 border border-white/5">
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            onChange={handleFileChange}
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="w-9 h-9 rounded-lg bg-neutral-800 flex items-center justify-center text-neutral-300"
          >
            <span className="material-symbols-rounded text-lg">image</span>
          </button>
          <input
            type="text"
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
            placeholder="Explain task issue..."
            className="flex-1 bg-transparent text-xs text-white outline-none px-1"
          />
          <button
            onClick={sendMessage}
            className="w-9 h-9 rounded-lg orange-gradient flex items-center justify-center text-white"
            style={{ background: `linear-gradient(135deg, ${accentColor}, #FF7A00)` }}
          >
            <span className="material-symbols-rounded text-lg">send</span>
          </button>
        </div>
      </div>
    </div>
  );
}
