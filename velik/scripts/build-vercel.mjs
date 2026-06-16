import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import { rm, writeFile } from "node:fs/promises";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const apiDir = path.resolve(projectDir, "api");

const banner = `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';
globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`;

async function build() {
  // Бандлим весь сервер в api/_server.mjs
  await esbuild({
    entryPoints: [path.resolve(projectDir, "server/_vercel-entry.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outfile: path.resolve(apiDir, "_server.mjs"),
    logLevel: "info",
    external: [
      "*.node",
      "mysql2",
      "pino",
      "pino-http",
      "pino-pretty",
      "bufferutil",
      "utf-8-validate",
    ],
    banner: { js: banner },
  });

  console.log("[vercel] Server bundled → api/_server.mjs");

  // Генерируем api/index.js (JS, не TS — Vercel не трогает его компилятором)
  await writeFile(
    path.resolve(apiDir, "index.js"),
    `import { app, applySchema } from "./_server.mjs";

const ready = applySchema().catch((err) => {
  console.error("[db] applySchema failed:", err);
});

export default async (req, res) => {
  await ready;
  app.handle(req, res, () => {
    res.statusCode = 404;
    res.end("Not found");
  });
};
`,
  );

  console.log("[vercel] api/index.js written");

  // Собираем фронтенд
  console.log("[vercel] Building frontend...");
  execSync("npm run build:frontend", {
    cwd: projectDir,
    env: { ...process.env, NODE_ENV: "production", BASE_PATH: "/" },
    stdio: "inherit",
  });

  console.log("[vercel] Done.");
}

build().catch((err) => {
  console.error(err);
  process.exit(1);
});
