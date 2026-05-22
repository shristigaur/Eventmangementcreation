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
export VITE_API_URL="http://localhost:5000"
echo "Starting frontend with VITE_API_URL=$VITE_API_URL"

nohup env VITE_API_URL="$VITE_API_URL" npm run dev > "$ROOT_DIR/frontend.log" 2>&1 &
FRONTEND_PID=$!
sleep 1

echo "Frontend started (pid=$FRONTEND_PID). Log: $ROOT_DIR/frontend.log"

echo "Tailing logs (press Ctrl+C to stop)"

# Tail both logs
tail -n +1 -f "$ROOT_DIR/backend.log" "$ROOT_DIR/frontend.log"

