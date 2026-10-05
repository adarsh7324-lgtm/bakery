/**
 * FAQService – Supabase implementation
 * Reads/writes to the `public.faqs` table.
 */

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToFAQ(row: any): FAQ {
  return {
    id: row.id as string,
    question: row.question as string,
    answer: row.answer as string,
    category: row.category as FAQCategory,
    visible: row.visible as boolean,
    order: row.order as number,
    createdAt: row.created_at as string,
    updatedAt: row.updated_at as string,
  };
}

// ─── Seed Data ───────────────────────────────────────────────────────────────

const SEED_FAQS = [
  { question: "How long does a cake stay fresh?", answer: "Our cakes stay fresh for 2-3 days at room temperature and up to 5 days when refrigerated. For best taste, consume within 24 hours of delivery. Store in a cool, dry place away from direct sunlight.", category: "Products" as FAQCategory, visible: true, order: 1 },
  { question: "What is the delivery time?", answer: "We usually deliver within 2-4 hours depending on your location and order time. Orders placed after 8 PM may be scheduled for the next morning. We deliver across Lanka and nearby areas in Varanasi.", category: "Delivery" as FAQCategory, visible: true, order: 2 },
  { question: "Do you offer same-day delivery?", answer: "Yes! We offer same-day delivery for orders placed before 6 PM. For custom cakes or large orders, we recommend placing your order at least 24-48 hours in advance to ensure freshness and quality.", category: "Delivery" as FAQCategory, visible: true, order: 3 },
  { question: "Can I customize a cake?", answer: "Absolutely! We love creating custom cakes. You can customize the flavor, size, design, message, and frosting. Please contact us at least 48 hours in advance for custom orders. Call or WhatsApp us to discuss your requirements.", category: "Cakes" as FAQCategory, visible: true, order: 4 },
  { question: "Do you have eggless cakes?", answer: "Yes, we offer a wide variety of eggless cakes that are just as delicious! Our eggless options include chocolate, vanilla, red velvet, butterscotch, pineapple, and more. Just mention your preference when ordering.", category: "Cakes" as FAQCategory, visible: true, order: 5 },
  { question: "What payment methods do you accept?", answer: "We accept Cash on Delivery (COD), UPI payments (Google Pay, PhonePe, Paytm), and all major credit/debit cards. For large custom orders, we may request an advance payment to confirm the booking.", category: "Payments" as FAQCategory, visible: true, order: 6 },
  { question: "How early should I place a cake order?", answer: "For standard cakes, same-day or next-day ordering is fine. For custom designed cakes, fondant cakes, or bulk orders, please place your order at least 2-3 days in advance so we can prepare it with care.", category: "Orders" as FAQCategory, visible: true, order: 7 },
  { question: "Do you deliver to my area?", answer: "We currently deliver across Lanka, BHU, Assi, Sunderpur, and nearby areas in Varanasi. If you are unsure about your area, please WhatsApp us at +91 76180 00036 and we will confirm availability for your location.", category: "Delivery" as FAQCategory, visible: true, order: 8 },
];

// ─── Listener System ─────────────────────────────────────────────────────────

type FAQListener = (faqs: FAQ[]) => void;
const listeners: Set<FAQListener> = new Set();
function notifyListeners(faqs: FAQ[]) {
  listeners.forEach((fn) => fn(faqs));
}

// ─── Seed helper ─────────────────────────────────────────────────────────────

let seeded = false;
async function seedIfEmpty(): Promise<void> {
  if (seeded) return;
  seeded = true;
  const { count } = await supabase
    .from("faqs")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;
  await supabase.from("faqs").insert(SEED_FAQS);
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const faqService = {
  subscribe(listener: FAQListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  /** All FAQs sorted by order (admin use – includes hidden) */
  async getAllFAQs(): Promise<FAQ[]> {
    await seedIfEmpty();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .order("order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToFAQ);
  },

  /** Only visible FAQs (customer use) */
  async getVisibleFAQs(): Promise<FAQ[]> {
    await seedIfEmpty();
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("visible", true)
      .order("order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToFAQ);
  },

  async getFAQ(id: string): Promise<FAQ | undefined> {
    const { data, error } = await supabase
      .from("faqs")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return rowToFAQ(data);
  },

  async createFAQ(input: CreateFAQInput): Promise<FAQ> {
    const { data, error } = await supabase
      .from("faqs")
      .insert({
        question: input.question,
        answer: input.answer,
        category: input.category,
        visible: input.visible ?? true,
        order: input.order ?? 0,
      })
      .select()
      .single();
    if (error) throw error;
    const faq = rowToFAQ(data);
    const all = await this.getAllFAQs();
    notifyListeners(all);
    return faq;
  },

  async updateFAQ(
    id: string,
    updates: Partial<Omit<FAQ, "id" | "createdAt">>
  ): Promise<FAQ> {
    const { data, error } = await supabase
      .from("faqs")
      .update({
        ...(updates.question !== undefined && { question: updates.question }),
        ...(updates.answer !== undefined && { answer: updates.answer }),
        ...(updates.category !== undefined && { category: updates.category }),
        ...(updates.visible !== undefined && { visible: updates.visible }),
        ...(updates.order !== undefined && { order: updates.order }),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    const faq = rowToFAQ(data);
    const all = await this.getAllFAQs();
    notifyListeners(all);
    return faq;
  },

  async deleteFAQ(id: string): Promise<void> {
    const { error } = await supabase.from("faqs").delete().eq("id", id);
    if (error) throw error;
    const all = await this.getAllFAQs();
    notifyListeners(all);
  },

  async toggleVisibility(id: string): Promise<FAQ> {
    const faq = await this.getFAQ(id);
    if (!faq) throw new Error(`FAQ ${id} not found`);
    return this.updateFAQ(id, { visible: !faq.visible });
  },

  async reorderFAQs(orderedIds: string[]): Promise<void> {
    // Batch update order values
    const updates = orderedIds.map((id, idx) =>
      supabase.from("faqs").update({ order: idx + 1 }).eq("id", id)
    );
    await Promise.all(updates);
    const all = await this.getAllFAQs();
    notifyListeners(all);
  },

  async moveFAQ(id: string, direction: "up" | "down"): Promise<void> {
    const all = await this.getAllFAQs();
    const idx = all.findIndex((f) => f.id === id);
    if (idx === -1) return;
    const swapIdx = direction === "up" ? idx - 1 : idx + 1;
    if (swapIdx < 0 || swapIdx >= all.length) return;

    const a = all[idx];
    const b = all[swapIdx];
    if (!a || !b) return;
    await Promise.all([
      supabase.from("faqs").update({ order: b.order }).eq("id", a.id),
      supabase.from("faqs").update({ order: a.order }).eq("id", b.id),
    ]);
    const updated = await this.getAllFAQs();
    notifyListeners(updated);
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
