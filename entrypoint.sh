#!/usr/bin/env bash
set -euo pipefail

# Ensure runtime directories exist
mkdir -p logs

# Apply database migrations
python3 manage.py migrate --noinput

# Collect static files
python3 manage.py collectstatic --noinput

# Start Gunicorn (bind to PORT provided by Railway)
exec python3 -m gunicorn cyblime_cycling.wsgi:application \
  --bind 0.0.0.0:${PORT:-8000} \
  --workers ${WEB_CONCURRENCY:-2} \
  --timeout 60
