/**
 * database.types.ts
 *
 * TypeScript representation of the Supabase database schema.
 * Mirrors 001_initial_schema.sql exactly.
 *
 * After the migration runs, you can regenerate this file automatically:
 *   npx supabase gen types typescript --project-id <YOUR_PROJECT_ID> > src/lib/database.types.ts
 */

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

// ─── Badge ────────────────────────────────────────────────────────────────────
export type Badge = "Best Seller" | "New" | "20% OFF";

// ─── FAQ Category ─────────────────────────────────────────────────────────────
export type FAQCategory =
  | "General"
  | "Products"
  | "Cakes"
  | "Delivery"
  | "Orders"
  | "Payments";

// ─── Gallery Tag ──────────────────────────────────────────────────────────────
export type GalleryTag =
  | "Cakes"
  | "Pastries"
  | "Pizza"
  | "Bakery"
  | "Store Interior";

// ─── Order Status ─────────────────────────────────────────────────────────────
export type OrderStatus =
  | "pending"
  | "confirmed"
  | "preparing"
  | "out_for_delivery"
  | "delivered"
  | "cancelled";

// ─── Payment Method ───────────────────────────────────────────────────────────
export type PaymentMethod = "cod" | "upi" | "card";

// ─── Order Item (stored as JSON in orders.items) ─────────────────────────────
export interface OrderItem {
  id: string;
  name: string;
  price: number;
  qty: number;
  image: string;
}

// ─── Database ─────────────────────────────────────────────────────────────────
export interface Database {
  public: {
    Tables: {
      // ── products ────────────────────────────────────────────────────────────
      products: {
        Row: {
          id: string;
          name: string;
          description: string;
          price: number;
          category: string;
          image: string;
          popular: number;
          badge: Badge | null;
          available: boolean;
          featured: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          name: string;
          description?: string;
          price: number;
          category: string;
          image?: string;
          popular?: number;
          badge?: Badge | null;
          available?: boolean;
          featured?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string;
          price?: number;
          category?: string;
          image?: string;
          popular?: number;
          badge?: Badge | null;
          available?: boolean;
          featured?: boolean;
          updated_at?: string;
        };
      };

      // ── faqs ────────────────────────────────────────────────────────────────
      faqs: {
        Row: {
          id: string;
          question: string;
          answer: string;
          category: FAQCategory;
          visible: boolean;
          order: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          question: string;
          answer: string;
          category: FAQCategory;
          visible?: boolean;
          order?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          question?: string;
          answer?: string;
          category?: FAQCategory;
          visible?: boolean;
          order?: number;
          updated_at?: string;
        };
      };

      // ── app_settings ────────────────────────────────────────────────────────
      app_settings: {
        Row: {
          singleton_id: boolean;
          categories: string[];
          badges: string[];
          updated_at: string;
        };
        Insert: {
          singleton_id?: boolean;
          categories?: string[];
          badges?: string[];
          updated_at?: string;
        };
        Update: {
          categories?: string[];
          badges?: string[];
          updated_at?: string;
        };
      };

      // ── gallery_photos ───────────────────────────────────────────────────────
      gallery_photos: {
        Row: {
          id: string;
          src: string;
          alt: string;
          tag: GalleryTag;
          sort_order: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          src: string;
          alt?: string;
          tag: GalleryTag;
          sort_order?: number;
          created_at?: string;
        };
        Update: {
          src?: string;
          alt?: string;
          tag?: GalleryTag;
          sort_order?: number;
        };
      };

      // ── owner_details ────────────────────────────────────────────────────────
      owner_details: {
        Row: {
          singleton_id: boolean;
          name: string;
          title: string;
          bio: string;
          photo: string;
          phone: string;
          email: string;
          updated_at: string;
        };
        Insert: {
          singleton_id?: boolean;
          name?: string;
          title?: string;
          bio?: string;
          photo?: string;
          phone?: string;
          email?: string;
          updated_at?: string;
        };
        Update: {
          name?: string;
          title?: string;
          bio?: string;
          photo?: string;
          phone?: string;
          email?: string;
          updated_at?: string;
        };
      };

      // ── orders ───────────────────────────────────────────────────────────────
      orders: {
        Row: {
          id: string;
          customer_name: string;
          customer_phone: string;
          address: string;
          pin_code: string;
          landmark: string;
          notes: string;
          payment_method: PaymentMethod;
          subtotal: number;
          discount: number;
          gst: number;
          delivery_fee: number;
          total: number;
          status: OrderStatus;
          items: OrderItem[];
          coupon_code: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          customer_phone: string;
          address: string;
          pin_code?: string;
          landmark?: string;
          notes?: string;
          payment_method: PaymentMethod;
          subtotal: number;
          discount?: number;
          gst?: number;
          delivery_fee?: number;
          total: number;
          status?: OrderStatus;
          items: OrderItem[];
          coupon_code?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          status?: OrderStatus;
          notes?: string;
          updated_at?: string;
        };
      };
    };

    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
