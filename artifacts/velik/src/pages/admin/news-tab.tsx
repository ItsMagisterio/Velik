import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminFetch, slugify } from "./api";
import { Pencil, Trash2, Plus } from "lucide-react";

type NewsItem = {
  id: number;
  title: string;
  slug: string;
  content: string;
  excerpt?: string | null;
  imageUrl?: string | null;
  isPublished: boolean;
  createdAt: string;
};

type FormData = { title: string; slug: string; content: string; excerpt: string; imageUrl: string; isPublished: boolean };
const empty: FormData = { title: "", slug: "", content: "", excerpt: "", imageUrl: "", isPublished: true };

export default function NewsTab() {
  const [items, setItems] = useState<NewsItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function load() {
    const data = await adminFetch<NewsItem[]>("GET", "/api/news");
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditId(null); setForm(empty); setModalOpen(true); }

  function openEdit(item: NewsItem) {
    setEditId(item.id);
    setForm({ title: item.title, slug: item.slug, content: item.content, excerpt: item.excerpt ?? "", imageUrl: item.imageUrl ?? "", isPublished: item.isPublished });
    setModalOpen(true);
  }

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "title" && !editId) (next as any).slug = slugify(String(val));
      return next;
    });
  }

  async function save() {
    if (!form.title || !form.slug || !form.content) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = { title: form.title, slug: form.slug, content: form.content, excerpt: form.excerpt || null, imageUrl: form.imageUrl || null, isPublished: form.isPublished };
      if (editId) await adminFetch("PATCH", `/api/news/${editId}`, body);
      else await adminFetch("POST", "/api/news", body);
      toast({ title: editId ? "Новость обновлена" : "Новость создана" });
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
      await adminFetch("DELETE", `/api/news/${id}`);
      toast({ title: "Новость удалена" });
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
          <h2 className="text-lg font-semibold text-white">Новости ({items.length})</h2>
          <Button size="sm" onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white gap-1">
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Заголовок</TableHead>
              <TableHead className="text-muted-foreground">Slug</TableHead>
              <TableHead className="text-muted-foreground">Дата</TableHead>
              <TableHead className="text-muted-foreground">Статус</TableHead>
              <TableHead className="text-muted-foreground text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Новостей пока нет</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white/60">#{item.id}</TableCell>
                <TableCell className="text-white font-medium max-w-[280px] truncate">{item.title}</TableCell>
                <TableCell className="text-white/60 font-mono text-xs">{item.slug}</TableCell>
                <TableCell className="text-white/60">{new Date(item.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={item.isPublished ? "border-green-500/50 text-green-400" : "border-white/20 text-white/40"}>
                    {item.isPublished ? "Опубликована" : "Черновик"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => openEdit(item)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400/60 hover:text-red-400 h-8 w-8 p-0" onClick={() => setDeleteId(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{editId ? "Редактировать новость" : "Новая новость"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/70 mb-1 block">Заголовок *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Заголовок новости" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Slug *</Label>
              <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Краткое описание</Label>
              <Input value={form.excerpt} onChange={(e) => set("excerpt", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Краткий анонс..." />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Содержание *</Label>
              <textarea
                value={form.content}
                onChange={(e) => set("content", e.target.value)}
                rows={8}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Полный текст новости..."
              />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">URL изображения</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="news-published" checked={form.isPublished} onChange={(e) => set("isPublished", e.target.checked)} className="w-4 h-4 accent-primary" />
              <Label htmlFor="news-published" className="text-white/70 cursor-pointer">Опубликовать</Label>
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
          <DialogHeader><DialogTitle>Удалить новость?</DialogTitle></DialogHeader>
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
