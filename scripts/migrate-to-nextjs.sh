#!/bin/bash
set -e
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

# --- Shared: remove Vite / Express artifacts ---
for pkg in frontend backend dashboard/frontend dashboard/backend; do
  rm -rf "$pkg/dist" "$pkg/vite.config.ts" "$pkg/index.html" 2>/dev/null || true
  rm -f "$pkg/src/main.tsx" "$pkg/src/App.tsx" "$pkg/src/index.css" 2>/dev/null || true
done
rm -rf backend/src dashboard/backend/src 2>/dev/null || true

# --- Frontend: move src to components ---
mkdir -p frontend/app frontend/components/pages frontend/lib frontend/services frontend/data frontend/types
cp frontend/src/index.css frontend/app/globals.css 2>/dev/null || true
cp -r frontend/src/components/* frontend/components/ 2>/dev/null || true
cp -r frontend/src/pages/* frontend/components/pages/ 2>/dev/null || true
cp -r frontend/src/lib/* frontend/lib/ 2>/dev/null || true
cp -r frontend/src/services/* frontend/services/ 2>/dev/null || true
cp -r frontend/src/data/* frontend/data/ 2>/dev/null || true
cp -r frontend/src/types/* frontend/types/ 2>/dev/null || true
rm -rf frontend/src

# --- Dashboard frontend ---
mkdir -p dashboard/frontend/app dashboard/frontend/components
cp dashboard/frontend/src/index.css dashboard/frontend/app/globals.css 2>/dev/null || true
mkdir -p dashboard/frontend/components/pages/admin
cp -r dashboard/frontend/src/components/* dashboard/frontend/components/ 2>/dev/null || true
cp -r dashboard/frontend/src/pages/admin/* dashboard/frontend/components/pages/admin/ 2>/dev/null || true
cp -r dashboard/frontend/src/contexts dashboard/frontend/
cp -r dashboard/frontend/src/constants dashboard/frontend/
cp -r dashboard/frontend/src/services dashboard/frontend/
cp -r dashboard/frontend/src/lib dashboard/frontend/
rm -rf dashboard/frontend/src

echo "File moves complete."
