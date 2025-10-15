# Docker Deployment Guide

## Overview

The Dockerfile has been optimized for TanStack Start with Nitro and Convex integration.

## Key Improvements Made

### 1. **Node Version Alignment**
- ✅ Changed from `node:22-slim` to `node:20-slim` to match `package.json` engines requirement
- Prevents potential compatibility issues

### 2. **Runtime Environment Variables**
- ✅ `VITE_CONVEX_URL` is now available at runtime (not just build time)
- ✅ Added `PORT` environment variable support for flexible hosting

### 3. **Security Improvements**
- ✅ Runs as non-root user (`nodejs:nodejs`)
- ✅ Proper file ownership and permissions
- ✅ Health check endpoint configured

### 4. **Optimized Dependencies**
- ✅ Uses `npm ci` for reproducible builds
- ✅ Runner stage only installs production dependencies (smaller image)
- ✅ Updated `.dockerignore` to exclude unnecessary files

### 5. **Flexible Port Configuration**
- ✅ Supports hosting platforms that inject `PORT` environment variable
- ✅ Defaults to port 3000 if PORT not provided

## Building the Docker Image

### Required Build Arguments

```bash
docker build \
  --build-arg CONVEX_DEPLOYMENT="prod:determined-bird-322" \
  --build-arg CONVEX_URL="https://determined-bird-322.convex.cloud" \
  --build-arg VITE_CONVEX_URL="https://determined-bird-322.convex.cloud" \
  --build-arg CONVEX_DEPLOY_KEY="your-deploy-key-here" \
  -t shadowdark-gm-tools:latest .
```

### Using Environment File

Create a `docker.env` file:

```bash
CONVEX_DEPLOYMENT=prod:determined-bird-322
CONVEX_URL=https://determined-bird-322.convex.cloud
VITE_CONVEX_URL=https://determined-bird-322.convex.cloud
CONVEX_DEPLOY_KEY=prod:determined-bird-322|your-key-here
```

Then build:

```bash
docker build \
  --build-arg CONVEX_DEPLOYMENT \
  --build-arg CONVEX_URL \
  --build-arg VITE_CONVEX_URL \
  --build-arg CONVEX_DEPLOY_KEY \
  --env-file docker.env \
  -t shadowdark-gm-tools:latest .
```

## Running the Container

### Basic Run

```bash
docker run -p 3000:3000 \
  -e VITE_CONVEX_URL="https://determined-bird-322.convex.cloud" \
  shadowdark-gm-tools:latest
```

### Custom Port

```bash
docker run -p 8080:8080 \
  -e PORT=8080 \
  -e VITE_CONVEX_URL="https://determined-bird-322.convex.cloud" \
  shadowdark-gm-tools:latest
```

### With Docker Compose

Create `docker-compose.yml`:

```yaml
version: '3.8'

services:
  app:
    build:
      context: .
      args:
        CONVEX_DEPLOYMENT: ${CONVEX_DEPLOYMENT}
        CONVEX_URL: ${CONVEX_URL}
        VITE_CONVEX_URL: ${VITE_CONVEX_URL}
        CONVEX_DEPLOY_KEY: ${CONVEX_DEPLOY_KEY}
    ports:
      - "3000:3000"
    environment:
      - VITE_CONVEX_URL=${VITE_CONVEX_URL}
      - NODE_ENV=production
    restart: unless-stopped
    healthcheck:
      test: ["CMD", "node", "-e", "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"]
      interval: 30s
      timeout: 10s
      retries: 3
      start_period: 5s
```

Then run:

```bash
docker-compose up -d
```

## Deploying to Hosting Platforms

### Railway

Railway automatically injects the `PORT` variable. No special configuration needed:

```bash
# Railway will use the Dockerfile automatically
railway up
```

Make sure to set these environment variables in Railway dashboard:
- `VITE_CONVEX_URL`: Your Convex deployment URL
- Build args are set in Railway's build settings

