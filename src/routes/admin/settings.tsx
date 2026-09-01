import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { Plus, Trash2, Tag, Bookmark } from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import { settingsService, useSettings } from "@/services/settingsService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export const Route = createFileRoute("/admin/settings")({
  head: () => ({
    meta: [{ title: "Settings | Shree Bakers Admin" }],
  }),
  component: AdminSettingsPage,
});

function AdminSettingsPage() {
  const settings = useSettings();
  const [newCategory, setNewCategory] = useState("");
  const [newBadge, setNewBadge] = useState("");

  const handleAddCategory = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newCategory.trim();
    if (!trimmed) return;
    
    if (settings.categories.includes(trimmed)) {
      toast.error("This category already exists");
      return;
    }

    settingsService.addCategory(trimmed);
    toast.success(`Category "${trimmed}" added successfully`);
    setNewCategory("");
  };

  const handleRemoveCategory = (category: string) => {
    if (window.confirm(`Are you sure you want to remove the category "${category}"?`)) {
      settingsService.removeCategory(category);
      toast.success(`Category "${category}" removed`);
    }
  };

  const handleAddBadge = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = newBadge.trim();
    if (!trimmed) return;
    
    if (settings.badges.includes(trimmed)) {
      toast.error("This badge already exists");
      return;
    }

    settingsService.addBadge(trimmed);
    toast.success(`Badge "${trimmed}" added successfully`);
    setNewBadge("");
  };

  const handleRemoveBadge = (badge: string) => {
    if (badge === "none") {
      toast.error("Cannot remove the default 'none' badge");
      return;
    }
    
    if (window.confirm(`Are you sure you want to remove the badge "${badge}"?`)) {
      settingsService.removeBadge(badge);
      toast.success(`Badge "${badge}" removed`);
    }
  };

  return (
    <AdminLayout>
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Settings
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage product categories and special badges for the store.
          </p>
        </div>
      </div>

      <div className="mt-8 grid gap-8 lg:grid-cols-2 max-w-5xl">
        {/* Categories Section */}
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-6 flex flex-col">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border text-caramel bg-caramel/10 border-caramel/20">
              <Bookmark className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Categories</h2>
              <p className="text-xs text-muted-foreground">Used to group products on the menu</p>
            </div>
          </div>

          <form onSubmit={handleAddCategory} className="flex gap-2">
            <Input
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
              placeholder="e.g. Special Combos"
              className="rounded-2xl"
            />
            <Button type="submit" className="rounded-2xl shrink-0 font-semibold shadow-soft">
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
            <ul className="space-y-2">
              {settings.categories.map((cat) => (
                <li key={cat} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background">
                  <span className="font-medium text-sm">{cat}</span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => handleRemoveCategory(cat)}
                    className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </li>
              ))}
              {settings.categories.length === 0 && (
                <li className="text-sm text-muted-foreground text-center py-4">No categories found</li>
              )}
            </ul>
          </div>
        </div>

        {/* Badges Section */}
        <div className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-6 flex flex-col">
          <div className="flex items-center gap-3 border-b border-border/50 pb-4">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
              <Tag className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Special Badges</h2>
              <p className="text-xs text-muted-foreground">Tags like "Best Seller" or "New"</p>
            </div>
          </div>

          <form onSubmit={handleAddBadge} className="flex gap-2">
            <Input
              value={newBadge}
              onChange={(e) => setNewBadge(e.target.value)}
              placeholder="e.g. Limited Edition"
              className="rounded-2xl"
            />
            <Button type="submit" className="rounded-2xl shrink-0 font-semibold shadow-soft bg-emerald-600 hover:bg-emerald-700 text-white">
              <Plus className="mr-1.5 h-4 w-4" /> Add
            </Button>
          </form>

          <div className="flex-1 overflow-y-auto pr-2" style={{ maxHeight: "400px" }}>
            <ul className="space-y-2">
              {settings.badges.map((badge) => (
                <li key={badge} className="flex items-center justify-between p-3 rounded-2xl border border-border bg-background">
                  <span className="font-medium text-sm">{badge}</span>
                  {badge !== "none" && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveBadge(badge)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </li>
              ))}
              {settings.badges.length === 0 && (
                <li className="text-sm text-muted-foreground text-center py-4">No badges found</li>
              )}
            </ul>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}
