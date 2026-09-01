import { Link, useNavigate, useLocation } from "@tanstack/react-router";
import {
  LayoutDashboard,
  Package,
  PlusCircle,
  LogOut,
  Store,
  Menu as MenuIcon,
  X,
  User,
  Settings,
} from "lucide-react";
import { useEffect, useState, type ReactNode } from "react";
import logo from "@/assets/logo.png.asset.json";
import { authService } from "@/services/authService";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function AdminLayout({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(authService.getCurrentUser());
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    if (!authService.isAuthenticated()) {
      navigate({ to: "/admin/login" });
    }
  }, [navigate]);

  const handleLogout = async () => {
    await authService.logout();
    navigate({ to: "/admin/login" });
  };

  const navItems = [
    { to: "/admin/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { to: "/admin/products", label: "Products", icon: Package },
    { to: "/admin/products/new", label: "Add Product", icon: PlusCircle },
    { to: "/admin/settings", label: "Settings", icon: Settings },
  ];

  return (
    <div className="min-h-screen bg-secondary/30 flex flex-col md:flex-row">
      {/* Mobile Top Navigation */}
      <header className="md:hidden flex items-center justify-between border-b border-border bg-card px-4 py-3 sticky top-0 z-30 shadow-sm">
        <div className="flex items-center gap-2.5">
          <img src={logo.url} alt="Logo" className="h-9 w-9 rounded-full object-cover" />
          <span className="font-display font-bold text-base text-foreground">
            Shree Admin
          </span>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="p-2 rounded-xl border border-border text-foreground hover:bg-secondary"
            aria-label="Toggle Navigation"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <MenuIcon className="h-5 w-5" />}
          </button>
        </div>
      </header>

      {/* Mobile Menu Drawer */}
      {mobileOpen ? (
        <div className="md:hidden fixed inset-0 top-[61px] bg-background/95 backdrop-blur z-20 p-6 flex flex-col justify-between border-t border-border">
          <nav className="space-y-2">
            {navItems.map((item) => {
              const active = location.pathname === item.to;
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  onClick={() => setMobileOpen(false)}
                  className={cn(
                    "flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold transition-colors",
                    active
                      ? "bg-caramel text-accent-foreground shadow-soft"
                      : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <item.icon className="h-5 w-5" />
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/"
              target="_blank"
              onClick={() => setMobileOpen(false)}
              className="flex items-center gap-3 rounded-2xl px-4 py-3.5 text-sm font-semibold text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <Store className="h-5 w-5" />
              View Live Website
            </Link>
          </nav>

          <div className="border-t border-border pt-4 space-y-3">
            {user ? (
              <div className="flex items-center gap-3 px-2 py-1 text-xs text-muted-foreground">
                <User className="h-4 w-4 text-caramel" />
                <span className="truncate">{user.email}</span>
              </div>
            ) : null}
            <Button
              variant="destructive"
              className="w-full rounded-2xl font-semibold flex items-center justify-center gap-2"
              onClick={handleLogout}
            >
              <LogOut className="h-4 w-4" /> Log Out
            </Button>
          </div>
        </div>
      ) : null}

      {/* Desktop Sidebar */}
      <aside className="hidden md:flex flex-col w-64 border-r border-border/80 bg-card p-6 min-h-screen sticky top-0 shrink-0">
        <div className="flex items-center gap-3 pb-6 border-b border-border/70">
          <img src={logo.url} alt="Shree Bakers logo" className="h-11 w-11 rounded-full object-cover" />
          <div>
            <h2 className="font-display font-bold text-lg leading-tight">Shree Bakers</h2>
            <span className="text-[11px] font-semibold uppercase tracking-wider text-caramel">
              Admin Portal
            </span>
          </div>
        </div>

        <nav className="mt-8 space-y-2 flex-1">
          {navItems.map((item) => {
            const active = location.pathname === item.to;
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-semibold transition-all",
                  active
                    ? "bg-caramel text-accent-foreground shadow-soft"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <item.icon className="h-4 w-4" />
                {item.label}
              </Link>
            );
          })}

          <div className="pt-4 border-t border-border/50 mt-4">
            <Link
              to="/"
              target="_blank"
              className="flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Store className="h-4 w-4 text-caramel" />
              View Public Site ↗
            </Link>
          </div>
        </nav>

        <div className="border-t border-border/70 pt-6 space-y-4">
          {user ? (
            <div className="flex items-center gap-3 px-2 text-xs text-muted-foreground">
              <div className="h-8 w-8 rounded-full bg-secondary grid place-items-center text-caramel font-bold border border-border">
                {user.email.charAt(0).toUpperCase()}
              </div>
              <div className="truncate">
                <p className="font-semibold text-foreground truncate">{user.name}</p>
                <p className="text-[11px] text-muted-foreground truncate">{user.email}</p>
              </div>
            </div>
          ) : null}

          <Button
            variant="outline"
            className="w-full rounded-full border-border hover:bg-destructive hover:text-destructive-foreground transition-colors font-semibold flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" /> Log Out
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto">
        {children}
      </main>
    </div>
  );
}
