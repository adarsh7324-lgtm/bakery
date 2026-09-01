import { createFileRoute, Link } from "@tanstack/react-router";
import {
  Package,
  CheckCircle2,
  XCircle,
  Star,
  Plus,
  Pencil,
  Eye,
  EyeOff,
  Search,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useProducts, productService } from "@/services/productService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { inr } from "@/data/menu";

export const Route = createFileRoute("/admin/dashboard")({
  head: () => ({
    meta: [{ title: "Admin Dashboard | Shree Bakers" }],
  }),
  component: AdminDashboard,
});

function AdminDashboard() {
  const { products, loading } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const stats = useMemo(() => {
    const total = products.length;
    const available = products.filter((p) => p.available !== false).length;
    const soldOut = products.filter((p) => p.available === false).length;
    const featured = products.filter((p) => p.featured).length;
    return { total, available, soldOut, featured };
  }, [products]);

  const recentProducts = useMemo(() => {
    let filtered = products;
    if (searchTerm.trim()) {
      filtered = filtered.filter((p) =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }
    return filtered.slice(0, 8);
  }, [products, searchTerm]);

  const handleToggleAvailability = async (id: string, currentName: string) => {
    try {
      const updated = await productService.toggleAvailability(id);
      toast.success(
        `${currentName} is now marked as ${updated.available !== false ? "Available 🟢" : "Sold Out 🔴"}`,
      );
    } catch {
      toast.error("Failed to update product availability");
    }
  };

  const handleToggleFeatured = async (id: string, currentName: string) => {
    try {
      const updated = await productService.toggleFeatured(id);
      toast.success(
        `${currentName} ${updated.featured ? "added to" : "removed from"} Featured section`,
      );
    } catch {
      toast.error("Failed to update featured status");
    }
  };

  return (
    <AdminLayout>
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Bakery Overview
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Real-time control over products, availability, and featured displays.
          </p>
        </div>
        <Button asChild className="rounded-full px-6 font-semibold shadow-soft">
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Overview Cards */}
      <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            title: "Total Products",
            value: stats.total,
            icon: Package,
            color: "text-caramel bg-caramel/10 border-caramel/20",
          },
          {
            title: "Available Products",
            value: stats.available,
            icon: CheckCircle2,
            color: "text-emerald-600 bg-emerald-500/10 border-emerald-500/20",
          },
          {
            title: "Sold Out Products",
            value: stats.soldOut,
            icon: XCircle,
            color: "text-destructive bg-destructive/10 border-destructive/20",
          },
          {
            title: "Featured Items",
            value: stats.featured,
            icon: Star,
            color: "text-amber-500 bg-amber-500/10 border-amber-500/20",
          },
        ].map((card) => (
          <div
            key={card.title}
            className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft transition hover:shadow-lift"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                {card.title}
              </span>
              <div className={`grid h-10 w-10 place-items-center rounded-2xl border ${card.color}`}>
                <card.icon className="h-5 w-5" />
              </div>
            </div>
            <p className="mt-4 font-display text-3xl font-bold">{loading ? "..." : card.value}</p>
          </div>
        ))}
      </div>

      {/* Recent Products Section */}
      <div className="mt-10 rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
          <div>
            <h2 className="font-display text-xl font-bold">Recent Products</h2>
            <p className="text-xs text-muted-foreground">Quick status toggles & management</p>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Quick search..."
                className="rounded-full pl-9 bg-background h-9 text-xs"
              />
            </div>
            <Button asChild variant="outline" size="sm" className="rounded-full font-semibold shrink-0">
              <Link to="/admin/products">View All Products ({products.length})</Link>
            </Button>
          </div>
        </div>

        {/* Product Table / Cards */}
        {loading ? (
          <div className="py-12 text-center text-sm text-muted-foreground">Loading products...</div>
        ) : recentProducts.length === 0 ? (
          <div className="py-12 text-center text-sm text-muted-foreground">No products found.</div>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm border-collapse min-w-[650px]">
              <thead>
                <tr className="border-b border-border/60 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <th className="py-3 px-4">Product</th>
                  <th className="py-3 px-4">Category</th>
                  <th className="py-3 px-4">Price</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4">Featured</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/40">
                {recentProducts.map((product) => (
                  <tr key={product.id} className="hover:bg-secondary/40 transition-colors">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="h-10 w-10 rounded-xl object-cover border border-border"
                      />
                      <div>
                        <p className="font-semibold text-foreground leading-snug">{product.name}</p>
                        <p className="text-[11px] text-muted-foreground line-clamp-1">
                          {product.description}
                        </p>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="rounded-full bg-secondary px-2.5 py-1 text-xs font-medium border border-border">
                        {product.category}
                      </span>
                    </td>
                    <td className="py-3 px-4 font-display font-bold text-caramel">
                      {inr(product.price)}
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product.id, product.name)}
                        className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold transition ${
                          product.available !== false
                            ? "bg-emerald-500/10 text-emerald-600 hover:bg-emerald-500/20"
                            : "bg-destructive/10 text-destructive hover:bg-destructive/20"
                        }`}
                      >
                        {product.available !== false ? (
                          <>
                            <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                            Available
                          </>
                        ) : (
                          <>
                            <span className="h-2 w-2 rounded-full bg-destructive" />
                            Sold Out
                          </>
                        )}
                      </button>
                    </td>
                    <td className="py-3 px-4">
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.name)}
                        className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium border transition ${
                          product.featured
                            ? "border-amber-400/50 bg-amber-400/10 text-amber-600"
                            : "border-border text-muted-foreground hover:bg-secondary"
                        }`}
                      >
                        <Star className={`h-3.5 w-3.5 ${product.featured ? "fill-amber-400 text-amber-400" : ""}`} />
                        {product.featured ? "Featured" : "No"}
                      </button>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <Button
                        asChild
                        size="sm"
                        variant="ghost"
                        className="rounded-full h-8 px-3 text-xs font-semibold"
                      >
                        <Link to="/admin/products/$id/edit" params={{ id: product.id }}>
                          <Pencil className="mr-1 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </AdminLayout>
  );
}
