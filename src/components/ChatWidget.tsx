import { useState, useRef, useEffect, type FormEvent } from 'react';
import { useAIChat } from '../hooks/useAI';
import type { Language } from '../utils/translations';

interface ChatMsg {
  sender: 'patient' | 'ai';
  message: string;
}

const STARTERS: Record<Language, string[]> = {
  en: ['My gums bleed when I brush', 'Tooth pain after eating something cold', 'How do I care for a new filling?'],
  am: ['ጥርሴን ስቦርሽ ድዴ ይደማል', 'ቀዝቃዛ ነገር ከበላሁ በኋላ ጥርስ ይጎዳኛል', 'አዲስ ፊሊንግ እንዴት እንክብካቤ አደርጋለሁ?']
};

export function ChatWidget({ lang, patientId }: { lang: Language; patientId?: string }) {
  const [open, setOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<ChatMsg[]>([
    {
      sender: 'ai',
      message:
        lang === 'am'
          ? 'ሰላም! የDama Dental AI ረዳት ነኝ። ስለ ጥርስዎ ጤንነት ምን ልርዳዎት? (ይህ የሐኪም ምክር ምትክ አይደለም።)'
          : "Hi, I'm the Dama Dental assistant. What's going on with your teeth today? (This isn't a substitute for seeing a dentist.)"
    }
  ]);
  const chat = useAIChat();
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: 'smooth' });
  }, [messages, open]);

  function send(text: string) {
    if (!text.trim() || chat.isPending) return;
    setMessages((m) => [...m, { sender: 'patient', message: text }]);
    setInput('');
    chat.mutate(
      { message: text, language: lang, patientId },
      {
        onSuccess: (res) => setMessages((m) => [...m, { sender: 'ai', message: res.reply }]),
        onError: () =>
          setMessages((m) => [
            ...m,
            {
              sender: 'ai',
              message:
                lang === 'am'
                  ? 'ይቅርታ፣ አሁን ምላሽ መስጠት አልቻልኩም። እባክዎ ቆይተው እንደገና ይሞክሩ ወይም ክሊኒኩን ይደውሉ።'
                  : "Sorry, I couldn't reach the assistant just now. Please try again or call the clinic directly."
            }
          ])
      }
    );
  }

  function handleSubmit(e: FormEvent) {
    e.preventDefault();
    send(input);
  }

  return (
    <>
      {!open && (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-full bg-teal-700 px-5 py-3.5 text-sm font-semibold text-white shadow-soft transition hover:bg-teal-800 sm:bottom-7 sm:right-7"
        >
          <span className="relative flex h-2 w-2">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-gold-400 opacity-75" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-gold-400" />
          </span>
          {lang === 'am' ? 'AI ረዳት' : 'Ask the AI assistant'}
        </button>
      )}

      {open && (
        <div className="fixed inset-x-4 bottom-4 z-50 flex h-[min(560px,80vh)] flex-col overflow-hidden rounded-3xl border border-teal-700/15 bg-white shadow-soft sm:inset-auto sm:bottom-7 sm:right-7 sm:w-[380px]">
          <div className="flex items-center justify-between bg-teal-700 px-5 py-4 text-white">
            <div>
              <p className="font-display text-base font-semibold">Dama AI Assistant</p>
              <p className="text-xs text-sand-100/80">
                {lang === 'am' ? 'ለአስቸኳይ ጉዳይ ክሊኒኩን ይደውሉ' : 'For emergencies, call the clinic'}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close chat"
              className="rounded-full p-1.5 text-white/80 hover:bg-white/10 hover:text-white"
            >
              ✕
            </button>
          </div>

          <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto bg-sand-50 px-4 py-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.sender === 'patient' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
                    m.sender === 'patient'
                      ? 'rounded-br-sm bg-teal-700 text-white'
                      : 'rounded-bl-sm border border-teal-700/10 bg-white text-ink'
                  }`}
                >
                  {m.message}
                </div>
              </div>
            ))}
            {chat.isPending && (
              <div className="flex justify-start">
                <div className="rounded-2xl rounded-bl-sm border border-teal-700/10 bg-white px-4 py-2.5 text-sm text-ink/50">
                  {lang === 'am' ? 'በመተየብ ላይ…' : 'Typing…'}
                </div>
              </div>
            )}
            {messages.length === 1 && (
              <div className="flex flex-wrap gap-2 pt-2">
                {STARTERS[lang].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => send(s)}
                    className="rounded-full border border-teal-700/20 bg-white px-3 py-1.5 text-xs text-teal-800 hover:bg-teal-700/5"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t border-teal-700/10 p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={lang === 'am' ? 'መልዕክት ይጻፉ…' : 'Type a message…'}
              className="input-field !py-2.5"
            />
            <button type="submit" className="btn-primary !px-4 !py-2.5 text-xs" disabled={chat.isPending}>
              {lang === 'am' ? 'ላክ' : 'Send'}
            </button>
          </form>
        </div>
      )}
    </>
  );
}
