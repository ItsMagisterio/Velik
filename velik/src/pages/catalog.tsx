import { useMemo, useState } from "react";
import { useListProducts, useListCategories, useFilterOptions } from "@/api";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { motion, AnimatePresence } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryHeader } from "@/components/category-header";
import {
  CatalogFilters,
  INITIAL_FILTER_STATE,
  type CatalogFilterState,
} from "@/components/catalog-filters";
import { useLocation } from "wouter";

// ─── Category picker ──────────────────────────────────────────────────────────

const CATEGORY_EMOJI: Record<string, string> = {
  velosipedy:        "🚲",
  elektrosamokaty:   "⚡",
  elektravelasipedy: "🔋",
  samokaty:          "🛴",
  aksessuary:        "🧢",
  zapchasti:         "🔧",
  servis:            "🛠️",
};

function CategoryPicker({
  categories,
  onSelect,
}: {
  categories: Array<{ id: number; name: string; slug: string; description?: string | null; imageUrl?: string | null; productCount?: number }>;
  onSelect: (id: number, slug: string) => void;
}) {
  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mb-10 text-center md:text-left">
        <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-3">
          Каталог
        </h1>
        <p className="text-muted-foreground text-lg max-w-xl">
          Выберите раздел, чтобы перейти к товарам
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {categories.map((cat, i) => (
          <motion.button
            key={cat.id}
            onClick={() => onSelect(cat.id, cat.slug)}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: i * 0.05 }}
            className="group glass-card rounded-2xl overflow-hidden text-left hover:ring-1 hover:ring-primary/50 transition-all duration-200 hover:shadow-[0_0_24px_rgba(100,60,255,0.18)]"
          >
            {cat.imageUrl ? (
              <div className="relative h-44 overflow-hidden">
                <img
                  src={cat.imageUrl}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/75 via-black/20 to-transparent" />
                <div className="absolute bottom-0 left-0 right-0 px-4 py-3 flex items-end justify-between">
                  <h2 className="text-lg font-bold text-white leading-tight text-center w-full">
                    {cat.name}
                  </h2>
                  {cat.productCount != null && (
                    <span className="text-xs text-white/60 shrink-0 absolute right-4 bottom-3.5">
                      {cat.productCount} товаров
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="h-44 flex flex-col items-center justify-end pb-4 px-4 relative bg-white/5">
                <span className="text-5xl select-none absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-[60%] opacity-30">
                  {CATEGORY_EMOJI[cat.slug] ?? "📦"}
                </span>
                <div className="relative w-full flex items-end justify-between">
                  <h2 className="text-base font-bold text-white leading-tight text-center w-full">
                    {cat.name}
                  </h2>
                  {cat.productCount != null && (
                    <span className="text-xs text-white/50 shrink-0 absolute right-0">
                      {cat.productCount}
                    </span>
                  )}
                </div>
              </div>
            )}
          </motion.button>
        ))}
      </div>
    </div>
  );
}

// ─── Main catalog page ────────────────────────────────────────────────────────

