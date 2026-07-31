import { createFileRoute, Link } from "@tanstack/react-router";
import { ChefHat, Heart, Timer, Wheat } from "lucide-react";
import aboutImg from "@/assets/about.jpg";
import heroImg from "@/assets/hero.jpg";
import { Button } from "@/components/ui/button";
import { Reveal, SectionHeading } from "@/components/reveal";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About Shree Bakers | Artisan Bakery in Lanka, Varanasi" },
      {
        name: "description",
        content:
          "Learn the story of Shree Bakers — skilled bakers, fresh ingredients and small-batch baking serving Varanasi since day one.",
      },
      { property: "og:title", content: "About Shree Bakers, Varanasi" },
      {
        property: "og:description",
        content: "Fresh ingredients, skilled bakers and treats made with love in Lanka, Varanasi.",
      },
    ],
  }),
  component: About,
});

const timeline = [
  { icon: Wheat, title: "Fresh Ingredients", text: "Flour, butter and fruit sourced fresh each morning." },
  { icon: ChefHat, title: "Skilled Bakers", text: "A team that treats every cake like a centrepiece." },
  { icon: Heart, title: "Made with Love", text: "Hand finished in small batches, never mass produced." },
  { icon: Timer, title: "Fast Delivery", text: "From our oven to your table in 30-45 minutes." },
];

function About() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="About Us"
        title="Baking joy in the heart of Varanasi"
        subtitle="Shree Bakers has been delighting customers in Varanasi with fresh cakes, pastries, pizzas, burgers and bakery delights. Every item is freshly prepared using quality ingredients."
      />

      <Reveal className="mt-12">
        <div className="overflow-hidden rounded-[2rem] shadow-lift">
          <img
            src={aboutImg}
            alt="Shree Bakers store interior with fresh breads and cakes"
            loading="lazy"
            width={1200}
            height={1400}
            className="h-[320px] w-full object-cover sm:h-[460px]"
          />
        </div>
      </Reveal>

      <div className="mt-16 grid gap-12 lg:grid-cols-2 lg:gap-16">
        <div className="space-y-8 border-l border-caramel/30 pl-6">
          {timeline.map((t, i) => (
            <Reveal key={t.title} delay={i * 0.08}>
              <div className="relative">
                <span className="absolute -left-[2.15rem] top-1 grid h-8 w-8 place-items-center rounded-full bg-caramel text-accent-foreground">
                  <t.icon className="h-4 w-4" />
                </span>
                <h3 className="text-lg font-semibold">{t.title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{t.text}</p>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal>
          <div className="overflow-hidden rounded-[2rem] shadow-soft">
            <img
              src={heroImg}
              alt="Display of freshly baked cakes and croissants"
              loading="lazy"
              width={1600}
              height={1200}
              className="h-full w-full object-cover"
            />
          </div>
        </Reveal>
      </div>

      <Reveal className="mt-16">
        <div className="rounded-[2rem] bg-secondary/70 p-8 text-center sm:p-14">
          <h2 className="font-display text-2xl font-bold sm:text-3xl">
            Planning a celebration?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted-foreground sm:text-base">
            We craft custom cakes for birthdays, anniversaries and weddings — just tell us your
            theme.
          </p>
          <div className="mt-7 flex flex-wrap justify-center gap-3">
            <Button asChild size="lg" className="rounded-full px-8 font-semibold">
              <Link to="/menu">Order a Cake</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="rounded-full px-8 font-semibold">
              <Link to="/contact">Talk to Us</Link>
            </Button>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
