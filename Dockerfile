# ---- Builder Stage ----
# Use a Node.js image to build the application
FROM node:20.19.0-slim AS builder

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
# This leverages Docker layer caching
COPY package*.json ./
RUN npm install

# Copy the rest of the application source code
COPY . .

# Run the build script
RUN npm run build

# ---- Runner Stage ----
# Use a smaller, more secure base image for the final container
FROM node:20.19.0-slim AS runner

WORKDIR /app

# Copy only the necessary files from the builder stage
COPY --from=builder /app/.output ./.output
COPY --from=builder /app/node_modules ./node_modules
COPY package.json .

# Expose the port the app runs on
# The default port for TanStack Start is 3000
EXPOSE 3000

# Set the command to start the application
CMD ["npm", "run", "start"]