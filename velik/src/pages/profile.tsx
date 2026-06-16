import {
  useGetMe,
  useLogout,
  useListOrders,
  useGetWishlist,
  useListNotifications,
  useMarkNotificationRead,
  useMarkAllNotificationsRead,
  useDeleteNotification,
  useDeleteAllNotifications,
  getListNotificationsQueryKey,
} from "@/api";
import { useLocation } from "wouter";
import { useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { useQueryClient } from "@tanstack/react-query";
import { getGetMeQueryKey, getListOrdersQueryKey } from "@/api";
import { LogOut, Package, Heart, Settings, Clock, CheckCircle2, Truck, Bell, Wrench, DollarSign, CheckCheck, Trash2 } from "lucide-react";
import { ProductCard } from "@/components/product-card";

export default function Profile() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: user, isLoading: isUserLoading, error } = useGetMe();
  const logout = useLogout();

  const { data: orders } = useListOrders({}, {
    query: { enabled: !!user }
  });

  const { data: wishlist } = useGetWishlist({
    query: { enabled: !!user }
  });

  const { data: notifications } = useListNotifications({
    query: { enabled: !!user }
  });

  const markRead = useMarkNotificationRead();
  const markAllRead = useMarkAllNotificationsRead();
  const deleteOne = useDeleteNotification();
  const deleteAll = useDeleteAllNotifications();

  useEffect(() => {
    if (!isUserLoading && (error || !user)) {
      setLocation("/login");
    }
  }, [user, error, isUserLoading, setLocation]);

  const handleLogout = () => {
    logout.mutate(undefined, {
      onSuccess: () => {
        localStorage.removeItem("auth_token");
        queryClient.setQueryData(getGetMeQueryKey(), null);
        setLocation("/");
      }
    });
  };

  const handleMarkRead = (id: number) => {
    markRead.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const handleMarkAllRead = () => {
    markAllRead.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const handleDeleteOne = (id: number) => {
    deleteOne.mutate({ id }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  const handleDeleteAll = () => {
    deleteAll.mutate(undefined, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getListNotificationsQueryKey() });
      }
    });
  };

  if (isUserLoading || !user) {
    return <div className="container mx-auto px-4 py-24 text-center">Загрузка...</div>;
  }

  const unreadCount = notifications?.filter((n) => !n.isRead).length ?? 0;

  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'pending': return <Clock className="h-5 w-5 text-yellow-500" />;
      case 'confirmed': return <CheckCircle2 className="h-5 w-5 text-blue-500" />;
      case 'shipped': return <Truck className="h-5 w-5 text-purple-500" />;
      case 'delivered': return <CheckCircle2 className="h-5 w-5 text-green-500" />;
      default: return <Clock className="h-5 w-5 text-muted-foreground" />;
    }
  };

  const getStatusText = (status: string) => {
    switch(status) {
      case 'pending': return 'В обработке';
      case 'confirmed': return 'Подтвержден';
      case 'shipped': return 'В пути';
      case 'delivered': return 'Доставлен';
      case 'cancelled': return 'Отменен';
      default: return status;
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'status_changed': return <Wrench className="h-4 w-4 text-blue-400 shrink-0" />;
      case 'cost_updated': return <DollarSign className="h-4 w-4 text-green-400 shrink-0" />;
      default: return <Bell className="h-4 w-4 text-primary shrink-0" />;
    }
  };

  const formatRelativeTime = (iso: string) => {
    const diff = Date.now() - new Date(iso).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'только что';
    if (mins < 60) return `${mins} мин. назад`;
    const hours = Math.floor(mins / 60);
    if (hours < 24) return `${hours} ч. назад`;
    const days = Math.floor(hours / 24);
    if (days < 7) return `${days} дн. назад`;
    return new Date(iso).toLocaleDateString('ru-RU');
  };

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="flex flex-col md:flex-row gap-8 items-start mb-12">
        <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-primary to-secondary flex items-center justify-center text-4xl font-bold text-white shadow-lg shrink-0">
          {user.name.charAt(0).toUpperCase()}
        </div>
        <div className="flex-1">
          <h1 className="text-3xl font-display font-bold text-white mb-2">{user.name}</h1>
          <p className="text-muted-foreground">{user.email}</p>
          {user.phone && <p className="text-muted-foreground">{user.phone}</p>}
        </div>
        <Button variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10" onClick={handleLogout}>
          <LogOut className="mr-2 h-4 w-4" /> Выйти
        </Button>
      </div>

      <Tabs defaultValue="orders" className="w-full">
        <TabsList className="bg-white/5 border border-white/10 mb-8 rounded-xl p-1 inline-flex h-12 flex-wrap gap-0">
          <TabsTrigger value="orders" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Package className="mr-2 h-4 w-4" /> Заказы
          </TabsTrigger>
          <TabsTrigger value="notifications" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white relative">
            <Bell className="mr-2 h-4 w-4" /> Уведомления
            {unreadCount > 0 && (
              <span className="ml-2 inline-flex items-center justify-center h-5 min-w-5 px-1 rounded-full bg-primary text-white text-[11px] font-bold leading-none">
                {unreadCount}
              </span>
            )}
          </TabsTrigger>
          <TabsTrigger value="wishlist" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Heart className="mr-2 h-4 w-4" /> Избранное
          </TabsTrigger>
          <TabsTrigger value="settings" className="rounded-lg data-[state=active]:bg-white/10 data-[state=active]:text-white">
            <Settings className="mr-2 h-4 w-4" /> Настройки
          </TabsTrigger>
        </TabsList>

        <TabsContent value="orders">
          {orders && orders.length > 0 ? (
            <div className="space-y-6">
              {orders.map(order => (
                <div key={order.id} className="glass-card rounded-2xl p-6">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 border-b border-white/10 pb-4 gap-4">
                    <div>
                      <div className="text-lg font-bold text-white mb-1">Заказ #{order.id}</div>
                      <div className="text-sm text-muted-foreground">{new Date(order.createdAt).toLocaleDateString('ru-RU')}</div>
                    </div>
                    <div className="flex items-center gap-2 bg-white/5 px-3 py-1.5 rounded-lg border border-white/10">
                      {getStatusIcon(order.status)}
                      <span className="text-white font-medium">{getStatusText(order.status)}</span>
                    </div>
                  </div>

                  <div className="space-y-4 mb-6">
                    {order.items.map(item => (
                      <div key={item.id} className="flex items-center gap-4">
                        <img src={item.productImageUrl} alt={item.productName} className="w-16 h-16 rounded-lg bg-white/5 object-contain p-2" />
                        <div className="flex-1">
                          <div className="text-white font-medium line-clamp-1">{item.productName}</div>
                          <div className="text-sm text-muted-foreground">{item.quantity} x {item.price.toLocaleString('ru-RU')} BYN</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="flex justify-between items-center pt-4 border-t border-white/10">
                    <span className="text-muted-foreground">Итого:</span>
                    <span className="text-xl font-bold text-white">{order.total.toLocaleString('ru-RU')} BYN</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">У вас пока нет заказов</h3>
              <p className="text-muted-foreground">Самое время выбрать что-нибудь интересное в каталоге.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="notifications">
          {notifications && notifications.length > 0 ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">{notifications.length} уведомл.</span>
                <div className="flex items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-muted-foreground hover:text-white text-xs"
                      onClick={handleMarkAllRead}
                      disabled={markAllRead.isPending}
                    >
                      <CheckCheck className="mr-1.5 h-3.5 w-3.5" />
                      Все прочитаны
                    </Button>
                  )}
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-red-400/60 hover:text-red-400 text-xs"
                    onClick={handleDeleteAll}
                    disabled={deleteAll.isPending}
                  >
                    <Trash2 className="mr-1.5 h-3.5 w-3.5" />
                    Очистить всё
                  </Button>
                </div>
              </div>
              {notifications.map((n) => (
                <div
                  key={n.id}
                  className={`glass-card rounded-xl p-4 flex items-start gap-3 transition-all ${
                    !n.isRead ? "border border-primary/30 bg-primary/5" : "border border-white/5 opacity-70"
                  }`}
                >
                  <div className="mt-0.5 p-2 rounded-lg bg-white/5">
                    {getNotificationIcon(n.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <p className={`text-sm font-semibold leading-snug ${n.isRead ? "text-white/70" : "text-white"}`}>
                        {n.title}
                      </p>
                      <div className="flex items-center gap-2 shrink-0">
                        {!n.isRead && (
                          <span className="w-2 h-2 rounded-full bg-primary mt-1.5" />
                        )}
                        <button
                          onClick={() => handleDeleteOne(n.id)}
                          className="text-white/20 hover:text-red-400 transition-colors mt-0.5"
                          title="Удалить"
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </button>
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground mt-0.5 leading-relaxed whitespace-pre-line">{n.message}</p>
                    <div className="flex items-center justify-between mt-2">
                      <span className="text-xs text-white/30">{formatRelativeTime(n.createdAt)}</span>
                      {!n.isRead && (
                        <button
                          onClick={() => handleMarkRead(n.id)}
                          className="text-xs text-primary/70 hover:text-primary transition-colors"
                        >
                          Прочитано
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Нет уведомлений</h3>
              <p className="text-muted-foreground">Здесь будут появляться обновления по вашим заявкам на ремонт.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="wishlist">
          {wishlist && wishlist.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {wishlist.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          ) : (
            <div className="glass-card rounded-2xl p-12 text-center">
              <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-xl font-bold text-white mb-2">Список желаний пуст</h3>
              <p className="text-muted-foreground">Добавляйте товары в избранное, чтобы не потерять их.</p>
            </div>
          )}
        </TabsContent>

        <TabsContent value="settings">
          <div className="glass-card rounded-2xl p-8 max-w-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Личные данные</h3>
            <p className="text-muted-foreground">Настройки профиля в разработке.</p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
