#!/usr/bin/env bash
set -e

echo -e "\033[0;34mStarting Hamahang Backend...\033[0m"
cd "$(dirname "$0")/backend"
npm run start:dev &
BACKEND_PID=$!

echo -e "\033[0;34mStarting Hamahang Admin Panel...\033[0m"
cd "$(dirname "$0")/admin"
npm run dev &
ADMIN_PID=$!

echo ""
echo -e "\033[0;32m✅ Backend running on http://localhost:3000/api\033[0m"
echo -e "\033[0;32m✅ Swagger at http://localhost:3000/api/docs\033[0m"
echo -e "\033[0;32m✅ Admin Panel at http://localhost:3001\033[0m"
echo ""
echo "Press Ctrl+C to stop all servers"

trap "kill $BACKEND_PID $ADMIN_PID 2>/dev/null; exit" INT TERM
wait
