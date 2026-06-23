import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreateRepairRequest } from "@/api";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Wrench, CheckCircle2, Phone, MessageSquare, ChevronDown } from "lucide-react";
import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const formSchema = z.object({
  customerName: z.string().min(2, "Введите ваше имя"),
  customerPhone: z.string().min(9, "Введите корректный телефон"),
  bikeDescription: z.string().min(5, "Опишите ваш велосипед"),
  problemDescription: z.string().optional(),
});

const TO_PACKAGES = [
  {
    title: "Краткое ТО",
    price: "60,00 руб.",
    color: "from-primary/20 to-primary/5",
    border: "border-primary/30",
    badge: null,
    includes: [
      "Настройка тормозов и передач",
      "Чистка/смазка звёзд и цепи",
      "Устранение мелких восьмёрок",
      "Смазка кожухов и тросиков",
    ],
  },
  {
    title: "Полное ТО",
    price: "95,00 руб.",
    color: "from-secondary/20 to-secondary/5",
    border: "border-secondary/30",
    badge: "Популярное",
    includes: [
      "Полная разборка/сборка и настройка",
      "Замена смазки во втулках, рулевой, каретке",
      "Настройка передач и тормозов",
      "Смазка/чистка звёзд, цепи, кожухов",
      "Протяжка колёс",
      "Мойка велосипеда",
    ],
    note: "Без учёта слесарных работ",
  },
  {
    title: "VIP ТО",
    price: "150,00 руб.",
    color: "from-yellow-500/20 to-yellow-500/5",
    border: "border-yellow-500/30",
    badge: "Вне очереди",
    includes: [
      "Полное ТО + прокачка гидравлических тормозов",
      "Обслуживание амортизационной вилки",
      "Обработка покрышек специальным составом",
      "Доставка велосипеда в мастерскую и обратно",
    ],
  },
  {
    title: "VIP ТО Премиум",
    price: "350,00 руб.",
    color: "from-pink-500/20 to-pink-500/5",
    border: "border-pink-500/30",
    badge: "Всё включено",
    includes: [
      "Все услуги VIP ТО",
      "Доставка к заказчику",
      "Повышенный приоритет",
      "Полный письменный отчёт",
    ],
  },
];

