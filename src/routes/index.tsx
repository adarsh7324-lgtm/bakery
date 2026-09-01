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
import aboutImg from "@/assets/about.jpg";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/product-card";
import { Reveal, SectionHeading } from "@/components/reveal";
import { Testimonials } from "@/components/testimonials";
import { useProducts } from "@/services/productService";

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
  const { products } = useProducts();
  const featuredItems = useMemo(() => {
    const feat = products.filter((p) => p.featured);
    return feat.length > 0 ? feat.slice(0, 6) : products.slice(0, 6);
  }, [products]);

  return (
    <>
      {/* Hero */}
      <section className="relative h-screen w-full overflow-hidden bg-black flex items-center justify-center">
        {/* Cinematic Video Background */}
        <video
          src="/create_an_original_visual_conc.mp4"
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 h-full w-full object-cover"
        />
        
        {/* Subtle Dark Overlay for Text Readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />

        {/* Hero Content */}
        <div className="relative z-10 flex flex-col items-center text-center px-4 w-full max-w-5xl mt-16">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 2.6, duration: 1.2, ease: [0.25, 0.1, 0.25, 1] }}
            className="text-white text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-[0.2em] font-serif uppercase drop-shadow-xl"
            style={{ fontFamily: "'Playfair Display', serif" }}
          >
            Shree Bakers
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 3.2, duration: 1.2, ease: "easeOut" }}
            className="text-zinc-200 mt-6 text-xs sm:text-sm md:text-base tracking-[0.3em] uppercase drop-shadow-md"
          >
            Freshly baked. Rooted in Varanasi.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 3.8, duration: 1, ease: "easeOut" }}
            className="mt-12 flex flex-col sm:flex-row gap-4 sm:gap-6 justify-center w-full sm:w-auto"
          >
            <Button asChild size="lg" className="rounded-none bg-white text-black hover:bg-zinc-200 px-8 py-6 tracking-widest uppercase text-xs font-semibold w-full sm:w-auto">
              <Link to="/menu">Explore Our Bakes</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="rounded-none border-white/40 text-white hover:bg-white/10 px-8 py-6 tracking-widest uppercase text-xs font-semibold backdrop-blur-sm w-full sm:w-auto bg-black/20"
            >
              <Link to="/menu">Order Now</Link>
            </Button>
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
            {featuredItems.map((item, i) => (
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
