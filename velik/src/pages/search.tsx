import { useState } from "react";
import { Search as SearchIcon, X } from "lucide-react";
import { useListProducts, useListCategories } from "@/api";
import { ProductCard } from "@/components/product-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Product } from "@/api";

const SORT_OPTIONS = [
  { value: "newest", label: "По новизне" },
  { value: "price_asc", label: "Цена: по возрастанию" },
  { value: "price_desc", label: "Цена: по убыванию" },
  { value: "rating", label: "По рейтингу" },
];

export default function SearchPage() {
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState<number | null>(null);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [inStock, setInStock] = useState(false);
  const [withDiscount, setWithDiscount] = useState(false);
  const [sortBy, setSortBy] = useState("newest");
  const [searched, setSearched] = useState(false);

  const [appliedParams, setAppliedParams] = useState<{
    query: string;
    categoryId: number | null;
    minPrice: string;
    maxPrice: string;
    inStock: boolean;
    withDiscount: boolean;
    sortBy: string;
  } | null>(null);

  const { data: categories } = useListCategories();

  const { data: productData, isLoading } = useListProducts(
    appliedParams
      ? {
          ...(appliedParams.query ? { search: appliedParams.query } : {}),
          ...(appliedParams.categoryId != null ? { categoryId: appliedParams.categoryId } : {}),
          ...(appliedParams.minPrice ? { minPrice: Number(appliedParams.minPrice) } : {}),
          ...(appliedParams.maxPrice ? { maxPrice: Number(appliedParams.maxPrice) } : {}),
          ...(appliedParams.inStock ? { inStock: true } : {}),
          sortBy: appliedParams.sortBy as "newest" | "price_asc" | "price_desc" | "rating",
          limit: 48,
        }
      : undefined
  );

  function handleSearch() {
    setAppliedParams({ query, categoryId, minPrice, maxPrice, inStock, withDiscount, sortBy });
    setSearched(true);
  }

  function handleClear() {
    setQuery("");
    setCategoryId(null);
    setMinPrice("");
    setMaxPrice("");
    setInStock(false);
    setWithDiscount(false);
    setSortBy("newest");
    setAppliedParams(null);
    setSearched(false);
  }

  const allItems: Product[] = productData?.items ?? [];
  const filteredItems = appliedParams?.withDiscount
    ? allItems.filter((p) => p.discountPercent != null && p.discountPercent > 0)
    : allItems;

  return (
    <div className="container mx-auto px-4 py-12">
      <div className="mx-auto max-w-5xl">

        {/* Header */}
        <div className="mb-10 flex items-center gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary/15 text-primary">
            <SearchIcon className="h-7 w-7" />
          </div>
          <div>
            <h1 className="text-4xl font-bold text-white md:text-5xl">Расширенный поиск</h1>
            <p className="mt-2 text-muted-foreground">Найдите именно то, что ищете</p>
          </div>
        </div>

        {/* Filter card */}
        <section className="glass-card mb-8 rounded-3xl p-6 md:p-8">
          {/* Category */}
          <div className="mb-6">
            <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
              Раздел
            </label>
            <Select
              value={categoryId != null ? String(categoryId) : "all"}
              onValueChange={(v) => setCategoryId(v === "all" ? null : Number(v))}
            >
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11">
                <SelectValue placeholder="Все разделы" />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                <SelectItem value="all">Все разделы</SelectItem>
                {categories?.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid gap-6 sm:grid-cols-3">
            {/* Keyword */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Ключевая фраза
              </label>
              <Input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSearch()}
                placeholder="Название товара..."
                className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl h-11"
              />
            </div>

            {/* Price range */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Цена (руб.)
              </label>
              <div className="flex items-center gap-2">
                <Input
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  placeholder="От"
                  type="number"
                  min={0}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl h-11"
                />
                <span className="text-muted-foreground">—</span>
                <Input
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  placeholder="До"
                  type="number"
                  min={0}
                  className="bg-white/5 border-white/10 text-white placeholder:text-muted-foreground rounded-xl h-11"
                />
              </div>
            </div>

            {/* Checkboxes */}
            <div>
              <label className="mb-2 block text-sm font-bold uppercase tracking-widest text-primary">
                Товары
              </label>
              <div className="space-y-3 mt-1">
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={inStock}
                    onCheckedChange={(v) => setInStock(!!v)}
                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm text-white/80">В наличии</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <Checkbox
                    checked={withDiscount}
                    onCheckedChange={(v) => setWithDiscount(!!v)}
                    className="border-white/20 data-[state=checked]:bg-primary data-[state=checked]:border-primary"
                  />
                  <span className="text-sm text-white/80">Со скидкой</span>
                </label>
              </div>
            </div>
          </div>

          {/* Sort + Buttons */}
          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="bg-white/5 border-white/10 text-white rounded-xl h-11 w-52">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-[#1a1a2e] border-white/10 text-white">
                {SORT_OPTIONS.map((o) => (
                  <SelectItem key={o.value} value={o.value}>{o.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              onClick={handleSearch}
              className="bg-primary hover:bg-primary/90 text-white font-bold uppercase tracking-wider px-8 h-11 rounded-xl"
            >
              <SearchIcon className="mr-2 h-4 w-4" />
              Подобрать
            </Button>

            <Button
              onClick={handleClear}
              variant="outline"
              className="border-white/10 text-white bg-white/5 hover:bg-white/10 font-bold uppercase tracking-wider px-8 h-11 rounded-xl"
            >
              <X className="mr-2 h-4 w-4" />
              Очистить
            </Button>
          </div>
        </section>

        {/* Results */}
        {searched && (
          <section>
            <div className="mb-5 flex items-center justify-between">
              <h2 className="text-lg font-bold text-white">
                {isLoading ? "Поиск..." : `Найдено: ${filteredItems.length} товаров`}
              </h2>
            </div>

            {isLoading ? (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => (
                  <div key={i} className="glass-card rounded-2xl h-72 animate-pulse" />
                ))}
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center">
                <SearchIcon className="mx-auto mb-4 h-12 w-12 text-muted-foreground/40" />
                <p className="text-muted-foreground">Ничего не найдено. Попробуйте изменить параметры поиска.</p>
              </div>
            ) : (
              <div className="grid gap-5 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                {filteredItems.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            )}
          </section>
        )}

        {/* Prompt before first search */}
        {!searched && (
          <div className="glass-card rounded-3xl p-12 text-center">
            <SearchIcon className="mx-auto mb-4 h-12 w-12 text-primary/40" />
            <p className="text-muted-foreground">Задайте параметры поиска и нажмите «Подобрать»</p>
          </div>
        )}

      </div>
    </div>
  );
}
