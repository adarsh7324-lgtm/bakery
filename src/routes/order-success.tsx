import { createFileRoute, Link } from "@tanstack/react-router";
import { motion } from "motion/react";
import { Check, Clock, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/order-success")({
  head: () => ({
    meta: [
      { title: "Order Confirmed | Shree Bakers" },
      {
        name: "description",
        content: "Your Shree Bakers order is confirmed and will arrive fresh in 30-45 minutes.",
      },
      { property: "og:title", content: "Order Confirmed | Shree Bakers" },
      { property: "og:description", content: "Freshly baked and on its way to you." },
    ],
  }),
  component: OrderSuccess,
});

function OrderSuccess() {
  const orderId = `SB${Math.floor(100000 + Math.random() * 899999)}`;

  return (
    <div className="mx-auto grid max-w-2xl place-items-center px-4 py-24 text-center sm:px-6">
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: "spring", stiffness: 180, damping: 14 }}
        className="relative grid h-28 w-28 place-items-center rounded-full bg-caramel text-accent-foreground shadow-lift"
      >
        <motion.span
          className="absolute inset-0 rounded-full border-2 border-gold"
          initial={{ scale: 1, opacity: 0.8 }}
          animate={{ scale: 1.35, opacity: 0 }}
          transition={{ repeat: Infinity, duration: 1.8 }}
        />
        <Check className="h-12 w-12" strokeWidth={3} />
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="mt-8 text-3xl font-bold sm:text-4xl"
      >
        Order Confirmed
      </motion.h1>
      <p className="mt-3 text-muted-foreground">
        Thank you! Your treats are being packed fresh from our oven.
      </p>
      <p className="mt-2 text-sm font-semibold text-caramel">Order ID: {orderId}</p>

      <div className="mt-10 grid w-full gap-4 sm:grid-cols-2">
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <Clock className="mx-auto h-6 w-6 text-caramel" />
          <p className="mt-3 text-sm text-muted-foreground">Estimated Delivery</p>
          <p className="font-display text-xl font-bold">30–45 Minutes</p>
        </div>
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
          <Truck className="mx-auto h-6 w-6 text-caramel" />
          <p className="mt-3 text-sm text-muted-foreground">Order Tracking</p>
          <p className="font-display text-xl font-bold">Out for Baking</p>
        </div>
      </div>

      <Button asChild size="lg" className="mt-10 rounded-full px-8 font-semibold">
        <Link to="/menu">Continue Shopping</Link>
      </Button>
    </div>
  );
}
