import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { build as esbuild } from "esbuild";
import esbuildPluginPino from "esbuild-plugin-pino";
import { rm } from "node:fs/promises";
import { execSync } from "node:child_process";

globalThis.require = createRequire(import.meta.url);

const projectDir = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const distDir = path.resolve(projectDir, "dist");
const isProd = process.env.NODE_ENV === "production";

async function buildAll() {
  await rm(distDir, { recursive: true, force: true });

  await esbuild({
    entryPoints: [path.resolve(projectDir, "server/index.ts")],
    platform: "node",
    bundle: true,
    format: "esm",
    outdir: distDir,
    outExtension: { ".js": ".mjs" },
    logLevel: "info",
    external: [
      "*.node",
      "vite",
      "sharp",
      "better-sqlite3",
      "sqlite3",
      "canvas",
      "bcrypt",
      "argon2",
      "fsevents",
      "re2",
      "farmhash",
      "bufferutil",
      "utf-8-validate",
      "lightningcss",
      "pg-native",
      "mysql2",
      "pino-pretty",
    ],
    sourcemap: "linked",
    plugins: [esbuildPluginPino({ transports: ["pino-pretty"] })],
    banner: {
      js: `import { createRequire as __bannerCrReq } from 'node:module';
import __bannerPath from 'node:path';
import __bannerUrl from 'node:url';

globalThis.require = __bannerCrReq(import.meta.url);
globalThis.__filename = __bannerUrl.fileURLToPath(import.meta.url);
globalThis.__dirname = __bannerPath.dirname(globalThis.__filename);
`,
    },
  });

  if (isProd) {
    console.log("[frontend] Building Vite frontend...");
    execSync("pnpm run build:frontend", {
      cwd: projectDir,
      env: { ...process.env, PORT: "5000", BASE_PATH: "/", NODE_ENV: "production" },
      stdio: "inherit",
    });
    console.log("[frontend] Frontend built to dist/public.");
  }
}

buildAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
