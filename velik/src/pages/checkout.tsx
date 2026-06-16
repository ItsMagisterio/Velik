import { useState } from "react";
import { useLocation } from "wouter";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useGetCart, useCreateOrder, useGetMe } from "@/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { CheckCircle2, ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import { getGetCartQueryKey } from "@/api";
import { useQueryClient } from "@tanstack/react-query";

const formSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  customerPhone: z.string().min(9, "Введите корректный телефон"),
  customerEmail: z.string().email("Неверный формат email").optional().or(z.literal("")),
  deliveryMethod: z.enum(["delivery", "pickup"]),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(["online", "cash"]),
  comment: z.string().optional()
}).refine(data => {
  if (data.deliveryMethod === 'delivery' && !data.deliveryAddress) {
    return false;
  }
  return true;
}, {
  message: "Введите адрес доставки",
  path: ["deliveryAddress"]
});

export default function Checkout() {
  const [, setLocation] = useLocation();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { data: cart, isLoading } = useGetCart();
  const { data: user } = useGetMe();
  const createOrder = useCreateOrder();
  
  const [orderSuccess, setOrderSuccess] = useState<number | null>(null);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: user?.name || "",
      customerPhone: user?.phone || "",
      customerEmail: user?.email || "",
      deliveryMethod: "delivery",
      deliveryAddress: "",
      paymentMethod: "online",
      comment: "",
    },
  });

  const watchDeliveryMethod = form.watch("deliveryMethod");

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    if (!cart || cart.items.length === 0) return;

    createOrder.mutate({
      data: {
        ...values,
        sessionId: localStorage.getItem("sessionId"),
        items: cart.items.map(item => ({
          productId: item.productId,
          quantity: item.quantity,
          price: item.product.price
        }))
      }
    }, {
      onSuccess: (order) => {
        setOrderSuccess(order.id);
        queryClient.invalidateQueries({ queryKey: getGetCartQueryKey() });
      },
      onError: (err) => {
        toast({
          title: "Ошибка оформления",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  if (isLoading) return <div className="container mx-auto px-4 py-24 text-center">Загрузка...</div>;

  if (orderSuccess) {
    return (
      <div className="container mx-auto px-4 py-24 flex flex-col items-center justify-center text-center min-h-[70vh]">
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mb-8"
        >
          <CheckCircle2 className="h-12 w-12 text-green-400" />
        </motion.div>
        <h1 className="text-4xl font-display font-bold text-white mb-4">Заказ оформлен!</h1>
        <p className="text-xl text-muted-foreground mb-2">Номер вашего заказа: <span className="text-white font-bold">#{orderSuccess}</span></p>
        <p className="text-muted-foreground max-w-md mb-8">
          Мы получили ваш заказ и скоро свяжемся с вами для подтверждения деталей.
        </p>
        <Button onClick={() => setLocation("/")} size="lg" className="bg-white/10 hover:bg-white/20 text-white rounded-xl">
          Вернуться на главную
        </Button>
      </div>
    );
  }

  if (!cart || cart.items.length === 0) {
    setLocation("/cart");
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-12">
      <Button variant="ghost" onClick={() => setLocation("/cart")} className="mb-8 text-muted-foreground hover:text-white">
        <ArrowLeft className="mr-2 h-4 w-4" /> Вернуться в корзину
      </Button>

      <h1 className="text-4xl font-display font-bold text-white mb-8">Оформление заказа</h1>

      <div className="flex flex-col lg:flex-row gap-10">
        <div className="flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              
              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Контактные данные</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="customerName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Имя *</FormLabel>
                        <FormControl>
                          <Input placeholder="Иван Иванов" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Телефон *</FormLabel>
                        <FormControl>
                          <Input placeholder="+375 (XX) XXX-XX-XX" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="customerEmail"
                    render={({ field }) => (
                      <FormItem className="md:col-span-2">
                        <FormLabel className="text-white/80">Email</FormLabel>
                        <FormControl>
                          <Input placeholder="ivan@example.com" type="email" className="bg-white/5 border-white/10 text-white" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Доставка</h2>
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="delivery" className="border-white/20 text-primary data-[state=checked]:border-primary" />
                            </FormControl>
                            <FormLabel className="font-medium text-white cursor-pointer w-full">
                              Курьером по Минску
                              <p className="text-sm text-muted-foreground mt-1 font-normal">Бесплатно, сегодня-завтра</p>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="pickup" className="border-white/20 text-primary data-[state=checked]:border-primary" />
                            </FormControl>
                            <FormLabel className="font-medium text-white cursor-pointer w-full">
                              Самовывоз
                              <p className="text-sm text-muted-foreground mt-1 font-normal">ТЦ Галерея Минск</p>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchDeliveryMethod === 'delivery' && (
                  <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} className="mt-6">
                    <FormField
                      control={form.control}
                      name="deliveryAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Адрес доставки *</FormLabel>
                          <FormControl>
                            <Input placeholder="г. Минск, ул. Примерная 1, кв 2" className="bg-white/5 border-white/10 text-white" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </motion.div>
                )}
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Оплата</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-4">
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                        >
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="online" className="border-white/20 text-primary data-[state=checked]:border-primary" />
                            </FormControl>
                            <FormLabel className="font-medium text-white cursor-pointer w-full">
                              Картой онлайн
                              <p className="text-sm text-muted-foreground mt-1 font-normal">Visa, Mastercard, Белкарт</p>
                            </FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-3 space-y-0 rounded-xl border border-white/10 bg-white/5 p-4 cursor-pointer hover:bg-white/10 transition-colors has-[:checked]:border-primary has-[:checked]:bg-primary/5">
                            <FormControl>
                              <RadioGroupItem value="cash" className="border-white/20 text-primary data-[state=checked]:border-primary" />
                            </FormControl>
                            <FormLabel className="font-medium text-white cursor-pointer w-full">
                              При получении
                              <p className="text-sm text-muted-foreground mt-1 font-normal">Наличными или картой</p>
                            </FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="glass-card rounded-2xl p-8">
                <FormField
                  control={form.control}
                  name="comment"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-white/80">Комментарий к заказу (необязательно)</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Пожелания по доставке, номер домофона и т.д." 
                          className="bg-white/5 border-white/10 text-white min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <Button type="submit" className="hidden" id="submit-btn">Submit</Button>
            </form>
          </Form>
        </div>

        <div className="w-full lg:w-[400px] shrink-0">
          <div className="glass-card rounded-2xl p-8 sticky top-24">
            <h2 className="text-xl font-bold text-white mb-6">Ваш заказ</h2>
            
            <div className="space-y-4 mb-6 max-h-[300px] overflow-y-auto pr-2">
              {cart.items.map(item => (
                <div key={item.id} className="flex gap-4 items-center">
                  <div className="w-16 h-16 bg-white/5 rounded-lg p-1 shrink-0">
                    <img src={item.product.imageUrl} alt={item.product.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-white font-medium truncate text-sm">{item.product.name}</div>
                    <div className="text-muted-foreground text-xs">{item.quantity} шт.</div>
                  </div>
                  <div className="text-white font-bold shrink-0">
                    {(item.product.price * item.quantity).toLocaleString('ru-RU')}
                  </div>
                </div>
              ))}
            </div>
            
            <div className="border-t border-white/10 pt-4 mb-8 space-y-3">
              <div className="flex justify-between text-muted-foreground">
                <span>Товары ({cart.itemCount})</span>
                <span>{cart.total.toLocaleString('ru-RU')} BYN</span>
              </div>
              <div className="flex justify-between text-muted-foreground">
                <span>Доставка</span>
                <span>{watchDeliveryMethod === 'pickup' ? '0 BYN' : 'Бесплатно'}</span>
              </div>
              <div className="flex justify-between items-end pt-3 mt-3 border-t border-white/10">
                <span className="text-white font-medium">К оплате</span>
                <span className="text-2xl font-bold text-white text-glow">
                  {cart.total.toLocaleString('ru-RU')} <span className="text-sm font-normal text-white/70">BYN</span>
                </span>
              </div>
            </div>
            
            <Button 
              size="lg" 
              className="w-full bg-primary hover:bg-primary/90 text-white h-14 rounded-xl text-lg font-medium shadow-[0_0_20px_rgba(90,49,255,0.4)]"
              onClick={() => document.getElementById("submit-btn")?.click()}
              disabled={createOrder.isPending}
            >
              {createOrder.isPending ? "Оформление..." : "Подтвердить заказ"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
