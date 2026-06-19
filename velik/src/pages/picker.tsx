import { useState, type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap, ChevronRight, RotateCcw, ChevronDown, CheckCircle2, ArrowLeft,
  Bike, BatteryCharging, Wind, Navigation,
  User, Users, Baby,
  Wallet, Banknote, BadgeCheck, Crown,
  Ruler, Scale, Map,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useListProducts } from "@/api";
import { ProductCard } from "@/components/product-card";

/* ─────────────────── Types ─────────────────── */
type Phase = "landing" | "quiz" | "results";

interface Answer {
  transport: number | null;
  rider: "adult" | "teen" | "child" | null;
  budget: { min?: number; max?: number } | null;
}

/* ─────────────────── Quiz data ─────────────────── */
const TRANSPORT_OPTIONS: { categoryId: number; icon: ReactNode; label: string; sub: string }[] = [
  { categoryId: 1, icon: <Bike className="h-7 w-7" />,            label: "Велосипед",       sub: "Горный, городской, шоссейный" },
  { categoryId: 4, icon: <BatteryCharging className="h-7 w-7" />, label: "Электровелосипед", sub: "С мотором и аккумулятором"     },
  { categoryId: 5, icon: <Wind className="h-7 w-7" />,            label: "Самокат",          sub: "Классический, складной"        },
  { categoryId: 3, icon: <Zap className="h-7 w-7" />,             label: "Электросамокат",   sub: "Быстро, удобно, стильно"       },
];

const RIDER_OPTIONS: { key: "adult" | "teen" | "child"; icon: ReactNode; label: string; sub: string }[] = [
  { key: "adult", icon: <User className="h-7 w-7" />,  label: "Взрослый",   sub: "от 16 лет / рост от 155 см"    },
  { key: "teen",  icon: <Users className="h-7 w-7" />, label: "Подросток",  sub: "10–16 лет / рост 130–155 см"   },
  { key: "child", icon: <Baby className="h-7 w-7" />,  label: "Ребёнок",    sub: "до 10 лет / рост до 130 см"    },
];

const BUDGET_OPTIONS: { label: string; sub: string; icon: ReactNode; min?: number; max?: number }[] = [
  { label: "До 300 руб.",      sub: "Бюджетный вариант",    icon: <Wallet className="h-7 w-7" />,    min: undefined, max: 300      },
  { label: "300 – 700 руб.",   sub: "Оптимальное качество", icon: <Banknote className="h-7 w-7" />,  min: 300,       max: 700      },
  { label: "700 – 1 500 руб.", sub: "Хороший выбор",        icon: <BadgeCheck className="h-7 w-7" />,min: 700,       max: 1500     },
  { label: "Свыше 1 500 руб.", sub: "Премиум-сегмент",      icon: <Crown className="h-7 w-7" />,     min: 1500,      max: undefined },
];

/* ─────────────────── Feature cards ─────────────────── */
const FEATURES = [
  {
    icon: <Ruler className="h-6 w-6" />,
    title: "Подбор по возрасту",
    desc: "Алгоритм точно определяет размер рамы (от 14\" до 23\") и диаметр колёс (26\", 27.5\", 29\") под вашу антропометрию.",
  },
  {
    icon: <Scale className="h-6 w-6" />,
    title: "Контроль нагрузки",
    desc: "Система учитывает вес и стиль езды — предложит модели с подходящей рамой и втулкой, которые выдержат эксплуатацию.",
  },
  {
    icon: <Map className="h-6 w-6" />,
    title: "Тип езды",
    desc: "Учитываем местность: город, лес, дача или работа курьером. Подбираем нужный тип вилки и протектор.",
  },
];

