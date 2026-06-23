import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown, ChevronLeft, ChevronRight, Home, Tag } from "lucide-react";
import { Link } from "wouter";
import type { Category } from "@/api";

interface CategoryHeaderProps {
  category: Category;
  onCategoryChange: (id: number | null) => void;
  onPriceFilter?: (min: number, max: number) => void;
  onSearchFilter?: (search: string) => void;
  totalProducts?: number;
}

const PRICE_PRESETS = [
  { label: "До 500 BYN",  max: 500  },
  { label: "До 1000 BYN", max: 1000 },
  { label: "До 2000 BYN", max: 2000 },
  { label: "До 5000 BYN", max: 5000 },
];

const MAX_PRICE = 10000;

const SUBCATEGORIES: Record<string, string[]> = {
  velosipedy: [
    "Горные велосипеды",
    "Горные двухподвесы",
    "Городские велосипеды",
    "Гибридные велосипеды",
    "Детские велосипеды",
    "Женские велосипеды",
    "Круизеры",
    "Подростковые велосипеды",
    "Складные велосипеды",
    "Фэтбайки",
    "BMX",
  ],
  elektrosamokaty: [
    "Городские самокаты",
    "Складные самокаты",
    "Внедорожные самокаты",
    "Высокоскоростные",
    "Детские электросамокаты",
  ],
  elektravelasipedy: [
    "Городские электровелосипеды",
    "Горные электровелосипеды",
    "Складные электровелосипеды",
    "Электрофэтбайки",
  ],
  samokaty: [
    "Трёхколёсные",
    "Детские самокаты",
    "Самокаты для подростков",
    "Трюковые самокаты",
    "Взрослые самокаты",
  ],
  zapchasti: [
    "Тормоза",
    "Трансмиссия",
    "Колёса и покрышки",
    "Рули и вилки",
    "Педали и каретки",
    "Цепи и звёзды",
  ],
  aksessuary: [
    "Шлемы",
    "Замки",
    "Фонари",
    "Сумки и рюкзаки",
    "Перчатки",
    "Насосы",
    "Флягодержатели",
  ],
  servis: [
    "Техническое обслуживание",
    "Ремонт ходовой",
    "Замена тросов",
    "Настройка переключателей",
    "Сезонное ТО",
  ],
};

interface GuideSection {
  heading: string;
  items: { name: string; desc: string }[];
}

interface CategoryGuide {
  intro: string;
  sections: GuideSection[];
  tips?: string[];
}

const CATEGORY_GUIDES: Record<string, CategoryGuide> = {
  velosipedy: {
    intro:
      "Велосипед — это больше, чем просто транспорт. Это свобода, здоровье, приключения и самый экологичный способ познавать мир. В нашем магазине мы собрали огромный выбор велосипедов, чтобы каждый — от трёхлетнего малыша до опытного спортсмена — нашёл себе идеального двухколёсного друга.",
    sections: [
      {
        heading: "Для приключений и универсальности",
        items: [
          { name: "Горные велосипеды (МТВ)", desc: "Настоящие универсалы, готовые к любым испытаниям. Идеальны для лесных троп, парков, дачи и ежедневных поездок по городу." },
          { name: "Двухподвесы", desc: "Вершина технологий МТВ. Амортизация на обоих колёсах обеспечивает максимальный контроль на сложных трассах." },
        ],
      },
      {
        heading: "Для города и комфорта",
        items: [
          { name: "Городские велосипеды", desc: "Прямая посадка, широкое седло и полная комплектация для идеального городского транспорта." },
          { name: "Женские велосипеды", desc: "Заниженная рама, анатомическое седло и изящный дизайн для максимального удобства." },
          { name: "Гибридные велосипеды", desc: "Золотая середина между горным и шоссейным. Быстрые на асфальте, не боятся грунта." },
        ],
      },
      {
        heading: "Для особых задач",
        items: [
          { name: "Складные велосипеды", desc: "Легко помещаются в багажник, лифт или шкаф — решение проблемы хранения." },
          { name: "Фэтбайки", desc: "Сверхшироские шины для снега, песка, грязи. Катание круглый год." },
          { name: "Круизеры", desc: "Яркий ретро-дизайн для неспешных прогулок в своё удовольствие." },
        ],
      },
      {
        heading: "Для юных велосипедистов",
        items: [
          { name: "Детские велосипеды", desc: "От беговелов до 24-дюймовых колёс. Максимум безопасности и яркий дизайн." },
          { name: "Подростковые велосипеды", desc: "Серьёзные байки по взрослым технологиям, но с рамой меньшего размера." },
        ],
      },
    ],
    tips: [
      "Определите стиль катания — это 80% успеха при выборе типа велосипеда.",
      "Подберите правильный размер рамы — в каждой карточке есть рекомендации по росту.",
      "Выберите тормоза: ободные — надёжны и просты, дисковые — мощнее при любой погоде.",
    ],
  },
  elektrosamokaty: {
    intro: "Электросамокат — идеальное решение для городских поездок. Лёгкий, компактный, экологичный. Избавьтесь от пробок и паркуйтесь где угодно.",
    sections: [
      {
        heading: "Для ежедневных поездок",
        items: [
          { name: "Городские модели", desc: "Лёгкие, складные, запас хода 20–40 км. Идеальны до работы или метро." },
          { name: "Комфортные модели", desc: "Широкая дека, амортизация, большие колёса для приятных прогулок." },
        ],
      },
      {
        heading: "Для активного стиля",
        items: [
          { name: "Внедорожные модели", desc: "Мощные двигатели, пневматические шины и усиленная рама для бездорожья." },
          { name: "Высокоскоростные", desc: "Скорость до 60 км/ч для опытных пользователей." },
        ],
      },
    ],
    tips: [
      "Реальный запас хода обычно на 20–30% меньше заявленного.",
      "Выбирайте пневматические шины для лучшей амортизации.",
    ],
  },
  elektravelasipedy: {
    intro: "Электровелосипед объединяет лучшее от классического велосипеда и электромотора. Подниматься в горы без усилий и преодолевать большие расстояния — теперь реально.",
    sections: [
      {
        heading: "Городские электровелосипеды",
        items: [
          { name: "С задним мотором", desc: "Плавная езда и естественное ощущение педалирования." },
          { name: "Складные модели", desc: "Компактные для хранения в квартире или перевозки в машине." },
        ],
      },
      {
        heading: "Спортивные электровелосипеды",
        items: [
          { name: "Горные e-MTB", desc: "Покоряйте любые подъёмы с поддержкой мощного мотора." },
          { name: "Электрофэтбайки", desc: "Для зимних поездок и бездорожья с электроприводом." },
        ],
      },
    ],
    tips: [
      "Ёмкость батареи определяет запас хода — чем больше, тем лучше.",
      "Моторы mid-drive (в каретке) предпочтительны для горных маршрутов.",
    ],
  },
};

