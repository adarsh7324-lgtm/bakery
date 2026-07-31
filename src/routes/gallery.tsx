import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import aboutImg from "@/assets/about.jpg";
import blackForest from "@/assets/black-forest.jpg";
import burger from "@/assets/burger.jpg";
import chocolateCake from "@/assets/chocolate-cake.jpg";
import dessert from "@/assets/dessert.jpg";
import heroImg from "@/assets/hero.jpg";
import pastry from "@/assets/pastry.jpg";
import pizza from "@/assets/pizza.jpg";
import quickbites from "@/assets/quickbites.jpg";
import truffleCake from "@/assets/truffle-cake.jpg";
import { Reveal, SectionHeading } from "@/components/reveal";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/gallery")({
  head: () => ({
    meta: [
      { title: "Gallery | Shree Bakers Varanasi" },
      {
        name: "description",
        content:
          "A visual tour of Shree Bakers — cakes, pastries, pizza, bakery counters and our store interior in Lanka, Varanasi.",
      },
      { property: "og:title", content: "Gallery | Shree Bakers Varanasi" },
      {
        property: "og:description",
        content: "Photos of our cakes, pastries, pizzas and bakery store in Varanasi.",
      },
    ],
  }),
  component: Gallery,
});

const photos = [
  { src: chocolateCake, tag: "Cakes", alt: "Chocolate cake with glossy ganache" },
  { src: pastry, tag: "Pastries", alt: "Chocolate pastry slice on a plate" },
  { src: pizza, tag: "Pizza", alt: "Cheese pizza with a stretchy slice" },
  { src: heroImg, tag: "Bakery", alt: "Bakery counter with cakes and croissants" },
  { src: aboutImg, tag: "Store Interior", alt: "Warm bakery store interior" },
  { src: blackForest, tag: "Cakes", alt: "Black forest cake with cherries" },
  { src: quickbites, tag: "Bakery", alt: "Assorted donuts and cookies" },
  { src: truffleCake, tag: "Cakes", alt: "Chocolate truffle cake" },
  { src: dessert, tag: "Pastries", alt: "Brownies and choco lava dessert" },
  { src: burger, tag: "Bakery", alt: "Cheese burger with fresh veggies" },
];

const tags = ["All", "Cakes", "Pastries", "Pizza", "Bakery", "Store Interior"];

function Gallery() {
  const [tag, setTag] = useState("All");
  const shown = photos.filter((p) => tag === "All" || p.tag === tag);

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Gallery"
        title="A little taste of Shree Bakers"
        subtitle="Every bake, styled and photographed just as it leaves our kitchen."
      />

      <Reveal className="mt-10">
        <div className="flex flex-wrap justify-center gap-2">
          {tags.map((t) => (
            <button
              key={t}
              type="button"
              onClick={() => setTag(t)}
              className={cn(
                "rounded-full border px-4 py-2 text-sm font-medium transition",
                tag === t
                  ? "border-caramel bg-caramel text-accent-foreground"
                  : "border-border hover:bg-secondary",
              )}
            >
              {t}
            </button>
          ))}
        </div>
      </Reveal>

      <div className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>*]:mb-5">
        {shown.map((p, i) => (
          <Reveal key={`${p.alt}-${i}`} delay={(i % 3) * 0.06}>
            <figure className="hover-lift overflow-hidden rounded-3xl border border-border/70 bg-card shadow-soft">
              <img
                src={p.src}
                alt={p.alt}
                loading="lazy"
                className="w-full object-cover"
                style={{ aspectRatio: i % 3 === 1 ? "3 / 4" : "4 / 3" }}
              />
              <figcaption className="px-5 py-3 text-xs font-semibold uppercase tracking-[0.2em] text-caramel">
                {p.tag}
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </div>
    </div>
  );
}
