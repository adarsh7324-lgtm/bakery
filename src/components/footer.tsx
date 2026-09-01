import { Link } from "@tanstack/react-router";
import { Facebook, Instagram, MessageCircle, Clock, MapPin, Phone } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import logoUrl from "@/assets/logo.jpg";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Footer() {
  const [email, setEmail] = useState("");
  return (
    <footer className="mt-24 border-t border-border/70 bg-secondary/60">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-16 sm:px-6 md:grid-cols-2 lg:grid-cols-4 lg:px-8">
        <div>
          <div className="flex items-center gap-3">
            <img
              src={logoUrl}
              alt="Shree Bakers logo"
              width={48}
              height={48}
              loading="lazy"
              className="h-12 w-12 rounded-full object-cover"
            />
            <span className="font-display text-xl font-bold">Shree Bakers</span>
          </div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
            Freshly baked happiness every day — cakes, pastries, pizzas and bakery delights
            made with love in Varanasi.
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-caramel">
            Quick Links
          </h3>
          <ul className="mt-4 space-y-2 text-sm">
            {[
              { to: "/menu", label: "Menu" },
              { to: "/about", label: "About" },
              { to: "/gallery", label: "Gallery" },
              { to: "/contact", label: "Contact" },
            ].map((l) => (
              <li key={l.to}>
                <Link to={l.to} className="text-muted-foreground transition hover:text-caramel">
                  {l.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-caramel">
            Visit Us
          </h3>
          <ul className="mt-4 space-y-3 text-sm text-muted-foreground">
            <li className="flex gap-2">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
              926/2 Hyderabad Gate, Lanka, Varanasi
            </li>
            <li className="flex gap-2">
              <Phone className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
              <a href="tel:+917618000036" className="hover:text-caramel">
                +91 7618000036
              </a>
            </li>
            <li className="flex gap-2">
              <Clock className="mt-0.5 h-4 w-4 shrink-0 text-caramel" />
              10:30 AM – 10:00 PM
            </li>
          </ul>
          <div className="mt-4 flex gap-2">
            {[
              { icon: Instagram, label: "Instagram", href: "https://instagram.com/shreebakers_" },
              { icon: Facebook, label: "Facebook", href: "https://facebook.com" },
              { icon: MessageCircle, label: "WhatsApp", href: "https://wa.me/917618000036" },
            ].map(({ icon: Icon, label, href }) => (
              <a
                key={label}
                href={href}
                target="_blank"
                rel="noreferrer"
                aria-label={label}
                className="grid h-10 w-10 place-items-center rounded-full border border-border bg-card transition hover:bg-caramel hover:text-accent-foreground"
              >
                <Icon className="h-4 w-4" />
              </a>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.22em] text-caramel">
            Newsletter
          </h3>
          <p className="mt-4 text-sm text-muted-foreground">
            Fresh offers and new arrivals, straight to your inbox.
          </p>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              if (!email) return;
              setEmail("");
              toast.success("Subscribed! Sweet updates coming your way.");
            }}
          >
            <Input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@email.com"
              aria-label="Email address"
              className="rounded-full bg-card"
            />
            <Button type="submit" className="rounded-full font-semibold">
              Join
            </Button>
          </form>
          <p className="mt-6 text-xs text-muted-foreground">
            Order tracking coming soon — call us for live updates.
          </p>
        </div>
      </div>
      <div className="border-t border-border/70 px-4 py-6 text-center text-xs text-muted-foreground flex flex-col sm:flex-row items-center justify-between gap-3 max-w-7xl mx-auto">
        <div>© {new Date().getFullYear()} Shree Bakers, Lanka, Varanasi. All rights reserved.</div>
        <Link
          to="/admin/login"
          className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground/60 hover:text-caramel transition-colors"
          title="Staff Portal"
        >
          <span>🔒 Staff Login</span>
        </Link>
      </div>
    </footer>
  );
}
