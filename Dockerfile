# ---- Builder Stage ----
# Use Node.js 20 to match package.json engines requirement
FROM node:20-slim AS builder

# Set the working directory
WORKDIR /app

# Accept build arguments for Convex configuration
# These are required for the build process
ARG CONVEX_DEPLOYMENT
ARG CONVEX_URL
ARG VITE_CONVEX_URL
ARG CONVEX_DEPLOY_KEY

# Set build-time environment variables
ENV CONVEX_DEPLOYMENT=$CONVEX_DEPLOYMENT
ENV CONVEX_URL=$CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL
ENV CONVEX_DEPLOY_KEY=$CONVEX_DEPLOY_KEY

# Copy package files and install ALL dependencies (including devDependencies for build)
COPY package*.json ./
RUN npm ci

# Copy the rest of the application source code
COPY . .

# Generate Convex client files before building
# This requires the CONVEX_DEPLOY_KEY to be set
RUN npx convex dev --once

# Run the build script (includes TypeScript compilation and Vite build)
RUN npm run build

# ---- Runner Stage ----
# Use Node.js 20 slim image for the final container
FROM node:20-slim AS runner

# Set working directory
WORKDIR /app

# Set NODE_ENV to production
ENV NODE_ENV=production

# Accept runtime environment variables
ARG VITE_CONVEX_URL
ENV VITE_CONVEX_URL=$VITE_CONVEX_URL

# Copy the build output from the builder stage
COPY --from=builder /app/.output ./.output

# Copy package files
COPY --from=builder /app/package*.json ./

# Install ONLY production dependencies (no devDependencies)
# This keeps the image size smaller
RUN npm ci --omit=dev

# Create a non-root user for security
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nodejs

# Change ownership of the app directory
RUN chown -R nodejs:nodejs /app

# Switch to non-root user
USER nodejs

# Expose the port the app runs on
# Support PORT environment variable for flexible hosting (Railway, Render, etc.)
EXPOSE 3000

# Health check to ensure the app is running
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3000', (r) => {process.exit(r.statusCode === 200 ? 0 : 1)})"

# Set the command to start the application
# Use PORT environment variable if provided, otherwise default to 3000
CMD ["sh", "-c", "PORT=${PORT:-3000} node .output/server/index.mjs"]