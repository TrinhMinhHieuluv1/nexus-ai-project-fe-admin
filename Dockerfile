# --- Stage 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy source
COPY . .

# Build args (optional, but kept for consistency with frontend)
ARG VITE_API_URL
ENV VITE_API_URL=$VITE_API_URL

# Build
RUN npm run build

# --- Stage 2: Serve ---
FROM nginx:alpine
# Vite defaults to 'dist' directory, but frontend used 'build'. 
# Let's check package.json for build script or vite.config.ts
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
