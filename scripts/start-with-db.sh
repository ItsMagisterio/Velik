#!/bin/bash
set -e

MARIADB_BASE=/nix/store/a4jsa8kjdn3wlccj2wkvhxqza38rpxzf-mariadb-server-10.11.13
DATADIR=/home/runner/.mysql/data
SOCKET=/home/runner/.mysql/run/mysql.sock
PIDFILE=/home/runner/.mysql/run/mysql.pid
LOGFILE=/home/runner/.mysql/logs/error.log

mkdir -p /home/runner/.mysql/{data,run,logs}

start_mariadb() {
  echo "[db] Starting MariaDB..."
  "$MARIADB_BASE/bin/mysqld" \
    --datadir="$DATADIR" \
    --socket="$SOCKET" \
    --pid-file="$PIDFILE" \
    --port=3306 \
    --user=runner \
    --skip-grant-tables \
    --log-error="$LOGFILE" \
    --basedir="$MARIADB_BASE" &
}

wait_for_mariadb() {
  echo "[db] Waiting for MariaDB..."
  for i in $(seq 1 30); do
    if mysql -u root -h 127.0.0.1 -P 3306 --connect-timeout=1 -e "SELECT 1;" >/dev/null 2>&1; then
      echo "[db] MariaDB ready."
      return 0
    fi
    sleep 1
  done
  echo "[db] MariaDB failed to start. Check $LOGFILE"
  exit 1
}

if ! mysql -u root -h 127.0.0.1 -P 3306 --connect-timeout=1 -e "SELECT 1;" >/dev/null 2>&1; then
  start_mariadb
  wait_for_mariadb
else
  echo "[db] MariaDB already running."
fi

mysql -u root -h 127.0.0.1 -P 3306 -e \
  "CREATE DATABASE IF NOT EXISTS velik CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>/dev/null

echo "[db] Database 'velik' ready."

exec "$@"
