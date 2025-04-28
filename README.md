## Requirements

- Node.js >= 20.x

## Development

Run `cp .env.hoodi .env` and change `VITE_TARGET_URL` to your cluster node API URL.

## After Node.js installed, run following commands

- corepack enable pnpm
- pnpm install
- pnpm run dev

# Docker Compose Setup for Cluster Node App

## Environment-Specific Configuration

The application can be configured for different environments:

- For Hoodi environment: create a `.env.hoodi` file with Hoodi-specific settings
- For Mainnet environment: create a `.env.mainnet` file with Mainnet-specific settings

The appropriate .env file will be copied based on the ENVIRONMENT variable.

## Using Docker Compose

### Starting the Application

```bash
# Start with Cluster Node URL
CLUSTER_NODE_URL=CLUSTER_NODE_URL docker-compose up -d --build

# example
CLUSTER_NODE_URL=http://127.0.0.1:7777 docker-compose up -d --build
```

### Stopping the Application

```bash
docker-compose down
```
