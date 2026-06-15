/**
 * Cross-platform dev launcher (Windows / macOS / Linux).
 * Usage: node scripts/dev.mjs
 *
 * Runs Node.js tools directly — no `pnpm run` involved, so pnpm version
 * differences (v10 vs v11 pre-flight checks) don't affect startup.
 *
 * Prerequisites:
 *   - MySQL or MariaDB running locally on port 3306
 *   - MYSQL_URL env var set (defaults to mysql://root@127.0.0.1:3306/velik)
 */

import { spawn } from "child_process";
import { createConnection } from "mysql2/promise";
import { readFile } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const IS_WIN = process.platform === "win32";

const MYSQL_URL = process.env.MYSQL_URL ?? "mysql://root@127.0.0.1:3306/velik";
const API_PORT = process.env.PORT ?? "8080";
const WEB_PORT = "21174";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

/** Resolve a .bin executable inside a package directory (cross-platform). */
function bin(pkgDir, name) {
  return IS_WIN
      ? path.join(pkgDir, "node_modules", ".bin", name + ".cmd")
      : path.join(pkgDir, "node_modules", ".bin", name);
}

function run(cmd, args, { cwd = ROOT, env = {} } = {}) {
  // На Windows для запуска командных файлов (.cmd) обязателен shell: true
  const useShell = IS_WIN && cmd.endsWith(".cmd");

  const proc = spawn(cmd, args, {
    stdio: "inherit",
    cwd,
    env: { ...process.env, ...env },
    shell: useShell,
  });
  proc.on("error", (err) => {
    console.error(`[error] ${path.basename(cmd)}: ${err.message}`);
  });
  return proc;
}

function runNode(args, opts = {}) {
  return run(process.execPath, args, opts);
}

/** Run a command and wait for it to exit cleanly. */
function runSync(cmd, args, opts = {}) {
  return new Promise((resolve, reject) => {
    const proc = run(cmd, args, opts);
    proc.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`${path.basename(cmd)} exited with code ${code}`));
    });
  });
}

// ──────────────────────────────────────────────
// DB: create database + push schema
// ──────────────────────────────────────────────

async function ensureDatabase() {
  const url = new URL(MYSQL_URL);
  const dbName = url.pathname.replace("/", "");
  let conn;
  try {
    conn = await createConnection({
      host: url.hostname,
      port: Number(url.port) || 3306,
      user: url.username || "root",
      password: url.password || undefined,
    });
  } catch (err) {
    console.error(`
╔══════════════════════════════════════════════════════════╗
║  Cannot connect to MySQL/MariaDB on ${url.hostname}:${url.port || 3306}       ║
║                                                          ║
║  Make sure MySQL or MariaDB is installed and running.    ║
║  See SETUP.md for installation instructions.             ║
╚══════════════════════════════════════════════════════════╝
`);
    console.error("Error:", err.message);
    process.exit(1);
  }
  await conn.execute(
      `CREATE DATABASE IF NOT EXISTS \`${dbName}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`
  );
  console.log(`[db] Database '${dbName}' ready.`);
  await conn.end();
}

async function pushSchema() {
  const url = new URL(MYSQL_URL);
  const dbName = url.pathname.replace("/", "");
  const sqlPath = path.join(ROOT, "scripts", "schema.sql");
  const sql = await readFile(sqlPath, "utf8");

  const conn = await createConnection({
    host: url.hostname,
    port: Number(url.port) || 3306,
    user: url.username || "root",
    password: url.password || undefined,
    database: dbName,
    multipleStatements: true,
  });

  // Strip CREATE DATABASE and USE statements — already handled above
  const filteredSql = sql
      .split(/;\s*\n/)
      .filter((s) => !/^\s*(CREATE DATABASE|USE\s)/i.test(s.trim()))
      .join(";\n")
      .trim();

  console.log("[db] Applying schema...");
  try {
    await conn.query(filteredSql);
    console.log("[db] Schema ready.");
  } catch (err) {
    console.error("[db] Schema error:", err.message);
    process.exit(1);
  } finally {
    await conn.end();
  }
}

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

await ensureDatabase();
await pushSchema();

const apiDir = path.join(ROOT, "artifacts", "api-server");
const velikDir = path.join(ROOT, "artifacts", "velik");

// Build API server once (esbuild step) before starting
console.log("[api] Building...");
try {
  await runSync(process.execPath, [path.join(apiDir, "build.mjs")], {
    cwd: apiDir,
    env: { NODE_ENV: "development" },
  });
} catch (err) {
  console.error("[api] Build failed:", err.message);
  process.exit(1);
}

console.log("[dev] Starting API server and frontend...\n");

// Start API server directly (no pnpm)
const api = runNode(
    ["--enable-source-maps", path.join(apiDir, "dist", "index.mjs")],
    {
      cwd: apiDir,
      env: { PORT: API_PORT, MYSQL_URL, NODE_ENV: "development" },
    }
);

// Start Vite dev server directly from velik's own .bin (no pnpm)
const viteBin = bin(velikDir, "vite");
const web = run(
    viteBin,
    ["--config", path.join(velikDir, "vite.config.ts"), "--host", "0.0.0.0"],
    {
      cwd: velikDir,
      env: { PORT: WEB_PORT, BASE_PATH: "/" },
    }
);

function killAll() {
  api.kill();
  web.kill();
  process.exit(0);
}

process.on("SIGINT", killAll);
process.on("SIGTERM", killAll);
