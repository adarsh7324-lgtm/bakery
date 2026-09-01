import { createFileRoute, useNavigate, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { ArrowLeft, Upload } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import { productService } from "@/services/productService";
import { categories, type Category, type MenuItem } from "@/data/menu";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";

export const Route = createFileRoute("/admin/products/$id/edit")({
  head: () => ({
    meta: [{ title: "Edit Product | Shree Bakers Admin" }],
  }),
  component: EditProductPage,
});

function EditProductPage() {
  const { id } = Route.useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<MenuItem | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState<Category>("Cakes");
  const [imageUrl, setImageUrl] = useState("");
  const [available, setAvailable] = useState(true);
  const [featured, setFeatured] = useState(false);
  const [badge, setBadge] = useState<string>("none");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    let isMounted = true;
    productService.getProduct(id).then((found) => {
      if (isMounted) {
        if (!found) {
          toast.error("Product not found");
          navigate({ to: "/admin/products" });
          return;
        }
        setProduct(found);
        setName(found.name);
        setPrice(String(found.price));
        setDescription(found.description);
        setCategory(found.category);
        setImageUrl(found.image);
        setAvailable(found.available !== false);
        setFeatured(Boolean(found.featured));
        setBadge(found.badge || "none");
        setLoading(false);
      }
    });

    return () => {
      isMounted = false;
    };
  }, [id, navigate]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      toast.error("Please upload a valid image file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        setImageUrl(event.target.result as string);
        toast.success("Image updated!");
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return toast.error("Product name is required.");
    if (!price || isNaN(Number(price))) return toast.error("Please enter a valid price.");
    if (!description.trim()) return toast.error("Description is required.");

    setIsSubmitting(true);
    try {
      await productService.updateProduct(id, {
        name: name.trim(),
        price: Number(price),
        description: description.trim(),
        category,
        image: imageUrl,
        available,
        featured,
        badge: badge !== "none" ? (badge as any) : undefined,
      });

      toast.success(`Product "${name}" updated successfully!`);
      navigate({ to: "/admin/products" });
    } catch {
      toast.error("Failed to save changes.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div className="py-20 text-center text-muted-foreground">Loading product details...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="flex items-center gap-3 pb-6 border-b border-border/60">
        <Button asChild variant="outline" size="sm" className="rounded-full">
          <Link to="/admin/products">
            <ArrowLeft className="h-4 w-4 mr-1" /> Back
          </Link>
        </Button>
        <div>
          <h1 className="font-display text-2xl font-bold">Edit Product</h1>
          <p className="text-xs text-muted-foreground">Modify product attributes, price, or image</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1.5fr)_minmax(0,1fr)] max-w-5xl">
        {/* Main Details */}
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-5">
          <div>
            <Label htmlFor="name">Product Name *</Label>
            <Input
              id="name"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 rounded-2xl"
            />
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label htmlFor="price">Price (₹) *</Label>
              <Input
                id="price"
                type="number"
                min={1}
                required
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                className="mt-2 rounded-2xl"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <Select value={category} onValueChange={(val) => setCategory(val as Category)}>
                <SelectTrigger className="mt-2 rounded-2xl">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((cat) => (
                    <SelectItem key={cat} value={cat}>
                      {cat}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <Textarea
              id="description"
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="mt-2 rounded-2xl"
            />
          </div>

          <div>
            <Label htmlFor="badge">Special Badge</Label>
            <Select value={badge} onValueChange={setBadge}>
              <SelectTrigger className="mt-2 rounded-2xl">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">None</SelectItem>
                <SelectItem value="Best Seller">Best Seller</SelectItem>
                <SelectItem value="New">New</SelectItem>
                <SelectItem value="20% OFF">20% OFF</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Media & Options */}
        <div className="space-y-6">
          {/* Image Upload Box */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft">
            <Label>Current Image</Label>
            <div className="mt-3 aspect-[4/3] rounded-2xl border-2 border-dashed border-border/80 bg-secondary/50 flex flex-col items-center justify-center p-4 relative overflow-hidden group">
              <img src={imageUrl} alt="Current Product" className="h-full w-full object-cover rounded-xl" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                <label className="cursor-pointer bg-white text-black font-semibold text-xs px-4 py-2 rounded-full shadow-lg flex items-center gap-1.5">
                  <Upload className="h-3.5 w-3.5" /> Replace Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              </div>
            </div>
          </div>

          {/* Status Switches */}
          <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label className="font-semibold text-foreground">Availability</Label>
                <p className="text-xs text-muted-foreground">Available to purchase vs Sold Out</p>
              </div>
              <Switch checked={available} onCheckedChange={setAvailable} />
            </div>

            <div className="flex items-center justify-between border-t border-border/50 pt-4">
              <div>
                <Label className="font-semibold text-foreground">Featured Product</Label>
                <p className="text-xs text-muted-foreground">Display in Homepage featured section</p>
              </div>
              <Switch checked={featured} onCheckedChange={setFeatured} />
            </div>
          </div>

          {/* Form Actions */}
          <div className="flex gap-3">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate({ to: "/admin/products" })}
              className="flex-1 rounded-full font-semibold"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="flex-1 rounded-full font-semibold shadow-soft"
            >
              {isSubmitting ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        </div>
      </form>
    </AdminLayout>
  );
}
