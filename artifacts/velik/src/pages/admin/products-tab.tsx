import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import { adminFetch, slugify } from "./api";
import { Pencil, Trash2, Plus } from "lucide-react";

type Category = { id: number; name: string };
type Product = {
  id: number; name: string; slug: string; price: number; oldPrice?: number | null;
  categoryId: number; brand: string; inStock: boolean; stockCount: number;
  imageUrl: string; badge?: string | null; isFeatured: boolean; isNew: boolean;
  discountPercent?: number | null; description?: string | null;
  specs?: Record<string, string> | null; rating: number; reviewCount: number;
};

type FormData = {
  name: string; slug: string; price: string; oldPrice: string; categoryId: string;
  brand: string; inStock: boolean; stockCount: string; imageUrl: string;
  badge: string; isFeatured: boolean; isNew: boolean; discountPercent: string;
  description: string; specs: { key: string; value: string }[];
};

const empty: FormData = {
  name: "", slug: "", price: "", oldPrice: "", categoryId: "", brand: "", inStock: true,
  stockCount: "0", imageUrl: "", badge: "", isFeatured: false, isNew: false,
  discountPercent: "", description: "", specs: [],
};

export default function ProductsTab() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [form, setForm] = useState<FormData>(empty);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  async function load() {
    const [prods, cats] = await Promise.all([
      adminFetch<{ items: Product[] }>("GET", "/api/products?limit=100"),
      adminFetch<Category[]>("GET", "/api/categories"),
    ]);
    setProducts(prods.items);
    setCategories(cats);
    setLoading(false);
  }

  useEffect(() => { load(); }, []);

  function openCreate() { setEditId(null); setForm(empty); setModalOpen(true); }

  function openEdit(p: Product) {
    setEditId(p.id);
    setForm({
      name: p.name, slug: p.slug, price: String(p.price), oldPrice: p.oldPrice != null ? String(p.oldPrice) : "",
      categoryId: String(p.categoryId), brand: p.brand, inStock: p.inStock, stockCount: String(p.stockCount),
      imageUrl: p.imageUrl, badge: p.badge ?? "", isFeatured: p.isFeatured, isNew: p.isNew,
      discountPercent: p.discountPercent != null ? String(p.discountPercent) : "", description: p.description ?? "",
      specs: p.specs ? Object.entries(p.specs).map(([key, value]) => ({ key, value })) : [],
    });
    setModalOpen(true);
  }

  function set<K extends keyof FormData>(key: K, val: FormData[K]) {
    setForm((prev) => {
      const next = { ...prev, [key]: val };
      if (key === "name" && !editId) (next as any).slug = slugify(String(val));
      return next;
    });
  }

  function addSpec() { setForm((prev) => ({ ...prev, specs: [...prev.specs, { key: "", value: "" }] })); }
  function updateSpec(i: number, field: "key" | "value", val: string) {
    setForm((prev) => { const specs = [...prev.specs]; specs[i] = { ...specs[i], [field]: val }; return { ...prev, specs }; });
  }
  function removeSpec(i: number) { setForm((prev) => ({ ...prev, specs: prev.specs.filter((_, idx) => idx !== i) })); }

  async function save() {
    if (!form.name || !form.slug || !form.price || !form.categoryId || !form.brand || !form.imageUrl) {
      toast({ title: "Заполните обязательные поля", variant: "destructive" });
      return;
    }
    setSaving(true);
    try {
      const specsObj = form.specs.length > 0
        ? Object.fromEntries(form.specs.filter((s) => s.key).map((s) => [s.key, s.value]))
        : undefined;
      const body = {
        name: form.name, slug: form.slug, price: Number(form.price),
        oldPrice: form.oldPrice ? Number(form.oldPrice) : null,
        categoryId: Number(form.categoryId), brand: form.brand, inStock: form.inStock,
        stockCount: Number(form.stockCount), imageUrl: form.imageUrl, images: [],
        badge: form.badge || null, isFeatured: form.isFeatured, isNew: form.isNew,
        discountPercent: form.discountPercent ? Number(form.discountPercent) : null,
        description: form.description || null, specs: specsObj,
      };
      if (editId) await adminFetch("PATCH", `/api/products/${editId}`, body);
      else await adminFetch("POST", "/api/products", body);
      toast({ title: editId ? "Товар обновлён" : "Товар создан" });
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
      await adminFetch("DELETE", `/api/products/${id}`);
      toast({ title: "Товар удалён" });
      setDeleteId(null);
      load();
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    }
  }

  const catMap = Object.fromEntries(categories.map((c) => [c.id, c.name]));

  return (
    <>
      <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
        <div className="px-6 py-4 border-b border-white/5 flex items-center justify-between">
          <h2 className="text-lg font-semibold text-white">Товары ({products.length})</h2>
          <Button size="sm" onClick={openCreate} className="bg-primary hover:bg-primary/90 text-white gap-1">
            <Plus className="h-4 w-4" /> Добавить
          </Button>
        </div>
        <Table>
          <TableHeader className="bg-black/20">
            <TableRow className="border-white/10 hover:bg-transparent">
              <TableHead className="text-muted-foreground">Фото</TableHead>
              <TableHead className="text-muted-foreground">Название</TableHead>
              <TableHead className="text-muted-foreground">Бренд</TableHead>
              <TableHead className="text-muted-foreground">Категория</TableHead>
              <TableHead className="text-muted-foreground">Цена</TableHead>
              <TableHead className="text-muted-foreground">Склад</TableHead>
              <TableHead className="text-muted-foreground text-right">Действия</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {loading ? (
              <TableRow><TableCell colSpan={7} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
            ) : products.map((p) => (
              <TableRow key={p.id} className="border-white/5 hover:bg-white/5">
                <TableCell>
                  {p.imageUrl && <img src={p.imageUrl} alt={p.name} className="w-10 h-10 rounded-lg object-cover bg-white/5" />}
                </TableCell>
                <TableCell>
                  <div className="text-white font-medium max-w-[200px] truncate">{p.name}</div>
                  <div className="flex gap-1 mt-1">
                    {p.isFeatured && <Badge variant="outline" className="text-[10px] h-4 border-primary/40 text-primary px-1">Хит</Badge>}
                    {p.isNew && <Badge variant="outline" className="text-[10px] h-4 border-secondary/40 text-secondary px-1">Новинка</Badge>}
                    {p.badge && <Badge variant="outline" className="text-[10px] h-4 border-yellow-500/40 text-yellow-400 px-1">{p.badge}</Badge>}
                  </div>
                </TableCell>
                <TableCell className="text-white/80">{p.brand}</TableCell>
                <TableCell className="text-white/60 text-sm">{catMap[p.categoryId] ?? "—"}</TableCell>
                <TableCell>
                  <div className="text-white font-semibold">{p.price.toLocaleString("ru-RU")} BYN</div>
                  {p.oldPrice && <div className="text-xs text-white/40 line-through">{p.oldPrice.toLocaleString("ru-RU")}</div>}
                </TableCell>
                <TableCell>
                  <Badge variant="outline" className={p.inStock ? "border-green-500/50 text-green-400" : "border-red-500/50 text-red-400"}>
                    {p.inStock ? `${p.stockCount} шт.` : "Нет"}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button size="sm" variant="ghost" className="text-white/60 hover:text-white h-8 w-8 p-0" onClick={() => openEdit(p)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="ghost" className="text-red-400/60 hover:text-red-400 h-8 w-8 p-0" onClick={() => setDeleteId(p.id)}>
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
            <DialogTitle>{editId ? "Редактировать товар" : "Новый товар"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div className="col-span-2">
                <Label className="text-white/70 mb-1 block">Название *</Label>
                <Input value={form.name} onChange={(e) => set("name", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Trek Marlin 5" />
              </div>
              <div className="col-span-2">
                <Label className="text-white/70 mb-1 block">Slug *</Label>
                <Input value={form.slug} onChange={(e) => set("slug", e.target.value)} className="bg-white/5 border-white/10 text-white font-mono text-sm" />
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <Label className="text-white/70 mb-1 block">Цена (BYN) *</Label>
                <Input type="number" value={form.price} onChange={(e) => set("price", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="999" />
              </div>
              <div>
                <Label className="text-white/70 mb-1 block">Старая цена</Label>
                <Input type="number" value={form.oldPrice} onChange={(e) => set("oldPrice", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="1299" />
              </div>
              <div>
                <Label className="text-white/70 mb-1 block">Скидка (%)</Label>
                <Input type="number" value={form.discountPercent} onChange={(e) => set("discountPercent", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="20" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 mb-1 block">Категория *</Label>
                <Select value={form.categoryId} onValueChange={(v) => set("categoryId", v)}>
                  <SelectTrigger className="bg-white/5 border-white/10 text-white">
                    <SelectValue placeholder="Выберите..." />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((c) => <SelectItem key={c.id} value={String(c.id)}>{c.name}</SelectItem>)}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label className="text-white/70 mb-1 block">Бренд *</Label>
                <Input value={form.brand} onChange={(e) => set("brand", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Trek" />
              </div>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-white/70 mb-1 block">Кол-во на складе</Label>
                <Input type="number" value={form.stockCount} onChange={(e) => set("stockCount", e.target.value)} className="bg-white/5 border-white/10 text-white" />
              </div>
              <div>
                <Label className="text-white/70 mb-1 block">Бейдж</Label>
                <Input value={form.badge} onChange={(e) => set("badge", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="Хит, Скидка..." />
              </div>
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">URL изображения *</Label>
              <Input value={form.imageUrl} onChange={(e) => set("imageUrl", e.target.value)} className="bg-white/5 border-white/10 text-white" placeholder="https://images.unsplash.com/..." />
            </div>
            <div>
              <Label className="text-white/70 mb-1 block">Описание</Label>
              <textarea
                value={form.description}
                onChange={(e) => set("description", e.target.value)}
                rows={3}
                className="w-full rounded-md bg-white/5 border border-white/10 text-white text-sm px-3 py-2 resize-y focus:outline-none focus:ring-1 focus:ring-primary"
                placeholder="Описание товара..."
              />
            </div>
            <div className="flex items-center gap-6">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.inStock} onChange={(e) => set("inStock", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-white/70 text-sm">В наличии</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isFeatured} onChange={(e) => set("isFeatured", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-white/70 text-sm">Хит продаж</span>
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.isNew} onChange={(e) => set("isNew", e.target.checked)} className="w-4 h-4 accent-primary" />
                <span className="text-white/70 text-sm">Новинка</span>
              </label>
            </div>
            <div>
              <div className="flex items-center justify-between mb-2">
                <Label className="text-white/70">Характеристики</Label>
                <Button size="sm" variant="ghost" onClick={addSpec} className="text-primary hover:text-white text-xs h-6 px-2">
                  + Добавить
                </Button>
              </div>
              <div className="space-y-2">
                {form.specs.map((spec, i) => (
                  <div key={i} className="flex gap-2">
                    <Input value={spec.key} onChange={(e) => updateSpec(i, "key", e.target.value)} placeholder="Ключ" className="bg-white/5 border-white/10 text-white text-sm" />
                    <Input value={spec.value} onChange={(e) => updateSpec(i, "value", e.target.value)} placeholder="Значение" className="bg-white/5 border-white/10 text-white text-sm" />
                    <Button size="sm" variant="ghost" onClick={() => removeSpec(i)} className="text-red-400/60 hover:text-red-400 h-9 w-9 p-0 shrink-0">×</Button>
                  </div>
                ))}
              </div>
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
          <DialogHeader><DialogTitle>Удалить товар?</DialogTitle></DialogHeader>
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
