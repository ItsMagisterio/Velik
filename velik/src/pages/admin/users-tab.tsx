import { useEffect, useState } from "react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { adminFetch } from "./api";

type User = {
  id: number;
  email: string;
  name: string;
  phone: string | null;
  role: string;
  createdAt: string;
};

export default function UsersTab() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminFetch<User[]>("GET", "/api/users")
      .then(setUsers)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
      <div className="px-6 py-4 border-b border-white/5">
        <h2 className="text-lg font-semibold text-white">Пользователи ({users.length})</h2>
      </div>
      <Table>
        <TableHeader className="bg-black/20">
          <TableRow className="border-white/10 hover:bg-transparent">
            <TableHead className="text-muted-foreground">ID</TableHead>
            <TableHead className="text-muted-foreground">Email</TableHead>
            <TableHead className="text-muted-foreground">Имя</TableHead>
            <TableHead className="text-muted-foreground">Телефон</TableHead>
            <TableHead className="text-muted-foreground">Роль</TableHead>
            <TableHead className="text-muted-foreground">Дата</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow><TableCell colSpan={6} className="text-center text-muted-foreground py-8">Загрузка...</TableCell></TableRow>
          ) : users.map((u) => (
            <TableRow key={u.id} className="border-white/5 hover:bg-white/5">
              <TableCell className="text-white/60">#{u.id}</TableCell>
              <TableCell className="text-white">{u.email}</TableCell>
              <TableCell className="text-white/80">{u.name}</TableCell>
              <TableCell className="text-white/60">{u.phone ?? "—"}</TableCell>
              <TableCell>
                <Badge variant="outline" className={u.role === "admin" ? "border-primary/50 text-primary" : "border-white/20 text-white/60"}>
                  {u.role}
                </Badge>
              </TableCell>
              <TableCell className="text-white/60">{new Date(u.createdAt).toLocaleDateString("ru-RU")}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
