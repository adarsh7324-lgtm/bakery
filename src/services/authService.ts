/**
 * AuthService Abstraction
 * Local/Mock implementation for development & testing.
 * Designed to be replaced with Supabase Auth without altering UI components.
 */

const AUTH_STORAGE_KEY = "shree_bakers_admin_session";

// Isolated placeholder credentials
export const ADMIN_CONFIG = {
  email: "admin@shreebakers.com",
  password: "admin",
  name: "Shree Bakers Admin",
};

export type AdminUser = {
  email: string;
  name: string;
  loginAt: string;
};

export const authService = {
  async login(email: string, pass: string): Promise<{ success: boolean; error?: string }> {
    // Artificial slight delay for realistic UI loading state
    await new Promise((res) => setTimeout(res, 600));

    if (email.trim().toLowerCase() === ADMIN_CONFIG.email.toLowerCase() && pass === ADMIN_CONFIG.password) {
      const user: AdminUser = {
        email: ADMIN_CONFIG.email,
        name: ADMIN_CONFIG.name,
        loginAt: new Date().toISOString(),
      };
      if (typeof window !== "undefined") {
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(user));
      }
      return { success: true };
    }

    return { success: false, error: "Invalid Admin ID/Email or Password." };
  },

  async logout(): Promise<void> {
    await new Promise((res) => setTimeout(res, 200));
    if (typeof window !== "undefined") {
      localStorage.removeItem(AUTH_STORAGE_KEY);
    }
  },

  isAuthenticated(): boolean {
    if (typeof window === "undefined") return false;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return Boolean(stored);
    } catch {
      return false;
    }
  },

  getCurrentUser(): AdminUser | null {
    if (typeof window === "undefined") return null;
    try {
      const stored = localStorage.getItem(AUTH_STORAGE_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  },
};
