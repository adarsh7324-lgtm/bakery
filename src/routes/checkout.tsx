import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Banknote, CreditCard, Smartphone } from "lucide-react";
import { useForm } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { SectionHeading } from "@/components/reveal";
import { inr } from "@/data/menu";
import { useCart, useCartTotals } from "@/lib/store";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout | Shree Bakers Varanasi" },
      {
        name: "description",
        content: "Enter your delivery details and place your Shree Bakers order in Varanasi.",
      },
      { property: "og:title", content: "Checkout | Shree Bakers" },
      { property: "og:description", content: "Fast delivery across Varanasi in 30-45 minutes." },
    ],
  }),
  component: Checkout,
});

type FormValues = {
  name: string;
  phone: string;
  address: string;
  pin: string;
  landmark: string;
  notes: string;
  payment: string;
};

function Checkout() {
  const navigate = useNavigate();
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const { subtotal, discount, gst, delivery, total } = useCartTotals();
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ defaultValues: { payment: "cod" } });
  const payment = watch("payment");

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <h1 className="font-display text-3xl font-bold">Your cart is empty</h1>
        <p className="mt-3 text-muted-foreground">Add a few treats before checking out.</p>
        <Button asChild className="mt-6 rounded-full px-8 font-semibold">
          <Link to="/menu">Explore Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6 lg:px-8 lg:py-20">
      <SectionHeading eyebrow="Checkout" title="Almost there" />

      <form
        onSubmit={handleSubmit((data) => {
          const itemsText = lines
            .map((l, i) => `${i + 1}. *${l.name}* × ${l.qty} — ₹${l.price * l.qty}`)
            .join("\n");

          const paymentLabel =
            data.payment === "cod"
              ? "Cash on Delivery"
              : data.payment === "upi"
              ? "UPI"
              : "Credit Card";

          const message = `✨ *NEW ORDER - SHREE BAKERS* ✨

👤 *Customer Details:*
• *Name:* ${data.name}
• *Phone:* ${data.phone}
• *Address:* ${data.address}
• *PIN Code:* ${data.pin}${data.landmark ? `\n• *Landmark:* ${data.landmark}` : ""}${data.notes ? `\n• *Notes:* ${data.notes}` : ""}
• *Payment:* ${paymentLabel}

🛒 *Order Items:*
${itemsText}

💰 *Payment Summary:*
• Subtotal: ₹${subtotal}
${discount > 0 ? `• Discount: -₹${discount}\n` : ""}• GST (5%): ₹${gst}
• Delivery: ${delivery === 0 ? "Free" : `₹${delivery}`}
• *Grand Total: ₹${total}*

Thank you! Please confirm my order.`;

          const whatsappUrl = `https://wa.me/917618000036?text=${encodeURIComponent(message)}`;
          clear();
          window.location.href = whatsappUrl;
        })}
        className="mt-12 grid gap-8 lg:grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)]"
      >
        <div className="space-y-6">
          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-bold">Customer Details</h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <Field id="name" label="Name" error={errors.name?.message}>
                <Input id="name" className="rounded-2xl" {...register("name", { required: "Required" })} />
              </Field>
              <Field id="phone" label="Phone" error={errors.phone?.message}>
                <Input
                  id="phone"
                  inputMode="tel"
                  className="rounded-2xl"
                  {...register("phone", { required: "Required" })}
                />
              </Field>
              <div className="sm:col-span-2">
                <Field id="address" label="Address" error={errors.address?.message}>
                  <Textarea
                    id="address"
                    rows={3}
                    className="rounded-2xl"
                    {...register("address", { required: "Required" })}
                  />
                </Field>
              </div>
              <Field id="pin" label="PIN Code" error={errors.pin?.message}>
                <Input
                  id="pin"
                  inputMode="numeric"
                  className="rounded-2xl"
                  {...register("pin", { required: "Required" })}
                />
              </Field>
              <Field id="landmark" label="Landmark">
                <Input id="landmark" className="rounded-2xl" {...register("landmark")} />
              </Field>
              <div className="sm:col-span-2">
                <Field id="notes" label="Delivery Notes">
                  <Textarea id="notes" rows={2} className="rounded-2xl" {...register("notes")} />
                </Field>
              </div>
            </div>
          </section>

          <section className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft sm:p-8">
            <h2 className="font-display text-xl font-bold">Payment</h2>
            <RadioGroup
              value={payment}
              onValueChange={(v) => setValue("payment", v)}
              className="mt-6 grid gap-3 sm:grid-cols-3"
            >
              {[
                { value: "cod", label: "Cash on Delivery", icon: Banknote },
                { value: "upi", label: "UPI", icon: Smartphone },
                { value: "card", label: "Credit Card", icon: CreditCard },
              ].map((p) => (
                <Label
                  key={p.value}
                  htmlFor={p.value}
                  className={`flex cursor-pointer items-center gap-3 rounded-2xl border p-4 transition ${
                    payment === p.value ? "border-caramel bg-secondary" : "border-border"
                  }`}
                >
                  <RadioGroupItem id={p.value} value={p.value} />
                  <p.icon className="h-4 w-4 text-caramel" />
                  <span className="text-sm font-medium">{p.label}</span>
                </Label>
              ))}
            </RadioGroup>
          </section>
        </div>

        <aside className="h-fit rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <h2 className="font-display text-xl font-bold">Order Summary</h2>
          <ul className="mt-5 space-y-3 text-sm">
            {lines.map((l) => (
              <li key={l.id} className="flex items-center justify-between gap-3">
                <span className="min-w-0 truncate text-muted-foreground">
                  {l.name} × {l.qty}
                </span>
                <span className="font-medium">{inr(l.price * l.qty)}</span>
              </li>
            ))}
          </ul>
          <dl className="mt-5 space-y-2 border-t border-border pt-4 text-sm">
            <Row label="Subtotal" value={inr(subtotal)} />
            {discount > 0 ? <Row label="Discount" value={`- ${inr(discount)}`} /> : null}
            <Row label="GST (5%)" value={inr(gst)} />
            <Row label="Delivery" value={delivery === 0 ? "Free" : inr(delivery)} />
            <div className="flex items-center justify-between border-t border-border pt-4">
              <dt className="font-display text-lg font-bold">Grand Total</dt>
              <dd className="font-display text-lg font-bold text-caramel">{inr(total)}</dd>
            </div>
          </dl>
          <Button
            type="submit"
            size="lg"
            disabled={isSubmitting}
            className="mt-6 w-full rounded-full font-semibold"
          >
            {isSubmitting ? "Redirecting..." : "Place Order on WhatsApp"}
          </Button>
        </aside>
      </form>
    </div>
  );
}

function Field({
  id,
  label,
  error,
  children,
}: {
  id: string;
  label: string;
  error?: string | undefined;
  children: React.ReactNode;
}) {
  return (
    <div>
      <Label htmlFor={id}>{label}</Label>
      <div className="mt-2">{children}</div>
      {error ? <p className="mt-1 text-xs text-destructive">{error}</p> : null}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between text-muted-foreground">
      <dt>{label}</dt>
      <dd className="font-medium text-foreground">{value}</dd>
    </div>
  );
}
