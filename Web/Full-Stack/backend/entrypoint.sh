#!/bin/bash
set -e

# Run database migrations
echo "Running database migrations..."
flask db upgrade || echo "Migrations failed or already applied"

# Run emergency database fix for has_bus_service column
echo "Running database schema fix..."
python fix_railway_db.py || echo "Database fix failed or already applied"

# Start the application with gunicorn
echo "Starting gunicorn server..."
exec gunicorn --bind 0.0.0.0:${PORT:-5000} --workers 4 --timeout 120 'app:create_app()'
