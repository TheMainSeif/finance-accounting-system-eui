#!/bin/sh
# Replace placeholders in nginx.conf template

# Ensure BACKEND_URL has http:// prefix
BACKEND_URL="${BACKEND_URL:-http://localhost:5000}"
if ! echo "$BACKEND_URL" | grep -q "^http"; then
    BACKEND_URL="http://$BACKEND_URL"
fi

echo "Configuring Nginx to listen on port ${PORT:-80} and proxy to ${BACKEND_URL}..."
sed -i "s!{{PORT}}!${PORT:-80}!g" /etc/nginx/conf.d/default.conf
sed -i "s!{{BACKEND_URL}}!${BACKEND_URL}!g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;"
