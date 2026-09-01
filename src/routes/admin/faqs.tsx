import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  Plus,
  Pencil,
  Trash2,
  Eye,
  EyeOff,
  ChevronUp,
  ChevronDown,
  MessageSquare,
} from "lucide-react";
import { toast } from "sonner";
import { AdminLayout } from "@/components/admin/admin-layout";
import {
  faqService,
  useAllFAQs,
  type FAQ,
  type FAQCategory,
  type CreateFAQInput,
} from "@/services/faqService";
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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";

export const Route = createFileRoute("/admin/faqs")({
  head: () => ({
    meta: [{ title: "Chat Assistant - FAQs | Shree Bakers Admin" }],
  }),
  component: AdminFAQsPage,
});

const CATEGORIES: FAQCategory[] = [
  "General",
  "Products",
  "Cakes",
  "Delivery",
  "Orders",
  "Payments",
];

type FormState = {
  question: string;
  answer: string;
  category: FAQCategory;
  visible: boolean;
};

const defaultForm: FormState = {
  question: "",
  answer: "",
  category: "General",
  visible: true,
};

function AdminFAQsPage() {
  const { faqs, loading } = useAllFAQs();
  const [formMode, setFormMode] = useState<"none" | "add" | "edit">("none");
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(defaultForm);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const openAdd = () => {
    setForm(defaultForm);
    setEditingId(null);
    setFormMode("add");
  };

  const openEdit = (faq: FAQ) => {
    setForm({
      question: faq.question,
      answer: faq.answer,
      category: faq.category,
      visible: faq.visible,
    });
    setEditingId(faq.id);
    setFormMode("edit");
  };

  const cancelForm = () => {
    setFormMode("none");
    setEditingId(null);
  };

  const handleSave = async () => {
    if (!form.question.trim()) { toast.error("Question is required"); return; }
    if (!form.answer.trim()) { toast.error("Answer is required"); return; }
    setSaving(true);
    try {
      if (formMode === "add") {
        await faqService.createFAQ(form as CreateFAQInput);
        toast.success("FAQ added successfully");
      } else if (formMode === "edit" && editingId) {
        await faqService.updateFAQ(editingId, form);
        toast.success("FAQ updated successfully");
      }
      setFormMode("none");
      setEditingId(null);
    } catch {
      toast.error("Failed to save FAQ");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await faqService.deleteFAQ(id);
      toast.success("FAQ deleted");
    } catch {
      toast.error("Failed to delete FAQ");
    } finally {
      setDeleteConfirmId(null);
    }
  };

  const handleToggleVisibility = async (id: string) => {
    try {
      const updated = await faqService.toggleVisibility(id);
      toast.success(updated.visible ? "FAQ is now visible to customers" : "FAQ hidden from customers");
    } catch {
      toast.error("Failed to update visibility");
    }
  };

  const handleMove = async (id: string, direction: "up" | "down") => {
    try {
      await faqService.moveFAQ(id, direction);
    } catch {
      toast.error("Failed to reorder");
    }
  };

  return (
    <AdminLayout>
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-border/60">
        <div>
          <h1 className="font-display text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            Chat Assistant
          </h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage predefined questions and answers shown in the customer chat widget.
          </p>
        </div>
        <Button
          onClick={openAdd}
          className="rounded-full font-semibold shadow-soft shrink-0"
        >
          <Plus className="mr-1.5 h-4 w-4" /> Add Question
        </Button>
      </div>

      {/* Stats */}
      <div className="mt-6 grid grid-cols-2 sm:grid-cols-3 gap-4">
        {[
          { label: "Total FAQs", value: faqs.length, color: "text-foreground" },
          {
            label: "Visible",
            value: faqs.filter((f) => f.visible).length,
            color: "text-emerald-600",
          },
          {
            label: "Hidden",
            value: faqs.filter((f) => !f.visible).length,
            color: "text-muted-foreground",
          },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-2xl border border-border/70 bg-card p-4 shadow-soft"
          >
            <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {s.label}
            </p>
            <p className={`mt-1 font-display text-3xl font-bold ${s.color}`}>
              {s.value}
            </p>
          </div>
        ))}
      </div>

      {/* Add/Edit Form */}
      {formMode !== "none" && (
        <div className="mt-8 rounded-3xl border border-border/70 bg-card p-6 shadow-soft space-y-5">
          <h2 className="font-display text-lg font-bold">
            {formMode === "add" ? "Add New Question" : "Edit Question"}
          </h2>

          <div className="space-y-4">
            <div>
              <Label htmlFor="faq-question">Question *</Label>
              <Input
                id="faq-question"
                value={form.question}
                onChange={(e) => setForm((f) => ({ ...f, question: e.target.value }))}
                placeholder="e.g. What is the delivery time?"
                className="mt-1.5 rounded-2xl"
              />
            </div>
            <div>
              <Label htmlFor="faq-answer">Answer *</Label>
              <Textarea
                id="faq-answer"
                rows={4}
                value={form.answer}
                onChange={(e) => setForm((f) => ({ ...f, answer: e.target.value }))}
                placeholder="Write a clear, helpful answer..."
                className="mt-1.5 rounded-2xl"
              />
            </div>
            <div className="grid sm:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="faq-category">Category</Label>
                <Select
                  value={form.category}
                  onValueChange={(val) =>
                    setForm((f) => ({ ...f, category: val as FAQCategory }))
                  }
                >
                  <SelectTrigger id="faq-category" className="mt-1.5 rounded-2xl">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {CATEGORIES.map((c) => (
                      <SelectItem key={c} value={c}>{c}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-6">
                <Switch
                  id="faq-visible"
                  checked={form.visible}
                  onCheckedChange={(checked) =>
                    setForm((f) => ({ ...f, visible: checked }))
                  }
                />
                <Label htmlFor="faq-visible" className="cursor-pointer">
                  {form.visible ? "Visible to customers" : "Hidden from customers"}
                </Label>
              </div>
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <Button onClick={handleSave} disabled={saving} className="rounded-full font-semibold">
              {saving ? "Saving..." : formMode === "add" ? "Save FAQ" : "Update FAQ"}
            </Button>
            <Button variant="outline" onClick={cancelForm} className="rounded-full">
              Cancel
            </Button>
          </div>
        </div>
      )}

      {/* FAQ List */}
      <div className="mt-8 space-y-3">
        {loading ? (
          <div className="space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-20 animate-pulse rounded-2xl bg-card border border-border" />
            ))}
          </div>
        ) : faqs.length === 0 ? (
          <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-border py-16 text-center">
            <MessageSquare className="h-10 w-10 text-muted-foreground mb-3" />
            <p className="font-semibold text-foreground">No FAQs yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Click "Add Question" to create your first FAQ.
            </p>
          </div>
        ) : (
          faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`rounded-2xl border bg-card p-4 shadow-soft transition-all ${
                !faq.visible ? "opacity-60 border-dashed" : "border-border/70"
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Order Controls */}
                <div className="flex flex-col gap-0.5 shrink-0 mt-0.5">
                  <button
                    aria-label="Move up"
                    onClick={() => handleMove(faq.id, "up")}
                    disabled={index === 0}
                    className="grid h-6 w-6 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronUp className="h-3.5 w-3.5" />
                  </button>
                  <button
                    aria-label="Move down"
                    onClick={() => handleMove(faq.id, "down")}
                    disabled={index === faqs.length - 1}
                    className="grid h-6 w-6 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronDown className="h-3.5 w-3.5" />
                  </button>
                </div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className="font-semibold text-sm text-foreground leading-snug">
                      {faq.question}
                    </span>
                    <Badge
                      variant="outline"
                      className="text-[10px] px-2 py-0 h-5 border-border/70 shrink-0"
                    >
                      {faq.category}
                    </Badge>
                    {faq.visible ? (
                      <Badge className="text-[10px] px-2 py-0 h-5 bg-emerald-500/15 text-emerald-700 border-emerald-500/30 hover:bg-emerald-500/15 shrink-0">
                        Visible
                      </Badge>
                    ) : (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-2 py-0 h-5 text-muted-foreground shrink-0"
                      >
                        Hidden
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground line-clamp-2 leading-relaxed">
                    {faq.answer}
                  </p>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    aria-label={faq.visible ? "Hide FAQ" : "Show FAQ"}
                    onClick={() => handleToggleVisibility(faq.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary transition-colors"
                    title={faq.visible ? "Hide" : "Show"}
                  >
                    {faq.visible ? (
                      <Eye className="h-4 w-4" />
                    ) : (
                      <EyeOff className="h-4 w-4" />
                    )}
                  </button>
                  <button
                    aria-label="Edit FAQ"
                    onClick={() => openEdit(faq)}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-secondary transition-colors"
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    aria-label="Delete FAQ"
                    onClick={() => setDeleteConfirmId(faq.id)}
                    className="grid h-8 w-8 place-items-center rounded-xl border border-border text-muted-foreground hover:bg-destructive hover:text-destructive-foreground hover:border-destructive transition-colors"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Delete Confirm Dialog */}
      <Dialog
        open={deleteConfirmId !== null}
        onOpenChange={(open) => !open && setDeleteConfirmId(null)}
      >
        <DialogContent className="rounded-3xl">
          <DialogHeader>
            <DialogTitle>Delete this question?</DialogTitle>
            <DialogDescription>
              This action cannot be undone. The question and its answer will be permanently removed from the customer chat widget.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="gap-2">
            <Button variant="outline" className="rounded-full" onClick={() => setDeleteConfirmId(null)}>
              Cancel
            </Button>
            <Button
              variant="destructive"
              className="rounded-full"
              onClick={() => deleteConfirmId && handleDelete(deleteConfirmId)}
            >
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </AdminLayout>
  );
}
