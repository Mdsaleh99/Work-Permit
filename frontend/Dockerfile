# Stage 1: Build frontend
FROM node:24-alpine AS builder

WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build


# Stage 2: Serve with Caddy
FROM caddy:2-alpine

# Copy built files to Caddy's web root
COPY --from=builder /app/dist /usr/share/caddy

# Copy Caddyfile for static site
COPY Caddyfile /etc/caddy/Caddyfile