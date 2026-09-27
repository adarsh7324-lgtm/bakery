import { createFileRoute } from "@tanstack/react-router";
import {
  Images,
  Plus,
  Trash2,
  User,
  Save,
  Upload,
  GripVertical,
  X,
} from "lucide-react";
import { useRef, useState } from "react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  galleryService,
  useGalleryPhotos,
  useOwnerDetails,
  type GalleryPhoto,
} from "@/services/galleryService";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/admin/gallery")({
  head: () => ({
    meta: [{ title: "Edit Gallery | Shree Bakers Admin" }],
  }),
  component: AdminGalleryPage,
});

const TAGS = ["Cakes", "Pastries", "Pizza", "Bakery", "Store Interior"];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

// ─── Photo Card ───────────────────────────────────────────────────────────────

function PhotoCard({
  photo,
  onDelete,
  onUpdate,
}: {
  photo: GalleryPhoto;
  onDelete: () => void;
  onUpdate: (updates: Partial<Omit<GalleryPhoto, "id">>) => void;
}) {
  return (
    <div className="group relative rounded-3xl border border-border/70 bg-card shadow-soft overflow-hidden flex flex-col">
      {/* Image */}
      <div className="relative aspect-[4/3] bg-secondary/40">
        <img
          src={photo.src}
          alt={photo.alt}
          className="h-full w-full object-cover"
        />
        {/* Delete button */}
        <button
          type="button"
          onClick={onDelete}
          className="absolute top-2 right-2 h-8 w-8 grid place-items-center rounded-full bg-destructive text-destructive-foreground opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
          aria-label="Delete photo"
        >
          <X className="h-4 w-4" />
        </button>
        <div className="absolute bottom-2 left-2 text-[10px] font-bold uppercase tracking-widest text-white bg-black/40 rounded-full px-2.5 py-1 backdrop-blur-sm">
          <GripVertical className="h-3 w-3 inline mr-1" />
          drag
        </div>
      </div>

      {/* Controls */}
      <div className="p-3 space-y-2 flex-1">
        <Input
          value={photo.alt}
          onChange={(e) => onUpdate({ alt: e.target.value })}
          placeholder="Caption / alt text"
          className="rounded-xl h-8 text-xs"
        />
        <select
          value={photo.tag}
          onChange={(e) => onUpdate({ tag: e.target.value })}
          className="w-full rounded-xl border border-border bg-background text-xs font-medium px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-caramel/40"
        >
          {TAGS.map((t) => (
            <option key={t} value={t}>
              {t}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

function AdminGalleryPage() {
  const photos = useGalleryPhotos();
  const owner = useOwnerDetails();

  // ── Owner form state ──
  const [ownerForm, setOwnerForm] = useState({
    name: owner.name,
    title: owner.title,
    bio: owner.bio,
    phone: owner.phone ?? "",
    email: owner.email ?? "",
    photo: owner.photo,
  });
  const [ownerPhotoPreview, setOwnerPhotoPreview] = useState(owner.photo);
  const ownerPhotoRef = useRef<HTMLInputElement>(null);
  const [ownerSaving, setOwnerSaving] = useState(false);

  // ── Gallery upload state ──
  const galleryInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  // Keep form in sync when owner data changes externally
  const syncedName = owner.name;
  if (ownerForm.name !== syncedName && !ownerSaving) {
    setOwnerForm({
      name: owner.name,
      title: owner.title,
      bio: owner.bio,
      phone: owner.phone ?? "",
      email: owner.email ?? "",
      photo: owner.photo,
    });
    setOwnerPhotoPreview(owner.photo);
  }

  // ── Owner handlers ──
  const handleOwnerPhotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const base64 = await fileToBase64(file);
    setOwnerPhotoPreview(base64);
    setOwnerForm((prev) => ({ ...prev, photo: base64 }));
  };

  const handleOwnerSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setOwnerSaving(true);
    try {
      galleryService.updateOwner(ownerForm);
      toast.success("Owner details saved successfully!");
    } catch {
      toast.error("Failed to save owner details");
    } finally {
      setOwnerSaving(false);
    }
  };

  // ── Gallery handlers ──
  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (!files.length) return;
    setUploading(true);
    try {
      for (const file of files) {
        const base64 = await fileToBase64(file);
        galleryService.addPhoto({
          src: base64,
          alt: file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " "),
          tag: "Cakes",
        });
      }
      toast.success(`${files.length} photo${files.length > 1 ? "s" : ""} added to gallery`);
    } catch {
      toast.error("Failed to upload photos");
    } finally {
      setUploading(false);
      if (galleryInputRef.current) galleryInputRef.current.value = "";
    }
  };

  const handlePhotoDelete = (id: string) => {
    if (window.confirm("Remove this photo from the gallery?")) {
      galleryService.deletePhoto(id);
      toast.success("Photo removed");
    }
  };

  const handlePhotoUpdate = (id: string, updates: Partial<Omit<GalleryPhoto, "id">>) => {
    galleryService.updatePhoto(id, updates);
  };

  return (
    <AdminLayout>
      {/* Page header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Edit Gallery & Owner
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage the public gallery photos and the owner profile shown on the About page.
          </p>
        </div>
      </div>

      {/* ── Owner Details ── */}
      <section className="mt-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="grid h-10 w-10 place-items-center rounded-2xl border text-caramel bg-caramel/10 border-caramel/20">
            <User className="h-5 w-5" />
          </div>
          <div>
            <h2 className="font-display text-xl font-bold">Owner Details</h2>
            <p className="text-xs text-muted-foreground">Shown in the lower section of the About page</p>
          </div>
        </div>

        <form
          onSubmit={handleOwnerSave}
          className="rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-6"
        >
          <div className="flex flex-col sm:flex-row gap-8 items-start">
            {/* Photo upload */}
            <div className="flex flex-col items-center gap-3 shrink-0">
              <div
                className="relative h-36 w-36 rounded-full overflow-hidden border-4 border-caramel/30 bg-secondary cursor-pointer group shadow-soft"
                onClick={() => ownerPhotoRef.current?.click()}
              >
                {ownerPhotoPreview ? (
                  <img
                    src={ownerPhotoPreview}
                    alt="Owner"
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="h-full w-full flex flex-col items-center justify-center text-muted-foreground">
                    <User className="h-12 w-12 opacity-40" />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity rounded-full">
                  <Upload className="h-6 w-6 text-white" />
                </div>
              </div>
              <button
                type="button"
                onClick={() => ownerPhotoRef.current?.click()}
                className="text-xs font-medium text-caramel hover:underline"
              >
                Change Photo
              </button>
              <input
                ref={ownerPhotoRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleOwnerPhotoChange}
              />
            </div>

            {/* Text fields */}
            <div className="flex-1 grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Full Name
                </label>
                <Input
                  value={ownerForm.name}
                  onChange={(e) => setOwnerForm((p) => ({ ...p, name: e.target.value }))}
                  placeholder="e.g. Adarsh Rai"
                  className="rounded-2xl"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Title / Role
                </label>
                <Input
                  value={ownerForm.title}
                  onChange={(e) => setOwnerForm((p) => ({ ...p, title: e.target.value }))}
                  placeholder="e.g. Founder & Head Baker"
                  className="rounded-2xl"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Phone
                </label>
                <Input
                  value={ownerForm.phone}
                  onChange={(e) => setOwnerForm((p) => ({ ...p, phone: e.target.value }))}
                  placeholder="+91 98765 43210"
                  className="rounded-2xl"
                  type="tel"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Email
                </label>
                <Input
                  value={ownerForm.email}
                  onChange={(e) => setOwnerForm((p) => ({ ...p, email: e.target.value }))}
                  placeholder="owner@shreebakers.com"
                  className="rounded-2xl"
                  type="email"
                />
              </div>
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                  Bio / Story
                </label>
                <textarea
                  value={ownerForm.bio}
                  onChange={(e) => setOwnerForm((p) => ({ ...p, bio: e.target.value }))}
                  placeholder="Tell the owner's story..."
                  rows={4}
                  className="w-full rounded-2xl border border-border bg-background px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-caramel/40 resize-none"
                />
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-2 border-t border-border/50">
            <Button
              type="submit"
              className="rounded-full px-8 font-semibold shadow-soft"
              disabled={ownerSaving}
            >
              <Save className="mr-2 h-4 w-4" />
              {ownerSaving ? "Saving…" : "Save Owner Details"}
            </Button>
          </div>
        </form>
      </section>

      {/* ── Gallery Management ── */}
      <section className="mt-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl border text-emerald-600 bg-emerald-500/10 border-emerald-500/20">
              <Images className="h-5 w-5" />
            </div>
            <div>
              <h2 className="font-display text-xl font-bold">Gallery Photos</h2>
              <p className="text-xs text-muted-foreground">
                {photos.length} custom photo{photos.length !== 1 ? "s" : ""} uploaded (static defaults always shown)
              </p>
            </div>
          </div>
          <Button
            type="button"
            onClick={() => galleryInputRef.current?.click()}
            disabled={uploading}
            className="rounded-full px-6 font-semibold shadow-soft"
          >
            <Plus className="mr-2 h-4 w-4" />
            {uploading ? "Uploading…" : "Add Photos"}
          </Button>
          <input
            ref={galleryInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleGalleryUpload}
          />
        </div>

        {photos.length === 0 ? (
          <div
            className="rounded-3xl border-2 border-dashed border-border/60 bg-card p-16 text-center cursor-pointer hover:border-caramel/40 hover:bg-caramel/5 transition-colors"
            onClick={() => galleryInputRef.current?.click()}
          >
            <Upload className="mx-auto h-10 w-10 text-muted-foreground/50 mb-4" />
            <p className="text-sm font-medium text-muted-foreground">
              Click to upload photos, or drag & drop
            </p>
            <p className="text-xs text-muted-foreground/60 mt-1">
              PNG, JPG, WEBP up to 10 MB each
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
            {photos.map((photo) => (
              <PhotoCard
                key={photo.id}
                photo={photo}
                onDelete={() => handlePhotoDelete(photo.id)}
                onUpdate={(updates) => handlePhotoUpdate(photo.id, updates)}
              />
            ))}
            {/* Add more button */}
            <div
              className={cn(
                "rounded-3xl border-2 border-dashed border-border/60 bg-card flex flex-col items-center justify-center gap-3 p-6 cursor-pointer hover:border-caramel/40 hover:bg-caramel/5 transition-colors aspect-[4/3]",
              )}
              onClick={() => galleryInputRef.current?.click()}
            >
              <Plus className="h-8 w-8 text-muted-foreground/50" />
              <span className="text-xs font-medium text-muted-foreground">Add More</span>
            </div>
          </div>
        )}
      </section>
    </AdminLayout>
  );
}
