import { Link } from "@tanstack/react-router";
import { AnimatePresence, motion } from "motion/react";
import { Minus, Plus, ShoppingBag, Trash2, X } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inr } from "@/data/menu";
import { useCart, useCartTotals } from "@/lib/store";

export function CartDrawer() {
  const open = useCart((s) => s.open);
  const setOpen = useCart((s) => s.setOpen);
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const applyCoupon = useCart((s) => s.applyCoupon);
  const coupon = useCart((s) => s.coupon);
  const { subtotal, discount, gst, delivery, total } = useCartTotals();
  const [code, setCode] = useState("");

  return (
    <AnimatePresence>
      {open ? (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[60] bg-foreground/40 backdrop-blur-sm"
          />
          <motion.aside
            role="dialog"
            aria-label="Shopping cart"
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", stiffness: 260, damping: 30 }}
            className="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-md flex-col bg-background shadow-lift sm:rounded-l-3xl"
          >
            <div className="flex items-center justify-between border-b border-border px-5 py-4">
              <h2 className="font-display text-xl font-bold">Your Cart</h2>
              <button
                type="button"
                aria-label="Close cart"
                onClick={() => setOpen(false)}
                className="grid h-9 w-9 place-items-center rounded-full hover:bg-secondary"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-5 py-4">
              {lines.length === 0 ? (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <ShoppingBag className="mx-auto h-10 w-10 text-caramel" />
                    <p className="mt-4 text-sm text-muted-foreground">Your cart is empty.</p>
                    <Button asChild className="mt-4 rounded-full font-semibold">
                      <Link to="/menu" onClick={() => setOpen(false)}>
                        Explore Menu
                      </Link>
                    </Button>
                  </div>
                </div>
              ) : (
                <ul className="space-y-4">
                  {lines.map((l) => (
                    <li
                      key={l.id}
                      className="flex gap-3 rounded-2xl border border-border/70 bg-card p-3"
                    >
                      <img
                        src={l.image}
                        alt={l.name}
                        loading="lazy"
                        width={80}
                        height={80}
                        className="h-20 w-20 shrink-0 rounded-xl object-cover"
                      />
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-semibold">{l.name}</p>
                        <p className="text-sm text-caramel">{inr(l.price)}</p>
                        <div className="mt-2 flex items-center gap-2">
                          <div className="flex items-center gap-1 rounded-full border border-border px-1 py-1">
                            <button
                              type="button"
                              aria-label={`Decrease ${l.name}`}
                              onClick={() => setQty(l.id, l.qty - 1)}
                              className="grid h-6 w-6 place-items-center rounded-full hover:bg-secondary"
                            >
                              <Minus className="h-3 w-3" />
                            </button>
                            <span className="w-6 text-center text-xs font-semibold">{l.qty}</span>
                            <button
                              type="button"
                              aria-label={`Increase ${l.name}`}
                              onClick={() => setQty(l.id, l.qty + 1)}
                              className="grid h-6 w-6 place-items-center rounded-full hover:bg-secondary"
                            >
                              <Plus className="h-3 w-3" />
                            </button>
                          </div>
                          <button
                            type="button"
                            aria-label={`Remove ${l.name}`}
                            onClick={() => remove(l.id)}
                            className="grid h-8 w-8 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {lines.length > 0 ? (
              <div className="border-t border-border px-5 py-4">
                <form
                  className="flex gap-2"
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
                    placeholder="Coupon code (SHREE10)"
                    aria-label="Coupon code"
                    className="rounded-full"
                  />
                  <Button type="submit" variant="secondary" className="rounded-full font-semibold">
                    Apply
                  </Button>
                </form>

                <dl className="mt-4 space-y-1.5 text-sm">
                  <Row label="Subtotal" value={inr(subtotal)} />
                  {discount > 0 ? (
                    <Row label={`Discount (${coupon})`} value={`- ${inr(discount)}`} />
                  ) : null}
                  <Row label="GST (5%)" value={inr(gst)} />
                  <Row label="Delivery" value={delivery === 0 ? "Free" : inr(delivery)} />
                  <div className="mt-2 flex items-center justify-between border-t border-border pt-3">
                    <dt className="font-display text-lg font-bold">Grand Total</dt>
                    <dd className="font-display text-lg font-bold text-caramel">{inr(total)}</dd>
                  </div>
                </dl>

                <Button asChild className="mt-4 w-full rounded-full font-semibold">
                  <Link to="/checkout" onClick={() => setOpen(false)}>
                    Proceed to Checkout
                  </Link>
                </Button>
              </div>
            ) : null}
          </motion.aside>
        </>
      ) : null}
    </AnimatePresence>
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
