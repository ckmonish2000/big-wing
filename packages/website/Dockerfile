# Use Node.js LTS as base image
FROM node:20-alpine AS builder

WORKDIR /usr/src/app

# Install PNPM globally
RUN npm install -g pnpm

# Copy workspace files first for better caching
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml ./

# Copy entire workspace (to include common/)
COPY packages ./packages

# Install dependencies for frontend (including @big-wing/common)
RUN pnpm install --filter website --frozen-lockfile

WORKDIR /usr/src/app/packages/website

# Build the frontend
RUN pnpm run build

# # ---------------- DEVELOPMENT STAGE ---------------- #
FROM builder AS dev
WORKDIR /usr/src/app/packages/website
ENV NODE_ENV=development
EXPOSE 3000
CMD ["pnpm", "run", "dev"]

# # ---------------- PRODUCTION STAGE ---------------- #
FROM builder AS prod
WORKDIR /usr/src/app/packages/website
ENV NODE_ENV=production
EXPOSE 3000
CMD ["pnpm", "run", "preview"]
