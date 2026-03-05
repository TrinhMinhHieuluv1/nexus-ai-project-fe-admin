# --- Stage 1: Build ---
FROM node:20-slim AS builder
WORKDIR /app

# Copy package files
COPY package*.json ./
RUN --mount=type=cache,target=/root/.npm \
    npm install

# Copy source
COPY . .

# Build args (mirrored from frontend for consistency)
ARG VITE_API_URL
ARG VITE_WS_URL
ARG GOOGLE_API_KEY
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_WS_URL=$VITE_WS_URL
ENV GOOGLE_API_KEY=$GOOGLE_API_KEY

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
