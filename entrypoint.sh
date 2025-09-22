#!/usr/bin/env bash
set -euo pipefail

# Apply database migrations
./venv/bin/python manage.py migrate --noinput

# Collect static files
./venv/bin/python manage.py collectstatic --noinput

# Start Gunicorn (bind to PORT provided by Railway)
exec ./venv/bin/gunicorn cyblime_cycling.wsgi:application --bind 0.0.0.0:${PORT:-8000} --workers ${WEB_CONCURRENCY:-2} --timeout 60