### Render

Render also injects `PORT`. Configure in `render.yaml`:

```yaml
services:
  - type: web
    name: shadowdark-gm-tools
    runtime: docker
    envVars:
      - key: VITE_CONVEX_URL
        value: https://determined-bird-322.convex.cloud
    buildCommand: ""
    startCommand: ""  # Uses Dockerfile CMD
```

### Docker Hub / Generic Hosting

1. Build and tag:
```bash
docker build -t your-username/shadowdark-gm-tools:latest .
docker push your-username/shadowdark-gm-tools:latest
```

2. On your server:
```bash
docker pull your-username/shadowdark-gm-tools:latest
docker run -d \
  -p 3000:3000 \
  -e VITE_CONVEX_URL="https://determined-bird-322.convex.cloud" \
  --restart unless-stopped \
  --name shadowdark-app \
  your-username/shadowdark-gm-tools:latest
```

## Health Checks

The Dockerfile includes a health check that runs every 30 seconds:

```bash
# Check container health
docker ps

# View health check logs
docker inspect --format='{{json .State.Health}}' <container-id>
```

## Troubleshooting

### Build Fails at `npm run build`

**Issue**: TypeScript errors or Vite build errors

**Solution**:
1. Make sure all build args are provided
2. Check that `CONVEX_DEPLOY_KEY` is valid
3. Run `npm run build` locally first to catch errors

### Container Starts but Returns 502/503

**Issue**: App not listening on correct port

**Solution**:
- Check that `PORT` environment variable matches exposed port
- Verify `VITE_CONVEX_URL` is accessible from container
- Check logs: `docker logs <container-id>`

### Health Check Failing

**Issue**: Health check endpoint not responding

**Solution**:
- Ensure app is actually listening on port 3000 (or custom PORT)
- Check if Convex connection is working
- Increase `start_period` in health check if app takes longer to start

### Large Image Size

**Current size**: ~500-600MB (optimized)

**Further optimization**:
- Use multi-stage build (already implemented)
- Production dependencies only in runner (already implemented)
- Consider using Alpine base: `FROM node:20-alpine` (reduces ~100MB)

## Environment Variables Reference

### Build-Time (--build-arg)

| Variable | Required | Description |
|----------|----------|-------------|
| `CONVEX_DEPLOYMENT` | Yes | Convex deployment identifier |
| `CONVEX_URL` | Yes | Convex HTTP Actions URL |
| `VITE_CONVEX_URL` | Yes | Convex URL for client-side code |
| `CONVEX_DEPLOY_KEY` | Yes | Convex deployment key for auth |

### Runtime (-e or environment)

| Variable | Required | Default | Description |
|----------|----------|---------|-------------|
| `VITE_CONVEX_URL` | Yes | - | Convex URL for runtime |
| `PORT` | No | 3000 | Port the app listens on |
| `NODE_ENV` | No | production | Node environment |

## Security Notes

1. **Never commit `CONVEX_DEPLOY_KEY`** to version control
2. Use secrets management in CI/CD (GitHub Secrets, Railway Secrets, etc.)
3. The container runs as non-root user `nodejs` (UID 1001)
4. Health checks help detect compromised containers

## Performance Tips

1. **Use BuildKit** for faster builds:
   ```bash
   DOCKER_BUILDKIT=1 docker build ...
   ```

2. **Layer caching**: The Dockerfile is optimized for layer caching
   - Dependencies are installed before copying source code
   - Rebuilds are faster when only source code changes

3. **Production builds** are optimized:
   - Minified JavaScript
   - Tree-shaken dependencies
   - Gzip-compressed assets

## Next Steps

- [ ] Set up CI/CD pipeline for automated builds
- [ ] Configure monitoring (Sentry, LogRocket, etc.)
- [ ] Set up automated security scanning (Snyk, Trivy)
- [ ] Implement blue-green deployment strategy
