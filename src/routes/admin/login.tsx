import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { Eye, EyeOff, Lock, Mail, ShieldCheck } from "lucide-react";
import logoUrl from "@/assets/logo.jpg";
import { authService, ADMIN_CONFIG } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export const Route = createFileRoute("/admin/login")({
  head: () => ({
    meta: [
      { title: "Admin Portal Login | Shree Bakers" },
      { name: "description", content: "Staff & Admin management portal login for Shree Bakers." },
    ],
  }),
  component: AdminLogin,
});

function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !password) {
      setError("Please enter both Admin ID/Email and Password.");
      return;
    }

    setLoading(true);
    try {
      const res = await authService.login(email, password);
      if (res.success) {
        navigate({ to: "/admin/dashboard" });
      } else {
        setError(res.error || "Authentication failed.");
      }
    } catch {
      setError("An unexpected error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-secondary/40 px-4 py-12">
      <div className="w-full max-w-md bg-card rounded-3xl border border-border/80 p-8 shadow-lift relative overflow-hidden">
        {/* Subtle decorative background glow */}
        <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-caramel/10 blur-2xl pointer-events-none" />

        {/* Brand & Header */}
        <div className="text-center">
          <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-secondary p-1 border border-border">
            <img src={logoUrl} alt="Shree Bakers logo" className="h-full w-full rounded-full object-cover" />
          </div>
          <h1 className="mt-4 font-display text-2xl font-bold text-foreground">Admin Portal</h1>
          <p className="mt-1 text-sm text-muted-foreground">Manage your bakery website & products</p>
        </div>

        {/* Error Alert */}
        {error ? (
          <div className="mt-6 rounded-2xl bg-destructive/10 border border-destructive/20 p-3.5 text-xs font-semibold text-destructive text-center">
            {error}
          </div>
        ) : null}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <Label htmlFor="admin-email">Admin ID / Email</Label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@shreebakers.com"
                className="rounded-2xl pl-11 bg-background"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="admin-password">Password</Label>
            <div className="relative mt-2">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                id="admin-password"
                type={showPassword ? "text" : "password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="rounded-2xl pl-11 pr-11 bg-background"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                aria-label={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>

          <Button
            type="submit"
            disabled={loading}
            className="w-full rounded-full py-6 font-semibold shadow-soft hover:shadow-lift transition-all mt-2"
          >
            {loading ? "Authenticating..." : "Sign In to Dashboard"}
          </Button>
        </form>

        {/* Local Demo Credentials Helper */}
        <div className="mt-8 rounded-2xl bg-secondary/60 p-4 border border-border/60 text-xs text-muted-foreground space-y-1.5">
          <div className="flex items-center gap-1.5 font-semibold text-foreground">
            <ShieldCheck className="h-4 w-4 text-caramel" />
            <span>Local Development Login Credentials:</span>
          </div>
          <p className="font-mono text-[11px] text-foreground/80">Email: {ADMIN_CONFIG.email}</p>
          <p className="font-mono text-[11px] text-foreground/80">Password: {ADMIN_CONFIG.password}</p>
        </div>
      </div>
    </div>
  );
}