const FALLBACK_DESCRIPTION: Record<string, string> = {
  samokaty: "Самокаты для детей и взрослых — отличный способ активного отдыха. Прочные конструкции, надёжные тормоза и яркий дизайн.",
  zapchasti: "Запчасти и комплектующие для велосипедов, самокатов и электротранспорта. Только оригинальные детали от проверенных производителей.",
  aksessuary: "Аксессуары для комфортной и безопасной езды: шлемы, перчатки, фонари, замки, сумки и многое другое.",
  servis: "Профессиональный сервис и обслуживание велосипедов и электротранспорта. Опытные мастера, гарантия на все виды работ.",
};

export function CategoryHeader({
  category,
  onCategoryChange,
  onPriceFilter,
  onSearchFilter,
  totalProducts,
}: CategoryHeaderProps) {
  const [guideOpen, setGuideOpen] = useState(false);
  const [activePreset, setActivePreset] = useState<number | null>(null);
  const [activeSubcat, setActiveSubcat] = useState<string | null>(null);

  const guide = CATEGORY_GUIDES[category.slug] ?? null;
  const subcategories = SUBCATEGORIES[category.slug] ?? [];

  const description =
    category.description ||
    guide?.intro ||
    FALLBACK_DESCRIPTION[category.slug] ||
    "";

  const sliderFill =
    activePreset !== null
      ? (PRICE_PRESETS[activePreset].max / MAX_PRICE) * 100
      : 100;

  const handlePreset = (idx: number, max: number) => {
    if (activePreset === idx) {
      setActivePreset(null);
      onPriceFilter?.(0, MAX_PRICE);
    } else {
      setActivePreset(idx);
      onPriceFilter?.(0, max);
    }
  };

  const stepPreset = (dir: 1 | -1) => {
    const next =
      activePreset === null
        ? dir === 1 ? 0 : PRICE_PRESETS.length - 1
        : activePreset + dir;
    if (next < 0 || next >= PRICE_PRESETS.length) {
      setActivePreset(null);
      onPriceFilter?.(0, MAX_PRICE);
    } else {
      setActivePreset(next);
      onPriceFilter?.(0, PRICE_PRESETS[next].max);
    }
  };

  const handleSubcat = (name: string) => {
    if (activeSubcat === name) {
      setActiveSubcat(null);
      onSearchFilter?.("");
    } else {
      setActiveSubcat(name);
      onSearchFilter?.(name);
    }
  };

  return (
    <motion.div
      className="mb-8"
      initial={{ opacity: 0, y: -12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
    >
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-muted-foreground mb-4">
        <Link href="/" className="hover:text-white transition-colors flex items-center gap-1">
          <Home className="w-3.5 h-3.5" />
        </Link>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <button onClick={() => onCategoryChange(null)} className="hover:text-white transition-colors">
          Каталог
        </button>
        <ChevronRight className="w-3.5 h-3.5 opacity-40" />
        <span className="text-white font-medium">{category.name}</span>
      </div>

      {/* Main banner */}
      <div className="glass-card rounded-2xl overflow-hidden">
        <div className="flex flex-col sm:flex-row">
          {/* Category image */}
          {category.imageUrl && (
            <div className="sm:w-52 h-40 sm:h-auto flex-shrink-0 relative overflow-hidden">
              <img
                src={category.imageUrl}
                alt={category.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-transparent to-black/40" />
            </div>
          )}

          {/* Content */}
          <div className="flex-1 p-5 flex flex-col gap-3 min-w-0">
            {/* Title */}
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-2xl font-bold text-white tracking-wide uppercase">
                {category.name}
              </h2>
              {totalProducts !== undefined && (
                <span className="text-xs text-muted-foreground whitespace-nowrap mt-1">
                  {totalProducts} товаров
                </span>
              )}
            </div>

            {/* Price preset chips */}
            {onPriceFilter && (
              <div className="flex items-center gap-2 flex-wrap">
                {PRICE_PRESETS.map((p, idx) => (
                  <button
                    key={idx}
                    onClick={() => handlePreset(idx, p.max)}
                    className={`
                      flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                      border transition-all duration-200
                      ${activePreset === idx
                        ? "bg-primary border-primary text-white shadow-[0_0_12px_rgba(139,92,246,0.4)]"
                        : "border-white/10 text-muted-foreground hover:border-primary/50 hover:text-white bg-white/5"
                      }
                    `}
                  >
                    <Tag className="w-3 h-3" />
                    {p.label}
                  </button>
                ))}
              </div>
            )}

            {/* Price slider bar */}
            {onPriceFilter && (
              <div className="flex items-center gap-2">
                <button
                  onClick={() => stepPreset(-1)}
                  className="text-primary/70 hover:text-primary transition-colors flex-shrink-0"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <div className="flex-1 relative h-1.5 rounded-full bg-white/10 overflow-hidden">
                  <motion.div
                    className="absolute left-0 top-0 h-full rounded-full bg-gradient-to-r from-primary to-purple-400"
                    animate={{ width: `${sliderFill}%` }}
                    transition={{ type: "spring", stiffness: 300, damping: 30 }}
                  />
                </div>
                <button
                  onClick={() => stepPreset(1)}
                  className="text-primary/70 hover:text-primary transition-colors flex-shrink-0"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Description */}
            {description && (
              <p className="text-sm text-white/70 leading-relaxed">{description}</p>
            )}

            {/* Expand guide button */}
            {guide && (
              <button
                onClick={() => setGuideOpen((v) => !v)}
                className="self-start flex items-center gap-1 text-xs text-primary hover:text-primary/80 transition-colors"
              >
                {guideOpen ? "Свернуть" : "Подробнее о категории"}
                <motion.span animate={{ rotate: guideOpen ? 180 : 0 }} transition={{ duration: 0.2 }}>
                  <ChevronDown className="w-3.5 h-3.5" />
                </motion.span>
              </button>
            )}
          </div>
        </div>

        {/* Expandable guide */}
        <AnimatePresence initial={false}>
          {guideOpen && guide && (
            <motion.div
              key="guide"
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.35, ease: "easeInOut" }}
              className="overflow-hidden border-t border-white/5"
            >
              <div className="p-5 pt-4 grid sm:grid-cols-2 gap-6">
                {guide.sections.map((sec, i) => (
                  <div key={i}>
                    <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                      {sec.heading}
                    </h3>
                    <ul className="space-y-2">
                      {sec.items.map((item, j) => (
                        <li key={j}>
                          <span className="text-xs font-semibold text-primary">{item.name}</span>
                          <p className="text-xs text-white/60 mt-0.5 leading-relaxed">{item.desc}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
              {guide.tips && (
                <div className="px-5 pb-5">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-2">
                    Как не ошибиться с выбором?
                  </h3>
                  <ol className="space-y-1">
                    {guide.tips.map((tip, i) => (
                      <li key={i} className="text-xs text-white/60 flex gap-2">
                        <span className="text-primary font-semibold flex-shrink-0">{i + 1}.</span>
                        {tip}
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Subcategory chips specific to this category */}
      {subcategories.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2">
          {subcategories.map((name) => (
            <button
              key={name}
              onClick={() => handleSubcat(name)}
              className={`
                px-3 py-1.5 rounded-lg text-xs font-medium uppercase tracking-wide
                border transition-all duration-200
                ${activeSubcat === name
                  ? "bg-primary/20 border-primary text-primary"
                  : "border-white/10 text-muted-foreground hover:border-white/30 hover:text-white bg-white/5"
                }
              `}
            >
              {name}
            </button>
          ))}
        </div>
      )}
    </motion.div>
  );
}
