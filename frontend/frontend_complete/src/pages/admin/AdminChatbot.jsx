import { useEffect, useState } from "react";
import { api } from "../../lib/api.js";

export default function AdminChatbot() {
  const [conversations, setConversations] = useState(null);
  const [open, setOpen] = useState(null);

  useEffect(() => {
    api.adminConversations().then((d) => setConversations(d.conversations));
  }, []);

  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-navy-800">Chatbot Conversations</h1>
        <p className="mt-1 text-sm text-[color:var(--color-text-muted)]">
          {conversations ? `${conversations.length} conversations captured` : "Loading..."} from the "Ask RMR" widget.
        </p>
      </div>

      {conversations === null ? (
        <div className="space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card h-14 animate-pulse bg-navy-50/60" />
          ))}
        </div>
      ) : conversations.length === 0 ? (
        <div className="rounded-[var(--radius-card)] border border-dashed border-[color:var(--color-border)] bg-white p-10 text-center text-sm text-[color:var(--color-text-muted)]">
          No conversations yet — visitor chats with "Ask RMR" will appear here.
        </div>
      ) : (
        <div className="space-y-3">
          {conversations.map((c) => {
            const isOpen = open === c.id;
            return (
              <div key={c.id} className="card overflow-hidden !p-0 transition-shadow duration-200 hover:shadow-[var(--shadow-sm)]">
                <button
                  onClick={() => setOpen(isOpen ? null : c.id)}
                  className="flex w-full items-center justify-between p-4 text-left"
                >
                  <span className="flex items-center gap-3 text-sm font-medium text-navy-800">
                    <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-navy-50 text-navy-500">
                      <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="1.6">
                        <path d="M4 12c0-4.4 3.8-8 8.5-8S21 7.6 21 12s-3.8 8-8.5 8c-1 0-1.96-.16-2.85-.46L5 21l1.1-3.6C4.8 16.1 4 14.15 4 12z" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                    </span>
                    Visitor {c.visitorId.slice(0, 8)}... — {c.messages.length} messages
                  </span>
                  <span className="flex items-center gap-3">
                    <span className="text-xs text-[color:var(--color-text-muted)]">
                      {new Date(c.createdAt).toLocaleString()}
                    </span>
                    <svg
                      viewBox="0 0 20 20"
                      className={`h-4 w-4 text-navy-400 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d="M5 7.5l5 5 5-5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </span>
                </button>
                {isOpen && (
                  <div className="space-y-2 border-t border-[color:var(--color-border)] bg-navy-50/30 p-4">
                    {c.messages.map((m) => (
                      <div
                        key={m.id}
                        className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                          m.role === "user" ? "bg-white text-navy-800 shadow-[var(--shadow-xs)]" : "ml-auto bg-navy-700 text-white"
                        }`}
                      >
                        {m.content}
                        {m.matchedIntent === null && m.role === "bot" && (
                          <span className="ml-2 rounded-full bg-gold-400/20 px-1.5 py-0.5 text-[10px] font-medium uppercase text-gold-700">
                            unmatched
                          </span>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
