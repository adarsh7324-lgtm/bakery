import { Link } from "@tanstack/react-router";
import { motion, useScroll, useSpring } from "motion/react";
import { Menu, Moon, ShoppingBag, Sun, X } from "lucide-react";
import { useEffect, useState } from "react";
import logo from "@/assets/logo.png.asset.json";
import { Button } from "@/components/ui/button";
import { useCart, useCartTotals } from "@/lib/store";

const links = [
  { to: "/", label: "Home" },
  { to: "/menu", label: "Menu" },
  { to: "/about", label: "About" },
  { to: "/gallery", label: "Gallery" },
  { to: "/contact", label: "Contact" },
] as const;

export function Navbar() {
  const [open, setOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 26, mass: 0.3 });
  const { count } = useCartTotals();
  const setCartOpen = useCart((s) => s.setOpen);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="sticky top-0 z-50">
      <div className="glass-nav">
        <nav className="mx-auto grid max-w-7xl grid-cols-[minmax(0,1fr)_auto] items-center gap-4 px-4 py-3 sm:px-6 lg:px-8">
          <Link to="/" className="flex min-w-0 items-center gap-3">
            <img
              src={logo.url}
              alt="Shree Bakers logo"
              width={48}
              height={48}
              className="h-11 w-11 shrink-0 rounded-full object-cover"
            />
            <span className="min-w-0">
              <span className="block truncate font-display text-lg font-bold leading-tight">
                Shree Bakers
              </span>
              <span className="block truncate text-[11px] uppercase tracking-[0.22em] text-caramel">
                Lanka, Varanasi
              </span>
            </span>
          </Link>

          <div className="flex items-center gap-1 sm:gap-2">
            <ul className="hidden items-center gap-1 lg:flex">
              {links.map((l) => (
                <li key={l.to}>
                  <Link
                    to={l.to}
                    activeOptions={{ exact: l.to === "/" }}
                    activeProps={{ className: "text-caramel" }}
                    className="rounded-full px-4 py-2 text-sm font-medium transition-colors hover:text-caramel"
                  >
                    {l.label}
                  </Link>
                </li>
              ))}
            </ul>

            <button
              type="button"
              aria-label="Toggle dark mode"
              onClick={() => setDark((d) => !d)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 transition hover:bg-secondary"
            >
              {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>

            <button
              type="button"
              aria-label="Open cart"
              onClick={() => setCartOpen(true)}
              className="relative grid h-10 w-10 place-items-center rounded-full border border-border/70 transition hover:bg-secondary"
            >
              <ShoppingBag className="h-4 w-4" />
              {count > 0 ? (
                <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-caramel px-1 text-[10px] font-bold text-accent-foreground">
                  {count}
                </span>
              ) : null}
            </button>

            <Button asChild className="hidden rounded-full font-semibold sm:inline-flex">
              <Link to="/menu">Order Now</Link>
            </Button>

            <button
              type="button"
              aria-label="Toggle navigation"
              onClick={() => setOpen((o) => !o)}
              className="grid h-10 w-10 place-items-center rounded-full border border-border/70 lg:hidden"
            >
              {open ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </button>
          </div>
        </nav>

        {open ? (
          <ul className="border-t border-border/60 px-4 pb-4 pt-2 lg:hidden">
            {links.map((l) => (
              <li key={l.to}>
                <Link
                  to={l.to}
                  onClick={() => setOpen(false)}
                  className="block rounded-2xl px-4 py-3 text-sm font-medium hover:bg-secondary"
                >
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        ) : null}
      </div>
      <motion.div
        style={{ scaleX: progress }}
        className="h-[3px] origin-left bg-gradient-to-r from-caramel to-gold"
      />
    </header>
  );
}