/* ─────────────────── FAQ data ─────────────────── */
const FAQ = [
  {
    q: "Какой велосипед выбрать для веса более 100 кг?",
    a: "Для веса более 90–100 кг критически важно выбирать велосипеды с задней втулкой типа «Кассета». В отличие от дешёвой «Трещотки», кассета имеет разнесённые подшипники, что предотвращает изгиб и поломку оси заднего колеса.",
  },
  {
    q: "Что такое блокировка вилки (Lockout) и зачем она нужна?",
    a: "Блокировка хода — это функция амортизационной вилки, позволяющая сделать её жёсткой. Это полезно при езде по ровному асфальту или в гору, чтобы энергия педалирования не уходила в раскачку пружины.",
  },
  {
    q: "Можно ли взрослому ездить на 24-дюймовых колёсах?",
    a: "Только если это складной велосипед. Для классических горных моделей колёса 24\" подходят для роста до 155 см (подростки). Взрослым мы рекомендуем стандарты 26\", 27.5\" или 29\".",
  },
  {
    q: "Какие тормоза лучше: механика или гидравлика?",
    a: "Дисковая механика надёжна, проста в ремонте и дешевле. Гидравлика обеспечивает максимальную мощность торможения при нажатии одним пальцем, но стоит дороже.",
  },
  {
    q: "Нужна ли амортизация для езды по городу?",
    a: "Для ровного асфальта амортизация лишь добавляет вес. Если в маршруте есть бордюры, грунт, парковые дорожки — передняя вилка с ходом 50–80 мм будет комфортна.",
  },
];

