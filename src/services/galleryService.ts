/**
 * GalleryService
 * Manages gallery photos and owner details using localStorage.
 * Designed to be swapped with Supabase Storage seamlessly.
 */

import { useEffect, useState } from "react";

const GALLERY_STORAGE_KEY = "shree_bakers_gallery_v1";
const OWNER_STORAGE_KEY = "shree_bakers_owner_v1";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface GalleryPhoto {
  id: string;
  src: string;          // URL or base64 data URI
  alt: string;
  tag: string;
}

export interface OwnerDetails {
  name: string;
  title: string;
  bio: string;
  photo: string;        // URL or base64 data URI
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

// ─── Listener System ─────────────────────────────────────────────────────────

type GalleryListener = (photos: GalleryPhoto[]) => void;
type OwnerListener = (owner: OwnerDetails) => void;

const galleryListeners: Set<GalleryListener> = new Set();
const ownerListeners: Set<OwnerListener> = new Set();

function notifyGallery(photos: GalleryPhoto[]) {
  galleryListeners.forEach((l) => l(photos));
}
function notifyOwner(owner: OwnerDetails) {
  ownerListeners.forEach((l) => l(owner));
}

// ─── Initializers ────────────────────────────────────────────────────────────

function initGallery(): GalleryPhoto[] {
  if (typeof window === "undefined") return [];
  try {
    const stored = localStorage.getItem(GALLERY_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (err) {
    console.error("Failed to parse gallery from localStorage", err);
  }
  return [];
}

function initOwner(): OwnerDetails {
  if (typeof window === "undefined") return defaultOwner;
  try {
    const stored = localStorage.getItem(OWNER_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return { ...defaultOwner, ...parsed };
    }
  } catch (err) {
    console.error("Failed to parse owner from localStorage", err);
  }
  return defaultOwner;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const galleryService = {
  // Gallery photos
  subscribeGallery(listener: GalleryListener): () => void {
    galleryListeners.add(listener);
    return () => galleryListeners.delete(listener);
  },

  getPhotos(): GalleryPhoto[] {
    return initGallery();
  },

  addPhoto(photo: Omit<GalleryPhoto, "id">): GalleryPhoto {
    const photos = this.getPhotos();
    const newPhoto: GalleryPhoto = {
      ...photo,
      id: `photo-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    };
    const updated = [...photos, newPhoto];
    this._saveGallery(updated);
    return newPhoto;
  },

  updatePhoto(id: string, updates: Partial<Omit<GalleryPhoto, "id">>): GalleryPhoto {
    const photos = this.getPhotos();
    const updated = photos.map((p) => (p.id === id ? { ...p, ...updates } : p));
    this._saveGallery(updated);
    return updated.find((p) => p.id === id)!;
  },

  deletePhoto(id: string): void {
    const photos = this.getPhotos();
    const updated = photos.filter((p) => p.id !== id);
    this._saveGallery(updated);
  },

  reorderPhotos(photos: GalleryPhoto[]): void {
    this._saveGallery(photos);
  },

  _saveGallery(photos: GalleryPhoto[]) {
    if (typeof window !== "undefined") {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(photos));
    }
    notifyGallery(photos);
  },

  // Owner details
  subscribeOwner(listener: OwnerListener): () => void {
    ownerListeners.add(listener);
    return () => ownerListeners.delete(listener);
  },

  getOwner(): OwnerDetails {
    return initOwner();
  },

  updateOwner(updates: Partial<OwnerDetails>): OwnerDetails {
    const current = this.getOwner();
    const updated = { ...current, ...updates };
    if (typeof window !== "undefined") {
      localStorage.setItem(OWNER_STORAGE_KEY, JSON.stringify(updated));
    }
    notifyOwner(updated);
    return updated;
  },
};

// ─── React Hooks ─────────────────────────────────────────────────────────────

export function useGalleryPhotos() {
  const [photos, setPhotos] = useState<GalleryPhoto[]>(initGallery());

  useEffect(() => {
    let mounted = true;
    if (mounted) setPhotos(galleryService.getPhotos());

    const unsub = galleryService.subscribeGallery((updated) => {
      if (mounted) setPhotos(updated);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return photos;
}

export function useOwnerDetails() {
  const [owner, setOwner] = useState<OwnerDetails>(initOwner());

  useEffect(() => {
    let mounted = true;
    if (mounted) setOwner(galleryService.getOwner());

    const unsub = galleryService.subscribeOwner((updated) => {
      if (mounted) setOwner(updated);
    });
    return () => {
      mounted = false;
      unsub();
    };
  }, []);

  return owner;
}
