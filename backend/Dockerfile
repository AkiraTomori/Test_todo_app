# Stage 1: Install dependencies and generate Prisma Client
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package info
COPY package*.json ./
COPY prisma ./prisma/

# Install ALL dependencies (including devDependencies to run Prisma CLI)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate


# Stage 2: Production image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

# Install only production dependencies
COPY package*.json ./
COPY prisma.config.ts ./
COPY prisma ./prisma/
RUN npm ci --omit=dev

# Copy the generated Prisma client from builder stage
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma

# Copy application source
COPY src ./src

# Expose port
EXPOSE 3000

# Start server
CMD ["npm", "start"]
