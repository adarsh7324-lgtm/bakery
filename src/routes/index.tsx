import { createFileRoute, Link } from "@tanstack/react-router";
import { motion, useInView } from "motion/react";
import {
  Cake,
  ChefHat,
  Croissant,
  Heart,
  Leaf,
  Star,
  Timer,
  Truck,
  Wheat,
} from "lucide-react";
import { useEffect, useRef, useState } from "react";
import heroImg from "@/assets/hero.jpg";
import aboutImg from "@/assets/about.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Testimonials } from "@/components/testimonials";
import { popularItems } from "@/data/menu";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Shree Bakers | Freshly Baked Happiness in Lanka, Varanasi" },
      {
        name: "description",
        content:
          "Handcrafted cakes, pastries, pizzas and burgers baked fresh daily at Shree Bakers, Lanka, Varanasi. Order online for fast delivery.",
      },
      { property: "og:title", content: "Shree Bakers | Freshly Baked Happiness Every Day" },
      {
        property: "og:description",
        content: "Premium cakes, pastries and pizzas from Varanasi's favourite artisan bakery.",
      },
    ],
  }),
  component: Home,
});

function Counter({ to, suffix = "" }: { to: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [n, setN] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let frame = 0;
    const total = 60;
    const id = setInterval(() => {
      frame += 1;
      setN(Math.round(to * (1 - Math.pow(1 - frame / total, 3))));
      if (frame >= total) clearInterval(id);
    }, 16);
    return () => clearInterval(id);
  }, [inView, to]);

  return (
    <span ref={ref}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}

const features = [
  { icon: Croissant, title: "Freshly Baked", text: "Every batch baked the same morning it's sold." },
  { icon: Leaf, title: "Premium Ingredients", text: "Real butter, Belgian cocoa, seasonal fruit." },
  { icon: Cake, title: "Custom Cakes", text: "Designed for birthdays, weddings and gifting." },
  { icon: Truck, title: "Fast Delivery", text: "Warm at your door across Varanasi in 30-45 min." },
];

const story = [
  { icon: Wheat, title: "Fresh Ingredients", text: "Sourced daily from trusted local suppliers." },
  { icon: ChefHat, title: "Skilled Bakers", text: "Craftsmen with decades of baking experience." },
  { icon: Heart, title: "Made with Love", text: "Small batches, hand finished, never rushed." },
  { icon: Timer, title: "Fast Delivery", text: "Packed warm and delivered with care." },
];

function Home() {
  return (
    <>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 pb-16 pt-12 sm:px-6 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:pb-24 lg:pt-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-caramel/30 bg-card px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
              <Wheat className="h-3.5 w-3.5" /> Lanka, Varanasi
            </span>
            <h1 className="mt-6 text-4xl font-bold leading-[1.08] sm:text-5xl lg:text-6xl">
              Freshly Baked <span className="text-gradient-warm">Happiness</span> Every Day
            </h1>
            <p className="mt-6 max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
              From handcrafted cakes to cheesy pizzas and delightful pastries, Shree Bakers has
              been serving Varanasi with love and freshness.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg" className="rounded-full px-8 font-semibold">
                <Link to="/menu">Order Now</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="rounded-full border-caramel/40 px-8 font-semibold"
              >
                <Link to="/menu">Explore Menu</Link>
              </Button>
            </div>

            <div className="mt-10 grid max-w-md grid-cols-3 gap-4">
              {[
                { n: 2250, s: "+", l: "Happy Customers" },
                { n: 60, s: "+", l: "Menu Items" },
                { n: 12, s: "+", l: "Years Baking" },
              ].map((s) => (
                <div key={s.l}>
                  <p className="font-display text-2xl font-bold text-caramel sm:text-3xl">
                    <Counter to={s.n} suffix={s.s} />
                  </p>
                  <p className="mt-1 text-xs text-muted-foreground">{s.l}</p>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="relative"
          >
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={heroImg}
                alt="Fresh cakes, croissants and pastries on a marble bakery counter"
                width={1600}
                height={1200}
                className="h-full w-full object-cover"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
              className="absolute -bottom-6 left-4 rounded-3xl border border-border/70 bg-card/95 p-4 shadow-lift backdrop-blur sm:left-8"
            >
              <div className="flex items-center gap-1 text-gold">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-1 font-display text-lg font-bold">4.3 Rating</p>
              <p className="text-xs text-muted-foreground">2250+ Happy Customers</p>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <SectionHeading
          eyebrow="Why Shree Bakers"
          title="Baked with craft, served with warmth"
          subtitle="Small-batch baking, honest ingredients and a delivery promise you can taste."
        />
        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((f, i) => (
            <Reveal key={f.title} delay={i * 0.08}>
              <div className="hover-lift group h-full rounded-3xl border border-border/70 bg-card p-7 shadow-soft">
                <div className="grid h-14 w-14 place-items-center rounded-2xl bg-secondary text-caramel transition-transform duration-500 group-hover:-rotate-6 group-hover:scale-110">
                  <f.icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-lg font-semibold">{f.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{f.text}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Popular */}
      <section className="bg-secondary/50 py-16 lg:py-24">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <SectionHeading
            eyebrow="Featured"
            title="Our most loved bakes"
            subtitle="The classics Varanasi keeps coming back for."
          />
          <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {popularItems.map((item, i) => (
              <ProductCard key={item.id} item={item} index={i} />
            ))}
          </div>
          <div className="mt-12 text-center">
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
              <Link to="/menu">View Full Menu</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* About */}
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
          <Reveal>
            <div className="overflow-hidden rounded-[2rem] shadow-lift">
              <img
                src={aboutImg}
                alt="Interior of Shree Bakers store with wooden shelves of fresh bread"
                loading="lazy"
                width={1200}
                height={1400}
                className="h-full w-full object-cover"
              />
            </div>
          </Reveal>
          <div>
            <SectionHeading
              align="left"
              eyebrow="Our Story"
              title="A Varanasi bakery built on freshness"
              subtitle="Shree Bakers has been delighting customers in Varanasi with fresh cakes, pastries, pizzas, burgers and bakery delights. Every item is freshly prepared using quality ingredients."
            />
            <div className="mt-10 space-y-6 border-l border-caramel/30 pl-6">
              {story.map((s, i) => (
                <Reveal key={s.title} delay={i * 0.08}>
                  <div className="relative">
                    <span className="absolute -left-[2.15rem] top-1 grid h-8 w-8 place-items-center rounded-full bg-caramel text-accent-foreground">
                      <s.icon className="h-4 w-4" />
                    </span>
                    <h3 className="text-base font-semibold">{s.title}</h3>
                    <p className="mt-1 text-sm text-muted-foreground">{s.text}</p>
                  </div>
                </Reveal>
              ))}
            </div>
            <Button asChild className="mt-10 rounded-full px-8 font-semibold">
              <Link to="/about">More About Us</Link>
            </Button>
          </div>
        </div>
      </section>

      <Testimonials />
    </>
  );
}
