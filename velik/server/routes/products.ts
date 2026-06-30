import { Router, type IRouter } from "express";
import { eq, and, gte, lte, desc, asc, like, count, sql, or } from "drizzle-orm";
import { db, productsTable, categoriesTable, reviewsTable } from "../db";
import {
  ListProductsQueryParams,
  ListProductsResponse,
  CreateProductBody,
  GetProductParams,
  GetProductResponse,
  UpdateProductParams,
  UpdateProductBody,
  UpdateProductResponse,
  DeleteProductParams,
  GetFeaturedProductsResponse,
  GetPopularProductsResponse,
  GetNewArrivalsResponse,
  GetRelatedProductsParams,
  GetRelatedProductsResponse,
  GetPopularBrandsResponse,
} from "../../shared";

const router: IRouter = Router();

function parseJson<T>(val: unknown, fallback: T): T {
  if (typeof val === "string") {
    try {
      return JSON.parse(val) as T;
    } catch {
      return fallback;
    }
  }
  return (val ?? fallback) as T;
}

function parseProductRow<T extends { images: unknown; specs: unknown }>(r: T) {
  return {
    ...r,
    images: parseJson<string[]>(r.images, []),
    specs: parseJson<Record<string, string> | null>(r.specs, null),
  };
}

router.get("/products/featured", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isFeatured, true))
    .orderBy(desc(productsTable.rating))
    .limit(8);
  const withCategory = rows.map((r) => ({ ...parseProductRow(r), categoryName: null }));
  res.json(GetFeaturedProductsResponse.parse(withCategory));
});

router.get("/products/popular", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .orderBy(desc(productsTable.reviewCount), desc(productsTable.rating))
    .limit(8);
  const withCategory = rows.map((r) => ({ ...parseProductRow(r), categoryName: null }));
  res.json(GetPopularProductsResponse.parse(withCategory));
});

router.get("/products/new-arrivals", async (_req, res): Promise<void> => {
  const rows = await db
    .select()
    .from(productsTable)
    .where(eq(productsTable.isNew, true))
    .orderBy(desc(productsTable.createdAt))
    .limit(8);
  const withCategory = rows.map((r) => ({ ...parseProductRow(r), categoryName: null }));
  res.json(GetNewArrivalsResponse.parse(withCategory));
});

router.get("/products/filter-options", async (_req, res): Promise<void> => {
  const brandsResult = await db
    .selectDistinct({ brand: productsTable.brand })
    .from(productsTable)
    .orderBy(asc(productsTable.brand));

  const specKeys = [
    "Класс велосипеда",
    "Тип пользователя",
    "Вилка (тип)",
    "Материал рамы",
    "Тип рамы",
    "Размер рамы",
    "Рост велосипедиста",
    "Тип трансмиссии",
    "Количество скоростей",
    "Кассета или трещотка",
    "Тип манеток",
    "Диаметр колес",
    "Передний тормоз",
    "Задний тормоз",
    "Материал педалей",
    "В комплекте",
  ];

  const specsResult: Record<string, string[]> = {};
  for (const key of specKeys) {
    const [rows] = await db.execute(
      sql`SELECT DISTINCT JSON_UNQUOTE(JSON_EXTRACT(specs, CONCAT('$."', ${key}, '"'))) AS value
          FROM products
          WHERE JSON_EXTRACT(specs, CONCAT('$."', ${key}, '"')) IS NOT NULL
            AND JSON_UNQUOTE(JSON_EXTRACT(specs, CONCAT('$."', ${key}, '"'))) != 'null'
          ORDER BY value`,
    );
    specsResult[key] = (rows as Array<{ value: string }>)
      .map((r) => r.value)
      .filter(Boolean);
  }

  res.json({
    brands: brandsResult.map((r) => r.brand).filter(Boolean),
    specs: specsResult,
  });
});

