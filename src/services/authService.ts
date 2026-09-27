/**
 * AuthService – Supabase Auth implementation
 * Uses Supabase email/password sign-in for admin authentication.
 *
 * To create the admin user, run once in Supabase SQL Editor:
 *   select auth.create_user('admin@shreebakers.com', 'your-secure-password');
 * Or use Supabase Dashboard → Authentication → Users → Add user.
 */

import { supabase } from "@/lib/supabase";

// ─── Types ────────────────────────────────────────────────────────────────────

export type AdminUser = {
  id: string;
  email: string;
  loginAt: string;
};

// ─── Service ─────────────────────────────────────────────────────────────────

export const authService = {
  async login(
    email: string,
    pass: string
  ): Promise<{ success: boolean; error?: string }> {
    const { error } = await supabase.auth.signInWithPassword({
      email: email.trim(),
      password: pass,
    });

    if (error) {
      return {
        success: false,
        error: "Invalid email or password.",
      };
    }
    return { success: true };
  },

  async logout(): Promise<void> {
    await supabase.auth.signOut();
  },

  async isAuthenticated(): Promise<boolean> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session !== null;
  },

  async getCurrentUser(): Promise<AdminUser | null> {
    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) return null;
    return {
      id: user.id,
      email: user.email ?? "",
      loginAt: user.last_sign_in_at ?? new Date().toISOString(),
    };
  },
};
