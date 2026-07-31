import { motion } from "motion/react";
import { Star } from "lucide-react";
import { useEffect, useState } from "react";
import { SectionHeading } from "@/components/reveal";

const reviews = [
  { text: "The cakes are incredibly fresh and delicious.", name: "Ananya S.", city: "Lanka" },
  { text: "Best bakery in Lanka!", name: "Rohit M.", city: "BHU" },
  { text: "Pizza and pastries are amazing.", name: "Priya K.", city: "Susuwahi" },
  { text: "Ordered a truffle cake for my birthday — everyone loved it.", name: "Vikas T.", city: "Lahartara" },
];

export function Testimonials() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % reviews.length), 4000);
    return () => clearInterval(id);
  }, []);

  return (
    <section className="bg-secondary/50 py-16 lg:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <SectionHeading eyebrow="Testimonials" title="Loved across Varanasi" />
        <div className="mt-12 overflow-hidden">
          <motion.div
            className="flex"
            animate={{ x: `-${index * 100}%` }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          >
            {reviews.map((r) => (
              <figure key={r.text} className="w-full shrink-0 px-2">
                <blockquote className="rounded-3xl border border-border/70 bg-card p-8 text-center shadow-soft sm:p-12">
                  <div className="flex justify-center gap-1 text-gold">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                  <p className="mt-6 font-display text-xl leading-relaxed sm:text-2xl">
                    “{r.text}”
                  </p>
                  <figcaption className="mt-6 text-sm text-muted-foreground">
                    {r.name} · {r.city}
                  </figcaption>
                </blockquote>
              </figure>
            ))}
          </motion.div>
        </div>
        <div className="mt-8 flex justify-center gap-2">
          {reviews.map((r, i) => (
            <button
              key={r.name}
              type="button"
              aria-label={`Show review ${i + 1}`}
              onClick={() => setIndex(i)}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-8 bg-caramel" : "w-2 bg-border"
              }`}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
