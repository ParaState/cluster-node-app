FROM node:20-alpine AS builder

WORKDIR /app

# Copy package.json and pnpm-lock.yaml
COPY package.json pnpm-lock.yaml ./

# Install pnpm
RUN npm install -g pnpm

# Install dependencies
RUN pnpm install

# Copy all files
COPY . .

# Set environment variables
ARG CLUSTER_NODE_URL
ARG ENVIRONMENT=hoodi

# Copy environment-specific .env file
RUN if [ "$ENVIRONMENT" = "hoodi" ]; then \
    cp -f .env.hoodi .env; \
    elif [ "$ENVIRONMENT" = "mainnet" ]; then \
    cp -f .env.mainnet .env; \
    else \
    echo "Error: Unknown environment: $ENVIRONMENT" && exit 1; \
    fi

# Build the app
RUN pnpm build:production

# Production stage
FROM nginx:alpine

# Copy built assets from builder stage
COPY --from=builder /app/dist /usr/share/nginx/html

# Copy nginx configuration
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy entrypoint script
COPY docker-entrypoint.sh /docker-entrypoint.sh
RUN chmod +x /docker-entrypoint.sh

# Expose port
EXPOSE 80

# Use our custom entrypoint script
ENTRYPOINT ["/docker-entrypoint.sh"] 