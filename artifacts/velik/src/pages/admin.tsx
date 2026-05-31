import { useGetMe, useGetStatsSummary, useListOrders, useListRepairRequests } from "@workspace/api-client-react";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { DollarSign, Package, Users, Wrench } from "lucide-react";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: stats } = useGetStatsSummary({ query: { enabled: user?.role === "admin" } });
  const { data: orders } = useListOrders({}, { query: { enabled: user?.role === "admin" } });
  const { data: repairs } = useListRepairRequests({ query: { enabled: user?.role === "admin" } });

  useEffect(() => {
    if (!isUserLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isUserLoading, setLocation]);

  if (isUserLoading || !user || user.role !== "admin") return null;

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-white mb-8">Панель управления</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Общая выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalRevenue.toLocaleString('ru-RU')} BYN</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Новых заказов</CardTitle>
            <Package className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.newOrders}</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Заявок на ремонт</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.pendingRepairs}</div>
          </CardContent>
        </Card>
        
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">Всего клиентов</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white">{stats?.totalUsers}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-8 rounded-xl p-1">
          <TabsTrigger value="orders">Заказы</TabsTrigger>
          <TabsTrigger value="repairs">Ремонт</TabsTrigger>
        </TabsList>
        
        <TabsContent value="orders">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Клиент</TableHead>
                  <TableHead className="text-muted-foreground">Дата</TableHead>
                  <TableHead className="text-muted-foreground">Сумма</TableHead>
                  <TableHead className="text-muted-foreground">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {orders?.map((order) => (
                  <TableRow key={order.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">#{order.id}</TableCell>
                    <TableCell className="text-white/80">{order.customerName}</TableCell>
                    <TableCell className="text-white/80">{new Date(order.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell className="text-white">{order.total.toLocaleString()} BYN</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-primary/50 text-primary">{order.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
        
        <TabsContent value="repairs">
          <div className="glass-card rounded-2xl overflow-hidden border border-white/5">
            <Table>
              <TableHeader className="bg-black/20">
                <TableRow className="border-white/10 hover:bg-transparent">
                  <TableHead className="text-muted-foreground">ID</TableHead>
                  <TableHead className="text-muted-foreground">Клиент</TableHead>
                  <TableHead className="text-muted-foreground">Устройство</TableHead>
                  <TableHead className="text-muted-foreground">Дата</TableHead>
                  <TableHead className="text-muted-foreground">Статус</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {repairs?.map((req) => (
                  <TableRow key={req.id} className="border-white/5 hover:bg-white/5">
                    <TableCell className="font-medium text-white">#{req.id}</TableCell>
                    <TableCell className="text-white/80">
                      <div>{req.customerName}</div>
                      <div className="text-xs text-muted-foreground">{req.customerPhone}</div>
                    </TableCell>
                    <TableCell className="text-white/80">{req.bikeDescription}</TableCell>
                    <TableCell className="text-white/80">{new Date(req.createdAt).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="border-secondary/50 text-secondary">{req.status}</Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