const PRICE_CATEGORIES = [
  {
    name: "Рулевая Колонка",
    items: [
      { name: "Переборка рулевой колонки (ТО, чистка, смазка)", price: "20,00" },
      { name: "Регулировка люфта A-Head (безрезьбовой)", price: "15,00" },
      { name: "Регулировка люфта Head Set (резьбовой)", price: "15,00" },
      { name: "Монтаж якоря в безрезьбовую вилку", price: "15,00" },
      { name: "Установка проставочных колец", price: "15,00" },
    ],
  },
  {
    name: "Колёса",
    items: [
      { name: "Центровка колеса (восьмёрка, эллипс, зонт)", price: "15–150" },
      { name: "Полная протяжка колеса (1 шт.)", price: "35,00" },
      { name: "Расспицовка колеса", price: "35,00" },
      { name: "Заспицовка колеса", price: "65,00" },
      { name: "Заспицовка из комплектующих магазина", price: "55,00" },
      { name: "Накачка колёс", price: "0" },
      { name: "Замена камеры или покрышки", price: "15,00" },
    ],
  },
  {
    name: "Тормоза",
    items: [
      { name: "Настройка V-Brake (1 сторона)", price: "15,00" },
      { name: "Замена тормозных колодок V-Brake с настройкой", price: "15,00" },
      { name: "Замена тормозов V-Brake с настройкой", price: "30,00" },
      { name: "Настройка механического дискового тормоза", price: "25,00" },
      { name: "Замена колодок дискового (механического) с настройкой", price: "30,00" },
      { name: "Замена калипера механического тормоза с настройкой", price: "30,00" },
      { name: "Замена тормозного диска (механический)", price: "30,00" },
      { name: "Прокачка гидравлического контура (без материалов)", price: "40,00" },
      { name: "Настройка гидравлического дискового тормоза", price: "25,00" },
      { name: "Замена колодок гидравлического с настройкой", price: "25,00" },
      { name: "Восстановление тормозного диска", price: "20,00" },
    ],
  },
  {
    name: "Рама и Вилка",
    items: [
      { name: "Настройка дропаута (петуха)", price: "15,00" },
      { name: "Настройка дропаута + настройка переключателя", price: "15,00" },
      { name: "Ремонт резьбы дропаута с адаптером", price: "15,00" },
      { name: "Замена чашек рулевой колонки с монтажем вилки", price: "25,00" },
      { name: "Замена чашек + настройка тормозов", price: "25,00" },
      { name: "Замена вилки с переборкой рулевой и настройкой тормозов", price: "30,00" },
    ],
  },
  {
    name: "Переключатели",
    items: [
      { name: "Регулировка переднего переключателя", price: "15,00" },
      { name: "Замена переднего переключателя с настройкой", price: "24,00" },
      { name: "Регулировка заднего переключателя", price: "15,00" },
      { name: "Замена заднего переключателя с настройкой", price: "24,00" },
    ],
  },
  {
    name: "Втулки, Трещётки, Кассеты",
    items: [
      { name: "Переборка передней втулки (ТО/ремонт)", price: "20,00" },
      { name: "Переборка задней втулки (ТО/ремонт)", price: "25,00" },
      { name: "Устранение люфта в передней втулке", price: "15,00" },
      { name: "Устранение люфта в задней (без съёма трещётки)", price: "15,00" },
      { name: "Устранение люфта в задней (со съёмом трещётки)", price: "27,00" },
      { name: "Замена трещётки", price: "15,00" },
      { name: "Замена кассеты", price: "15,00" },
    ],
  },
  {
    name: "Тормозные ручки и Манетки",
    items: [
      { name: "Замена тормозных ручек (пара)", price: "15,00" },
      { name: "Замена тормозных ручек с настройкой (пара)", price: "10–35" },
      { name: "Замена манеток (пара)", price: "40,00" },
      { name: "Замена манеток с настройкой передач (пара)", price: "40–65" },
      { name: "Замена манеток с настройкой передач и тормозов (пара)", price: "40–85" },
    ],
  },
  {
    name: "Руль и Вынос",
    items: [
      { name: "Замена руля (с грипсами, ручками, манетками)", price: "25,00" },
      { name: "Замена выноса A-Head (безрезьбового)", price: "15,00" },
      { name: "Замена выноса A-Head (резьбового)", price: "15,00" },
      { name: "Замена/монтаж рожек", price: "15,00" },
      { name: "Замена ручек руля (грипс)", price: "15,00" },
    ],
  },
  {
    name: "Каретка и Шатуны",
    items: [
      { name: "Замена кареточного узла (монтаж/демонтаж шатунов)", price: "35,00" },
      { name: "Замена кареточного + перенастройка переднего переключателя", price: "35,00" },
      { name: "Регулировка люфта каретки без снятия шатунов", price: "15,00" },
      { name: "Регулировка люфта с демонтажем левого шатуна", price: "20,00" },
      { name: "Регулировка люфта с демонтажем обоих шатунов", price: "30,00" },
      { name: "Замена шатунов с педалями (пара)", price: "20,00" },
      { name: "Замена шатунов + настройка переднего переключателя", price: "30,00" },
      { name: "Настройка системы звёзд", price: "15,00" },
      { name: "Замена педалей (пара)", price: "15,00" },
      { name: "Восстановление резьбы в шатуне (при возможности)", price: "15,00" },
    ],
  },
  {
    name: "Троса и Рубашки",
    items: [
      { name: "Замена рубашек и тросов без настройки (1 линия)", price: "15,00" },
      { name: "Смазка тросиков и рубашек (1 линия)", price: "15,00" },
    ],
  },
  {
    name: "Цепь",
    items: [
      { name: "Замена цепи", price: "15,00" },
      { name: "Ремонт или укорачивание цепи", price: "15,00" },
      { name: "Смазка цепи специальными смазками", price: "15,00" },
    ],
  },
  {
    name: "Аксессуары",
    items: [
      { name: "Установка велокомпьютера с полной настройкой", price: "20,00" },
      { name: "Установка крыльев (щитков)", price: "9–25" },
      { name: "Установка багажника", price: "9–25" },
      { name: "Установка велоподножки", price: "9–25" },
      { name: "Установка звонков, фонарей, флягодержателей, зеркал", price: "0" },
      { name: "Замена седла", price: "5–70" },
    ],
  },
  {
    name: "Прочие услуги",
    items: [
      { name: "Работы по времени (нестандартные)", price: "20 руб./час" },
      { name: "По договорённости", price: "10–29 руб./час" },
      { name: "Чистка велосипеда специальными средствами", price: "30,00" },
      { name: "Сборка нового велосипеда (без сборки колёс)", price: "от 95–195" },
      { name: "Сборка нового велосипеда со сборкой колёс", price: "195,00" },
      { name: "Индивидуальная сборка / эксклюзивные модели", price: "договорная" },
      { name: "Перенос оборудования на другую раму", price: "150,00" },
      { name: "Покраска рамы", price: "от 120,00" },
    ],
  },
];

