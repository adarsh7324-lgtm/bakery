/**
 * FAQService Abstraction
 * Local/Mock implementation using localStorage with seed data fallback.
 * Designed to be swapped with Supabase seamlessly — only this file changes.
 *
 * Architecture:
 *   Customer Chat UI → faqService → localStorage
 *   Admin FAQ Panel  → faqService → localStorage
 *
 * Future:
 *   Customer Chat UI → faqService → Supabase
 *   Admin FAQ Panel  → faqService → Supabase
 */

import { useEffect, useState } from "react";

const FAQ_STORAGE_KEY = "shree_bakers_faqs_v1";

export type FAQCategory =
  | "General"
  | "Products"
  | "Cakes"
  | "Delivery"
  | "Orders"
  | "Payments";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: FAQCategory;
  visible: boolean;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export type CreateFAQInput = Omit<FAQ, "id" | "createdAt" | "updatedAt">;

// ─── Seed Data ───────────────────────────────────────────────────────────────
// These are realistic placeholder FAQs for demonstration.
// They can be edited/removed from the admin panel.
const SEED_FAQS: FAQ[] = [
  {
    id: "faq-1",
    question: "How long does a cake stay fresh?",
    answer:
      "Our cakes stay fresh for 2-3 days at room temperature and up to 5 days when refrigerated. For best taste, consume within 24 hours of delivery. Store in a cool, dry place away from direct sunlight.",
    category: "Products",
    visible: true,
    order: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-2",
    question: "What is the delivery time?",
    answer:
      "We usually deliver within 2-4 hours depending on your location and order time. Orders placed after 8 PM may be scheduled for the next morning. We deliver across Lanka and nearby areas in Varanasi.",
    category: "Delivery",
    visible: true,
    order: 2,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-3",
    question: "Do you offer same-day delivery?",
    answer:
      "Yes! We offer same-day delivery for orders placed before 6 PM. For custom cakes or large orders, we recommend placing your order at least 24-48 hours in advance to ensure freshness and quality.",
    category: "Delivery",
    visible: true,
    order: 3,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-4",
    question: "Can I customize a cake?",
    answer:
      "Absolutely! We love creating custom cakes. You can customize the flavor, size, design, message, and frosting. Please contact us at least 48 hours in advance for custom orders. Call or WhatsApp us to discuss your requirements.",
    category: "Cakes",
    visible: true,
    order: 4,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-5",
    question: "Do you have eggless cakes?",
    answer:
      "Yes, we offer a wide variety of eggless cakes that are just as delicious! Our eggless options include chocolate, vanilla, red velvet, butterscotch, pineapple, and more. Just mention your preference when ordering.",
    category: "Cakes",
    visible: true,
    order: 5,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-6",
    question: "What payment methods do you accept?",
    answer:
      "We accept Cash on Delivery (COD), UPI payments (Google Pay, PhonePe, Paytm), and all major credit/debit cards. For large custom orders, we may request an advance payment to confirm the booking.",
    category: "Payments",
    visible: true,
    order: 6,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-7",
    question: "How early should I place a cake order?",
    answer:
      "For standard cakes, same-day or next-day ordering is fine. For custom designed cakes, fondant cakes, or bulk orders, please place your order at least 2-3 days in advance so we can prepare it with care.",
    category: "Orders",
    visible: true,
    order: 7,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: "faq-8",
    question: "Do you deliver to my area?",
    answer:
      "We currently deliver across Lanka, BHU, Assi, Sunderpur, and nearby areas in Varanasi. If you are unsure about your area, please WhatsApp us at +91 76180 00036 and we will confirm availability for your location.",
    category: "Delivery",
    visible: true,
    order: 8,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

// ─── Listener System (Reactive updates across UI) ────────────────────────────
type FAQListener = (faqs: FAQ[]) => void;
const listeners: Set<FAQListener> = new Set();

function notifyListeners(faqs: FAQ[]) {
  listeners.forEach((fn) => fn(faqs));
}

// ─── Core Init ───────────────────────────────────────────────────────────────
function initializeFAQs(): FAQ[] {
  if (typeof window === "undefined") return SEED_FAQS;
  try {
    const stored = localStorage.getItem(FAQ_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {
    console.error("Failed to parse FAQs from localStorage", e);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(SEED_FAQS));
  }
  return SEED_FAQS;
}

function persist(faqs: FAQ[]) {
  if (typeof window !== "undefined") {
    localStorage.setItem(FAQ_STORAGE_KEY, JSON.stringify(faqs));
  }
  notifyListeners(faqs);
}

// ─── Service API ─────────────────────────────────────────────────────────────
export const faqService = {
  subscribe(listener: FAQListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** Get all FAQs (admin use - includes hidden) */
  async getAllFAQs(): Promise<FAQ[]> {
    return initializeFAQs().sort((a, b) => a.order - b.order);
  },

  /** Get only visible FAQs (customer use) */
  async getVisibleFAQs(): Promise<FAQ[]> {
    const all = initializeFAQs();
    return all.filter((f) => f.visible).sort((a, b) => a.order - b.order);
  },

  async getFAQ(id: string): Promise<FAQ | undefined> {
    const all = initializeFAQs();
    return all.find((f) => f.id === id);
  },

  async createFAQ(input: CreateFAQInput): Promise<FAQ> {
    const all = initializeFAQs();
    const maxOrder = all.length > 0 ? Math.max(...all.map((f) => f.order)) : 0;
    const newFAQ: FAQ = {
      ...input,
      id: `faq-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      order: input.order ?? maxOrder + 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [...all, newFAQ];
    persist(updated);
    return newFAQ;
  },

  async updateFAQ(id: string, updates: Partial<Omit<FAQ, "id" | "createdAt">>): Promise<FAQ> {
    const all = initializeFAQs();
    let updatedFAQ: FAQ | undefined;
    const updated = all.map((f) => {
      if (f.id === id) {
        updatedFAQ = { ...f, ...updates, updatedAt: new Date().toISOString() };
        return updatedFAQ;
      }
      return f;
    });
    if (!updatedFAQ) throw new Error(`FAQ ${id} not found`);
    persist(updated);
    return updatedFAQ;
  },

  async deleteFAQ(id: string): Promise<void> {
    const all = initializeFAQs();
    const filtered = all.filter((f) => f.id !== id);
    persist(filtered);
  },

  async toggleVisibility(id: string): Promise<FAQ> {
    const faq = await this.getFAQ(id);
    if (!faq) throw new Error(`FAQ ${id} not found`);
    return this.updateFAQ(id, { visible: !faq.visible });
  },

  async reorderFAQs(orderedIds: string[]): Promise<void> {
    const all = initializeFAQs();
    const reordered = all.map((f) => {
      const newOrder = orderedIds.indexOf(f.id);
      return { ...f, order: newOrder >= 0 ? newOrder + 1 : f.order };
    });
    persist(reordered);
  },

  async moveFAQ(id: string, direction: "up" | "down"): Promise<void> {
    const all = initializeFAQs().sort((a, b) => a.order - b.order);
    const idx = all.findIndex((f) => f.id === id);
    if (idx === -1) return;

    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= all.length) return;

    const newOrder = [...all];
    const tempOrder = newOrder[idx].order;
    newOrder[idx] = { ...newOrder[idx], order: newOrder[swapIdx].order };
    newOrder[swapIdx] = { ...newOrder[swapIdx], order: tempOrder };
    persist(newOrder);
  },
};

// ─── React Hooks ─────────────────────────────────────────────────────────────

/** All FAQs (admin use) */
export function useAllFAQs() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    faqService.getAllFAQs().then((data) => {
      if (mounted) { setFAQs(data); setLoading(false); }
    });
    const unsub = faqService.subscribe((updated) => {
      if (mounted) setFAQs([...updated].sort((a, b) => a.order - b.order));
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { faqs, loading };
}

/** Visible FAQs only (customer use) */
export function useVisibleFAQs() {
  const [faqs, setFAQs] = useState<FAQ[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    faqService.getVisibleFAQs().then((data) => {
      if (mounted) { setFAQs(data); setLoading(false); }
    });
    const unsub = faqService.subscribe((updated) => {
      if (mounted) {
        setFAQs(
          [...updated].filter((f) => f.visible).sort((a, b) => a.order - b.order)
        );
      }
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { faqs, loading };
}
