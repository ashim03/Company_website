"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ArrowUp, MessageCircle, Send, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";

type SiteWidgetsProps = {
  whatsappUrl: string;
  whatsappNumber: string;
  phone: string;
  email: string;
};

const QUICK_REPLIES = [
  { id: "services", label: "I want services" },
  { id: "classes", label: "I want classes / training" },
  { id: "more", label: "Know more" },
] as const;

const ANSWERS: Record<string, string> = {
  services:
    "We help businesses grow with digital marketing, social media, graphic design, web & software, and IT solutions. Tell us what your business needs and we'll point you to the right service.",
  classes:
    "We offer hands-on professional classes in IT & digital skills, digital marketing, graphic design, and web development. Courses are practical and built around real projects.",
  more: "Great question — our team can give you a tailored answer. Reach us on WhatsApp, email, or call and we'll get back to you quickly.",
};

function waLink(url: string, number: string, text: string) {
  if (!url && !number) return "/contact";
  if (url) return `${url}${url.includes("?") ? "&" : "?"}text=${encodeURIComponent(text)}`;
  const num = number.replace(/[^0-9]/g, "");
  const intl = num.startsWith("977") ? num : num.length === 10 ? `977${num}` : num;
  return `https://wa.me/${intl}?text=${encodeURIComponent(text)}`;
}

