import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import * as schema from "./schema";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const { url: mysqlUrl } = JSON.parse(
  readFileSync(path.resolve(__dirname, "../mysql.json"), "utf8")
) as { url: string };
const parsed = new URL(mysqlUrl);
const JSON_COLUMNS = new Set(["images", "specs"]);

export const pool = mysql.createPool({
  host: parsed.hostname,
  port: parseInt(parsed.port || "3306", 10),
  user: parsed.username || "root",
  password: parsed.password || undefined,
  database: parsed.pathname.slice(1),
  typeCast(field, next) {
    if (JSON_COLUMNS.has(field.name)) {
      const val = field.string();
      if (val === null || val === undefined) return null;
      try {
        return JSON.parse(val);
      } catch {
        return val;
      }
    }
    return next();
  },
});

export const db = drizzle(pool, { schema, mode: "default" });

export * from "./schema";
