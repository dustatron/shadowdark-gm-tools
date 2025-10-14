# ---- Builder Stage ----
# Use a Node.js image to build the application
FROM node:22-slim AS builder

# Set the working directory
WORKDIR /app

# Accept CONVEX_URL as a build argument and set it as an environment variable
# This is required for the `npm run build` command to succeed
ARG CONVEX_URL
ENV CONVEX_URL=$CONVEX_URL

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the build script
RUN npm run build

# ---- Runner Stage ----
# Use a smaller, more secure base image for the final container
FROM node:22-slim AS runner

WORKDIR /app

# Copy the build output from the builder stage
COPY --from=builder /app/.output ./.output

# Copy the package files and node_modules from the builder stage
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/node_modules ./node_modules

# Expose the port the app runs on
# The default port for TanStack Start is 3000
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "run", "start"]