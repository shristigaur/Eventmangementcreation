#!/usr/bin/env bash
set -euo pipefail
ROOT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting local dev servers (backend + frontend). Logs: backend.log, frontend.log"

# Start backend
cd "$ROOT_DIR/backend"
if [ -f package.json ]; then
  echo "Installing backend deps (if needed)..."
  npm install --silent || true
fi
nohup npm run dev > "$ROOT_DIR/backend.log" 2>&1 &
BACKEND_PID=$!
sleep 1

echo "Backend started (pid=$BACKEND_PID). Log: $ROOT_DIR/backend.log"

# Start frontend
cd "$ROOT_DIR/frontend1"
if [ -f package.json ]; then
  echo "Installing frontend deps (if needed)..."
  npm install --silent || true
fi
# If backend wrote the chosen port, read it and export to Vite env
BACKEND_PORT_FILE="$ROOT_DIR/backend/.backend_port"
if [ -f "$BACKEND_PORT_FILE" ]; then
  BACKEND_PORT=$(cat "$BACKEND_PORT_FILE" | tr -d '\n' || true)
  if [ -n "$BACKEND_PORT" ]; then
    export VITE_BACKEND_URL="http://localhost:${BACKEND_PORT}"
    echo "Starting frontend with VITE_BACKEND_URL=$VITE_BACKEND_URL"
  fi
fi

nohup env VITE_BACKEND_URL="$VITE_BACKEND_URL" npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
sleep 1

echo "Frontend started (pid=$FRONTEND_PID). Log: $ROOT_DIR/frontend.log"

echo "Tailing logs (press Ctrl+C to stop)"

# Tail both logs
tail -n +1 -f "$ROOT_DIR/backend.log" "$ROOT_DIR/frontend.log"

