import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { api } from "../lib/api.js";
import { getVisitorId } from "../lib/visitor.js";
import { projectWhatsAppLink } from "../lib/whatsapp.js";

const DEFAULT_QUICK_REPLIES = ["Show me your projects", "Pricing", "Amenities", "Talk to an agent"];

export default function ChatbotWidget({ hidden = false }) {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([
    {
      role: "bot",
      content: t("chatbot.greeting"),
      isGreeting: true,
      quickReplies: DEFAULT_QUICK_REPLIES,
    },
  ]);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);

  // Inline lead-capture card. Set whenever the backend flags an answer as
  // requiresLead (pricing, a specific project, "talk to an agent", or any
  // unmatched question) - see backend/src/lib/chatbotKnowledge.js.
  const [leadCard, setLeadCard] = useState(null); // { projectSlug, projectName } | null
  const [leadName, setLeadName] = useState("");
  const [leadPhone, setLeadPhone] = useState("");
  const [leadSending, setLeadSending] = useState(false);
  const [leadError, setLeadError] = useState("");

  const endRef = useRef(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, open, leadCard]);

  // Keep the initial greeting (and its quick replies) in sync if the
  // visitor switches site language before sending their first message.
  useEffect(() => {
    setMessages((m) =>
      m.map((msg, i) =>
        i === 0 && msg.isGreeting
          ? { ...msg, content: t("chatbot.greeting"), quickReplies: DEFAULT_QUICK_REPLIES }
          : msg
      )
    );
  }, [i18n.language, t]);

  const pushBotReply = (data) => {
    setMessages((m) => [
      ...m,
      {
        role: "bot",
        content: data.answer,
        quickReplies: data.quickReplies || [],
        projectOptions: data.projectOptions || [],
        project: data.project || null,
      },
    ]);
    if (data.requiresLead) {
      setLeadCard({
        projectSlug: data.project?.slug || "",
        projectName: data.project?.name || "",
      });
    } else {
      setLeadCard(null);
    }
  };

  // Shared by the text input, quick-reply chips, and project-option chips -
  // every path re-enters the same matchIntent pipeline on the backend, so
  // tapping "Geetha Garden" behaves exactly like typing it.
  const sendText = async (text) => {
    const clean = String(text || "").trim();
    if (!clean || sending) return;
    setMessages((m) => [...m, { role: "user", content: clean }]);
    setInput("");
    setLeadCard(null);
    setLeadError("");
    setSending(true);
    try {
      const data = await api.chatbotMessage({
        visitorId: getVisitorId(),
        message: clean,
        lang: i18n.language,
      });
      pushBotReply(data);
    } catch {
      setMessages((m) => [...m, { role: "bot", content: t("chatbot.error") }]);
    } finally {
      setSending(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    sendText(input);
  };

  const submitLead = async (e) => {
    e.preventDefault();
    if (leadName.trim().length < 2 || leadPhone.trim().length < 10) {
      setLeadError(t("form.invalidPhone"));
      return;
    }
    setLeadSending(true);
    setLeadError("");
    try {
      const data = await api.chatbotLead({
        visitorId: getVisitorId(),
        name: leadName.trim(),
        phone: leadPhone.trim(),
        projectSlug: leadCard?.projectSlug || "",
      });
      setMessages((m) => [...m, { role: "bot", content: t("form.success") }]);
      setLeadCard(null);
      setLeadName("");
      setLeadPhone("");
      // Hand the visitor straight off to WhatsApp with everything they just
      // told the bot already filled in, so they can keep the conversation
      // going without retyping anything.
      if (data.whatsappLink) window.open(data.whatsappLink, "_blank", "noopener,noreferrer");
    } catch (err) {
      setLeadError(err?.message || t("chatbot.error"));
    } finally {
      setLeadSending(false);
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
        <div className="mb-3 flex h-[30rem] w-80 flex-col overflow-hidden rounded-[var(--radius-card)] border border-[color:var(--color-border)] bg-white shadow-xl">
          <div className="bg-navy-700 px-4 py-3 text-white">
            <p className="font-display text-sm font-semibold">{t("chatbot.title")}</p>
            <p className="text-xs text-navy-200">{t("chatbot.subtitle")}</p>
          </div>

          <div className="flex-1 space-y-3 overflow-y-auto px-4 py-3">
            {messages.map((m, i) => (
              <div key={i} className="space-y-2">
                <div
                  className={`max-w-[85%] rounded-sm px-3 py-2 text-sm ${
                    m.role === "user" ? "ml-auto bg-navy-700 text-white" : "bg-navy-50 text-navy-800"
                  }`}
                >
                  {m.content}
                </div>

                {/* Project-scoped answer: jump straight to that project or
                    open a WhatsApp chat pre-filled with its name. */}
                {m.role === "bot" && m.project && (
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => navigate(`/projects/${m.project.slug}`)}
                      className="rounded-full border border-navy-700 px-3 py-1 text-xs font-medium text-navy-700 transition hover:bg-navy-50"
                    >
                      {t("buttons.viewDetails")}
                    </button>
                    <a
                      href={projectWhatsAppLink(m.project.name)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="rounded-full bg-[#25D366] px-3 py-1 text-xs font-medium text-white transition hover:opacity-90"
                    >
                      {t("buttons.whatsapp")}
                    </a>
                  </div>
                )}

                {/* Live list of published projects (e.g. after "show me
                    your projects") - tapping one re-asks the bot about it. */}
                {m.role === "bot" && m.projectOptions?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.projectOptions.map((p) => (
                      <button
                        key={p.slug}
                        type="button"
                        onClick={() => sendText(p.name)}
                        className="rounded-full border border-gold-400 px-3 py-1 text-xs font-medium text-navy-700 transition hover:bg-gold-50"
                      >
                        {p.name}
                      </button>
                    ))}
                  </div>
                )}

                {/* Suggested follow-up questions as tappable chips. */}
                {m.role === "bot" && m.quickReplies?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {m.quickReplies.map((q) => (
                      <button
                        key={q}
                        type="button"
                        onClick={() => sendText(q)}
                        className="rounded-full bg-navy-100 px-3 py-1 text-xs font-medium text-navy-700 transition hover:bg-navy-200"
                      >
                        {q}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Inline name + phone capture - shown whenever the bot's last
                answer needs a human follow-up (pricing, a specific project,
                "talk to an agent", or a question it couldn't answer). */}
            {leadCard && (
              <form
                onSubmit={submitLead}
                className="space-y-2 rounded-[var(--radius-card)] border border-gold-300 bg-gold-50 p-3"
              >
                <p className="text-xs font-medium text-navy-800">
                  {leadCard.projectName
                    ? `${t("form.enquiringAbout")} ${leadCard.projectName}`
                    : t("chatbot.shareDetails")}
                </p>
                <input
                  value={leadName}
                  onChange={(e) => setLeadName(e.target.value)}
                  placeholder={t("form.name")}
                  className="form-input !py-2 text-sm"
                />
                <input
                  value={leadPhone}
                  onChange={(e) => setLeadPhone(e.target.value)}
                  placeholder={t("form.phone")}
                  className="form-input !py-2 text-sm"
                />
                {leadError && <p className="text-xs text-red-600">{leadError}</p>}
                <div className="flex gap-2">
                  <button type="submit" disabled={leadSending} className="btn-primary flex-1 !py-2 text-xs">
                    {leadSending ? t("form.submitting") : t("buttons.submit")}
                  </button>
                  <button
                    type="button"
                    onClick={() => setLeadCard(null)}
                    className="rounded-sm border border-[color:var(--color-border)] px-3 py-2 text-xs text-navy-600"
                  >
                    {t("buttons.cancel")}
                  </button>
                </div>
              </form>
            )}

            <div ref={endRef} />
          </div>

          <form onSubmit={handleSubmit} className="flex gap-2 border-t border-[color:var(--color-border)] p-3">
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
