import path from "path";
import { fileURLToPath } from "url";
import app from "./app";
import { logger } from "./lib/logger";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const rawPort = process.env["PORT"];

if (!rawPort) {
  throw new Error(
    "PORT environment variable is required but was not provided.",
  );
}

const port = Number(rawPort);

if (Number.isNaN(port) || port <= 0) {
  throw new Error(`Invalid PORT value: "${rawPort}"`);
}

const isDev = process.env.NODE_ENV !== "production";

if (isDev) {
  process.env.VITE_MIDDLEWARE_MODE = "1";
  const { createServer: createViteServer } = await import("vite");
  const vite = await createViteServer({
    configFile: path.resolve(__dirname, "../vite.config.ts"),
    server: { middlewareMode: true },
    appType: "spa",
  });
  app.use(vite.middlewares);
} else {
  const { default: express } = await import("express");
  const publicDir = path.resolve(__dirname, "public");
  app.use(express.static(publicDir));
  app.get("*", (_req, res) => {
    res.sendFile(path.join(publicDir, "index.html"));
  });
}

app.listen(port, (err) => {
  if (err) {
    logger.error({ err }, "Error listening on port");
    process.exit(1);
  }

  logger.info({ port }, "Server listening");
});
