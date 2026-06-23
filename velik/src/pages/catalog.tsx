import { useState } from "react";
import { useListProducts, useListCategories } from "@/api";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { motion } from "framer-motion";
import { Search, SlidersHorizontal, X } from "lucide-react";
import { CategoryHeader } from "@/components/category-header";

export default function Catalog() {
  const searchParams = new URLSearchParams(window.location.search);
  const initialCategory = searchParams.get("category");
  const initialBrand = searchParams.get("brand") ?? "";

  const [search, setSearch] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(initialCategory ? parseInt(initialCategory) : null);
  const [brand, setBrand] = useState<string>(initialBrand);
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(10000);
  const [inStock, setInStock] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>("newest");
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  const { data: categories } = useListCategories();

  const { data: productData, isLoading } = useListProducts({
    ...(search ? { search } : {}),
    ...(categoryId != null ? { categoryId } : {}),
    ...(brand ? { brand } : {}),
    ...(minPrice > 0 ? { minPrice } : {}),
    ...(maxPrice < 10000 ? { maxPrice } : {}),
    ...(inStock ? { inStock } : {}),
    sortBy: sortBy as any,
  });

  const activeCategory = categories?.find((c) => c.id === categoryId) ?? null;

  const handlePriceFilter = (min: number, max: number) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  return (
    <div className="container mx-auto px-4 py-12">
      {/* Brand filter banner */}
      {brand && (
        <div className="mb-8 glass-card rounded-2xl p-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-xs text-white/50 uppercase tracking-widest mb-1">Фильтр по бренду</p>
            <h2 className="text-2xl font-bold text-white tracking-wide">{brand}</h2>
            {productData?.total !== undefined && (
              <p className="text-sm text-white/50 mt-1">{productData.total} товаров</p>
            )}
          </div>
          <button
            onClick={() => setBrand("")}
            className="flex items-center gap-1.5 px-4 py-2 rounded-lg border border-white/10 text-white/60 hover:text-white hover:border-white/30 transition-colors text-sm"
          >
            <X className="w-4 h-4" /> Сбросить
          </button>
        </div>
      )}

      {/* Generic header shown only when NO category and NO brand is selected */}
      {!activeCategory && !brand && (
        <div className="mb-12 text-center md:text-left">
          <h1 className="text-4xl md:text-5xl font-display font-bold text-white mb-4">Каталог</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">Найдите свой идеальный электротранспорт среди сотен премиальных моделей.</p>
        </div>
      )}

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Mobile Filters Toggle */}
        <div className="lg:hidden flex items-center justify-between mb-4">
          <Button variant="outline" onClick={() => setIsFiltersOpen(!isFiltersOpen)} className="glass text-white border-white/10">
            <SlidersHorizontal className="mr-2 h-4 w-4" />
            Фильтры
          </Button>
          <div className="text-sm text-muted-foreground">
            {productData?.total || 0} товаров
          </div>
        </div>

        {/* Sidebar Filters */}
        <motion.aside
          className={`lg:w-1/4 flex-shrink-0 ${isFiltersOpen ? "block" : "hidden lg:block"}`}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="glass-card rounded-2xl p-6 sticky top-24">
            <div className="flex items-center justify-between lg:hidden mb-6">
              <h2 className="text-lg font-bold text-white">Фильтры</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsFiltersOpen(false)}>
                <X className="h-5 w-5" />
              </Button>
            </div>

            {/* Categories */}
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Категории</h3>
              <div className="space-y-2">
                <Button
                  variant="ghost"
                  className={`w-full justify-start ${categoryId === null ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"}`}
                  onClick={() => setCategoryId(null)}
                >
                  Все категории
                </Button>
                {categories?.map((cat) => (
                  <Button
                    key={cat.id}
                    variant="ghost"
                    className={`w-full justify-start ${categoryId === cat.id ? "text-primary bg-primary/10" : "text-muted-foreground hover:text-white"}`}
                    onClick={() => setCategoryId(cat.id)}
                  >
                    {cat.name}
                  </Button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="mb-8">
              <h3 className="text-white font-medium mb-4">Цена (BYN)</h3>
              <Slider
                defaultValue={[0, 10000]}
                max={10000}
                step={100}
                value={[minPrice, maxPrice]}
                onValueChange={(val) => {
                  setMinPrice(val[0]);
                  setMaxPrice(val[1]);
                }}
                className="mb-6"
              />
              <div className="flex items-center gap-4">
                <Input
                  type="number"
                  value={minPrice}
                  onChange={(e) => setMinPrice(Number(e.target.value))}
                  className="bg-white/5 border-white/10 text-white"
                />
                <span className="text-muted-foreground">-</span>
                <Input
                  type="number"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="bg-white/5 border-white/10 text-white"
                />
              </div>
            </div>

            {/* In Stock Only */}
            <div className="mb-8 flex items-center space-x-2">
              <Checkbox
                id="in-stock"
                checked={inStock}
                onCheckedChange={(checked) => setInStock(checked === true)}
                className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
              />
              <label htmlFor="in-stock" className="text-sm font-medium text-white cursor-pointer">
                Только в наличии
              </label>
            </div>

            <Button
              className="w-full bg-white/10 text-white hover:bg-white/20 border-none"
              onClick={() => {
                setCategoryId(null);
                setMinPrice(0);
                setMaxPrice(10000);
                setInStock(false);
                setSearch("");
              }}
            >
              Сбросить фильтры
            </Button>
          </div>
        </motion.aside>

        {/* Main Content */}
        <div className="flex-1">
          {/* Category header — shown when a category is selected */}
          {activeCategory && (
            <CategoryHeader
              category={activeCategory}
              onCategoryChange={(id) => {
                setCategoryId(id);
                setMinPrice(0);
                setMaxPrice(10000);
                setSearch("");
              }}
              onPriceFilter={handlePriceFilter}
              onSearchFilter={setSearch}
              totalProducts={productData?.total}
            />
          )}

          {/* Top Bar */}
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

          {/* Product Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="glass-card rounded-2xl aspect-[3/4] animate-pulse" />
              ))}
            </div>
          ) : productData?.items.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <h3 className="text-2xl font-bold text-white mb-2">Ничего не найдено</h3>
              <p className="text-muted-foreground">Попробуйте изменить параметры фильтрации</p>
              <Button
                className="mt-6 bg-primary hover:bg-primary/90 text-white"
                onClick={() => {
                  setCategoryId(null);
                  setMinPrice(0);
                  setMaxPrice(10000);
                  setInStock(false);
                  setSearch("");
                }}
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
