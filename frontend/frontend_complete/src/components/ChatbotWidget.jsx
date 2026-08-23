import { useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { getVisitorId } from "../lib/visitor.js";

export default function ChatbotWidget({ hidden = false }) {
  const { t, i18n } = useTranslation();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([{ role: "bot", content: t("chatbot.greeting"), isGreeting: true }]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open]);

  // Keep the initial greeting in sync if the visitor switches site language
  // before sending their first message — every message sent after that is
  // already correctly localized via the lang param on each request.
  useEffect(() => {
    setMessages((m) =>
      m.map((msg, i) => (i === 0 && msg.isGreeting ? { ...msg, content: t("chatbot.greeting") } : msg))
    );
  }, [i18n.language, t]);

  const send = async (e) => {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;
    setMessages((m) => [...m, { role: "user", content: text }]);
    setInput("");
    setSending(true);
    try {
      const data = await api.chatbotMessage({
        visitorId: getVisitorId(),
        message: text,
        lang: i18n.language,
      });
      setMessages((m) => [...m, { role: "bot", content: data.answer }]);
    } catch {
      setMessages((m) => [...m, { role: "bot", content: t("chatbot.error") }]);
    } finally {
      setSending(false);
    }
  };

  return (
    <div
      className={`fixed bottom-6 left-6 z-40 transition-all duration-300 ease-out ${
        hidden ? "pointer-events-none translate-y-4 scale-90 opacity-0" : "translate-y-0 scale-100 opacity-100"
      }`}
      aria-hidden={hidden}
    >
      {open && (
        <div className="mb-3 flex h-[28rem] w-80 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white shadow-xl">
          <div className="bg-navy-700 px-4 py-3 text-white">
            <p className="font-display text-sm font-semibold">{t("chatbot.title")}</p>
            <p className="text-xs text-navy-200">{t("chatbot.subtitle")}</p>
          </div>
          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div
                key={i}
                className={`max-w-[85%] rounded-sm px-3 py-2 text-sm ${
                  m.role === "user"
                    ? "ml-auto bg-navy-700 text-white"
                    : "bg-navy-50 text-navy-800"
                }`}
              >
                {m.content}
              </div>
            ))}
            <div ref={endRef} />
          </div>
          <form onSubmit={send} className="flex gap-2 border-t border-[color:var(--color-border)] p-3">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={t("chatbot.placeholder")}
              className="form-input !py-2 text-sm"
            />
            <button type="submit" disabled={sending} className="btn-primary !px-3 !py-2 text-xs">
              {t("buttons.send").split(" ")[0]}
            </button>
          </form>
        </div>
      )}
      <button
        onClick={() => setOpen((v) => !v)}
        aria-label={open ? t("buttons.close") : t("chatbot.title")}
        className="grid h-14 w-14 place-items-center rounded-full bg-navy-700 text-white shadow-lg transition hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-gold-400 focus-visible:ring-offset-2"
      >
        {open ? (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" className="h-6 w-6" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
            <path
              d="M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-1.96-.16-2.85-.46L5 21l1.1-3.6C4.8 16.1 4 14.15 4 12z"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <circle cx="9" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="12.5" cy="12" r="1" fill="currentColor" stroke="none" />
            <circle cx="16" cy="12" r="1" fill="currentColor" stroke="none" />
          </svg>
        )}
      </button>
    </div>
  );
}