/* ─────────────────── Sub-components ─────────────────── */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border-b border-white/8 last:border-0">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-start justify-between gap-4 py-4 text-left"
      >
        <span className="flex items-start gap-3">
          <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary/20 text-xs font-bold text-primary">?</span>
          <span className="text-white font-medium text-sm">{q}</span>
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${open ? "rotate-180" : ""}`} />
      </button>
      {open && (
        <p className="pb-4 pl-8 text-sm text-muted-foreground leading-relaxed">{a}</p>
      )}
    </div>
  );
}

function ChoiceCard({
  icon, label, sub, selected, onClick,
}: { icon: ReactNode; label: string; sub: string; selected: boolean; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className={`relative flex flex-col items-center gap-3 rounded-2xl border p-5 text-center transition-all duration-200 hover:border-primary/60 hover:bg-primary/5 ${
        selected
          ? "border-primary bg-primary/10 shadow-lg shadow-primary/10"
          : "border-white/10 bg-white/3"
      }`}
    >
      {selected && (
        <span className="absolute right-3 top-3">
          <CheckCircle2 className="h-4 w-4 text-primary" />
        </span>
      )}
      <span className={`flex h-14 w-14 items-center justify-center rounded-2xl transition-colors ${
        selected ? "bg-primary text-white" : "bg-primary/15 text-primary"
      }`}>
        {icon}
      </span>
      <span className="font-bold text-white text-sm leading-tight">{label}</span>
      <span className="text-xs text-muted-foreground">{sub}</span>
    </button>
  );
}

/* ─────────────────── Main component ─────────────────── */
export default function PickerPage() {
  const [phase, setPhase] = useState<Phase>("landing");
  const [step, setStep]   = useState(0);
  const [answer, setAnswer] = useState<Answer>({ transport: null, rider: null, budget: null });

  const { data: productData, isLoading } = useListProducts(
    phase === "results" && answer.transport != null
      ? {
          categoryId: answer.transport,
          ...(answer.budget?.min  != null ? { minPrice: answer.budget.min  } : {}),
          ...(answer.budget?.max  != null ? { maxPrice: answer.budget.max  } : {}),
          limit: 24,
          sortBy: "newest",
        }
      : undefined
  );

  const products = productData?.items ?? [];

  const STEPS = 3;

  function nextStep() {
    if (step < STEPS - 1) setStep(s => s + 1);
    else setPhase("results");
  }
  function prevStep() {
    if (step > 0) setStep(s => s - 1);
    else setPhase("landing");
  }
  function restart() {
    setPhase("landing");
    setStep(0);
    setAnswer({ transport: null, rider: null, budget: null });
  }

  const canNext =
    (step === 0 && answer.transport !== null) ||
    (step === 1 && answer.rider !== null) ||
    (step === 2 && answer.budget !== null);

  /* ════════════════ LANDING ════════════════ */
  if (phase === "landing") return (
    <div className="container mx-auto px-4 py-12">
      {/* Hero */}
      <div className="relative mb-10 overflow-hidden rounded-3xl">
        <img
          src="https://images.unsplash.com/photo-1571068316344-75bc76f77890?w=1400&q=80"
          alt="Умный подбор"
          className="h-72 w-full object-cover md:h-96 brightness-40"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col justify-center px-8 md:px-14">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/30 text-primary">
              <Zap className="h-4 w-4" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-primary">Алгоритм подбора</span>
          </div>
          <h1 className="mb-3 text-4xl font-bold text-white md:text-5xl leading-tight">
            Умный подбор<br />велосипеда
          </h1>
          <p className="mb-6 max-w-lg text-white/80 text-sm md:text-base">
            Ответьте на 3 вопроса — алгоритм подберёт идеальную модель,<br className="hidden md:block" />
            учитывая тип езды, возраст и бюджет. Бесплатно и за 1 минуту.
          </p>
          <Button
            onClick={() => setPhase("quiz")}
            className="w-fit bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider px-8 py-3 rounded-xl"
          >
            <Zap className="mr-2 h-4 w-4" />
            Запустить подбор
          </Button>
        </div>
      </div>

      {/* Feature cards */}
      <div className="mb-10 grid gap-5 sm:grid-cols-3">
        {FEATURES.map((f) => (
          <div key={f.title} className="glass-card rounded-2xl p-6">
            <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl bg-primary/15 text-primary">
              {f.icon}
            </div>
            <h3 className="mb-2 font-bold uppercase text-white tracking-wide text-sm">{f.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{f.desc}</p>
          </div>
        ))}
      </div>

      {/* FAQ */}
      <div className="glass-card rounded-3xl p-6 md:p-10 mb-8">
        <h2 className="mb-6 text-center text-2xl font-bold text-white">Частые вопросы о выборе (FAQ)</h2>
        <div>
          {FAQ.map((item) => <FaqItem key={item.q} {...item} />)}
        </div>
      </div>

      {/* Bottom CTA */}
      <div className="text-center">
        <Button
          onClick={() => setPhase("quiz")}
          className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider px-12 py-3 rounded-xl text-base"
        >
          <Navigation className="mr-2 h-4 w-4" />
          Подобрать модель
        </Button>
      </div>
    </div>
  );

  /* ════════════════ QUIZ ════════════════ */
  if (phase === "quiz") return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-2xl">
        {/* Header */}
        <div className="mb-8 flex items-center gap-4">
          <button onClick={prevStep} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/5 hover:bg-white/10 text-white transition-colors">
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex-1">
            <div className="mb-2 flex items-center justify-between text-xs text-muted-foreground">
              <span>Шаг {step + 1} из {STEPS}</span>
              <span>{Math.round(((step + 1) / STEPS) * 100)}%</span>
            </div>
            <div className="h-1.5 rounded-full bg-white/10">
              <motion.div
                className="h-full rounded-full bg-primary"
                animate={{ width: `${((step + 1) / STEPS) * 100}%` }}
                transition={{ duration: 0.4 }}
              />
            </div>
          </div>
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {/* ── Step 0: Transport ── */}
            {step === 0 && (
              <div>
                <h2 className="mb-2 text-3xl font-bold text-white">Какой транспорт нужен?</h2>
                <p className="mb-6 text-muted-foreground">Выберите вид транспорта, который вас интересует</p>
                <div className="grid grid-cols-2 gap-4">
                  {TRANSPORT_OPTIONS.map((o) => (
                    <ChoiceCard
                      key={o.categoryId}
                      icon={o.icon}
                      label={o.label}
                      sub={o.sub}
                      selected={answer.transport === o.categoryId}
                      onClick={() => setAnswer(a => ({ ...a, transport: o.categoryId }))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 1: Rider ── */}
            {step === 1 && (
              <div>
                <h2 className="mb-2 text-3xl font-bold text-white">Для кого?</h2>
                <p className="mb-6 text-muted-foreground">Это поможет определить правильный размер</p>
                <div className="grid grid-cols-3 gap-4">
                  {RIDER_OPTIONS.map((o) => (
                    <ChoiceCard
                      key={o.key}
                      icon={o.icon}
                      label={o.label}
                      sub={o.sub}
                      selected={answer.rider === o.key}
                      onClick={() => setAnswer(a => ({ ...a, rider: o.key }))}
                    />
                  ))}
                </div>
              </div>
            )}

            {/* ── Step 2: Budget ── */}
            {step === 2 && (
              <div>
                <h2 className="mb-2 text-3xl font-bold text-white">Ваш бюджет?</h2>
                <p className="mb-6 text-muted-foreground">Подберём лучшее в вашем ценовом диапазоне</p>
                <div className="grid grid-cols-2 gap-4">
                  {BUDGET_OPTIONS.map((o) => (
                    <ChoiceCard
                      key={o.label}
                      icon={o.icon}
                      label={o.label}
                      sub={o.sub}
                      selected={answer.budget?.min === o.min && answer.budget?.max === o.max}
                      onClick={() => setAnswer(a => ({ ...a, budget: { min: o.min, max: o.max } }))}
                    />
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Next button */}
        <div className="mt-8">
          <Button
            disabled={!canNext}
            onClick={nextStep}
            className="w-full bg-primary hover:bg-primary/90 disabled:opacity-30 text-white font-bold uppercase tracking-wider h-12 rounded-xl text-sm"
          >
            {step < STEPS - 1 ? (
              <>Далее <ChevronRight className="ml-1 h-4 w-4" /></>
            ) : (
              <>Показать результаты <ChevronRight className="ml-1 h-4 w-4" /></>
            )}
          </Button>
        </div>
      </div>
    </div>
  );

  /* ════════════════ RESULTS ════════════════ */
  const transportLabel = TRANSPORT_OPTIONS.find(o => o.categoryId === answer.transport)?.label ?? "Транспорт";
  const budgetLabel    = BUDGET_OPTIONS.find(o => o.min === answer.budget?.min && o.max === answer.budget?.max)?.label ?? "";
  const riderLabel     = RIDER_OPTIONS.find(o => o.key === answer.rider)?.label ?? "";

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Summary bar */}
      <div className="mb-8 glass-card rounded-2xl p-5 flex flex-wrap items-center gap-3">
        <Zap className="h-5 w-5 text-primary shrink-0" />
        <span className="text-white font-medium">Подборка для вас:</span>
        {[transportLabel, riderLabel, budgetLabel].map((tag) => (
          <span key={tag} className="rounded-lg bg-primary/15 px-3 py-1 text-sm font-medium text-primary">{tag}</span>
        ))}
        <button
          onClick={restart}
          className="ml-auto flex items-center gap-1.5 text-xs text-muted-foreground hover:text-white transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" /> Начать заново
        </button>
      </div>

      {/* Results grid */}
      {isLoading ? (
        <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center">
          <Bike className="mx-auto mb-4 h-12 w-12 text-muted-foreground/30" />
          <p className="mb-2 text-xl font-bold text-white">Ничего не нашлось</p>
          <p className="mb-6 text-muted-foreground">Попробуйте изменить параметры или посмотрите весь каталог</p>
          <Button onClick={restart} variant="outline" className="border-white/10 text-white bg-white/5 hover:bg-white/10">
            <RotateCcw className="mr-2 h-4 w-4" /> Изменить параметры
          </Button>
        </div>
      ) : (
        <>
          <p className="mb-5 text-muted-foreground">Найдено {products.length} подходящих моделей</p>
          <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </>
      )}
    </div>
  );
}
