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

const DELIVERY_OPTIONS = [
  { value: "courier_rb", label: "Курьерской службой по РБ", description: "До дома в любую точку РБ, независимо от населённого пункта", price: 50 },
  { value: "pickup", label: "Самовывоз", description: "Самовывоз из магазина в центре города", price: 0 },
];

const PAYMENT_OPTIONS = [
  { value: "cash", label: "Наличными", description: "Оплата при получении наличными" },
  { value: "card", label: "Пластиковые карты", description: "Visa, Mastercard, Белкарт через терминал" },
  { value: "installment", label: "Рассрочка или кредит", description: "+12% от итоговой суммы — оформление на следующем шаге" },
];

const INSTALLMENT_RATE = 0.12;

function calcTotal(cartTotal: number, deliveryMethod: string, paymentMethod: string) {
  const delivery = DELIVERY_OPTIONS.find(o => o.value === deliveryMethod)?.price ?? 0;
  const subtotal = cartTotal + delivery;
  const surcharge = paymentMethod === "installment" ? Math.round(subtotal * INSTALLMENT_RATE * 100) / 100 : 0;
  return { delivery, subtotal, surcharge, total: subtotal + surcharge };
}

const formSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  customerPhone: z.string().min(9, "Введите корректный телефон"),
  customerEmail: z.string().email("Неверный формат email").optional().or(z.literal("")),
  deliveryMethod: z.enum(["courier_rb", "pickup"]),
  deliveryAddress: z.string().optional(),
  paymentMethod: z.enum(["cash", "card", "installment"]),
  comment: z.string().optional()
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
      deliveryMethod: "pickup",
      deliveryAddress: "",
      paymentMethod: "cash",
      comment: "",
    },
  });


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
                <h2 className="text-2xl font-bold text-white mb-6">Способ доставки</h2>
                <FormField
                  control={form.control}
                  name="deliveryMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
                        <div className="grid grid-cols-[1fr_auto] px-5 py-2.5 bg-white/5 text-xs font-semibold text-white/40 uppercase tracking-widest">
                          <span>Способ доставки</span>
                          <span>Сумма</span>
                        </div>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            {DELIVERY_OPTIONS.map((opt) => (
                              <FormItem key={opt.value} className="space-y-0">
                                <FormLabel className="cursor-pointer">
                                  <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5 ${field.value === opt.value ? "bg-primary/10" : ""}`}>
                                    <FormControl>
                                      <RadioGroupItem value={opt.value} className="border-white/30 text-primary data-[state=checked]:border-primary shrink-0" />
                                    </FormControl>
                                    <div>
                                      <p className={`font-medium ${field.value === opt.value ? "text-primary" : "text-white"}`}>{opt.label}</p>
                                      <p className="text-sm text-white/40 mt-0.5 font-normal">{opt.description}</p>
                                    </div>
                                    <span className={`text-sm font-semibold shrink-0 ${field.value === opt.value ? "text-primary" : "text-white/60"}`}>
                                      {opt.price === 0 ? "0,00 руб." : `${opt.price},00 руб.`}
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="glass-card rounded-2xl p-8">
                <h2 className="text-2xl font-bold text-white mb-6">Способ оплаты</h2>
                <FormField
                  control={form.control}
                  name="paymentMethod"
                  render={({ field }) => (
                    <FormItem className="space-y-3">
                      <div className="rounded-xl border border-white/10 overflow-hidden divide-y divide-white/10">
                        <div className="grid grid-cols-[1fr_auto] px-5 py-2.5 bg-white/5 text-xs font-semibold text-white/40 uppercase tracking-widest">
                          <span>Способ оплаты</span>
                          <span>Сумма</span>
                        </div>
                        <FormControl>
                          <RadioGroup onValueChange={field.onChange} defaultValue={field.value}>
                            {PAYMENT_OPTIONS.map((opt) => (
                              <FormItem key={opt.value} className="space-y-0">
                                <FormLabel className="cursor-pointer">
                                  <div className={`grid grid-cols-[auto_1fr_auto] items-center gap-4 px-5 py-4 transition-colors hover:bg-white/5 ${field.value === opt.value ? "bg-primary/10" : ""}`}>
                                    <FormControl>
                                      <RadioGroupItem value={opt.value} className="border-white/30 text-primary data-[state=checked]:border-primary shrink-0" />
                                    </FormControl>
                                    <div>
                                      <p className={`font-medium ${field.value === opt.value ? "text-primary" : "text-white"}`}>{opt.label}</p>
                                      <p className="text-sm text-white/40 mt-0.5 font-normal">{opt.description}</p>
                                    </div>
                                    <span className={`text-sm font-semibold shrink-0 ${field.value === opt.value ? "text-primary" : "text-white/60"}`}>
                                      {opt.value === "installment" ? "+12%" : "0,00 руб."}
                                    </span>
                                  </div>
                                </FormLabel>
                              </FormItem>
                            ))}
                          </RadioGroup>
                        </FormControl>
                      </div>
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
              {(() => {
                const { delivery, surcharge, total } = calcTotal(cart.total, form.watch("deliveryMethod"), form.watch("paymentMethod"));
                return (
                  <>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Товары ({cart.itemCount})</span>
                      <span>{cart.total.toLocaleString('ru-RU')} BYN</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Доставка</span>
                      <span>{delivery === 0 ? "Бесплатно" : `${delivery} BYN`}</span>
                    </div>
                    {surcharge > 0 && (
                      <div className="flex justify-between text-muted-foreground">
                        <span>Рассрочка (+12%)</span>
                        <span>+{surcharge.toFixed(2)} BYN</span>
                      </div>
                    )}
                    <div className="flex justify-between items-end pt-3 mt-3 border-t border-white/10">
                      <span className="text-white font-medium">К оплате</span>
                      <span className="text-2xl font-bold text-white text-glow">
                        {total.toFixed(2)} <span className="text-sm font-normal text-white/70">BYN</span>
                      </span>
                    </div>
                  </>
                );
              })()}
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
