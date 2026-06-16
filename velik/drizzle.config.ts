import { defineConfig } from "drizzle-kit";
import { readFileSync } from "fs";
import path from "path";

const { url } = JSON.parse(
  readFileSync(path.resolve(import.meta.dirname, "mysql.json"), "utf8")
) as { url: string };

export default defineConfig({
  schema: "./server/db/schema/index.ts",
  out: "./drizzle",
  dialect: "mysql",
  dbCredentials: { url },
});
