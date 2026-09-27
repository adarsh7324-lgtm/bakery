/**
 * GalleryService – Supabase implementation
 * Gallery photos → `public.gallery_photos` table + `gallery-images` storage bucket
 * Owner details → `public.owner_details` table + `owner-photo` storage bucket
 */

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GalleryPhoto {
  id: string;
  src: string;   // Supabase Storage public URL
  alt: string;
  tag: string;
}

export interface OwnerDetails {
  name: string;
  title: string;
  bio: string;
  photo: string; // Supabase Storage public URL
  phone?: string;
  email?: string;
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultOwner: OwnerDetails = {
  name: "Adarsh Rai",
  title: "Founder & Head Baker",
  bio: "With a deep passion for baking and an eye for detail, Adarsh founded Shree Bakers with a simple mission — bring fresh, handcrafted bakes to every table in Varanasi. From humble beginnings in a small kitchen to serving hundreds of happy customers daily, every product is made with love and quality ingredients.",
  photo: "",
  phone: "",
  email: "",
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

function rowToPhoto(row: Record<string, unknown>): GalleryPhoto {
  return {
    id: row.id as string,
    src: row.src as string,
    alt: (row.alt as string) ?? "",
    tag: row.tag as string,
  };
}

function rowToOwner(row: Record<string, unknown>): OwnerDetails {
  return {
    name: (row.name as string) || defaultOwner.name,
    title: (row.title as string) || defaultOwner.title,
    bio: (row.bio as string) || defaultOwner.bio,
    photo: (row.photo as string) || "",
    phone: (row.phone as string) || "",
    email: (row.email as string) || "",
  };
}

// ─── Listener System ─────────────────────────────────────────────────────────

type GalleryListener = (photos: GalleryPhoto[]) => void;
type OwnerListener = (owner: OwnerDetails) => void;

const galleryListeners: Set<GalleryListener> = new Set();
const ownerListeners: Set<OwnerListener> = new Set();

function notifyGallery(photos: GalleryPhoto[]) {
  galleryListeners.forEach((fn) => fn(photos));
}
function notifyOwner(owner: OwnerDetails) {
  ownerListeners.forEach((fn) => fn(owner));
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const galleryService = {
  // ── Gallery Photos ─────────────────────────────────────────────────────────

  subscribeGallery(listener: GalleryListener): () => void {
    galleryListeners.add(listener);
    return () => galleryListeners.delete(listener);
  },

  async getPhotos(): Promise<GalleryPhoto[]> {
    const { data, error } = await supabase
      .from("gallery_photos")
      .select("*")
      .order("sort_order", { ascending: true });
    if (error) throw error;
    return (data ?? []).map(rowToPhoto);
  },

  async addPhoto(photo: Omit<GalleryPhoto, "id">): Promise<GalleryPhoto> {
    // Calculate next sort_order
    const { data: maxRow } = await supabase
      .from("gallery_photos")
      .select("sort_order")
      .order("sort_order", { ascending: false })
      .limit(1)
      .single();
    const sort_order = ((maxRow?.sort_order as number) ?? 0) + 1;

    const { data, error } = await supabase
      .from("gallery_photos")
      .insert({ src: photo.src, alt: photo.alt, tag: photo.tag, sort_order })
      .select()
      .single();
    if (error) throw error;
    const newPhoto = rowToPhoto(data);
    const all = await this.getPhotos();
    notifyGallery(all);
    return newPhoto;
  },

  async updatePhoto(
    id: string,
    updates: Partial<Omit<GalleryPhoto, "id">>
  ): Promise<GalleryPhoto> {
    const { data, error } = await supabase
      .from("gallery_photos")
      .update({
        ...(updates.src !== undefined && { src: updates.src }),
        ...(updates.alt !== undefined && { alt: updates.alt }),
        ...(updates.tag !== undefined && { tag: updates.tag }),
      })
      .eq("id", id)
      .select()
      .single();
    if (error) throw error;
    const photo = rowToPhoto(data);
    const all = await this.getPhotos();
    notifyGallery(all);
    return photo;
  },

  async deletePhoto(id: string): Promise<void> {
    const { error } = await supabase
      .from("gallery_photos")
      .delete()
      .eq("id", id);
    if (error) throw error;
    const all = await this.getPhotos();
    notifyGallery(all);
  },

  async reorderPhotos(photos: GalleryPhoto[]): Promise<void> {
    const updates = photos.map((p, idx) =>
      supabase.from("gallery_photos").update({ sort_order: idx }).eq("id", p.id)
    );
    await Promise.all(updates);
    notifyGallery(photos);
  },

  /** Upload image to Supabase Storage and return its public URL */
  async uploadGalleryImage(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `${Date.now()}-${Math.random().toString(36).substring(2, 7)}.${ext}`;
    const { error } = await supabase.storage
      .from("gallery-images")
      .upload(path, file, { upsert: false });
    if (error) throw error;
    const { data } = supabase.storage.from("gallery-images").getPublicUrl(path);
    return data.publicUrl;
  },

  // ── Owner Details ──────────────────────────────────────────────────────────

  subscribeOwner(listener: OwnerListener): () => void {
    ownerListeners.add(listener);
    return () => ownerListeners.delete(listener);
  },

  async getOwner(): Promise<OwnerDetails> {
    const { data, error } = await supabase
      .from("owner_details")
      .select("*")
      .eq("singleton_id", true)
      .single();
    if (error || !data) return defaultOwner;
    return rowToOwner(data as Record<string, unknown>);
  },

  async updateOwner(updates: Partial<OwnerDetails>): Promise<OwnerDetails> {
    const { data, error } = await supabase
      .from("owner_details")
      .update({
        ...(updates.name !== undefined && { name: updates.name }),
        ...(updates.title !== undefined && { title: updates.title }),
        ...(updates.bio !== undefined && { bio: updates.bio }),
        ...(updates.photo !== undefined && { photo: updates.photo }),
        ...(updates.phone !== undefined && { phone: updates.phone }),
        ...(updates.email !== undefined && { email: updates.email }),
      })
      .eq("singleton_id", true)
      .select()
      .single();
    if (error) throw error;
    const owner = rowToOwner(data as Record<string, unknown>);
    notifyOwner(owner);
    return owner;
  },

  /** Upload owner photo to Supabase Storage and return its public URL */
  async uploadOwnerPhoto(file: File): Promise<string> {
    const ext = file.name.split(".").pop();
    const path = `owner.${ext}`;
    const { error } = await supabase.storage
      .from("owner-photo")
      .upload(path, file, { upsert: true });
    if (error) throw error;
    const { data } = supabase.storage.from("owner-photo").getPublicUrl(path);
    // Cache-bust so UI refreshes immediately
    return `${data.publicUrl}?t=${Date.now()}`;
  },
};

// ─── React Hooks ─────────────────────────────────────────────────────────────

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    galleryService.getPhotos().then((data) => {
      if (mounted) { setPhotos(data); setLoading(false); }
    });
    const unsub = galleryService.subscribeGallery((updated) => {
      if (mounted) setPhotos(updated);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { photos, loading };
}

export function useOwnerDetails() {
  const [owner, setOwner] = useState<OwnerDetails>(defaultOwner);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    galleryService.getOwner().then((data) => {
      if (mounted) { setOwner(data); setLoading(false); }
    });
    const unsub = galleryService.subscribeOwner((updated) => {
      if (mounted) setOwner(updated);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { owner, loading };
}
