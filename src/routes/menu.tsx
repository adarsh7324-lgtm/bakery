import { createFileRoute } from "@tanstack/react-router";
import { Search } from "lucide-react";
import { useMemo, useState } from "react";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { categories, menu } from "@/data/menu";
import { useCart } from "@/lib/store";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/menu")({
  head: () => ({
    meta: [
      { title: "Menu | Shree Bakers Varanasi — Cakes, Pizza, Burgers" },
      {
        name: "description",
        content:
          "Browse the full Shree Bakers menu: cakes in 500g and 1kg, pastries, pizzas, burgers, desserts and quick bites with online ordering.",
      },
      { property: "og:title", content: "Full Menu | Shree Bakers Varanasi" },
      {
        property: "og:description",
        content: "Cakes, pastries, pizzas, burgers and quick bites — freshly baked daily.",
      },
    ],
  }),
  component: MenuPage,
});

function MenuPage() {
  const [category, setCategory] = useState<string>("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("popular");
  const recent = useCart((s) => s.recent);

  const suggestions = useMemo(() => {
    if (query.trim().length < 2) return [];
    return menu
      .filter((m) => m.name.toLowerCase().includes(query.toLowerCase()))
      .slice(0, 5);
  }, [query]);

  const items = useMemo(() => {
    let list = menu.filter(
      (m) =>
        (category === "All" || m.category === category) &&
        (m.name.toLowerCase().includes(query.toLowerCase()) ||
          m.description.toLowerCase().includes(query.toLowerCase())),
    );
    list = [...list].sort((a, b) => {
      if (sort === "low") return a.price - b.price;
      if (sort === "high") return b.price - a.price;
      return (b.popular ?? 0) - (a.popular ?? 0);
    });
    return list;
  }, [category, query, sort]);

  const recentItems = recent
    .map((id) => menu.find((m) => m.id === id))
    .filter(Boolean)
    .slice(0, 4);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Our Menu"
        title="Everything we bake, in one place"
        subtitle="Filter by category, search your favourite, and add it straight to your cart."
      />

      <Reveal className="mt-10">
        <div className="rounded-3xl border border-border/70 bg-card p-4 shadow-soft sm:p-6">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_auto]">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search cakes, pizzas, pastries..."
                aria-label="Search the menu"
                className="rounded-full pl-11"
              />
              {suggestions.length > 0 ? (
                <ul className="absolute z-20 mt-2 w-full overflow-hidden rounded-2xl border border-border bg-popover shadow-lift">
                  {suggestions.map((s) => (
                    <li key={s.id}>
                      <button
                        type="button"
                        onClick={() => setQuery(s.name)}
                        className="block w-full px-4 py-2.5 text-left text-sm hover:bg-secondary"
                      >
                        {s.name}
                      </button>
                    </li>
                  ))}
                </ul>
              ) : null}
            </div>
            <Select value={sort} onValueChange={setSort}>
              <SelectTrigger className="w-full rounded-full sm:w-56" aria-label="Sort items">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="popular">Popular</SelectItem>
                <SelectItem value="low">Price: Low to High</SelectItem>
                <SelectItem value="high">Price: High to Low</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {["All", ...categories].map((c) => (
              <button
                key={c}
                type="button"
                onClick={() => setCategory(c)}
                className={cn(
                  "rounded-full border px-4 py-2 text-sm font-medium transition",
                  category === c
                    ? "border-caramel bg-caramel text-accent-foreground"
                    : "border-border hover:bg-secondary",
                )}
              >
                {c}
              </button>
            ))}
          </div>
        </div>
      </Reveal>

      <p className="mt-6 text-sm text-muted-foreground">{items.length} items</p>

      <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item, i) => (
          <ProductCard key={item.id} item={item} index={i} withQty />
        ))}
      </div>

      {items.length === 0 ? (
        <p className="py-16 text-center text-muted-foreground">
          Nothing matched your search. Try another treat.
        </p>
      ) : null}

      {recentItems.length > 0 ? (
        <section className="mt-20">
          <h2 className="font-display text-2xl font-bold">Recently Viewed</h2>
          <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {recentItems.map((item, i) => (
              <ProductCard key={`recent-${item!.id}`} item={item!} index={i} />
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}
