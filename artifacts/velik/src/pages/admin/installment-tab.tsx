import { useEffect, useState } from "react";
import { CreditCard, RotateCcw, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { defaultInstallmentContent, type InstallmentPageContent } from "@/lib/installment-content";
import { adminFetch } from "./api";

const multilineToArray = (value: string) => value.split("\n").map((line) => line.trim()).filter(Boolean);
const arrayToMultiline = (value: string[]) => value.join("\n");

export default function InstallmentTab() {
  const [form, setForm] = useState<InstallmentPageContent>(defaultInstallmentContent);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    adminFetch<InstallmentPageContent | null>("GET", "/api/installment-page")
      .then((data) => setForm({ ...defaultInstallmentContent, ...(data ?? {}) }))
      .catch((e: any) => toast({ title: e.message, variant: "destructive" }))
      .finally(() => setLoading(false));
  }, [toast]);

  function setPageField<K extends keyof Omit<InstallmentPageContent, "programs">>(key: K, value: InstallmentPageContent[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function setProgramField(index: number, key: string, value: string) {
    setForm((prev) => ({
      ...prev,
      programs: prev.programs.map((program, programIndex) => (
        programIndex === index ? { ...program, [key]: key === "body" ? multilineToArray(value) : value } : program
      )),
    }));
  }

  async function save() {
    setSaving(true);
    try {
      const saved = await adminFetch<InstallmentPageContent>("PATCH", "/api/installment-page", form);
      setForm({ ...defaultInstallmentContent, ...saved });
      toast({ title: "Страница рассрочки обновлена" });
    } catch (e: any) {
      toast({ title: e.message, variant: "destructive" });
    } finally {
      setSaving(false);
    }
  }

  function resetDefaults() {
    setForm(defaultInstallmentContent);
    toast({ title: "В форму возвращён текст по умолчанию. Нажмите «Сохранить», чтобы применить." });
  }

  if (loading) {
    return <div className="glass-card rounded-2xl p-8 text-center text-muted-foreground">Загрузка...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="glass-card rounded-2xl border border-white/5 p-6">
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-white">Страница «Рассрочка»</h2>
              <p className="text-sm text-muted-foreground">Редактируйте заголовки, основной текст, описания карт и URL изображений.</p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={resetDefaults} className="border-white/10 bg-white/5 text-white hover:bg-white/10 gap-2">
              <RotateCcw className="h-4 w-4" /> По умолчанию
            </Button>
            <Button onClick={save} disabled={saving} className="bg-primary hover:bg-primary/90 text-white gap-2">
              <Save className="h-4 w-4" /> {saving ? "Сохранение..." : "Сохранить"}
            </Button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <Label className="mb-1 block text-white/70">Заголовок</Label>
            <Input value={form.heading} onChange={(e) => setPageField("heading", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="mb-1 block text-white/70">Подзаголовок</Label>
            <Input value={form.subtitle} onChange={(e) => setPageField("subtitle", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div className="md:col-span-2">
            <Label className="mb-1 block text-white/70">Первый абзац</Label>
            <Textarea value={form.lead} onChange={(e) => setPageField("lead", e.target.value)} className="min-h-24 bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="mb-1 block text-white/70">Акцентный заголовок</Label>
            <Input value={form.highlightTitle} onChange={(e) => setPageField("highlightTitle", e.target.value)} className="bg-white/5 border-white/10 text-white" />
          </div>
          <div>
            <Label className="mb-1 block text-white/70">Акцентный текст</Label>
            <Textarea value={form.highlightText} onChange={(e) => setPageField("highlightText", e.target.value)} className="min-h-24 bg-white/5 border-white/10 text-white" />
          </div>
        </div>
      </div>

      {form.programs.map((program, index) => (
        <div key={`${program.title}-${index}`} className="glass-card rounded-2xl border border-white/5 p-6">
          <h3 className="mb-4 text-lg font-semibold text-white">{index + 1}. {program.title || "Программа рассрочки"}</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <div>
              <Label className="mb-1 block text-white/70">Название</Label>
              <Input value={program.title} onChange={(e) => setProgramField(index, "title", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="mb-1 block text-white/70">URL изображения</Label>
              <Input value={program.image} onChange={(e) => setProgramField(index, "image", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="mb-1 block text-white/70">Alt изображения</Label>
              <Input value={program.imageAlt} onChange={(e) => setProgramField(index, "imageAlt", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div>
              <Label className="mb-1 block text-white/70">Подпись под изображением</Label>
              <Input value={program.caption ?? ""} onChange={(e) => setProgramField(index, "caption", e.target.value)} className="bg-white/5 border-white/10 text-white" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block text-white/70">Вступительный текст</Label>
              <Textarea value={program.intro} onChange={(e) => setProgramField(index, "intro", e.target.value)} className="min-h-24 bg-white/5 border-white/10 text-white" />
            </div>
            <div className="md:col-span-2">
              <Label className="mb-1 block text-white/70">Абзацы основного текста — каждый абзац с новой строки</Label>
              <Textarea value={arrayToMultiline(program.body)} onChange={(e) => setProgramField(index, "body", e.target.value)} className="min-h-40 bg-white/5 border-white/10 text-white" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
