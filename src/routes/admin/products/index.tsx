import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  Search,
  Plus,
  Pencil,
  Trash2,
  Filter,
  CheckCircle2,
  XCircle,
  Star,
  AlertTriangle,
} from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import { useProducts, productService } from "@/services/productService";
import { inr, type Category, type MenuItem } from "@/data/menu";
import { useSettings } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

export const Route = createFileRoute("/admin/products/")({
  head: () => ({
    meta: [{ title: "Product Management | Shree Bakers Admin" }],
  }),
  component: AdminProductsPage,
});

function AdminProductsPage() {
  const { products, loading } = useProducts();
  const settings = useSettings();
  const navigate = useNavigate();

  // Search & Filters state
  const [search, setSearch] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("All");
  const [availabilityFilter, setAvailabilityFilter] = useState<string>("all");
  const [featuredFilter, setFeaturedFilter] = useState<string>("all");

  // Deletion confirmation state
  const [deleteProductTarget, setDeleteProductTarget] = useState<MenuItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      const matchSearch =
        p.name.toLowerCase().includes(search.toLowerCase()) ||
        p.description.toLowerCase().includes(search.toLowerCase());

      const matchCategory = selectedCategory === "All" || p.category === selectedCategory;

      const matchAvailability =
        availabilityFilter === "all" ||
        (availabilityFilter === "available" && p.available !== false) ||
        (availabilityFilter === "soldout" && p.available === false);

      const matchFeatured =
        featuredFilter === "all" ||
        (featuredFilter === "featured" && p.featured) ||
        (featuredFilter === "not_featured" && !p.featured);

      return matchSearch && matchCategory && matchAvailability && matchFeatured;
    });
  }, [products, search, selectedCategory, availabilityFilter, featuredFilter]);

  const handleToggleAvailability = async (id: string, name: string) => {
    try {
      const updated = await productService.toggleAvailability(id);
      toast.success(`${name} is now ${updated.available !== false ? "Available 🟢" : "Sold Out 🔴"}`);
    } catch {
      toast.error("Failed to toggle availability");
    }
  };

  const handleToggleFeatured = async (id: string, name: string) => {
    try {
      const updated = await productService.toggleFeatured(id);
      toast.success(`${name} ${updated.featured ? "marked as Featured" : "unfeatured"}`);
    } catch {
      toast.error("Failed to toggle featured status");
    }
  };

  const confirmDelete = async () => {
    if (!deleteProductTarget) return;
    setIsDeleting(true);
    try {
      await productService.deleteProduct(deleteProductTarget.id);
      toast.success(`Product "${deleteProductTarget.name}" deleted successfully.`);
      setDeleteProductTarget(null);
    } catch {
      toast.error("Failed to delete product.");
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <AdminLayout>
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Product Management
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage bakery menu items, prices, availability, and featured status.
          </p>
        </div>
        <Button asChild className="rounded-full px-6 font-semibold shadow-soft">
          <Link to="/admin/products/new">
            <Plus className="mr-2 h-4 w-4" /> Add New Product
          </Link>
        </Button>
      </div>

      {/* Filter Controls Bar */}
      <div className="mt-8 rounded-3xl border border-border/70 bg-card p-5 shadow-soft space-y-4">
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search product name or description..."
              className="rounded-full pl-9 bg-background"
            />
          </div>

          {/* Category Filter */}
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger className="rounded-full bg-background">
              <SelectValue placeholder="Category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="All">All Categories</SelectItem>
              {settings.categories.map((cat) => (
                <SelectItem key={cat} value={cat}>
                  {cat}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          {/* Availability Filter */}
          <Select value={availabilityFilter} onValueChange={setAvailabilityFilter}>
            <SelectTrigger className="rounded-full bg-background">
              <SelectValue placeholder="Availability" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="available">🟢 Available Only</SelectItem>
              <SelectItem value="soldout">🔴 Sold Out Only</SelectItem>
            </SelectContent>
          </Select>

          {/* Featured Filter */}
          <Select value={featuredFilter} onValueChange={setFeaturedFilter}>
            <SelectTrigger className="rounded-full bg-background">
              <SelectValue placeholder="Featured" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Items</SelectItem>
              <SelectItem value="featured">⭐ Featured Only</SelectItem>
              <SelectItem value="not_featured">Not Featured</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center justify-between text-xs text-muted-foreground pt-1 border-t border-border/40">
          <span>Showing {filteredProducts.length} of {products.length} products</span>
          {(search || selectedCategory !== "All" || availabilityFilter !== "all" || featuredFilter !== "all") ? (
            <button
              onClick={() => {
                setSearch("");
                setSelectedCategory("All");
                setAvailabilityFilter("all");
                setFeaturedFilter("all");
              }}
              className="text-caramel font-medium hover:underline"
            >
              Reset Filters
            </button>
          ) : null}
        </div>
      </div>

      {/* Products Grid / Table */}
      <div className="mt-8">
        {loading ? (
          <div className="py-16 text-center text-sm text-muted-foreground">Loading menu products...</div>
        ) : filteredProducts.length === 0 ? (
          <div className="py-16 text-center bg-card rounded-3xl border border-border p-8">
            <p className="text-base font-semibold text-foreground">No products match your criteria</p>
            <p className="text-sm text-muted-foreground mt-1">Try clearing filters or search terms.</p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="group rounded-3xl border border-border/70 bg-card overflow-hidden shadow-soft flex flex-col hover:shadow-lift transition-all"
              >
                {/* Product Image */}
                <div className="relative aspect-[4/3] bg-secondary overflow-hidden">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="h-full w-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {/* Status Overlay Badge */}
                  <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${
                        product.available !== false
                          ? "bg-emerald-500 text-white"
                          : "bg-destructive text-destructive-foreground"
                      }`}
                    >
                      {product.available !== false ? "Available" : "Sold Out"}
                    </span>
                    {product.featured ? (
                      <span className="rounded-full bg-amber-400 text-black px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm flex items-center gap-1">
                        <Star className="h-3 w-3 fill-black" /> Featured
                      </span>
                    ) : null}
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-semibold text-caramel uppercase tracking-wider">
                        {product.category}
                      </span>
                      <span className="font-display text-lg font-bold text-foreground">
                        {inr(product.price)}
                      </span>
                    </div>
                    <h3 className="font-semibold text-base leading-snug mt-1 text-foreground">
                      {product.name}
                    </h3>
                    <p className="text-xs text-muted-foreground line-clamp-2 mt-1.5">
                      {product.description}
                    </p>
                  </div>

                  {/* Toggle Controls */}
                  <div className="pt-3 border-t border-border/50 space-y-2">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Status:</span>
                      <button
                        type="button"
                        onClick={() => handleToggleAvailability(product.id, product.name)}
                        className={`font-semibold underline transition ${
                          product.available !== false ? "text-emerald-600" : "text-destructive"
                        }`}
                      >
                        {product.available !== false ? "Mark Sold Out" : "Mark Available"}
                      </button>
                    </div>

                    <div className="flex items-center justify-between text-xs">
                      <span className="text-muted-foreground font-medium">Featured:</span>
                      <button
                        type="button"
                        onClick={() => handleToggleFeatured(product.id, product.name)}
                        className={`font-semibold underline transition ${
                          product.featured ? "text-amber-600" : "text-muted-foreground hover:text-foreground"
                        }`}
                      >
                        {product.featured ? "Unfeature" : "Feature on Home"}
                      </button>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-2 pt-2">
                      <Button
                        asChild
                        size="sm"
                        variant="secondary"
                        className="flex-1 rounded-2xl text-xs font-semibold"
                      >
                        <Link to="/admin/products/$id/edit" params={{ id: product.id }}>
                          <Pencil className="mr-1.5 h-3.5 w-3.5" /> Edit
                        </Link>
                      </Button>
                      <Button
                        size="sm"
                        variant="destructive"
                        onClick={() => setDeleteProductTarget(product)}
                        className="rounded-2xl text-xs font-semibold px-3"
                        title="Delete Product"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      <Dialog open={Boolean(deleteProductTarget)} onOpenChange={() => setDeleteProductTarget(null)}>
        <DialogContent className="rounded-3xl max-w-md bg-card">
          <DialogHeader>
            <div className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-destructive/10 text-destructive mb-3">
              <AlertTriangle className="h-6 w-6" />
            </div>
            <DialogTitle className="text-center font-display text-xl font-bold">
              Remove Product?
            </DialogTitle>
            <DialogDescription className="text-center text-sm text-muted-foreground mt-2">
              Are you sure you want to remove{" "}
              <strong className="text-foreground">{deleteProductTarget?.name}</strong> from the website? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex flex-col sm:flex-row gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setDeleteProductTarget(null)}
              className="rounded-full w-full sm:w-auto flex-1 font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              disabled={isDeleting}
              onClick={confirmDelete}
              className="rounded-full w-full sm:w-auto flex-1 font-semibold"
            >
              {isDeleting ? "Deleting..." : "Delete Product"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
