/**
 * ProductService Abstraction
 * Local/Mock implementation for development & testing using localStorage with seed fallback.
 * Designed to be swapped with Supabase client (Supabase DB + Supabase Storage) seamlessly.
 */

import { menu as initialSeedMenu, type MenuItem, type Category } from "@/data/menu";
import { useEffect, useState } from "react";

const PRODUCTS_STORAGE_KEY = "shree_bakers_products_v1";

type ProductListener = (products: MenuItem[]) => void;
const listeners: Set<ProductListener> = new Set();

function notifyListeners(products: MenuItem[]) {
  listeners.forEach((listener) => listener(products));
}

function initializeProducts(): MenuItem[] {
  if (typeof window === "undefined") return initialSeedMenu;
  try {
    const stored = localStorage.getItem(PRODUCTS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error("Failed to parse local products, resetting to seed", err);
  }

  // Ensure default available & featured flags on seed
  const seeded = initialSeedMenu.map((item) => ({
    ...item,
    available: item.available ?? true,
    featured: item.featured ?? [
      "cake-500-chocolate-cake",
      "cake-500-black-forest-cake",
      "cake-500-chocolate-truffle-cake",
      "veg-extra-cheese-pizza",
      "cheese-burger",
      "chocolate-pastry",
    ].includes(item.id),
  }));

  if (typeof window !== "undefined") {
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(seeded));
  }
  return seeded;
}

export type CreateProductInput = Omit<MenuItem, "id"> & { id?: string };

export const productService = {
  subscribe(listener: ProductListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async getProducts(): Promise<MenuItem[]> {
    return initializeProducts();
  },

  async getProduct(id: string): Promise<MenuItem | undefined> {
    const products = await this.getProducts();
    return products.find((p) => p.id === id);
  },

  async createProduct(input: CreateProductInput): Promise<MenuItem> {
    const products = await this.getProducts();
    const newProduct: MenuItem = {
      id: input.id || `product-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
      name: input.name,
      description: input.description,
      price: input.price,
      category: input.category,
      image: input.image,
      popular: input.popular ?? 50,
      badge: input.badge,
      available: input.available ?? true,
      featured: input.featured ?? false,
    };

    const updated = [newProduct, ...products];
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updated));
    }
    notifyListeners(updated);
    return newProduct;
  },

  async updateProduct(id: string, updates: Partial<MenuItem>): Promise<MenuItem> {
    const products = await this.getProducts();
    let updatedProduct: MenuItem | undefined;

    const updatedList = products.map((p) => {
      if (p.id === id) {
        updatedProduct = { ...p, ...updates };
        return updatedProduct;
      }
      return p;
    });

    if (!updatedProduct) {
      throw new Error(`Product with ID ${id} not found.`);
    }

    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(updatedList));
    }
    notifyListeners(updatedList);
    return updatedProduct;
  },

  async deleteProduct(id: string): Promise<void> {
    const products = await this.getProducts();
    const filtered = products.filter((p) => p.id !== id);
    if (typeof window !== "undefined") {
      localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(filtered));
    }
    notifyListeners(filtered);
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
};

/** React hook for live product data across admin & customer pages */
export function useProducts() {
  const [products, setProducts] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    productService.getProducts().then((data) => {
      if (isMounted) {
        setProducts(data);
        setLoading(false);
      }
    });

    const unsubscribe = productService.subscribe((updatedProducts) => {
      if (isMounted) {
        setProducts(updatedProducts);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return { products, loading };
}
