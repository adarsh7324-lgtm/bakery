import { createFileRoute } from "@tanstack/react-router";
import { Clock, MapPin, Phone } from "lucide-react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Reveal, SectionHeading } from "@/components/reveal";

export const Route = createFileRoute("/contact")({
  head: () => ({
    meta: [
      { title: "Contact Shree Bakers | Lanka, Varanasi Bakery" },
      {
        name: "description",
        content:
          "Visit Shree Bakers at 926/2 Hyderabad Gate, Lanka, Varanasi. Call +91 7618000036, open 10:30 AM to 10:00 PM daily.",
      },
      { property: "og:title", content: "Contact Shree Bakers, Lanka Varanasi" },
      {
        property: "og:description",
        content: "Address, phone, hours and enquiry form for Shree Bakers in Varanasi.",
      },
    ],
  }),
  component: Contact,
});

type FormValues = { name: string; email: string; phone: string; message: string };

function Contact() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>();

  return (
    <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading
        eyebrow="Contact"
        title="Come say hello"
        subtitle="Custom cake enquiries, bulk orders or a quick question — we're happy to help."
      />

      <div className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
        <Reveal>
          <div className="space-y-4">
            {[
              {
                icon: MapPin,
                title: "Address",
                lines: ["926/2 Hyderabad Gate,", "Lanka,", "Varanasi"],
              },
              { icon: Phone, title: "Phone", lines: ["+91 7618000036"] },
              { icon: Clock, title: "Open", lines: ["10:30 AM – 10:00 PM"] },
            ].map((c) => (
              <div
                key={c.title}
                className="flex gap-4 rounded-3xl border border-border/70 bg-card p-6 shadow-soft"
              >
                <span className="grid h-11 w-11 shrink-0 place-items-center rounded-2xl bg-secondary text-caramel">
                  <c.icon className="h-5 w-5" />
                </span>
                <div className="min-w-0">
                  <h3 className="text-sm font-semibold uppercase tracking-[0.2em] text-caramel">
                    {c.title}
                  </h3>
                  {c.lines.map((l) => (
                    <p key={l} className="mt-1 text-sm text-muted-foreground">
                      {l}
                    </p>
                  ))}
                </div>
              </div>
            ))}

            <div className="overflow-hidden rounded-3xl border border-border/70 shadow-soft">
              <iframe
                title="Shree Bakers location map"
                src="https://www.google.com/maps?q=Lanka,+Varanasi&output=embed"
                width="100%"
                height="300"
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                className="block border-0"
              />
            </div>
          </div>
        </Reveal>

        <Reveal delay={0.1}>
          <form
            onSubmit={handleSubmit(async (values) => {
              await new Promise((r) => setTimeout(r, 600));
              toast.success(`Thanks ${values.name}! We'll get back to you shortly.`);
              reset();
            })}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8"
          >
            <h3 className="font-display text-2xl font-bold">Send us a message</h3>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  className="mt-2 rounded-2xl"
                  {...register("name", { required: "Name is required" })}
                />
                {errors.name ? (
                  <p className="mt-1 text-xs text-destructive">{errors.name.message}</p>
                ) : null}
              </div>
              <div>
                <Label htmlFor="phone">Phone</Label>
                <Input
                  id="phone"
                  className="mt-2 rounded-2xl"
                  {...register("phone", { required: "Phone is required" })}
                />
                {errors.phone ? (
                  <p className="mt-1 text-xs text-destructive">{errors.phone.message}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  className="mt-2 rounded-2xl"
                  {...register("email", { required: "Email is required" })}
                />
                {errors.email ? (
                  <p className="mt-1 text-xs text-destructive">{errors.email.message}</p>
                ) : null}
              </div>
              <div className="sm:col-span-2">
                <Label htmlFor="message">Message</Label>
                <Textarea
                  id="message"
                  rows={5}
                  className="mt-2 rounded-2xl"
                  {...register("message", { required: "Tell us how we can help" })}
                />
                {errors.message ? (
                  <p className="mt-1 text-xs text-destructive">{errors.message.message}</p>
                ) : null}
              </div>
            </div>
            <Button
              type="submit"
              size="lg"
              disabled={isSubmitting}
              className="mt-6 w-full rounded-full font-semibold"
            >
              {isSubmitting ? "Sending..." : "Send Message"}
            </Button>
          </form>
        </Reveal>
      </div>
    </div>
  );
}
