import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useToast } from "@/hooks/use-toast";
import { adminFetch } from "./api";

type Order = {
  id: number;
  status: string;
  total: number;
  createdAt: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string | null;
  deliveryAddress?: string | null;
  deliveryMethod?: string;
  paymentMethod?: string;
  comment?: string | null;
  items?: { id: number; productName: string; quantity: number; price: number }[];
};

const STATUS_LABELS: Record<string, string> = {
  pending: "Ожидает",
  confirmed: "Подтверждён",
  shipped: "Отправлен",
  delivered: "Доставлен",
  cancelled: "Отменён",
};

const STATUS_COLORS: Record<string, string> = {
  pending: "border-yellow-500/50 text-yellow-400",
  confirmed: "border-blue-500/50 text-blue-400",
  shipped: "border-purple-500/50 text-purple-400",
  delivered: "border-green-500/50 text-green-400",
  cancelled: "border-red-500/50 text-red-400",
};

export default function OrdersTab() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [expanded, setExpanded] = useState<number | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    adminFetch<Order[]>("GET", "/api/orders")
      .then(setOrders)
      .finally(() => setLoading(false));
  }, []);

  async function updateStatus(id: number, status: string) {
    try {
      const updated = await adminFetch<Order>("PATCH", `/api/orders/${id}`, { status });
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, ...updated } : o)));
      toast({ title: "Статус обновлён" });
    } catch {
      toast({ title: "Ошибка", variant: "destructive" });
    }
  }

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Заказы ({orders.length})</h2>
      </div>
      <Table>
        <TableHeader className="bg-black/20">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-muted-foreground">ID</TableHead>
            <TableHead className="text-muted-foreground">Клиент</TableHead>
            <TableHead className="text-muted-foreground">Дата</TableHead>
            <TableHead className="text-muted-foreground">Сумма</TableHead>
            <TableHead className="text-muted-foreground">Способ</TableHead>
            <TableHead className="text-muted-foreground">Статус</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
          ) : orders.map((order) => (
            <>
              <TableRow
                key={order.id}
                className="border-white/5 hover:bg-white/5 cursor-pointer"
                onClick={() => setExpanded(expanded === order.id ? null : order.id)}
              >
                <TableCell className="font-medium text-white">#{order.id}</TableCell>
                <TableCell>
                  <div className="text-white">{order.customerName}</div>
                  <div className="text-xs text-muted-foreground">{order.customerPhone}</div>
                </TableCell>
                <TableCell className="text-white/80">{new Date(order.createdAt).toLocaleDateString("ru-RU")}</TableCell>
                <TableCell className="text-white font-semibold">{order.total.toLocaleString("ru-RU")} BYN</TableCell>
                <TableCell className="text-white/60 text-sm">{order.deliveryMethod === "pickup" ? "Самовывоз" : "Доставка"}</TableCell>
                <TableCell onClick={(e) => e.stopPropagation()}>
                  <Select value={order.status} onValueChange={(v) => updateStatus(order.id, v)}>
                    <SelectTrigger className={`w-36 h-7 text-xs border rounded-lg bg-transparent ${STATUS_COLORS[order.status]}`}>
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
              {expanded === order.id && (
                <TableRow key={`${order.id}-expanded`} className="border-white/5">
                  <TableCell colSpan={6} className="bg-black/20 px-6 py-4">
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <p className="text-muted-foreground mb-1">Адрес доставки</p>
                        <p className="text-white">{order.deliveryAddress ?? "—"}</p>
                      </div>
                      <div>
                        <p className="text-muted-foreground mb-1">Оплата</p>
                        <p className="text-white">{order.paymentMethod === "online" ? "Онлайн" : "Наличные"}</p>
                      </div>
                      {order.comment && <div className="col-span-2">
                        <p className="text-muted-foreground mb-1">Комментарий</p>
                        <p className="text-white">{order.comment}</p>
                      </div>}
                    </div>
                    {order.items && order.items.length > 0 && (
                      <div className="mt-4">
                        <p className="text-muted-foreground text-sm mb-2">Товары:</p>
                        <div className="space-y-1">
                          {order.items.map((item) => (
                            <div key={item.id} className="flex justify-between text-sm text-white/80">
                              <span>{item.productName} × {item.quantity}</span>
                              <span>{(item.price * item.quantity).toLocaleString("ru-RU")} BYN</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              )}
            </>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
