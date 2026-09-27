/**
 * SettingsService – Supabase implementation
 * Reads/writes to the `public.app_settings` singleton-row table.
 */

import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface AppSettings {
  categories: string[];
  badges: string[];
}

// ─── Defaults ────────────────────────────────────────────────────────────────

const defaultSettings: AppSettings = {
  categories: [
    "Cakes",
    "Pastries",
    "Breads",
    "Cookies",
    "Pizzas",
    "Burgers",
    "Sandwiches",
    "Beverages",
    "Gift Hampers",
  ],
  badges: ["none", "Best Seller", "New", "20% OFF"],
};

// ─── Listener System ─────────────────────────────────────────────────────────

type SettingsListener = (settings: AppSettings) => void;
const listeners: Set<SettingsListener> = new Set();
function notifyListeners(settings: AppSettings) {
  listeners.forEach((fn) => fn(settings));
}

// ─── Internal helpers ─────────────────────────────────────────────────────────

async function fetchSettings(): Promise<AppSettings> {
  const { data, error } = await supabase
    .from("app_settings")
    .select("categories, badges")
    .eq("singleton_id", true)
    .single();
  if (error || !data) return defaultSettings;
  return {
    categories: Array.isArray(data.categories)
      ? data.categories
      : defaultSettings.categories,
    badges: Array.isArray(data.badges) ? data.badges : defaultSettings.badges,
  };
}

async function saveSettings(settings: AppSettings): Promise<AppSettings> {
  const { error } = await supabase
    .from("app_settings")
    .update({ categories: settings.categories, badges: settings.badges })
    .eq("singleton_id", true);
  if (error) throw error;
  notifyListeners(settings);
  return settings;
}

// ─── Service ─────────────────────────────────────────────────────────────────

export const settingsService = {
  subscribe(listener: SettingsListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  async getSettings(): Promise<AppSettings> {
    return fetchSettings();
  },

  async addCategory(category: string): Promise<AppSettings> {
    const settings = await fetchSettings();
    if (settings.categories.includes(category)) return settings;
    const updated = {
      ...settings,
      categories: [...settings.categories, category],
    };
    return saveSettings(updated);
  },

  async removeCategory(category: string): Promise<AppSettings> {
    const settings = await fetchSettings();
    const updated = {
      ...settings,
      categories: settings.categories.filter((c) => c !== category),
    };
    return saveSettings(updated);
  },

  async addBadge(badge: string): Promise<AppSettings> {
    const settings = await fetchSettings();
    if (settings.badges.includes(badge)) return settings;
    const updated = { ...settings, badges: [...settings.badges, badge] };
    return saveSettings(updated);
  },

  async removeBadge(badge: string): Promise<AppSettings> {
    const settings = await fetchSettings();
    const updated = {
      ...settings,
      badges: settings.badges.filter((b) => b !== badge),
    };
    return saveSettings(updated);
  },
};

// ─── React Hook ───────────────────────────────────────────────────────────────

export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(defaultSettings);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    settingsService.getSettings().then((data) => {
      if (mounted) { setSettings(data); setLoading(false); }
    });
    const unsub = settingsService.subscribe((updated) => {
      if (mounted) setSettings(updated);
    });
    return () => { mounted = false; unsub(); };
  }, []);

  return { settings, loading };
}