export function SiteWidgets({ whatsappUrl, whatsappNumber, phone, email }: SiteWidgetsProps) {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<
    { from: "bot" | "user"; text: string; link?: { label: string; href: string } }[]
  >([]);
  const [input, setInput] = useState("");
  const [showTop, setShowTop] = useState(false);
  const [launcherPulse, setLauncherPulse] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    history.scrollRestoration = "manual";
    if (window.scrollY > 0) window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
  }, []);

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 480);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setLauncherPulse(open), 4000);
    return () => clearTimeout(t);
  }, [open, launcherPulse]);

  const scrollToTop = useCallback(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "smooth" });
    setOpen(false);
  }, []);

  const pushBot = useCallback((text: string, link?: { label: string; href: string }) => {
    setMessages((m) => [...m, { from: "bot", text, link }]);
  }, []);

  const startChat = useCallback(() => {
    setOpen((o) => {
      const next = !o;
      if (next && messages.length === 0) {
        setTimeout(
          () =>
            pushBot(
              "Hi! I'm the CodAstra Labs assistant. How can I help you today?",
              { label: whatsappUrl || whatsappNumber ? "Chat on WhatsApp" : "Contact the team", href: waLink(whatsappUrl, whatsappNumber, "Hi CodAstra Labs! I'd like to know more about your services.") }
            ),
          250
        );
      }
      setLauncherPulse(false);
      return next;
    });
  }, [messages.length, pushBot, whatsappUrl, whatsappNumber]);

  useEffect(() => {
    const el = scrollRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const answer = (topic: string) => {
    if (topic === "more") {
      pushBot(ANSWERS.more, {
        label: whatsappUrl || whatsappNumber ? "Chat on WhatsApp" : "Contact the team",
        href: waLink(whatsappUrl, whatsappNumber, "Hi CodAstra Labs! I'd like to know more about your services or classes."),
      });
      return;
    }
    pushBot(ANSWERS[topic], {
      label: whatsappUrl || whatsappNumber ? "Chat on WhatsApp" : "Contact the team",
      href: waLink(whatsappUrl, whatsappNumber, `Hi CodAstra Labs! I'm interested in: ${topic}`),
    });
  };

  const send = () => {
    const value = input.trim();
    if (!value) return;
    setInput("");
    setMessages((m) => [...m, { from: "user", text: value }]);
    setTimeout(
      () =>
        pushBot("Thanks for reaching out! To get a fast, tailored answer from our team, continue the conversation with our team.", {
          label: whatsappUrl || whatsappNumber ? "Chat on WhatsApp" : "Contact the team",
          href: waLink(whatsappUrl, whatsappNumber, `Hi CodAstra Labs! ${value}`),
        }),
      350
    );
  };

  return (
    <>
      <button
        type="button"
        onClick={scrollToTop}
        aria-label="Scroll back to top"
        className={cn(
          "fixed bottom-24 right-5 z-40 flex size-11 items-center justify-center rounded-full bg-brand text-white shadow-[0_14px_36px_-12px_rgba(59,130,246,0.8)] transition-all duration-300 hover:bg-primary hover:shadow-[0_18px_44px_-12px_rgba(34,211,238,0.8)]",
          showTop ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
        )}
      >
        <ArrowUp className="size-5" />
      </button>

      <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end gap-3">
        {open ? (
          <div className="flex w-[min(92vw,22.5rem)] flex-col overflow-hidden rounded-2xl gradient-border bg-card shadow-soft">
            <div className="flex items-center justify-between gap-3 border-b border-border/70 bg-gradient-to-r from-primary/20 via-sky-400/10 to-cyan-400/10 px-4 py-3">
              <div className="flex items-center gap-2.5">
                <span className="grid size-9 place-items-center rounded-full bg-brand text-white">
                  <Sparkles className="size-4" />
                </span>
                <div>
                  <p className="text-sm font-semibold text-foreground">CodAstra Assistant</p>
                  <p className="flex items-center gap-1.5 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-success">
                    <span className="size-1.5 rounded-full bg-success" />
                    online
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setOpen(false)}
                aria-label="Close chat"
                className="rounded-full p-1.5 text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>

            <div ref={scrollRef} className="flex h-72 flex-col gap-3 overflow-y-auto px-4 py-4">
              {messages.map((m, i) => (
                <div key={i} className={cn("flex flex-col", m.from === "user" ? "items-end" : "items-start")}>
                  <div
                    className={cn(
                      "max-w-[85%] rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed",
                      m.from === "user"
                        ? "rounded-br-sm bg-brand text-white"
                        : "rounded-bl-sm border border-border/70 bg-muted/40 text-foreground"
                    )}
                  >
                    {m.text}
                  </div>
                  {m.link ? (
                    <a
                      href={m.link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="mt-1.5 inline-flex items-center gap-1.5 rounded-full border border-primary/40 bg-primary/10 px-3 py-1.5 font-mono text-[0.68rem] font-medium uppercase tracking-[0.14em] text-primary transition-colors hover:bg-primary/20"
                    >
                      <MessageCircle className="size-3.5" />
                      {m.link.label}
                    </a>
                  ) : null}
                </div>
              ))}
            </div>

            <div className="border-t border-border/70 px-4 py-3">
              <div className="mb-3 flex flex-wrap gap-2">
                {QUICK_REPLIES.map((q) => (
                  <button
                    key={q.id}
                    type="button"
                    onClick={() => answer(q.id)}
                    className="rounded-full border border-border/70 bg-muted/40 px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:border-primary/50 hover:text-primary"
                  >
                    {q.label}
                  </button>
                ))}
              </div>
              {email || phone ? (
                <p className="mb-3 flex flex-wrap items-center gap-x-3 gap-y-1 font-mono text-[0.68rem] uppercase tracking-[0.14em] text-muted-foreground">
                  {email ? <a href={`mailto:${email}`} className="transition-colors hover:text-primary">{email}</a> : null}
                  {phone ? <a href={`tel:${phone}`} className="transition-colors hover:text-primary">{phone}</a> : null}
                </p>
              ) : null}
              <form
                className="flex items-center gap-2"
                onSubmit={(e) => {
                  e.preventDefault();
                  send();
                }}
              >
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type a message…"
                  aria-label="Chat message"
                  className="h-10 flex-1 rounded-full border border-border/70 bg-background/60 px-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground/60 focus:border-primary/60"
                />
                <button
                  type="submit"
                  aria-label="Send message"
                  className="grid size-10 shrink-0 place-items-center rounded-full bg-brand text-white transition-colors hover:bg-primary"
                >
                  <Send className="size-4" />
                </button>
              </form>
            </div>
          </div>
        ) : null}

        <button
          type="button"
          onClick={startChat}
          aria-label={open ? "Close chat" : "Open chat"}
          className={cn(
            "group flex h-12 shrink-0 items-center overflow-hidden rounded-full bg-brand text-sm font-semibold text-white shadow-[0_16px_40px_-12px_rgba(59,130,246,0.9)] transition-all duration-300 hover:bg-primary hover:shadow-[0_20px_48px_-12px_rgba(34,211,238,0.9)]",
            open
              ? "w-auto gap-2 pl-4 pr-5"
              : "w-12 justify-center hover:w-auto hover:gap-2 hover:pl-4 hover:pr-5"
          )}
        >
          <span className={cn("relative flex shrink-0", !open && "hidden group-hover:flex")}>
            <span className={cn("absolute inline-flex size-full rounded-full bg-success", launcherPulse && "animate-ping-ring")} />
            <span className="relative inline-flex size-2 rounded-full bg-success" />
          </span>
          <span className={cn("whitespace-nowrap", !open && "hidden group-hover:inline")}>
            {open ? "Close chat" : "Chat with us"}
          </span>
          <MessageCircle className="size-4 shrink-0 transition-transform duration-300 group-hover:rotate-12" />
        </button>
      </div>
    </>
  );
}

