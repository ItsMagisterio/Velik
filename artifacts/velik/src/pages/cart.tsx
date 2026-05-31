import { useGetCart, useUpdateCartItem, useRemoveCartItem, useClearCart } from "@workspace/api-client-react";
import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { getGetCartQueryKey } from "@workspace/api-client-react";
import { useQueryClient } from "@tanstack/react-query";

export default function Cart() {
  const [, setLocation] = useLocation();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  
  const updateItem = useUpdateCartItem();
  const removeItem = useRemoveCartItem();
  const clearCart = useClearCart();

  const handleUpdateQuantity = (itemId: number, newQuantity: number) => {
    if (newQuantity < 1) return;
    updateItem.mutate({
      id: itemId,
      data: { quantity: newQuantity }
    }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    });
  };

  const handleRemove = (itemId: number) => {
    removeItem.mutate({ id: itemId }, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      }
    });
  };

  if (isLoading) {
    return <div className="container mx-auto px-4 py-24 text-center">Загрузка корзины...</div>;
  }

  if (!cart || cart.items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[60vh]">
        <div className="w-24 h-24 bg-white/5 rounded-full flex items-center justify-center mb-6">
          <ShoppingBag className="h-10 w-10 text-muted-foreground" />
        </div>
        <h1 className="text-3xl font-display font-bold text-white mb-4">Ваша корзина пуста</h1>
        <p className="text-muted-foreground max-w-md mb-8">
          Перейдите в каталог, чтобы найти лучшие электровелосипеды, самокаты и аксессуары.
        </p>
        <Link href="/catalog">
          <Button size="lg" className="bg-primary hover:bg-primary/90 text-white rounded-xl">
            Перейти в каталог
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <h1 className="text-4xl font-display font-bold text-white mb-8">Корзина</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        {/* Cart Items */}
        <div className="flex-1 flex flex-col gap-4">
          <AnimatePresence>
            {cart.items.map((item) => (
              <motion.div
                key={item.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-2xl p-4 sm:p-6 flex flex-col sm:flex-row items-center gap-6"
              >
                <Link href={`/catalog/${item.productId}`} className="w-24 h-24 shrink-0 bg-white/5 rounded-xl p-2 flex items-center justify-center overflow-hidden hover:bg-white/10 transition-colors">
                  <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                </Link>
                
                <div className="flex-1 text-center sm:text-left">
                  <div className="text-sm text-primary font-medium mb-1">{item.product.brand}</div>
                  <Link href={`/catalog/${item.productId}`} className="text-lg font-medium text-white hover:text-primary transition-colors line-clamp-2 mb-2">
                    {item.product.name}
                  </Link>
                  <div className="text-lg font-bold text-white/90">
                    {item.product.price.toLocaleString('ru-RU')} BYN
                  </div>
                </div>

                <div className="flex items-center gap-4 sm:ml-auto">
                  <div className="flex items-center bg-background/50 border border-white/10 rounded-lg overflow-hidden h-10">
                    <button 
                      className="px-3 hover:bg-white/10 transition-colors h-full flex items-center justify-center text-white"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                    >
                      <Minus className="h-4 w-4" />
                    </button>
                    <div className="w-10 text-center font-medium text-white">
                      {item.quantity}
                    </div>
                    <button 
                      className="px-3 hover:bg-white/10 transition-colors h-full flex items-center justify-center text-white"
                      onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="text-xl font-bold text-white w-28 text-right hidden md:block text-glow">
                    {(item.product.price * item.quantity).toLocaleString('ru-RU')} BYN
                  </div>

                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
                    onClick={() => handleRemove(item.id)}
                  >
                    <Trash2 className="h-5 w-5" />
                  </Button>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Order Summary */}
        <div className="w-full lg:w-[400px] shrink-0">
          <div className="glass-card rounded-2xl p-8 sticky top-24">
            <h2 className="text-2xl font-bold text-white mb-6">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6 text-sm">
              <div className="flex justify-between text-muted-foreground">
                <span>Товары ({cart.itemCount})</span>
                <span className="text-white">{cart.total.toLocaleString('ru-RU')} BYN</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Скидка</span>
                <span className="text-green-400">0 BYN</span>
              </div>
            </div>
            
            <div className="border-t border-white/10 pt-6 mb-8 flex justify-between items-end">
              <span className="text-white font-medium">Итого</span>
              <span className="text-3xl font-bold text-white text-glow">
                {cart.total.toLocaleString('ru-RU')} <span className="text-lg font-normal text-white/70">BYN</span>
              </span>
            </div>
            
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl text-lg font-medium shadow-[0_0_20px_rgba(90,49,255,0.4)]"
              onClick={() => setLocation("/checkout")}
            >
              Перейти к оформлению
            </Button>
            
            <p className="text-xs text-center text-muted-foreground mt-4">
              Нажимая кнопку, вы соглашаетесь с условиями обработки персональных данных.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
