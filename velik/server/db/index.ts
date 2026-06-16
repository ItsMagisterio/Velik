import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import { existsSync, readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";
import * as schema from "./schema";

function getMysqlUrl(): string {
  if (process.env.MYSQL_URL) return process.env.MYSQL_URL;

  // Fallback: читаем mysql.json для локальной разработки
  try {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const candidates = [
      path.resolve(__dirname, "../mysql.json"),
      path.resolve(__dirname, "../../mysql.json"),
    ];
    for (const p of candidates) {
      if (existsSync(p)) {
        const { url } = JSON.parse(readFileSync(p, "utf8")) as { url: string };
        return url;
      }
    }
  } catch {
    // ignore
  }

  throw new Error(
    "Database URL not configured. Set the MYSQL_URL environment variable.",
  );
}

const mysqlUrl = getMysqlUrl();
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
