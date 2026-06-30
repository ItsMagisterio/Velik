import { useState } from "react";
import { ChevronDown, ChevronUp, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import type { FilterOptions } from "@/api/filter-options";
import { BRANDS } from "@/lib/brands";

// ─── State ────────────────────────────────────────────────────────────────────

export interface CatalogFilterState {
  minPrice: number;
  maxPrice: number;
  inStock: boolean;
  onSale: boolean;
  yearFrom: number | null;
  yearTo: number | null;
  brands: string[];
  specFilters: Record<string, string[]>;
}

export const INITIAL_FILTER_STATE: CatalogFilterState = {
  minPrice: 0,
  maxPrice: 10000,
  inStock: false,
  onSale: false,
  yearFrom: null,
  yearTo: null,
  brands: [],
  specFilters: {},
};

// ─── Per-category spec section definitions ────────────────────────────────────
// staticOptions shown when DB has no data yet for that spec key.

type SpecFilterDef =
  | { kind: "spec";       title: string; specKey: string; staticOptions?: string[] }
  | { kind: "bool";       title: string; specKey: string; label: string }
  | { kind: "bool-group"; title: string; items: Array<{ label: string; specKey: string }> }
  | { kind: "audience" };

const CATEGORY_SPEC_SECTIONS: Record<string, SpecFilterDef[]> = {

  // ── Велосипеды ──────────────────────────────────────────────────────────────
  velosipedy: [
    {
      kind: "spec", title: "Класс велосипеда", specKey: "Класс велосипеда",
      staticOptions: ["Горный (MTB)", "Шоссейный", "Городской", "Гибридный", "Круизер", "Складной", "Фэтбайк", "BMX", "Детский"],
    },
    { kind: "audience" },
    {
      kind: "spec", title: "Вилка (тип)", specKey: "Вилка (тип)",
      staticOptions: ["Жёсткая", "Пружинная", "Пружинно-масляная", "Воздушно-масляная", "Карбоновая"],
    },
    {
      kind: "bool-group", title: "Особенности подвески", items: [
        { label: "Блокировка вилки",   specKey: "Блокировка вилки" },
        { label: "Задний амортизатор", specKey: "Задний амортизатор" },
      ],
    },
    {
      kind: "spec", title: "Материал рамы", specKey: "Материал рамы",
      staticOptions: ["Алюминиевый сплав", "Сталь", "Карбон", "Хромомолибден", "Титан"],
    },
    {
      kind: "spec", title: "Тип рамы", specKey: "Тип рамы",
      staticOptions: ["Жёсткая (хардтейл)", "Двухподвес (фулл)", "Стрит", "Дёрт"],
    },
    {
      kind: "spec", title: "Размер рамы", specKey: "Размер рамы",
      staticOptions: ["13\"", "15\"", "17\"", "19\"", "21\"", "XS", "S", "M", "L", "XL"],
    },
    {
      kind: "spec", title: "Рост велосипедиста", specKey: "Рост велосипедиста",
      staticOptions: ["до 140 см", "140–155 см", "155–170 см", "170–185 см", "185–200 см", "от 200 см"],
    },
    { kind: "bool", title: "Складная рама", specKey: "Складная рама", label: "Складная рама" },
    {
      kind: "spec", title: "Количество скоростей", specKey: "Количество скоростей",
      staticOptions: ["1", "3", "6", "7", "8", "9", "10", "11", "12", "21", "24", "27"],
    },
    {
      kind: "spec", title: "Тип трансмиссии", specKey: "Тип трансмиссии",
      staticOptions: ["Shimano", "SRAM", "Microshift", "Одиночная"],
    },
    {
      kind: "spec", title: "Тип манеток", specKey: "Тип манеток",
      staticOptions: ["Триггерные", "Вращательные (Gripshift)", "Курковые", "Интегрированные"],
    },
    {
      kind: "spec", title: "Диаметр колес", specKey: "Диаметр колес",
      staticOptions: ["12\"", "14\"", "16\"", "20\"", "24\"", "26\"", "27.5\"", "28\"", "29\""],
    },
    { kind: "bool", title: "Двойные обода", specKey: "Двойные обода", label: "Двойные обода" },
    {
      kind: "spec", title: "Передний тормоз", specKey: "Передний тормоз",
      staticOptions: ["Дисковый гидравлический", "Дисковый механический", "Ободной V-brake", "Ободной клещевой"],
    },
    {
      kind: "spec", title: "Задний тормоз", specKey: "Задний тормоз",
      staticOptions: ["Дисковый гидравлический", "Дисковый механический", "Ободной V-brake", "Ободной клещевой"],
    },
    {
      kind: "bool-group", title: "Руль и седло", items: [
        { label: "Регулировка руля по высоте", specKey: "Регулировка руля по высоте" },
        { label: "Амортизация седла",          specKey: "Амортизация седла" },
      ],
    },
    {
      kind: "spec", title: "Материал педалей", specKey: "Материал педалей",
      staticOptions: ["Пластик", "Алюминий", "Нейлон", "Магний"],
    },
  ],

  // ── Электросамокаты ─────────────────────────────────────────────────────────
  elektrosamokaty: [
    {
      kind: "spec", title: "Мощность мотора", specKey: "Мощность мотора",
      staticOptions: ["250 Вт", "350 Вт", "500 Вт", "800 Вт", "1000 Вт", "1500 Вт", "2000 Вт+"],
    },
    {
      kind: "spec", title: "Запас хода", specKey: "Запас хода",
      staticOptions: ["до 20 км", "20–30 км", "30–40 км", "40–60 км", "60–80 км", "80+ км"],
    },
    {
      kind: "spec", title: "Максимальная скорость", specKey: "Максимальная скорость",
      staticOptions: ["до 20 км/ч", "20–25 км/ч", "25–35 км/ч", "35–45 км/ч", "45+ км/ч"],
    },
    {
      kind: "spec", title: "Тип колес", specKey: "Тип колес",
      staticOptions: ["Пневматические", "Бескамерные (Honeycomb)", "Литые резиновые"],
    },
    {
      kind: "spec", title: "Диаметр колес", specKey: "Диаметр колес",
      staticOptions: ["6\"", "8\"", "8.5\"", "10\"", "11\"", "12\""],
    },
    {
      kind: "spec", title: "Тип тормоза", specKey: "Тип тормоза",
      staticOptions: ["Дисковый гидравлический", "Дисковый механический", "Электронный (EABS)", "Барабанный"],
    },
    {
      kind: "spec", title: "Максимальная нагрузка", specKey: "Максимальная нагрузка",
      staticOptions: ["до 80 кг", "80–100 кг", "100–120 кг", "120+ кг"],
    },
    {
      kind: "spec", title: "Ёмкость батареи", specKey: "Ёмкость батареи",
      staticOptions: ["до 7 Ач", "7–10 Ач", "10–15 Ач", "15–20 Ач", "20+ Ач"],
    },
    {
      kind: "bool-group", title: "Конструкция", items: [
        { label: "Складной",                   specKey: "Складной" },
        { label: "Амортизатор передний",        specKey: "Амортизатор передний" },
        { label: "Амортизатор задний",          specKey: "Амортизатор задний" },
        { label: "Подсветка",                   specKey: "Подсветка" },
      ],
    },
  ],

  // ── Электровелосипеды ───────────────────────────────────────────────────────
  elektravelasipedy: [
    {
      kind: "spec", title: "Тип мотора", specKey: "Тип мотора",
      staticOptions: ["Мотор-колесо переднее", "Мотор-колесо заднее", "Центральный (mid-drive)"],
    },
    {
      kind: "spec", title: "Мощность мотора", specKey: "Мощность мотора",
      staticOptions: ["250 Вт", "350 Вт", "500 Вт", "750 Вт", "1000 Вт+"],
    },
    {
      kind: "spec", title: "Запас хода", specKey: "Запас хода",
      staticOptions: ["до 30 км", "30–50 км", "50–80 км", "80–120 км", "120+ км"],
    },
    {
      kind: "spec", title: "Ёмкость батареи", specKey: "Ёмкость батареи",
      staticOptions: ["до 10 Ач", "10–15 Ач", "15–20 Ач", "20–30 Ач", "30+ Ач"],
    },
    {
      kind: "spec", title: "Класс велосипеда", specKey: "Класс велосипеда",
      staticOptions: ["Городской", "Горный (e-MTB)", "Складной", "Грэвел", "Фэтбайк"],
    },
    {
      kind: "spec", title: "Материал рамы", specKey: "Материал рамы",
      staticOptions: ["Алюминиевый сплав", "Сталь", "Карбон"],
    },
    {
      kind: "spec", title: "Размер рамы", specKey: "Размер рамы",
      staticOptions: ["15\"", "17\"", "19\"", "S", "M", "L", "XL"],
    },
    { kind: "bool", title: "Складная рама", specKey: "Складная рама", label: "Складная рама" },
    {
      kind: "spec", title: "Диаметр колес", specKey: "Диаметр колес",
      staticOptions: ["20\"", "24\"", "26\"", "27.5\"", "28\"", "29\""],
    },
    {
      kind: "spec", title: "Передний тормоз", specKey: "Передний тормоз",
      staticOptions: ["Дисковый гидравлический", "Дисковый механический", "Ободной"],
    },
    {
      kind: "spec", title: "Задний тормоз", specKey: "Задний тормоз",
      staticOptions: ["Дисковый гидравлический", "Дисковый механический", "Ободной"],
    },
    {
      kind: "spec", title: "Количество скоростей", specKey: "Количество скоростей",
      staticOptions: ["1 (однопередаточный)", "7", "8", "9", "10", "11", "12"],
    },
  ],

  // ── Самокаты (не электро) ───────────────────────────────────────────────────
  samokaty: [
    { kind: "audience" },
    {
      kind: "spec", title: "Тип самоката", specKey: "Тип самоката",
      staticOptions: ["Городской", "Трюковой", "Трёхколёсный", "Детский", "Беговел"],
    },
    {
      kind: "spec", title: "Диаметр колес", specKey: "Диаметр колес",
      staticOptions: ["100 мм", "110 мм", "120 мм", "145 мм", "150 мм", "180 мм", "200 мм"],
    },
    {
      kind: "spec", title: "Тип колес", specKey: "Тип колес",
      staticOptions: ["Полиуретан", "Резина (надувные)", "Светящиеся"],
    },
    {
      kind: "spec", title: "Максимальная нагрузка", specKey: "Максимальная нагрузка",
      staticOptions: ["до 50 кг", "50–80 кг", "80–100 кг", "100+ кг"],
    },
    {
      kind: "spec", title: "Материал деки", specKey: "Материал деки",
      staticOptions: ["Алюминий", "Сталь", "Дерево", "Карбон"],
    },
    {
      kind: "spec", title: "Тип тормоза", specKey: "Тип тормоза",
      staticOptions: ["Ножной (пятка)", "Ручной дисковый", "Ручной ободной"],
    },
    {
      kind: "bool-group", title: "Конструкция", items: [
        { label: "Складной",                   specKey: "Складной" },
        { label: "Регулировка руля по высоте", specKey: "Регулировка руля по высоте" },
        { label: "Амортизатор",                specKey: "Амортизатор" },
      ],
    },
  ],

  // ── Аксессуары ──────────────────────────────────────────────────────────────
  aksessuary: [
    {
      kind: "spec", title: "Тип аксессуара", specKey: "Тип аксессуара",
      staticOptions: ["Шлем", "Замок", "Фонарь", "Насос", "Перчатки", "Сумка", "Флягодержатель", "Крыло", "Звонок", "Зеркало", "Подножка"],
    },
    {
      kind: "spec", title: "Совместимость", specKey: "Совместимость",
      staticOptions: ["Велосипед", "Электросамокат", "Электровелосипед", "Самокат", "Универсально"],
    },
    {
      kind: "spec", title: "Материал", specKey: "Материал",
      staticOptions: ["Пластик", "Алюминий", "Нейлон", "Кожа", "Неопрен", "Карбон"],
    },
    {
      kind: "spec", title: "Размер / объём", specKey: "Размер",
      staticOptions: ["XS", "S", "M", "L", "XL", "XXL", "Универсальный"],
    },
    {
      kind: "spec", title: "Степень защиты", specKey: "Степень защиты",
      staticOptions: ["CE EN1078", "ASTM F1447", "CPSC 1203"],
    },
  ],

  // ── Запчасти ─────────────────────────────────────────────────────────────────
  zapchasti: [
    {
      kind: "spec", title: "Тип запчасти", specKey: "Тип запчасти",
      staticOptions: ["Тормоза", "Трансмиссия", "Колёса и покрышки", "Рули и вилки", "Педали и каретки", "Цепи и звёзды", "Седло", "Рамы"],
    },
    {
      kind: "spec", title: "Совместимость", specKey: "Совместимость",
      staticOptions: ["Shimano", "SRAM", "Campagnolo", "Универсально"],
    },
    {
      kind: "spec", title: "Скоростность", specKey: "Скоростность",
      staticOptions: ["1 скорость", "7-8 скоростей", "9 скоростей", "10 скоростей", "11 скоростей", "12 скоростей"],
    },
    {
      kind: "spec", title: "Диаметр колеса", specKey: "Диаметр колес",
      staticOptions: ["20\"", "24\"", "26\"", "27.5\"", "28\"", "29\""],
    },
  ],
};

// ─── Props ────────────────────────────────────────────────────────────────────

interface CatalogFiltersProps {
  state: CatalogFilterState;
  onChange: (patch: Partial<CatalogFilterState>) => void;
  onReset: () => void;
  filterOptions?: FilterOptions;
  categorySlug?: string;
  onMobileClose?: () => void;
  isMobile?: boolean;
}

// ─── Primitives ──────────────────────────────────────────────────────────────

function FilterSection({
  title,
  children,
  activeCount = 0,
  defaultOpen = false,
}: {
  title: string;
  children: React.ReactNode;
  activeCount?: number;
  defaultOpen?: boolean;
}) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10 pb-4 mb-4 last:border-0 last:mb-0 last:pb-0">
      <button
        type="button"
        className="flex items-center justify-between w-full text-left"
        onClick={() => setOpen((o) => !o)}
      >
        <span className="text-sm font-medium text-white flex items-center gap-2">
          {title}
          {activeCount > 0 && (
            <span className="bg-primary text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center leading-none">
              {activeCount}
            </span>
          )}
        </span>
        {open ? (
          <ChevronUp className="w-3.5 h-3.5 text-white/40 shrink-0" />
        ) : (
          <ChevronDown className="w-3.5 h-3.5 text-white/40 shrink-0" />
        )}
      </button>
      {open && <div className="mt-3 space-y-2">{children}</div>}
    </div>
  );
}

