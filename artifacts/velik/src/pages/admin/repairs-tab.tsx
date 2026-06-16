import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "./api";

type Repair = {
  id: number;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  bikeDescription: string;
  problemDescription?: string | null;
  status: string;
  estimatedCost?: number | null;
  createdAt: string;
};

const STATUS_LABELS: Record<string, string> = {
  new: "Новая",
  in_progress: "В работе",
  completed: "Завершена",
  cancelled: "Отменена",
};

const STATUS_COLORS: Record<string, string> = {
  new: "border-blue-500/50 text-blue-400",
  in_progress: "border-yellow-500/50 text-yellow-400",
  completed: "border-green-500/50 text-green-400",
  cancelled: "border-red-500/50 text-red-400",
};

export default function RepairsTab() {
  const [repairs, setRepairs] = useState<Repair[]>([]);
  const [loading, setLoading] = useState(true);
  const [costs, setCosts] = useState<Record<number, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    adminFetch<Repair[]>("GET", "/api/repair-requests")
      .then((data) => {
        setRepairs(data);
        const c: Record<number, string> = {};
        data.forEach((r) => { c[r.id] = r.estimatedCost != null ? String(r.estimatedCost) : ""; });
        setCosts(c);
      })
      .finally(() => setLoading(false));
  }, []);

  async function update(id: number, patch: { status?: string; estimatedCost?: number | null }) {
    try {
      const updated = await adminFetch<Repair>("PATCH", `/api/repair-requests/${id}`, patch);
      setRepairs((prev) => prev.map((r) => (r.id === id ? { ...r, ...updated } : r)));
      toast({ title: "Обновлено" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Заявки на ремонт ({repairs.length})</h2>
      </div>
      <Table>
        <TableHeader className="bg-black/20">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-muted-foreground">ID</TableHead>
            <TableHead className="text-muted-foreground">Клиент</TableHead>
            <TableHead className="text-muted-foreground">Устройство</TableHead>
            <TableHead className="text-muted-foreground">Дата</TableHead>
            <TableHead className="text-muted-foreground">Оценка (BYN)</TableHead>
            <TableHead className="text-muted-foreground">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
          ) : repairs.map((r) => (
            <TableRow key={r.id} className="border-white/5 hover:bg-white/5">
              <TableCell className="text-white/60">#{r.id}</TableCell>
              <TableCell>
                <div className="text-white">{r.customerName}</div>
                <div className="text-xs text-muted-foreground">{r.customerPhone}</div>
              </TableCell>
              <TableCell>
                <div className="text-white/80 max-w-[180px] truncate">{r.bikeDescription}</div>
                {r.problemDescription && <div className="text-xs text-muted-foreground max-w-[180px] truncate">{r.problemDescription}</div>}
              </TableCell>
              <TableCell className="text-white/60">{new Date(r.createdAt).toLocaleDateString("ru-RU")}</TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Input
                    type="number"
                    value={costs[r.id] ?? ""}
                    onChange={(e) => setCosts((prev) => ({ ...prev, [r.id]: e.target.value }))}
                    className="w-24 h-7 text-xs bg-white/5 border-white/10 text-white"
                    placeholder="0"
                  />
                  <Button
                    size="sm"
                    variant="ghost"
                    className="h-7 px-2 text-xs text-primary hover:text-white"
                    onClick={() => update(r.id, { estimatedCost: costs[r.id] ? Number(costs[r.id]) : null })}
                  >
                    ✓
                  </Button>
                </div>
              </TableCell>
              <TableCell>
                <Select value={r.status} onValueChange={(v) => update(r.id, { status: v })}>
                  <SelectTrigger className={`w-32 h-7 text-xs border rounded-lg bg-transparent ${STATUS_COLORS[r.status]}`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(STATUS_LABELS).map(([val, label]) => (
                      <SelectItem key={val} value={val}>{label}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
