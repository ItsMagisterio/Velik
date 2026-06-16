import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRepairRequest } from "@/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wrench, Battery, ShieldAlert, Zap, CheckCircle2 } from "lucide-react";
import { useState } from "react";
import { motion } from "framer-motion";

const formSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  customerPhone: z.string().min(9, "Введите корректный телефон"),
  bikeDescription: z.string().min(5, "Опишите ваше устройство"),
  problemDescription: z.string().optional(),
});

export default function Repair() {
  const { toast } = useToast();
  const createRequest = useCreateRepairRequest();
  const [success, setSuccess] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      customerName: "",
      customerPhone: "",
      bikeDescription: "",
      problemDescription: "",
    },
  });

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    createRequest.mutate({ data: values }, {
      onSuccess: () => {
        setSuccess(true);
        form.reset();
      },
      onError: (err) => {
        toast({
          title: "Ошибка",
          description: err.message,
          variant: "destructive"
        });
      }
    });
  };

  const services = [
    { icon: <Battery className="w-8 h-8 text-primary" />, title: "Ремонт АКБ", desc: "Восстановление емкости, замена элементов, балансировка." },
    { icon: <ShieldAlert className="w-8 h-8 text-secondary" />, title: "Гидроизоляция", desc: "Защита контроллера, мотора и батареи от влаги. Гарантия 1 год." },
    { icon: <Zap className="w-8 h-8 text-primary" />, title: "Электрика", desc: "Ремонт проводки, замена контроллеров, дисплеев, курков газа." },
    { icon: <Wrench className="w-8 h-8 text-secondary" />, title: "Механика", desc: "Настройка тормозов, замена колодок, камер, покрышек." },
  ];

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Профессиональный <span className="text-primary">сервис</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Ремонтируем то, за что другие не берутся. Опыт более 5 лет, оригинальные запчасти и гарантия на все виды работ.
            </p>
          </div>
        </div>
      </section>

      {/* Services Grid */}
      <section className="py-12 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {services.map((s, i) => (
              <div key={i} className="glass-card rounded-2xl p-6 hover:-translate-y-1 transition-transform">
                <div className="mb-4 bg-background/50 w-16 h-16 rounded-xl flex items-center justify-center border border-white/10">
                  {s.icon}
                </div>
                <h3 className="text-xl font-bold text-white mb-2">{s.title}</h3>
                <p className="text-muted-foreground">{s.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Form Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-16 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-display font-bold text-white mb-6">Оставить заявку на ремонт</h2>
              <p className="text-muted-foreground mb-8">
                Опишите вашу проблему, и наш мастер свяжется с вами для уточнения деталей и примерной стоимости.
              </p>
              
              {success ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-8 text-center border-green-500/30">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                  <p className="text-muted-foreground mb-6">Мы свяжемся с вами в течение 15 минут.</p>
                  <Button variant="outline" onClick={() => setSuccess(false)} className="border-white/10 text-white">
                    Оставить еще одну заявку
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 glass-card p-8 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Ваше имя *</FormLabel>
                          <FormControl><Input className="bg-white/5 border-white/10 text-white" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="customerPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Телефон *</FormLabel>
                          <FormControl><Input className="bg-white/5 border-white/10 text-white" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    
                    <FormField control={form.control} name="bikeDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Устройство (марка, модель) *</FormLabel>
                        <FormControl><Input placeholder="Например: Kugoo M4 Pro" className="bg-white/5 border-white/10 text-white" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <FormField control={form.control} name="problemDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Что случилось?</FormLabel>
                        <FormControl><Textarea placeholder="Опишите симптомы поломки..." className="bg-white/5 border-white/10 text-white min-h-[100px]" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    
                    <Button type="submit" size="lg" className="w-full bg-primary hover:bg-primary/90 text-white" disabled={createRequest.isPending}>
                      {createRequest.isPending ? "Отправка..." : "Отправить заявку"}
                    </Button>
                  </form>
                </Form>
              )}
            </div>
            
            <div className="w-full lg:w-[400px] glass-card rounded-2xl p-8 shrink-0">
              <h3 className="text-xl font-bold text-white mb-6">Как мы работаем</h3>
              <ol className="space-y-6 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                <li className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.5)]">1</div>
                  <div className="font-medium text-white mb-1">Заявка или звонок</div>
                  <div className="text-sm text-muted-foreground">Вы описываете проблему, мы ориентируем по цене.</div>
                </li>
                <li className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.5)]">2</div>
                  <div className="font-medium text-white mb-1">Бесплатная диагностика</div>
                  <div className="text-sm text-muted-foreground">Точно выявляем причину и согласовываем финальную стоимость.</div>
                </li>
                <li className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.5)]">3</div>
                  <div className="font-medium text-white mb-1">Ремонт</div>
                  <div className="text-sm text-muted-foreground">Используем качественные запчасти и профессиональный инструмент.</div>
                </li>
                <li className="relative pl-8">
                  <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.5)]">4</div>
                  <div className="font-medium text-white mb-1">Выдача и гарантия</div>
                  <div className="text-sm text-muted-foreground">Проверяем устройство вместе с вами и даем гарантию до 1 года.</div>
                </li>
              </ol>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
