import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "./api";
import { Pencil, Trash2, Plus } from "lucide-react";

type Promotion = {
  id: number;
  title: string;
  description: string;
  discountPercent: number;
  imageUrl?: string | null;
  isActive: boolean;
  expiresAt?: string | null;
  createdAt: string;
};

type FormData = { title: string; description: string; discountPercent: string; imageUrl: string; isActive: boolean; expiresAt: string };
const empty: FormData = { title: "", description: "", discountPercent: "", imageUrl: "", isActive: true, expiresAt: "" };

export default function PromotionsTab() {
  const [items, setItems] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function load() {
    const data = await adminFetch<Promotion[]>("GET", "/api/promotions?all=true");
    setItems(data);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditId(null); setForm(empty); setModalOpen(true); }

  function openEdit(item: Promotion) {
    setEditId(item.id);
    setForm({
      title: item.title, description: item.description, discountPercent: String(item.discountPercent),
      imageUrl: item.imageUrl ?? "", isActive: item.isActive,
      expiresAt: item.expiresAt ? item.expiresAt.slice(0, 10) : "",
    });
    setModalOpen(true);
  }

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => ({ ...prev, [key]: val }));
  }

  async function save() {
    if (!form.title || !form.description || !form.discountPercent) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: form.title, description: form.description, discountPercent: Number(form.discountPercent),
        imageUrl: form.imageUrl || null, isActive: form.isActive,
        expiresAt: form.expiresAt ? new Date(form.expiresAt).toISOString() : null,
      };
      if (editId) await adminFetch("PATCH", `/api/promotions/${editId}`, body);
      else await adminFetch("POST", "/api/promotions", body);
      toast({ title: editId ? "Акция обновлена" : "Акция создана" });
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
      await adminFetch("DELETE", `/api/promotions/${id}`);
      toast({ title: "Акция удалена" });
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
          <h2 className="text-lg font-semibold text-white">Акции ({items.length})</h2>
          <Button size="sm" onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white gap-1">
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">ID</TableHead>
              <TableHead className="text-muted-foreground">Название</TableHead>
              <TableHead className="text-muted-foreground">Скидка</TableHead>
              <TableHead className="text-muted-foreground">Истекает</TableHead>
              <TableHead className="text-muted-foreground">Статус</TableHead>
              <TableHead className="text-muted-foreground text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
            ) : items.length === 0 ? (
              <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Акций пока нет</TableCell></TableRow>
            ) : items.map((item) => (
              <TableRow key={item.id} className="border-white/5 hover:bg-white/5">
                <TableCell className="text-white/60">#{item.id}</TableCell>
                <TableCell>
                  <div className="text-white font-medium">{item.title}</div>
                  <div className="text-xs text-muted-foreground max-w-[220px] truncate">{item.description}</div>
                </TableCell>
                <TableCell className="text-primary font-bold">-{item.discountPercent}%</TableCell>
                <TableCell className="text-white/60">{item.expiresAt ? new Date(item.expiresAt).toLocaleDateString("ru-RU") : "—"}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={item.isActive ? "border-green-500/50 text-green-400" : "border-white/20 text-white/40"}>
                    {item.isActive ? "Активна" : "Неактивна"}
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
        <DialogContent className="bg-[#0f0f1a] border-white/10 text-white max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Редактировать акцию" : "Новая акция"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-white/70 mb-1 block">Название *</Label>
              <Input value={form.title} onChange={(e) => set("title", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Летняя распродажа" />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Описание *</Label>
              <Input value={form.description} onChange={(e) => set("description", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Скидки до 30% на все велосипеды" />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 mb-1 block">Скидка (%) *</Label>
                <Input type="number" value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="20" min={1} max={100} />
              </div>
              <div>
                <Label className="text-white/70 mb-1 block">Дата окончания</Label>
                <Input type="date" value={form.expiresAt} onChange={(e) => set("expiresAt", e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">URL изображения</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="https://..." />
            </div>
            <div className="flex items-center gap-3">
              <input type="checkbox" id="promo-active" checked={form.isActive} onChange={(e) => set("isActive", e.target.checked)} className="w-4 h-4 accent-primary" />
              <Label htmlFor="promo-active" className="text-white/70 cursor-pointer">Активна</Label>
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
          <DialogHeader><DialogTitle>Удалить акцию?</DialogTitle></DialogHeader>
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
