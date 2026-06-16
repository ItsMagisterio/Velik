import { Router, type IRouter } from "express";
import { eq } from "drizzle-orm";
import crypto from "crypto";
import { db, usersTable, productsTable, wishlistTable } from "../db";
import {
  RegisterBody,
  LoginBody,
  LoginResponse,
  GetMeResponse,
  UpdateMeBody,
  UpdateMeResponse,
  GetWishlistResponse,
  AddToWishlistParams,
  RemoveFromWishlistParams,
} from "../../shared";

const router: IRouter = Router();

function hashPassword(password: string): string {
  return crypto.createHash("sha256").update(password + "velik_salt_2024").digest("hex");
}

function makeToken(userId: number): string {
  return Buffer.from(`${userId}:${Date.now()}:velik_secret`).toString("base64");
}

function parseToken(token: string): number | null {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf8");
    const parts = decoded.split(":");
    return parseInt(parts[0], 10);
  } catch {
    return null;
  }
}

async function getUserFromRequest(req: any) {
  const auth = req.headers["authorization"];
  if (!auth?.startsWith("Bearer ")) return null;
  const token = auth.slice(7);
  const userId = parseToken(token);
  if (!userId) return null;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, userId));
  return user ?? null;
}

router.post("/auth/register", async (req, res): Promise<void> => {
  const parsed = RegisterBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [existing] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email));
  if (existing) {
    res.status(400).json({ error: "Email already registered" });
    return;
  }

  const result = await db.insert(usersTable).values({
    email: parsed.data.email,
    passwordHash: hashPassword(parsed.data.password),
    name: parsed.data.name,
    phone: parsed.data.phone ?? null,
    role: "user",
  });
  const insertedId = (result as any).insertId ?? (result as any)[0]?.insertId;
  const [user] = await db.select().from(usersTable).where(eq(usersTable.id, insertedId));

  const token = makeToken(user.id);
  res.status(201).json(
    LoginResponse.parse({
      user: { ...user, createdAt: user.createdAt.toISOString() },
      token,
    }),
  );
});

router.post("/auth/login", async (req, res): Promise<void> => {
  const parsed = LoginBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const [user] = await db.select().from(usersTable).where(eq(usersTable.email, parsed.data.email));
  if (!user || user.passwordHash !== hashPassword(parsed.data.password)) {
    res.status(401).json({ error: "Invalid credentials" });
    return;
  }

  const token = makeToken(user.id);
  res.json(
    LoginResponse.parse({
      user: { ...user, createdAt: user.createdAt.toISOString() },
      token,
    }),
  );
});

router.post("/auth/logout", async (_req, res): Promise<void> => {
  res.sendStatus(204);
});

router.get("/auth/me", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  res.json(GetMeResponse.parse({ ...user, createdAt: user.createdAt.toISOString() }));
});

router.patch("/auth/me", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  const parsed = UpdateMeBody.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }
  await db.update(usersTable).set(parsed.data).where(eq(usersTable.id, user.id));
  const [updated] = await db.select().from(usersTable).where(eq(usersTable.id, user.id));
  res.json(UpdateMeResponse.parse({ ...updated, createdAt: updated.createdAt.toISOString() }));
});

router.get("/wishlist", async (req, res): Promise<void> => {
  const user = await getUserFromRequest(req);
  if (!user) {
    res.json(GetWishlistResponse.parse([]));
    return;
  }
  const items = await db.select().from(wishlistTable).where(eq(wishlistTable.userId, user.id));
  const products = await Promise.all(
    items.map(async (w) => {
      const [p] = await db.select().from(productsTable).where(eq(productsTable.id, w.productId));
      return p ? { ...p, categoryName: null } : null;
    }),
  );
  res.json(GetWishlistResponse.parse(products.filter(Boolean)));
});

router.post("/wishlist/:productId", async (req, res): Promise<void> => {
  const params = AddToWishlistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db.insert(wishlistTable).values({ userId: user.id, productId: params.data.productId });
  res.sendStatus(204);
});

router.delete("/wishlist/:productId", async (req, res): Promise<void> => {
  const params = RemoveFromWishlistParams.safeParse(req.params);
  if (!params.success) {
    res.status(400).json({ error: params.error.message });
    return;
  }
  const user = await getUserFromRequest(req);
  if (!user) {
    res.status(401).json({ error: "Not authenticated" });
    return;
  }
  await db.delete(wishlistTable).where(eq(wishlistTable.userId, user.id));
  res.sendStatus(204);
});

export default router;
