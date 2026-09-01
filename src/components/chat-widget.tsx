import { useState } from "react";
import { MessageCircle, X, ArrowLeft, ChevronRight } from "lucide-react";
import { useVisibleFAQs, type FAQ } from "@/services/faqService";
import { cn } from "@/lib/utils";

type View = "list" | "answer";

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [view, setView] = useState<View>("list");
  const [selectedFAQ, setSelectedFAQ] = useState<FAQ | null>(null);
  const { faqs, loading } = useVisibleFAQs();

  const handleSelectQuestion = (faq: FAQ) => {
    setSelectedFAQ(faq);
    setView("answer");
  };

  const handleBack = () => {
    setView("list");
    setSelectedFAQ(null);
  };

  const handleClose = () => {
    setOpen(false);
    setTimeout(() => {
      setView("list");
      setSelectedFAQ(null);
    }, 300);
  };

  return (
    <>
      {/* ── Floating Button ── */}
      <button
        id="chat-widget-trigger"
        aria-label="Open FAQ help chat"
        onClick={() => setOpen(true)}
        className={cn(
          "fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full shadow-lift",
          "bg-[#4a2910] text-white transition-all duration-300",
          "hover:scale-110 hover:shadow-[0_8px_30px_rgba(74,41,16,0.45)]",
          "focus:outline-none focus-visible:ring-2 focus-visible:ring-[#4a2910]/60 focus-visible:ring-offset-2",
          open && "opacity-0 pointer-events-none scale-75",
        )}
      >
        <MessageCircle className="h-6 w-6" strokeWidth={1.8} />
        {/* Ping dot */}
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-caramel border-2 border-white animate-ping" />
        <span className="absolute -top-0.5 -right-0.5 h-3 w-3 rounded-full bg-caramel border-2 border-white" />
      </button>

      {/* ── Chat Panel ── */}
      <div
        role="dialog"
        aria-modal="true"
        aria-label="FAQ Help Assistant"
        className={cn(
          "fixed bottom-6 right-6 z-50 w-[calc(100vw-3rem)] max-w-sm",
          "flex flex-col rounded-3xl border border-border/80 bg-card shadow-[0_20px_60px_rgba(0,0,0,0.18)]",
          "transition-all duration-300 origin-bottom-right",
          open
            ? "opacity-100 scale-100 translate-y-0 pointer-events-auto"
            : "opacity-0 scale-90 translate-y-4 pointer-events-none",
        )}
        style={{ maxHeight: "min(520px, calc(100dvh - 6rem))" }}
      >
        {/* Header */}
        <div className="flex items-start justify-between rounded-t-3xl bg-[#4a2910] px-5 py-4 text-white">
          <div>
            <p className="font-display text-base font-bold leading-tight">
              How can we help?
            </p>
            <p className="mt-0.5 text-xs text-white/70">
              {view === "list"
                ? "Choose a question below"
                : "Here's what we found"}
            </p>
          </div>
          <button
            aria-label="Close chat"
            onClick={handleClose}
            className="ml-2 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-white/15 transition hover:bg-white/30"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain">
          {/* ── List View ── */}
          {view === "list" && (
            <div className="p-4 space-y-2">
              {loading ? (
                <div className="space-y-2 py-2">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <div key={i} className="h-12 animate-pulse rounded-2xl bg-secondary" />
                  ))}
                </div>
              ) : faqs.length === 0 ? (
                <p className="py-6 text-center text-sm text-muted-foreground">
                  No questions available right now.
                </p>
              ) : (
                faqs.map((faq) => (
                  <button
                    key={faq.id}
                    onClick={() => handleSelectQuestion(faq)}
                    className="group flex w-full items-center justify-between rounded-2xl border border-border/70 bg-background px-4 py-3 text-left text-sm font-medium transition-all hover:border-[#4a2910]/40 hover:bg-[#4a2910]/5 active:scale-[0.98]"
                  >
                    <span className="min-w-0 leading-snug pr-2">{faq.question}</span>
                    <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground transition group-hover:translate-x-0.5 group-hover:text-[#4a2910]" />
                  </button>
                ))
              )}
            </div>
          )}

          {/* ── Answer View ── */}
          {view === "answer" && selectedFAQ && (
            <div className="flex flex-col p-4 gap-4">
              {/* Question bubble */}
              <div className="ml-auto max-w-[85%] rounded-2xl rounded-tr-sm bg-[#4a2910] px-4 py-3 text-sm text-white">
                {selectedFAQ.question}
              </div>

              {/* Answer bubble */}
              <div className="mr-auto max-w-[92%] rounded-2xl rounded-tl-sm border border-border/60 bg-secondary px-4 py-3 text-sm text-foreground leading-relaxed">
                {selectedFAQ.answer}
              </div>

              {/* Back button */}
              <button
                onClick={handleBack}
                className="flex items-center gap-1.5 self-start text-xs font-semibold text-[#4a2910] hover:underline mt-1"
              >
                <ArrowLeft className="h-3.5 w-3.5" />
                Back to questions
              </button>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t border-border/60 px-5 py-3 text-center">
          <p className="text-[11px] text-muted-foreground">
            Need more help?{" "}
            <a
              href="https://wa.me/917618000036"
              target="_blank"
              rel="noopener noreferrer"
              className="font-semibold text-[#4a2910] hover:underline"
            >
              WhatsApp us
            </a>
          </p>
        </div>
      </div>
    </>
  );
}
