#!/bin/sh

# Print the CLUSTER_NODE_URL for debugging
echo "CLUSTER_NODE_URL: ${CLUSTER_NODE_URL}"

# Replace API URL placeholder in nginx.conf with environment variable
sed -i "s|PROXY_API_URL|${CLUSTER_NODE_URL}|g" /etc/nginx/conf.d/default.conf

# Start nginx
exec nginx -g "daemon off;" 