export default function Catalog() {
  const [, navigate] = useLocation();
  const searchParams = new URLSearchParams(window.location.search);
  const initialSlug     = searchParams.get("slug")     ?? null;
  const initialCatId    = searchParams.get("category") ?? null;
  const initialBrand    = searchParams.get("brand")    ?? null;

  const [search, setSearch]       = useState("");
  const [sortBy, setSortBy]       = useState<string>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  // We store category by ID; slug is resolved after categories load
  const [categoryId, setCategoryId] = useState<number | null>(
    initialCatId ? parseInt(initialCatId) : null,
  );
  // Slug used to look up category when only slug is provided
  const [pendingSlug, setPendingSlug] = useState<string | null>(
    !initialCatId && initialSlug ? initialSlug : null,
  );

  const [filters, setFilters] = useState<CatalogFilterState>({
    ...INITIAL_FILTER_STATE,
    brands: initialBrand ? [initialBrand] : [],
  });

  const { data: categories } = useListCategories();
  const { data: filterOptions } = useFilterOptions();

  // Resolve slug → id once categories load
  const activeCategory = useMemo(() => {
    if (!categories) return null;
    if (categoryId != null) return categories.find((c) => c.id === categoryId) ?? null;
    if (pendingSlug)        return categories.find((c) => c.slug === pendingSlug) ?? null;
    return null;
  }, [categories, categoryId, pendingSlug]);

  // Sync resolved category to state (once)
  useMemo(() => {
    if (activeCategory && pendingSlug && categoryId == null) {
      setCategoryId(activeCategory.id);
      setPendingSlug(null);
    }
  }, [activeCategory, pendingSlug, categoryId]);

  const specFiltersParam = useMemo(() => {
    const active: Record<string, string[]> = {};
    for (const [key, vals] of Object.entries(filters.specFilters)) {
      if (vals.length > 0) active[key] = vals;
    }
    return Object.keys(active).length > 0 ? JSON.stringify(active) : undefined;
  }, [filters.specFilters]);

  const brandParam = filters.brands.length > 0 ? filters.brands.join("|") : undefined;

  const effectiveCategoryId = activeCategory?.id ?? null;

  const { data: productData, isLoading } = useListProducts({
    ...(search ? { search } : {}),
    ...(effectiveCategoryId != null ? { categoryId: effectiveCategoryId } : {}),
    ...(brandParam ? { brand: brandParam } : {}),
    ...(filters.minPrice > 0 ? { minPrice: filters.minPrice } : {}),
    ...(filters.maxPrice < 10000 ? { maxPrice: filters.maxPrice } : {}),
    ...(filters.inStock ? { inStock: true } : {}),
    ...(filters.onSale ? { onSale: true } : {}),
    ...(filters.yearFrom ? { yearFrom: filters.yearFrom } : {}),
    ...(filters.yearTo ? { yearTo: filters.yearTo } : {}),
    ...(specFiltersParam ? { specFilters: specFiltersParam } : {}),
    sortBy: sortBy as any,
  });

  const handleReset = () => {
    setFilters(INITIAL_FILTER_STATE);
    setSearch("");
  };

  const patchFilters = (patch: Partial<CatalogFilterState>) => {
    setFilters((prev) => ({ ...prev, ...patch }));
  };

  const selectCategory = (id: number, slug: string) => {
    setCategoryId(id);
    setPendingSlug(null);
    setFilters(INITIAL_FILTER_STATE);
    setSearch("");
    navigate(`/catalog?slug=${slug}`, { replace: true });
  };

  const clearCategory = () => {
    setCategoryId(null);
    setPendingSlug(null);
    setFilters(INITIAL_FILTER_STATE);
    setSearch("");
    navigate("/catalog", { replace: true });
  };

  // ── No category, no brand → show picker ──────────────────────────────────
  const showPicker = !activeCategory && filters.brands.length === 0 && !pendingSlug;

  if (showPicker) {
    return (
      <CategoryPicker
        categories={categories ?? []}
        onSelect={selectCategory}
      />
    );
  }

  // ── Category / brand view ─────────────────────────────────────────────────
  return (
    <div className="container mx-auto px-4 py-12">
      {/* Brand banner (when filtering by brand without category) */}
      {filters.brands.length === 1 && !activeCategory && (
        <div className="mb-8 glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">
              Фильтр по бренду
            </p>
            <h2 className="text-2xl font-bold text-white tracking-wide">
              {filters.brands[0]}
            </h2>
            {productData?.total !== undefined && (
              <p className="text-sm text-white/50 mt-1">
                {productData.total} товаров
              </p>
            )}
          </div>
          <button
            onClick={() => { patchFilters({ brands: [] }); clearCategory(); }}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
          >
            <X className="w-4 h-4" /> Сбросить
          </button>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile filters toggle */}
        <div className="lg:hidden flex items-center justify-between mb-2">
          <Button
            variant="outline"
            onClick={() => setIsFiltersOpen(!isFiltersOpen)}
            className="glass text-white border-white/10"
          >
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
          <div className="text-sm text-muted-foreground">
            {productData?.total || 0} товаров
          </div>
        </div>

        {/* Sidebar */}
        <AnimatePresence>
          {(isFiltersOpen || true) && (
            <motion.aside
              className={`lg:w-72 xl:w-80 flex-shrink-0 ${isFiltersOpen ? "block" : "hidden lg:block"}`}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
            >
              <CatalogFilters
                state={filters}
                onChange={patchFilters}
                onReset={handleReset}
                filterOptions={filterOptions}
                categorySlug={activeCategory?.slug}
                isMobile={isFiltersOpen}
                onMobileClose={() => setIsFiltersOpen(false)}
              />
            </motion.aside>
          )}
        </AnimatePresence>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {/* Category header with breadcrumb, price presets, subcategory chips */}
          {activeCategory && (
            <CategoryHeader
              category={activeCategory}
              onCategoryChange={(id) => {
                if (id === null) clearCategory();
                else {
                  const cat = categories?.find((c) => c.id === id);
                  if (cat) selectCategory(cat.id, cat.slug);
                }
              }}
              onPriceFilter={(min, max) => patchFilters({ minPrice: min, maxPrice: max })}
              onSearchFilter={setSearch}
              totalProducts={productData?.total}
            />
          )}

          {/* Top bar */}
          <div className="glass rounded-xl p-4 mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center z-10 relative">
            <div className="relative w-full sm:w-1/2">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Поиск по названию..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-9 bg-white/5 border-white/10 text-white focus-visible:ring-primary w-full"
              />
            </div>
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <span className="text-sm text-muted-foreground whitespace-nowrap hidden sm:block">
                {productData?.total || 0} товаров
              </span>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-full sm:w-[200px] bg-white/5 border-white/10 text-white">
                  <SelectValue placeholder="Сортировка" />
                </SelectTrigger>
                <SelectContent className="bg-card border-white/10 text-white">
                  <SelectItem value="newest">Сначала новые</SelectItem>
                  <SelectItem value="price_asc">Сначала дешевые</SelectItem>
                  <SelectItem value="price_desc">Сначала дорогие</SelectItem>
                  <SelectItem value="rating">По рейтингу</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Product grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : productData?.items.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">
                Попробуйте изменить параметры фильтрации
              </p>
              <Button
                className="mt-6 bg-primary hover:bg-primary/90 text-white"
                onClick={handleReset}
              >
                Сбросить фильтры
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {productData?.items.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
