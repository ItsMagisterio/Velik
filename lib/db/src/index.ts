import { drizzle } from "drizzle-orm/mysql2";
import mysql from "mysql2/promise";
import * as schema from "./schema";

const mysqlUrl = process.env.MYSQL_URL;
if (!mysqlUrl) {
  throw new Error(
    "MYSQL_URL must be set. Example: mysql://root@127.0.0.1:3306/velik",
  );
}

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
