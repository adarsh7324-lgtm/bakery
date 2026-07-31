import { createFileRoute, Link } from "@tanstack/react-router";
import { Minus, Plus, ShoppingBag, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { SectionHeading } from "@/components/reveal";
import { inr } from "@/data/menu";
import { useCart, useCartTotals } from "@/lib/store";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Cart | Shree Bakers" },
      {
        name: "description",
        content: "Review your Shree Bakers order, apply a coupon and proceed to checkout.",
      },
      { property: "og:title", content: "Your Cart | Shree Bakers" },
      { property: "og:description", content: "Review your bakery order before checkout." },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const coupon = useCart((s) => s.coupon);
  const { subtotal, discount, gst, delivery, total } = useCartTotals();
  const [code, setCode] = useState("");

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading eyebrow="Cart" title="Your order" />

      {lines.length === 0 ? (
        <div className="mt-14 rounded-3xl border border-border/70 bg-card p-14 text-center shadow-soft">
          <ShoppingBag className="mx-auto h-10 w-10 text-caramel" />
          <p className="mt-4 text-muted-foreground">Your cart is empty.</p>
          <Button asChild className="mt-6 rounded-full px-8 font-semibold">
            <Link to="/menu">Explore Menu</Link>
          </Button>
        </div>
      ) : (
        <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]">
          <ul className="space-y-4">
            {lines.map((l) => (
              <li
                key={l.id}
                className="flex gap-4 rounded-3xl border border-border/70 bg-card p-4 shadow-soft"
              >
                <img
                  src={l.image}
                  alt={l.name}
                  loading="lazy"
                  width={112}
                  height={112}
                  className="h-24 w-24 shrink-0 rounded-2xl object-cover sm:h-28 sm:w-28"
                />
                <div className="grid min-w-0 flex-1 grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-semibold">{l.name}</p>
                    <p className="mt-1 text-sm text-caramel">{inr(l.price)}</p>
                    <div className="mt-3 flex items-center gap-2">
                      <div className="flex items-center gap-1 rounded-full border border-border px-1 py-1">
                        <button
                          type="button"
                          aria-label={`Decrease ${l.name}`}
                          onClick={() => setQty(l.id, l.qty - 1)}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="w-7 text-center text-sm font-semibold">{l.qty}</span>
                        <button
                          type="button"
                          aria-label={`Increase ${l.name}`}
                          onClick={() => setQty(l.id, l.qty + 1)}
                          className="grid h-7 w-7 place-items-center rounded-full hover:bg-secondary"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <button
                        type="button"
                        aria-label={`Remove ${l.name}`}
                        onClick={() => remove(l.id)}
                        className="grid h-9 w-9 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <p className="font-display text-lg font-bold">{inr(l.price * l.qty)}</p>
                </div>
              </li>
            ))}
          </ul>

          <aside className="h-fit rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <h2 className="font-display text-xl font-bold">Order Summary</h2>
            <form
              className="mt-5 flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                if (applyCoupon(code)) toast.success("Coupon applied!");
                else toast.error("Invalid coupon code");
                setCode("");
              }}
            >
              <Input
                value={code}
                onChange={(e) => setCode(e.target.value)}
                placeholder="Coupon code"
                aria-label="Coupon code"
                className="rounded-full"
              />
              <Button type="submit" variant="secondary" className="rounded-full font-semibold">
                Apply
              </Button>
            </form>
            <dl className="mt-5 space-y-2 text-sm">
              <Row label="Subtotal" value={inr(subtotal)} />
              {discount > 0 ? <Row label={`Discount (${coupon})`} value={`- ${inr(discount)}`} /> : null}
              <Row label="GST (5%)" value={inr(gst)} />
              <Row label="Delivery" value={delivery === 0 ? "Free" : inr(delivery)} />
              <div className="flex items-center justify-between border-t border-border pt-4">
                <dt className="font-display text-lg font-bold">Grand Total</dt>
                <dd className="font-display text-lg font-bold text-caramel">{inr(total)}</dd>
              </div>
            </dl>
            <Button asChild size="lg" className="mt-6 w-full rounded-full font-semibold">
              <Link to="/checkout">Proceed to Checkout</Link>
            </Button>
          </aside>
        </div>
      )}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
