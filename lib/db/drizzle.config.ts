import { defineConfig } from "drizzle-kit";
import path from "path";

const mysqlUrl = process.env.MYSQL_URL;
if (!mysqlUrl) {
  throw new Error("MYSQL_URL must be set. Example: mysql://root@127.0.0.1:3306/velik");
}

export default defineConfig({
  schema: path.join(__dirname, "./src/schema/index.ts"),
  dialect: "mysql",
  dbCredentials: {
    url: mysqlUrl,
  },
});
