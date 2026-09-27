/**
 * ProductService – Supabase implementation
 * Reads/writes to the `public.products` table.
 * Image uploads go to the `product-images` storage bucket.
 */

import { supabase } from "@/lib/supabase";
import { menu as seedMenu, type MenuItem } from "@/data/menu";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export type { MenuItem, Category } from "@/data/menu";
export type CreateProductInput = Omit<MenuItem, "id"> & { id?: string };

// ─── Helpers ──────────────────────────────────────────────────────────────────

/** Convert a Supabase DB row → app MenuItem */
function rowToItem(row: Record<string, unknown>): MenuItem {
  return {
    id: row.id as string,
    name: row.name as string,
    description: row.description as string,
    price: row.price as number,
    category: row.category as string,
    image: row.image as string,
    popular: row.popular as number,
    badge: (row.badge as MenuItem["badge"]) ?? undefined,
    available: row.available as boolean,
    featured: row.featured as boolean,
  };
}

/** Convert MenuItem → Supabase insert/update shape */
function itemToRow(item: Partial<MenuItem>) {
  return {
    ...(item.id !== undefined && { id: item.id }),
    ...(item.name !== undefined && { name: item.name }),
    ...(item.description !== undefined && { description: item.description }),
    ...(item.price !== undefined && { price: item.price }),
    ...(item.category !== undefined && { category: item.category }),
    ...(item.image !== undefined && { image: item.image }),
    ...(item.popular !== undefined && { popular: item.popular }),
    badge: item.badge ?? null,
    ...(item.available !== undefined && { available: item.available }),
    ...(item.featured !== undefined && { featured: item.featured }),
  };
}

// ─── Listener System ─────────────────────────────────────────────────────────

type ProductListener = (products: MenuItem[]) => void;
const listeners: Set<ProductListener> = new Set();
function notifyListeners(products: MenuItem[]) {
  listeners.forEach((fn) => fn(products));
}

// ─── Seed helper ─────────────────────────────────────────────────────────────

let seeded = false;
const FEATURED_IDS = [
  "cake-500-chocolate-cake",
  "cake-500-black-forest-cake",
  "cake-500-chocolate-truffle-cake",
  "veg-extra-cheese-pizza",
  "cheese-burger",
  "chocolate-pastry",
];

async function seedIfEmpty(): Promise<void> {
  if (seeded) return;
  seeded = true;
  const { count } = await supabase
    .from("products")
    .select("id", { count: "exact", head: true });
  if ((count ?? 0) > 0) return;

  const rows = seedMenu.map((item) => ({
    id: item.id,
    name: item.name,
    description: item.description,
    price: item.price,
    category: item.category,
    image: item.image,          // bundled asset path – stored as-is
    popular: item.popular ?? 50,
    badge: item.badge ?? null,
    available: true,
    featured: FEATURED_IDS.includes(item.id),
  }));

  // Insert in batches of 50 to stay under Supabase limits
  for (let i = 0; i < rows.length; i += 50) {
    await supabase.from("products").upsert(rows.slice(i, i + 50));
  }
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const productService = {
  subscribe(listener: ProductListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async getProducts(): Promise<MenuItem[]> {
    await seedIfEmpty();
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .order("created_at", { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToItem);
  },

  async getProduct(id: string): Promise<MenuItem | undefined> {
    const { data, error } = await supabase
      .from("products")
      .select("*")
      .eq("id", id)
      .single();
    if (error) return undefined;
    return rowToItem(data);
  },

  async createProduct(input: CreateProductInput): Promise<MenuItem> {
    const id =
      input.id ||
      `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
    const { data, error } = await supabase
      .from("products")
      .insert({ ...itemToRow(input), id })
      .select()
      .single();
    if (error) throw error;
    const item = rowToItem(data);
    const all = await this.getProducts();
    notifyListeners(all);
    return item;
  },

  async updateProduct(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const { data, error } = await supabase
      .from("products")
      .update(itemToRow(updates))
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    const item = rowToItem(data);
    const all = await this.getProducts();
    notifyListeners(all);
    return item;
  },

  async deleteProduct(id: string): Promise<void> {
    const { error } = await supabase.from("products").delete().eq("id", id);
    if (error) throw error;
    const all = await this.getProducts();
    notifyListeners(all);
  },

  async toggleAvailability(id: string): Promise<MenuItem> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");
    return this.updateProduct(id, { available: !product.available });
  },

  async toggleFeatured(id: string): Promise<MenuItem> {
    const product = await this.getProduct(id);
    if (!product) throw new Error("Product not found");
    return this.updateProduct(id, { featured: !product.featured });
  },

  /** Upload an image file to Supabase Storage and return its public URL */
  async uploadImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const { error } = await supabase.storage
      .from("product-images")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("product-images").getPublicUrl(path);
    return data.publicUrl;
  },
};

// ─── React Hook ───────────────────────────────────────────────────────────────

export function useProducts() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    productService
      .getProducts()
      .then((data) => {
        if (mounted) { setProducts(data); setLoading(false); }
      })
      .catch((err) => {
        if (mounted) { setError(String(err.message)); setLoading(false); }
      });

    const unsub = productService.subscribe((updated) => {
      if (mounted) setProducts(updated);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { products, loading, error };
}
