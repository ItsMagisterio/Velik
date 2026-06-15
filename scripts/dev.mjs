/**
 * Cross-platform dev launcher (Windows / macOS / Linux).
 * Usage: node scripts/dev.mjs
 *
 * Prerequisites:
 *   - MySQL or MariaDB running locally on port 3306
 *   - MYSQL_URL env var set (defaults to mysql://root@127.0.0.1:3306/velik)
 */

import { spawn } from "child_process";
import { createConnection } from "mysql2/promise";

const MYSQL_URL =
  process.env.MYSQL_URL ?? "mysql://root@127.0.0.1:3306/velik";
const API_PORT = process.env.PORT ?? "8080";
const WEB_PORT = "21174";
const IS_WIN = process.platform === "win32";

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

function sh(cmd, args, env = {}) {
  const proc = spawn(IS_WIN ? "cmd" : cmd, IS_WIN ? ["/c", cmd, ...args] : args, {
    stdio: "inherit",
    shell: IS_WIN,
    env: { ...process.env, ...env },
  });
  proc.on("error", (err) => {
    console.error(`[error] ${cmd}: ${err.message}`);
  });
  return proc;
}

function pnpm(...args) {
  return IS_WIN ? "pnpm.cmd" : "pnpm";
}

function spawnPnpm(args, env = {}) {
  const bin = IS_WIN ? "pnpm.cmd" : "pnpm";
  const proc = spawn(bin, args, {
    stdio: "inherit",
    env: { ...process.env, ...env },
    shell: IS_WIN,
  });
  proc.on("error", (err) => {
    console.error(`[error] pnpm ${args.join(" ")}: ${err.message}`);
  });
  return proc;
}

// ──────────────────────────────────────────────
// DB check
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

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

await ensureDatabase();

console.log("[dev] Starting API server and frontend...\n");

const api = spawnPnpm(
  ["--filter", "@workspace/api-server", "run", "dev"],
  { PORT: API_PORT, MYSQL_URL }
);

const web = spawnPnpm(
  ["--filter", "@workspace/velik", "run", "dev"],
  { PORT: WEB_PORT, BASE_PATH: "/" }
);

function killAll() {
  api.kill();
  web.kill();
  process.exit(0);
}

process.on("SIGINT", killAll);
process.on("SIGTERM", killAll);
