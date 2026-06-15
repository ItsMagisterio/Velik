# Velik — локальный запуск (Windows / macOS / Linux)

## Что нужно установить

| Инструмент | Версия | Ссылка |
|---|---|---|
| Node.js | 20+ | https://nodejs.org |
| pnpm | 10+ | https://pnpm.io/installation |
| MySQL или MariaDB | 10.6+ / 8.0+ | см. ниже |

---

## 1. Установка MySQL/MariaDB

### Windows

**Вариант A — MySQL:**
1. Скачай установщик: https://dev.mysql.com/downloads/installer/
2. Выбери «MySQL Server» и установи
3. Во время установки запомни пароль root (или оставь пустым)
4. MySQL запустится автоматически как служба Windows

**Вариант B — MariaDB:**
1. Скачай: https://mariadb.org/download/
2. Установи, следуя мастеру
3. MariaDB запустится как служба Windows

### macOS

**Через Homebrew (рекомендуется):**
```bash
brew install mysql
brew services start mysql
```

Или MariaDB:
```bash
brew install mariadb
brew services start mariadb
```

**Через официальный установщик:**
- MySQL: https://dev.mysql.com/downloads/mysql/
- После установки запусти MySQL из «Системные настройки»

### Linux (Ubuntu/Debian)
```bash
sudo apt install mariadb-server
sudo systemctl start mariadb
```

---

## 2. Клонирование и установка зависимостей

```bash
git clone <url-репозитория>
cd velik
pnpm install
```

---

## 3. Настройка переменных окружения

Создай файл `.env.local` в корне проекта (или задай переменные вручную):

```
MYSQL_URL=mysql://root@127.0.0.1:3306/velik
```

Если у root есть пароль:
```
MYSQL_URL=mysql://root:твой_пароль@127.0.0.1:3306/velik
```

**Windows (PowerShell):**
```powershell
$env:MYSQL_URL = "mysql://root@127.0.0.1:3306/velik"
```

**macOS / Linux:**
```bash
export MYSQL_URL="mysql://root@127.0.0.1:3306/velik"
```

---

## 4. Запуск

```bash
pnpm dev
```

Скрипт автоматически:
- Проверит подключение к MySQL
- Создаст базу данных `velik` если её нет
- Запустит API-сервер на `http://localhost:8080`
- Запустит фронтенд на `http://localhost:21174`

> Открывай в браузере: **http://localhost:21174**

---

## 5. Первый запуск — применить схему БД

После первого `pnpm dev` (в отдельном терминале):

```bash
MYSQL_URL=mysql://root@127.0.0.1:3306/velik pnpm --filter @workspace/db run push
```

**Windows (PowerShell):**
```powershell
$env:MYSQL_URL="mysql://root@127.0.0.1:3306/velik"
pnpm --filter @workspace/db run push
```

---

## Полезные команды

| Команда | Что делает |
|---|---|
| `pnpm dev` | Запустить всё (API + фронт) |
| `pnpm build` | Собрать для продакшна |
| `pnpm typecheck` | Проверка типов |
| `pnpm --filter @workspace/db run push` | Применить изменения схемы БД |
| `pnpm --filter @workspace/api-spec run codegen` | Перегенерировать API-хуки из OpenAPI |

---

## Частые проблемы

**"Cannot connect to MySQL"**
- Убедись что MySQL/MariaDB запущен
- Проверь правильность `MYSQL_URL` (хост, порт, пароль)

**"Access denied for user 'root'"**
- Добавь пароль в строку подключения: `mysql://root:пароль@...`

**Windows: 'pnpm' is not recognized**
- Установи pnpm: `npm install -g pnpm`
- Перезапусти терминал
