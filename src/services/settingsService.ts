import { useEffect, useState } from "react";

const SETTINGS_STORAGE_KEY = "shree_bakers_settings_v1";

export interface AppSettings {
  categories: string[];
  badges: string[];
}

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

type SettingsListener = (settings: AppSettings) => void;
const listeners: Set<SettingsListener> = new Set();

function notifyListeners(settings: AppSettings) {
  listeners.forEach((listener) => listener(settings));
}

function initializeSettings(): AppSettings {
  if (typeof window === "undefined") return defaultSettings;
  try {
    const stored = localStorage.getItem(SETTINGS_STORAGE_KEY);
    if (stored) {
      const parsed = JSON.parse(stored);
      return {
        categories: Array.isArray(parsed.categories) ? parsed.categories : defaultSettings.categories,
        badges: Array.isArray(parsed.badges) ? parsed.badges : defaultSettings.badges,
      };
    }
  } catch (err) {
    console.error("Failed to parse local settings", err);
  }

  if (typeof window !== "undefined") {
    localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(defaultSettings));
  }
  return defaultSettings;
}

export const settingsService = {
  subscribe(listener: SettingsListener): () => void {
    listeners.add(listener);
    return () => listeners.delete(listener);
  },

  getSettings(): AppSettings {
    return initializeSettings();
  },

  addCategory(category: string) {
    const settings = this.getSettings();
    if (settings.categories.includes(category)) return settings;
    
    const newSettings = { ...settings, categories: [...settings.categories, category] };
    this._saveAndNotify(newSettings);
    return newSettings;
  },

  removeCategory(category: string) {
    const settings = this.getSettings();
    const newSettings = { 
      ...settings, 
      categories: settings.categories.filter((c) => c !== category) 
    };
    this._saveAndNotify(newSettings);
    return newSettings;
  },

  addBadge(badge: string) {
    const settings = this.getSettings();
    if (settings.badges.includes(badge)) return settings;
    
    const newSettings = { ...settings, badges: [...settings.badges, badge] };
    this._saveAndNotify(newSettings);
    return newSettings;
  },

  removeBadge(badge: string) {
    const settings = this.getSettings();
    const newSettings = { 
      ...settings, 
      badges: settings.badges.filter((b) => b !== badge) 
    };
    this._saveAndNotify(newSettings);
    return newSettings;
  },

  _saveAndNotify(newSettings: AppSettings) {
    if (typeof window !== "undefined") {
      localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
    }
    notifyListeners(newSettings);
  }
};

/** React hook for live settings data */
export function useSettings() {
  const [settings, setSettings] = useState<AppSettings>(initializeSettings());

  useEffect(() => {
    let isMounted = true;
    
    if (isMounted) {
      setSettings(settingsService.getSettings());
    }

    const unsubscribe = settingsService.subscribe((updatedSettings) => {
      if (isMounted) {
        setSettings(updatedSettings);
      }
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, []);

  return settings;
}