export default function Repair() {
  const { toast } = useToast();
  const createRequest = useCreateRepairRequest();
  const [success, setSuccess] = useState(false);
  const [openCategory, setOpenCategory] = useState<string | null>(null);

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
        toast({ title: "Ошибка", description: err.message, variant: "destructive" });
      },
    });
  };

  return (
    <div className="w-full">
      {/* Hero */}
      <section className="py-20 relative overflow-hidden">
        <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[120px] pointer-events-none" />
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <p className="text-primary text-sm font-semibold uppercase tracking-widest mb-3">Первый велосервис в Молодечно</p>
            <h1 className="text-5xl md:text-6xl font-display font-bold text-white mb-6">
              Ремонт<br /><span className="text-primary">велосипедов</span>
            </h1>
            <p className="text-xl text-white/60 leading-relaxed mb-4">
              Любой велосипед возможно восстановить — мы отвечаем за то, чтобы восстановление было качественным и долговечным.
            </p>
            <p className="text-white/50 leading-relaxed">
              Более 10 лет мы совершенствуемся в создании и ремонте велосипедов. Консультации по ремонту, целесообразности замены комплектующих и уточнение стоимости — <span className="text-primary font-medium">бесплатно</span>.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <a href="tel:+375444558888" className="flex items-center gap-2 px-5 py-3 bg-primary hover:bg-primary/90 transition-colors rounded-xl text-white font-medium">
                <Phone className="w-4 h-4" /> Позвонить
              </a>
              <a href="#form" className="flex items-center gap-2 px-5 py-3 glass-card hover:border-primary/30 transition-colors rounded-xl text-white font-medium border border-white/10">
                <MessageSquare className="w-4 h-4" /> Оставить заявку
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* TO Packages */}
      <section className="py-12 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Стоимость обслуживания</h2>
          <p className="text-white/50 mb-8">Комплексные пакеты технического обслуживания велосипедов</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {TO_PACKAGES.map((pkg, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.07 }}
                className={`relative rounded-2xl border ${pkg.border} bg-gradient-to-br ${pkg.color} p-5 flex flex-col`}
              >
                {pkg.badge && (
                  <span className="absolute top-3 right-3 text-[10px] font-bold uppercase tracking-wider bg-white/10 text-white px-2 py-0.5 rounded-full">
                    {pkg.badge}
                  </span>
                )}
                <h3 className="text-lg font-bold text-white mb-1">{pkg.title}</h3>
                <p className="text-2xl font-display font-bold text-white mb-4">{pkg.price}</p>
                <ul className="space-y-1.5 flex-1">
                  {pkg.includes.map((item, j) => (
                    <li key={j} className="text-xs text-white/70 flex items-start gap-2">
                      <CheckCircle2 className="w-3.5 h-3.5 text-primary/70 flex-shrink-0 mt-0.5" />
                      {item}
                    </li>
                  ))}
                </ul>
                {pkg.note && (
                  <p className="mt-3 text-[10px] text-white/40 border-t border-white/10 pt-2">{pkg.note}</p>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Price List */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-white mb-2">Прайс-лист на ремонт</h2>
          <p className="text-white/50 mb-8">Цены на ремонт, настройку и замену комплектующих (BYN)</p>

          <div className="space-y-3">
            {PRICE_CATEGORIES.map((cat) => {
              const isOpen = openCategory === cat.name;
              return (
                <div key={cat.name} className="glass-card rounded-2xl overflow-hidden border border-white/5">
                  <button
                    onClick={() => setOpenCategory(isOpen ? null : cat.name)}
                    className="w-full flex items-center justify-between px-6 py-4 text-left hover:bg-white/5 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <Wrench className="w-4 h-4 text-primary flex-shrink-0" />
                      <span className="font-semibold text-white">{cat.name}</span>
                      <span className="text-xs text-white/40">{cat.items.length} услуг</span>
                    </div>
                    <motion.span animate={{ rotate: isOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                      <ChevronDown className="w-4 h-4 text-white/40" />
                    </motion.span>
                  </button>

                  <AnimatePresence initial={false}>
                    {isOpen && (
                      <motion.div
                        key="content"
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.25 }}
                        className="overflow-hidden"
                      >
                        <div className="border-t border-white/5">
                          {cat.items.map((item, idx) => (
                            <div
                              key={idx}
                              className={`flex items-center justify-between px-6 py-3 gap-4 ${idx % 2 === 0 ? "bg-white/[0.02]" : ""}`}
                            >
                              <span className="text-sm text-white/70 flex-1">{item.name}</span>
                              <span className="text-sm font-semibold text-white whitespace-nowrap">
                                {item.price === "0" ? (
                                  <span className="text-green-400">Бесплатно</span>
                                ) : (
                                  <>{item.price.includes("руб") ? item.price : `${item.price} руб.`}</>
                                )}
                              </span>
                            </div>
                          ))}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })}
          </div>

          <p className="mt-6 text-sm text-white/40 text-center">
            Работы, не включённые в прайс, выполняются по реально затраченному времени. Звоните — проконсультируем бесплатно.
          </p>
        </div>
      </section>

      {/* Form + How we work */}
      <section id="form" className="py-16 bg-white/5 border-y border-white/5">
        <div className="container mx-auto px-4">
          <div className="flex flex-col lg:flex-row gap-12 items-start">
            <div className="flex-1">
              <h2 className="text-3xl font-display font-bold text-white mb-2">Оставить заявку</h2>
              <p className="text-white/50 mb-8">Опишите проблему — мастер свяжется для уточнения деталей и стоимости.</p>

              {success ? (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="glass-card rounded-2xl p-8 text-center border border-green-500/20">
                  <CheckCircle2 className="w-16 h-16 text-green-400 mx-auto mb-4" />
                  <h3 className="text-2xl font-bold text-white mb-2">Заявка принята!</h3>
                  <p className="text-white/50 mb-6">Мы свяжемся с вами в течение 15 минут.</p>
                  <Button variant="outline" onClick={() => setSuccess(false)} className="border-white/10 text-white">
                    Оставить ещё одну заявку
                  </Button>
                </motion.div>
              ) : (
                <Form {...form}>
                  <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5 glass-card p-7 rounded-2xl">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                      <FormField control={form.control} name="customerName" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Ваше имя *</FormLabel>
                          <FormControl><Input className="bg-white/5 border-white/10 text-white" placeholder="Иван" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                      <FormField control={form.control} name="customerPhone" render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white/80">Телефон *</FormLabel>
                          <FormControl><Input className="bg-white/5 border-white/10 text-white" placeholder="+375 44 000 00 00" {...field} /></FormControl>
                          <FormMessage />
                        </FormItem>
                      )} />
                    </div>
                    <FormField control={form.control} name="bikeDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Велосипед (марка, модель) *</FormLabel>
                        <FormControl><Input className="bg-white/5 border-white/10 text-white" placeholder="Например: Stels Navigator 900" {...field} /></FormControl>
                        <FormMessage />
                      </FormItem>
                    )} />
                    <FormField control={form.control} name="problemDescription" render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-white/80">Что случилось?</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Опишите симптомы поломки или что нужно сделать..."
                            className="bg-white/5 border-white/10 text-white min-h-[100px]"
                            {...field}
                          />
                        </FormControl>
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

            <div className="w-full lg:w-[380px] shrink-0 space-y-5">
              <div className="glass-card rounded-2xl p-7">
                <h3 className="text-xl font-bold text-white mb-6">Как мы работаем</h3>
                <ol className="space-y-5 relative before:absolute before:inset-y-0 before:left-[11px] before:w-[2px] before:bg-white/10">
                  {[
                    { title: "Заявка или звонок", desc: "Опишите проблему — сориентируем по цене и срокам." },
                    { title: "Бесплатная консультация", desc: "Уточняем детали и согласовываем итоговую стоимость." },
                    { title: "Ремонт", desc: "Используем качественные запчасти и профессиональный инструмент." },
                    { title: "Выдача и гарантия", desc: "Проверяем велосипед вместе с вами, даём гарантию на работы." },
                  ].map((step, i) => (
                    <li key={i} className="relative pl-8">
                      <div className="absolute left-0 top-1 w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-[0_0_10px_rgba(90,49,255,0.5)]">
                        {i + 1}
                      </div>
                      <div className="font-medium text-white mb-0.5">{step.title}</div>
                      <div className="text-sm text-white/50">{step.desc}</div>
                    </li>
                  ))}
                </ol>
              </div>

              <div className="glass-card rounded-2xl p-7">
                <h3 className="text-xl font-bold text-white mb-3">Комплектующие</h3>
                <p className="text-sm text-white/60 leading-relaxed">
                  Мы держим склад наиболее востребованных запчастей — это позволяет делать ремонт быстрее и дешевле. В редких случаях помогаем найти детали, которых нет в Беларуси.
                </p>
              </div>

              <div className="glass-card rounded-2xl p-7 border border-primary/20">
                <p className="text-xs text-primary font-semibold uppercase tracking-widest mb-2">Бесплатно</p>
                <h3 className="text-lg font-bold text-white mb-2">Консультация</h3>
                <p className="text-sm text-white/60 leading-relaxed mb-4">
                  Ремонт, целесообразность замены комплектующих, советы по эксплуатации — всё это бесплатно.
                </p>
                <a href="tel:+375444558888" className="flex items-center gap-2 text-primary font-medium text-sm hover:text-primary/80 transition-colors">
                  <Phone className="w-4 h-4" /> +375 44 455 88 88
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
