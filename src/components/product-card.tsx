import { motion } from "motion/react";
import { Heart, Minus, Plus, ShoppingBag } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { inr, type MenuItem } from "@/data/menu";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

export function ProductCard({
  item,
  withQty = false,
  index = 0,
}: {
  item: MenuItem;
  withQty?: boolean;
  index?: number;
}) {
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.add);
  const view = useCart((s) => s.view);
  const wishlist = useCart((s) => s.wishlist);
  const toggleWishlist = useCart((s) => s.toggleWishlist);
  const wished = wishlist.includes(item.id);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15 }}
      transition={{ duration: 0.5, delay: Math.min(index * 0.05, 0.3) }}
      className="hover-lift group flex h-full flex-col overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft"
    >
      <div className="relative aspect-[4/3] overflow-hidden bg-secondary">
        <img
          src={item.image}
          alt={item.name}
          loading="lazy"
          width={900}
          height={675}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {item.available === false ? (
          <span className="absolute left-4 top-4 rounded-full bg-destructive text-destructive-foreground px-3 py-1 text-[11px] font-bold uppercase tracking-wider shadow-md">
            Sold Out
          </span>
        ) : item.badge ? (
          <span
            className={cn(
              "absolute left-4 top-4 rounded-full px-3 py-1 text-[11px] font-semibold tracking-wide",
              item.badge === "20% OFF"
                ? "bg-destructive text-destructive-foreground"
                : "bg-gold text-primary",
            )}
          >
            {item.badge}
          </span>
        ) : null}
        <button
          type="button"
          aria-label={wished ? `Remove ${item.name} from wishlist` : `Add ${item.name} to wishlist`}
          onClick={() => toggleWishlist(item.id)}
          className="absolute right-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-card/85 backdrop-blur transition hover:bg-card"
        >
          <Heart
            className={cn("h-4 w-4", wished ? "fill-destructive text-destructive" : "text-foreground")}
          />
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-semibold leading-snug">{item.name}</h3>
        <p className="line-clamp-2 text-sm text-muted-foreground">{item.description}</p>
        <div className="mt-auto flex items-center justify-between gap-3 pt-2">
          <span className="font-display text-xl font-bold text-caramel">{inr(item.price)}</span>
          {withQty ? (
            <div className="flex items-center gap-1 rounded-full border border-border px-1 py-1">
              <button
                type="button"
                aria-label="Decrease quantity"
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
              >
                <Minus className="h-3.5 w-3.5" />
              </button>
              <span className="w-6 text-center text-sm font-semibold">{qty}</span>
              <button
                type="button"
                aria-label="Increase quantity"
                onClick={() => setQty((q) => q + 1)}
                className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
              >
                <Plus className="h-3.5 w-3.5" />
              </button>
            </div>
          ) : null}
        </div>
        <Button
          className="w-full rounded-full font-semibold"
          disabled={item.available === false}
          onClick={() => {
            if (item.available === false) return;
            add(item, qty);
            view(item.id);
            toast.success(`${item.name} added to cart`);
          }}
        >
          <ShoppingBag className="mr-2 h-4 w-4" />{" "}
          {item.available === false ? "Sold Out" : "Add to Cart"}
        </Button>
      </div>
    </motion.article>
  );
}