router.get("/products", async (req, res): Promise<void> => {
  const qp = ListProductsQueryParams.safeParse(req.query);
  if (!qp.success) {
    res.status(400).json({ error: qp.error.message });
    return;
  }

  const { categoryId, search, minPrice, maxPrice, brand, inStock, sortBy, page = 1, limit = 12, onSale, yearFrom, yearTo, specFilters } = qp.data;

  const conditions = [];
  if (categoryId) conditions.push(eq(productsTable.categoryId, categoryId));
  if (search) conditions.push(like(productsTable.name, `%${search}%`));
  if (minPrice != null) conditions.push(gte(productsTable.price, minPrice));
  if (maxPrice != null) conditions.push(lte(productsTable.price, maxPrice));

  // Brand: supports pipe-delimited multi-brand OR matching (e.g. "Trek|Giant")
  if (brand) {
    const parts = brand.split("|").map((b) => b.trim()).filter(Boolean);
    if (parts.length === 1) {
      conditions.push(like(productsTable.brand, `%${parts[0]}%`));
    } else {
      conditions.push(or(...parts.map((b) => like(productsTable.brand, `%${b}%`)))!);
    }
  }

  if (inStock != null) conditions.push(eq(productsTable.inStock, inStock));
  if (onSale) conditions.push(sql`${productsTable.discountPercent} IS NOT NULL AND ${productsTable.discountPercent} > 0`);
  if (yearFrom) conditions.push(sql`YEAR(${productsTable.createdAt}) >= ${yearFrom}`);
  if (yearTo) conditions.push(sql`YEAR(${productsTable.createdAt}) <= ${yearTo}`);

  // Spec filters: JSON-encoded Record<specKey, string[]>
  if (specFilters) {
    try {
      const parsed = JSON.parse(specFilters) as Record<string, string[]>;
      for (const [key, values] of Object.entries(parsed)) {
        if (!Array.isArray(values) || values.length === 0) continue;
        const orClauses = values.map(
          (v) =>
            sql`JSON_UNQUOTE(JSON_EXTRACT(${productsTable.specs}, CONCAT('$."', ${key}, '"'))) = ${v}`,
        );
        conditions.push(orClauses.length === 1 ? orClauses[0] : or(...orClauses)!);
      }
    } catch {
      // Invalid JSON — ignore
    }
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  let orderByClause;
  switch (sortBy) {
    case "price_asc":
      orderByClause = asc(productsTable.price);
      break;
    case "price_desc":
      orderByClause = desc(productsTable.price);
      break;
    case "rating":
      orderByClause = desc(productsTable.rating);
      break;
    case "newest":
      orderByClause = desc(productsTable.createdAt);
      break;
    default:
      orderByClause = desc(productsTable.id);
  }

  const offset = (Number(page) - 1) * Number(limit);

  const [rows, totalCount] = await Promise.all([
    db.select().from(productsTable).where(whereClause).orderBy(orderByClause).limit(Number(limit)).offset(offset),
    db.select({ count: count() }).from(productsTable).where(whereClause),
  ]);

  const withCategory = rows.map((r) => ({ ...parseProductRow(r), categoryName: null }));

  res.json(
    ListProductsResponse.parse({
      items: withCategory,
      total: totalCount[0]?.count ?? 0,
      page: Number(page),
      limit: Number(limit),
    }),
  );
});

router.post("/products", async (req, res): Promise<void> => {
  const parsed = CreateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  const result = await db.insert(productsTable).values(parsed.data);
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, insertedId));
  res.status(201).json({ ...parseProductRow(row), categoryName: null });
});

router.get("/products/:id", async (req, res): Promise<void> => {
  const params = GetProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }

  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }

  const related = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.categoryId, row.categoryId), sql`${productsTable.id} != ${row.id}`))
    .limit(4);

  res.json(
    GetProductResponse.parse({
      ...parseProductRow(row),
      categoryName: null,
      relatedProducts: related.map((r) => ({ ...parseProductRow(r), categoryName: null })),
    }),
  );
});

router.patch("/products/:id", async (req, res): Promise<void> => {
  const params = UpdateProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const parsed = UpdateProductBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(productsTable).set(parsed.data).where(eq(productsTable.id, params.data.id));
  const [row] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!row) {
    res.status(404).json({ error: "Product not found" });
    return;
  }
  res.json(UpdateProductResponse.parse({ ...parseProductRow(row), categoryName: null }));
});

router.delete("/products/:id", async (req, res): Promise<void> => {
  const params = DeleteProductParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  await db.delete(productsTable).where(eq(productsTable.id, params.data.id));
  res.sendStatus(204);
});

router.get("/products/:id/related", async (req, res): Promise<void> => {
  const params = GetRelatedProductsParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const [product] = await db.select().from(productsTable).where(eq(productsTable.id, params.data.id));
  if (!product) {
    res.json(GetRelatedProductsResponse.parse([]));
    return;
  }
  const rows = await db
    .select()
    .from(productsTable)
    .where(and(eq(productsTable.categoryId, product.categoryId), sql`${productsTable.id} != ${product.id}`))
    .limit(6);
  res.json(GetRelatedProductsResponse.parse(rows.map((r) => ({ ...parseProductRow(r), categoryName: null }))));
});

router.get("/stats/brands", async (_req, res): Promise<void> => {
  const rows = await db
    .select({ brand: productsTable.brand, productCount: count() })
    .from(productsTable)
    .groupBy(productsTable.brand)
    .orderBy(desc(count()))
    .limit(10);
  res.json(GetPopularBrandsResponse.parse(rows.map((r) => ({ ...r, logoUrl: null }))));
});

export default router;
