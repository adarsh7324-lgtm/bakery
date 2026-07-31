import { create } from "zustand";
import type { MenuItem } from "@/data/menu";

export type CartLine = {
  id: string;
  name: string;
  price: number;
  image: string;
  qty: number;
};

type CartState = {
  lines: CartLine[];
  open: boolean;
  coupon: string | null;
  wishlist: string[];
  recent: string[];
  setOpen: (open: boolean) => void;
  add: (item: MenuItem, qty?: number) => void;
  remove: (id: string) => void;
  setQty: (id: string, qty: number) => void;
  clear: () => void;
  applyCoupon: (code: string) => boolean;
  toggleWishlist: (id: string) => void;
  view: (id: string) => void;
};

export const COUPONS: Record<string, number> = {
  SHREE10: 0.1,
  SWEET20: 0.2,
};

export const useCart = create<CartState>((set, get) => ({
  lines: [],
  open: false,
  coupon: null,
  wishlist: [],
  recent: [],
  setOpen: (open) => set({ open }),
  add: (item, qty = 1) =>
    set((s) => {
      const existing = s.lines.find((l) => l.id === item.id);
      const lines = existing
        ? s.lines.map((l) => (l.id === item.id ? { ...l, qty: l.qty + qty } : l))
        : [
            ...s.lines,
            { id: item.id, name: item.name, price: item.price, image: item.image, qty },
          ];
      return { lines, open: true };
    }),
  remove: (id) => set((s) => ({ lines: s.lines.filter((l) => l.id !== id) })),
  setQty: (id, qty) =>
    set((s) => ({
      lines: s.lines
        .map((l) => (l.id === id ? { ...l, qty: Math.max(0, qty) } : l))
        .filter((l) => l.qty > 0),
    })),
  clear: () => set({ lines: [], coupon: null }),
  applyCoupon: (code) => {
    const key = code.trim().toUpperCase();
    if (COUPONS[key]) {
      set({ coupon: key });
      return true;
    }
    return false;
  },
  toggleWishlist: (id) =>
    set((s) => ({
      wishlist: s.wishlist.includes(id)
        ? s.wishlist.filter((w) => w !== id)
        : [...s.wishlist, id],
    })),
  view: (id) =>
    set((s) => ({ recent: [id, ...s.recent.filter((r) => r !== id)].slice(0, 6) })),
}));

export function useCartTotals() {
  const lines = useCart((s) => s.lines);
  const coupon = useCart((s) => s.coupon);
  const subtotal = lines.reduce((sum, l) => sum + l.price * l.qty, 0);
  const discount = coupon ? Math.round(subtotal * (COUPONS[coupon] ?? 0)) : 0;
  const taxed = subtotal - discount;
  const gst = Math.round(taxed * 0.05);
  const delivery = subtotal === 0 || subtotal >= 499 ? 0 : 40;
  const total = taxed + gst + delivery;
  const count = lines.reduce((n, l) => n + l.qty, 0);
  return { subtotal, discount, gst, delivery, total, count };
}
