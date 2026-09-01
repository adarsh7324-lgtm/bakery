import { ArrowUp, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useCart, useCartTotals } from "@/lib/store";

interface FloatingActionsProps {
  onChatOpen?: () => void;
}

export function FloatingActions({ onChatOpen }: FloatingActionsProps) {
  const [showTop, setShowTop] = useState(false);
  const setOpen = useCart((s) => s.setOpen);
  const { count } = useCartTotals();

  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 500);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-center gap-3">
      {showTop ? (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          className="grid h-11 w-11 place-items-center rounded-full border border-border bg-card shadow-soft transition hover:-translate-y-1"
        >
          <ArrowUp className="h-4 w-4" />
        </button>
      ) : null}
      <button
        type="button"
        aria-label="Open cart"
        onClick={() => setOpen(true)}
        className="relative grid h-12 w-12 place-items-center rounded-full bg-primary text-primary-foreground shadow-lift transition hover:-translate-y-1"
      >
        <ShoppingBag className="h-5 w-5" />
        {count > 0 ? (
          <span className="absolute -right-1 -top-1 grid h-6 min-w-6 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-primary">
            {count}
          </span>
        ) : null}
      </button>
    </div>
  );
}