function FilterCheckbox({
  id,
  label,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}) {
  return (
    <div className="flex items-center gap-2">
      <Checkbox
        id={id}
        checked={checked}
        onCheckedChange={(c) => onChange(c === true)}
        className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary shrink-0"
      />
      <label
        htmlFor={id}
        className="text-sm text-white/70 hover:text-white cursor-pointer leading-tight"
      >
        {label}
      </label>
    </div>
  );
}

// staticOptions used as fallback when DB has no spec data yet
function SpecSection({
  title,
  specKey,
  dbOptions,
  staticOptions = [],
  specFilters,
  onSpecFilterChange,
}: {
  title: string;
  specKey: string;
  dbOptions: string[];
  staticOptions?: string[];
  specFilters: Record<string, string[]>;
  onSpecFilterChange: (key: string, values: string[]) => void;
}) {
  const [showAll, setShowAll] = useState(false);
  const selected = specFilters[specKey] ?? [];
  // prefer live DB options; fall back to static
  const options = dbOptions.length > 0 ? dbOptions : staticOptions;
  const visible = showAll ? options : options.slice(0, 6);

  const toggle = (value: string, checked: boolean) => {
    onSpecFilterChange(
      specKey,
      checked ? [...selected, value] : selected.filter((v) => v !== value),
    );
  };

  return (
    <FilterSection title={title} activeCount={selected.length}>
      {options.length === 0 ? (
        <p className="text-xs text-white/30 italic">Нет данных</p>
      ) : (
        <>
          {visible.map((opt) => (
            <FilterCheckbox
              key={opt}
              id={`spec-${specKey}-${opt}`}
              label={opt}
              checked={selected.includes(opt)}
              onChange={(c) => toggle(opt, c)}
            />
          ))}
          {options.length > 6 && (
            <button
              type="button"
              onClick={() => setShowAll((s) => !s)}
              className="text-xs text-primary hover:text-primary/70 mt-1 transition-colors"
            >
              {showAll ? "Скрыть" : `Ещё ${options.length - 6}`}
            </button>
          )}
        </>
      )}
    </FilterSection>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export function CatalogFilters({
  state,
  onChange,
  onReset,
  filterOptions,
  categorySlug,
  onMobileClose,
  isMobile,
}: CatalogFiltersProps) {
  const [showAllBrands, setShowAllBrands] = useState(false);

  const specs = filterOptions?.specs ?? {};
  const visibleBrands = showAllBrands ? BRANDS : BRANDS.slice(0, 6);
  const specFilters = state.specFilters;

  const setSpec = (key: string, values: string[]) => {
    const next = { ...specFilters };
    if (values.length === 0) delete next[key];
    else next[key] = values;
    onChange({ specFilters: next });
  };

  const isBool = (key: string) => specFilters[key]?.includes("Да") ?? false;
  const toggleBool = (key: string, checked: boolean) => setSpec(key, checked ? ["Да"] : []);

  const toggleBrand = (brand: string, checked: boolean) => {
    onChange({ brands: checked ? [...state.brands, brand] : state.brands.filter((b) => b !== brand) });
  };

  const toggleAudience = (val: string, checked: boolean) => {
    const current = specFilters["Тип пользователя"] ?? [];
    setSpec("Тип пользователя", checked ? [...current, val] : current.filter((v) => v !== val));
  };

  const activeCount =
    (state.inStock ? 1 : 0) +
    (state.onSale ? 1 : 0) +
    (state.yearFrom ? 1 : 0) +
    (state.yearTo ? 1 : 0) +
    (state.minPrice > 0 || state.maxPrice < 10000 ? 1 : 0) +
    state.brands.length +
    Object.values(specFilters).filter((v) => v.length > 0).length;

  const specSections: SpecFilterDef[] =
    (categorySlug ? CATEGORY_SPEC_SECTIONS[categorySlug] : undefined) ?? [];

  const renderSection = (def: SpecFilterDef, idx: number) => {
    switch (def.kind) {
      case "spec":
        return (
          <SpecSection
            key={`${def.specKey}-${idx}`}
            title={def.title}
            specKey={def.specKey}
            dbOptions={specs[def.specKey] ?? []}
            staticOptions={def.staticOptions}
            specFilters={specFilters}
            onSpecFilterChange={setSpec}
          />
        );
      case "bool":
        return (
          <FilterSection key={`${def.specKey}-${idx}`} title={def.title} activeCount={isBool(def.specKey) ? 1 : 0}>
            <FilterCheckbox
              id={`bool-${def.specKey}`}
              label={def.label}
              checked={isBool(def.specKey)}
              onChange={(c) => toggleBool(def.specKey, c)}
            />
          </FilterSection>
        );
      case "bool-group":
        return (
          <FilterSection
            key={`boolgroup-${idx}`}
            title={def.title}
            activeCount={def.items.filter((it) => isBool(it.specKey)).length}
          >
            {def.items.map((it) => (
              <FilterCheckbox
                key={it.specKey}
                id={`bool-${it.specKey}`}
                label={it.label}
                checked={isBool(it.specKey)}
                onChange={(c) => toggleBool(it.specKey, c)}
              />
            ))}
          </FilterSection>
        );
      case "audience":
        return (
          <FilterSection
            key={`audience-${idx}`}
            title="Тип пользователя"
            activeCount={(specFilters["Тип пользователя"] ?? []).length}
          >
            {(["Unisex", "Подростковый", "Детский"] as const).map((val) => (
              <FilterCheckbox
                key={val}
                id={`audience-${val}`}
                label={val}
                checked={(specFilters["Тип пользователя"] ?? []).includes(val)}
                onChange={(c) => toggleAudience(val, c)}
              />
            ))}
          </FilterSection>
        );
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sticky top-24 overflow-y-auto max-h-[calc(100vh-7rem)]">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-base font-bold text-white">
          Фильтры
          {activeCount > 0 && (
            <span className="ml-2 text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
              {activeCount}
            </span>
          )}
        </h2>
        <div className="flex items-center gap-2">
          {activeCount > 0 && (
            <Button variant="ghost" size="sm" onClick={onReset}
              className="text-white/40 hover:text-white text-xs h-auto py-1 px-2">
              Сбросить
            </Button>
          )}
          {isMobile && (
            <Button variant="ghost" size="icon" onClick={onMobileClose} className="h-7 w-7">
              <X className="h-4 w-4 text-white/60" />
            </Button>
          )}
        </div>
      </div>

      {/* ── Цена ── */}
      <FilterSection title="Цена (BYN)" defaultOpen activeCount={state.minPrice > 0 || state.maxPrice < 10000 ? 1 : 0}>
        <Slider
          max={10000} step={100}
          value={[state.minPrice, state.maxPrice]}
          onValueChange={([min, max]) => onChange({ minPrice: min, maxPrice: max })}
          className="mb-4"
        />
        <div className="flex items-center gap-2">
          <Input type="number" value={state.minPrice}
            onChange={(e) => onChange({ minPrice: Number(e.target.value) })}
            className="bg-white/5 border-white/10 text-white text-sm h-8" />
          <span className="text-white/30 text-sm shrink-0">—</span>
          <Input type="number" value={state.maxPrice}
            onChange={(e) => onChange({ maxPrice: Number(e.target.value) })}
            className="bg-white/5 border-white/10 text-white text-sm h-8" />
        </div>
      </FilterSection>

      {/* ── Наличие и скидки ── */}
      <FilterSection title="Наличие и скидки" defaultOpen activeCount={(state.inStock ? 1 : 0) + (state.onSale ? 1 : 0)}>
        <FilterCheckbox id="inStock" label="В наличии" checked={state.inStock} onChange={(c) => onChange({ inStock: c })} />
        <FilterCheckbox id="onSale" label="Товары со скидкой" checked={state.onSale} onChange={(c) => onChange({ onSale: c })} />
      </FilterSection>

      {/* ── Год ── */}
      <FilterSection title="Год выпуска" activeCount={state.yearFrom || state.yearTo ? 1 : 0}>
        <div className="flex items-center gap-2">
          <Input type="number" placeholder="С" value={state.yearFrom ?? ""}
            onChange={(e) => onChange({ yearFrom: e.target.value ? Number(e.target.value) : null })}
            className="bg-white/5 border-white/10 text-white text-sm h-8" />
          <span className="text-white/30 text-sm shrink-0">—</span>
          <Input type="number" placeholder="По" value={state.yearTo ?? ""}
            onChange={(e) => onChange({ yearTo: e.target.value ? Number(e.target.value) : null })}
            className="bg-white/5 border-white/10 text-white text-sm h-8" />
        </div>
      </FilterSection>

      {/* ── Производитель ── */}
      <FilterSection title="Производитель" activeCount={state.brands.length}>
        {visibleBrands.map((b) => (
          <FilterCheckbox key={b} id={`brand-${b}`} label={b}
            checked={state.brands.includes(b)} onChange={(c) => toggleBrand(b, c)} />
        ))}
        {BRANDS.length > 6 && (
          <button type="button" onClick={() => setShowAllBrands((s) => !s)}
            className="text-xs text-primary hover:text-primary/70 mt-1 transition-colors">
            {showAllBrands ? "Скрыть" : `Ещё ${BRANDS.length - 6}`}
          </button>
        )}
      </FilterSection>

      {/* ── Per-category spec sections ── */}
      {specSections.map((def, idx) => renderSection(def, idx))}
    </div>
  );
}
