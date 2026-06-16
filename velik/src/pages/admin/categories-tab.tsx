import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useToast } from "@/hooks/use-toast";
import { adminFetch, slugify } from "./api";
import { Pencil, Trash2, Plus } from "lucide-react";

type Category = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  description?: string | null;
  imageUrl?: string | null;
  productCount: number;
};

type FormData = { name: string; slug: string; icon: string; description: string; imageUrl: string };
const empty: FormData = { name: "", slug: "", icon: "📦", description: "", imageUrl: "" };

export default function CategoriesTab() {
  const [items, setItems] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function load() {
    const data = await adminFetch<Category[]>("GET", "/api/categories");
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() {
    setEditId(null);
    setForm(empty);
    setModalOpen(true);
  }

  function openEdit(cat: Category) {
    setEditId(cat.id);
    setForm({ name: cat.name, slug: cat.slug, icon: cat.icon, description: cat.description ?? "", imageUrl: cat.imageUrl ?? "" });
    setModalOpen(true);
  }

  function set(key: keyof FormData, val: string) {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "name" && !editId) next.slug = slugify(val);
      return next;
    });
  }

  async function save() {
    if (!form.name || !form.slug) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = { name: form.name, slug: form.slug, icon: form.icon, description: form.description || null, imageUrl: form.imageUrl || null };
      if (editId) {
        await adminFetch("PATCH", `/api/categories/${editId}`, body);
      } else {
        await adminFetch("POST", "/api/categories", body);
      }
      toast({ title: editId ? "Категория обновлена" : "Категория создана" });
      setModalOpen(false);
      load();
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  async function remove(id: number) {
    try {
      await adminFetch("DELETE", `/api/categories/${id}`);
      toast({ title: "Категория удалена" });
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    }
  }

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Категории ({items.length})</h2>
          <Button size="sm" onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white gap-1">
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Название</TableHead>
              <TableHead className="text-muted-foreground">Slug</TableHead>
              <TableHead className="text-muted-foreground">Товаров</TableHead>
              <TableHead className="text-muted-foreground text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
            ) : items.map((cat) => (
              <TableRow key={cat.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white/60">#{cat.id}</TableCell>
                <TableCell className="text-white font-medium">{cat.name}</TableCell>
                <TableCell className="text-white/60 font-mono text-xs">{cat.slug}</TableCell>
                <TableCell className="text-white/80">{cat.productCount}</TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => openEdit(cat)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400/60 hover:text-red-400 h-8 w-8 p-0" onClick={() => setDeleteId(cat.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Редактировать категорию" : "Новая категория"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/70 mb-1 block">Название *</Label>
              <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Велосипеды" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Slug *</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" placeholder="velosipedy" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Описание</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Краткое описание" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">URL изображения</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setModalOpen(false)} className="text-white/60 hover:text-white">Отмена</Button>
            <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90 text-white">
              {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={deleteId !== null} onOpenChange={() => setDeleteId(null)}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white max-w-sm">
          <DialogHeader><DialogTitle>Удалить категорию?</DialogTitle></DialogHeader>
          <p className="text-white/60 text-sm">Это действие нельзя отменить.</p>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setDeleteId(null)} className="text-white/60 hover:text-white">Отмена</Button>
            <Button variant="destructive" onClick={() => deleteId && remove(deleteId)}>Удалить</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
