# Use Node.js LTS as base image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install PNPM globally
RUN npm install -g pnpm

# Copy workspace files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy entire workspace (to include common/)
COPY packages ./packages

# Install dependencies for backend (including @big-wing/common)
RUN pnpm install --filter backend --frozen-lockfile

# ---------------- DEVELOPMENT STAGE ---------------- #
FROM builder AS dev
WORKDIR /usr/src/app/packages/backend
ENV NODE_ENV=development
EXPOSE 4000
CMD ["pnpm", "run", "start:dev"]

# ---------------- PRODUCTION STAGE ---------------- #
FROM builder AS prod
WORKDIR /usr/src/app/packages/backend
# Build the backend
RUN pnpm run build
ENV NODE_ENV=production
EXPOSE 4000
CMD ["pnpm", "run", "start:prod"]
