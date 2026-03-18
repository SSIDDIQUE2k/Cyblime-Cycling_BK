#!/usr/bin/env bash
set -euo pipefail

# Ensure runtime directories exist
mkdir -p logs

# Determine Python interpreter (prefer python3)
PYTHON=python3
if ! command -v python3 >/dev/null 2>&1; then
  PYTHON=python
fi

# Apply database migrations
"$PYTHON" manage.py migrate --noinput

# Collect static files
"$PYTHON" manage.py collectstatic --noinput

# Start Gunicorn (bind to PORT provided by Railway)
exec "$PYTHON" -m gunicorn cyblime_cycling.wsgi:application \
  --bind 0.0.0.0:${PORT:-8000} \
  --workers ${WEB_CONCURRENCY:-2} \
  --timeout 60
