# Velik

Русскоязычная e-commerce платформа для продажи премиальных велосипедов и самокатов.

## Стек

- **Frontend**: React 19, Vite 7, Tailwind v4, TanStack Query
- **Backend**: Node 20, Express 5, Drizzle ORM
- **БД**: MariaDB (Nix), mysql2
- **Монорепо**: pnpm workspaces

## Структура

```
velik/
  scripts/        # build.mjs, apply-schema.mjs, seed.mjs
  server/         # Express API
  src/            # React фронтенд
  shared/         # Общие типы
  public/         # Статика
  mysql.json      # Конфиг БД (единственный источник)
scripts/
  start-with-db.sh   # Запуск MariaDB + миграции + seed + dev
  post-merge.sh
```

## Запуск (Replit)

Workflow **Velik** запускает `scripts/start-with-db.sh`, который:
1. Инициализирует и стартует MariaDB
2. Применяет схему (`velik/scripts/apply-schema.mjs`)
3. Создаёт admin-пользователя (`velik/scripts/seed.mjs`)
4. Запускает `pnpm --filter velik run dev`

## Запуск локально (Windows)

```bash
npm install -g pnpm
pnpm install
pnpm approve-builds
pnpm --filter velik run dev
```

> Локально нужен отдельно запущенный MySQL/MariaDB. Конфиг подключения — `velik/mysql.json`.

## User preferences

- DB config хранится в `velik/mysql.json`, не в переменных окружения.
- Seed создаёт только admin-пользователя (логин `admin`, пароль `adminadmin`). Товары и категории добавляются вручную через админку.
