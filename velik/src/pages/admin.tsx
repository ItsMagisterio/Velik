import { useGetMe, useGetStatsSummary } from "@/api";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DollarSign, Package, Users, Wrench, LayoutDashboard, Tag, Megaphone } from "lucide-react";
import CategoriesTab from "./admin/categories-tab";
import ProductsTab from "./admin/products-tab";
import OrdersTab from "./admin/orders-tab";
import RepairsTab from "./admin/repairs-tab";
import PromotionsTab from "./admin/promotions-tab";
import UsersTab from "./admin/users-tab";

export default function Admin() {
  const [, setLocation] = useLocation();
  const { data: user, isLoading: isUserLoading } = useGetMe();
  const { data: stats } = useGetStatsSummary({ query: { enabled: user?.role === "admin" } });

  useEffect(() => {
    if (!isUserLoading && (!user || user.role !== "admin")) {
      setLocation("/");
    }
  }, [user, isUserLoading, setLocation]);

  if (isUserLoading || !user || user.role !== "admin") return null;

  return (
    <div className="container mx-auto px-4 py-10">
      <div className="flex items-center gap-3 mb-8">
        <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center">
          <LayoutDashboard className="h-5 w-5 text-white" />
        </div>
        <div>
          <h1 className="text-3xl font-display font-bold text-white">Панель управления</h1>
          <p className="text-muted-foreground text-sm">Velik Admin</p>
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Выручка</CardTitle>
            <DollarSign className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-white">{stats?.totalRevenue.toLocaleString("ru-RU")} BYN</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Новых заказов</CardTitle>
            <Package className="h-4 w-4 text-secondary" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-white">{stats?.newOrders}</div>
            <div className="text-xs text-muted-foreground">всего: {stats?.totalOrders}</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Ремонт</CardTitle>
            <Wrench className="h-4 w-4 text-yellow-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-white">{stats?.pendingRepairs}</div>
            <div className="text-xs text-muted-foreground">ожидают</div>
          </CardContent>
        </Card>
        <Card className="glass border-white/5">
          <CardHeader className="flex flex-row items-center justify-between pb-2 pt-4 px-4">
            <CardTitle className="text-xs font-medium text-muted-foreground">Клиентов</CardTitle>
            <Users className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent className="px-4 pb-4">
            <div className="text-xl font-bold text-white">{stats?.totalUsers}</div>
            <div className="text-xs text-muted-foreground">товаров: {stats?.totalProducts}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="categories" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-6 rounded-xl p-1 flex flex-wrap gap-1 h-auto">
          <TabsTrigger value="categories" className="gap-1.5 text-xs">
            <Tag className="h-3.5 w-3.5" /> Категории
          </TabsTrigger>
          <TabsTrigger value="products" className="gap-1.5 text-xs">
            <Package className="h-3.5 w-3.5" /> Товары
          </TabsTrigger>
          <TabsTrigger value="orders" className="gap-1.5 text-xs">
            <DollarSign className="h-3.5 w-3.5" /> Заказы
          </TabsTrigger>
          <TabsTrigger value="repairs" className="gap-1.5 text-xs">
            <Wrench className="h-3.5 w-3.5" /> Ремонт
          </TabsTrigger>
          <TabsTrigger value="promotions" className="gap-1.5 text-xs">
            <Megaphone className="h-3.5 w-3.5" /> Акции
          </TabsTrigger>
          <TabsTrigger value="users" className="gap-1.5 text-xs">
            <Users className="h-3.5 w-3.5" /> Пользователи
          </TabsTrigger>
        </TabsList>

        <TabsContent value="categories"><CategoriesTab /></TabsContent>
        <TabsContent value="products"><ProductsTab /></TabsContent>
        <TabsContent value="orders"><OrdersTab /></TabsContent>
        <TabsContent value="repairs"><RepairsTab /></TabsContent>
        <TabsContent value="promotions"><PromotionsTab /></TabsContent>
        <TabsContent value="users"><UsersTab /></TabsContent>
      </Tabs>
    </div>
  );
}
