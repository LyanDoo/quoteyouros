# Stage 1 — Build
FROM node:24-alpine AS build

WORKDIR /app

# Install dependencies first (layer caching)
COPY package.json package-lock.json ./
RUN npm ci

# Accept the API URL as a build arg so Vite can inline it
ARG VITE_API_URL=http://localhost:8030
ENV VITE_API_URL=${VITE_API_URL}

# Copy source and build
COPY . .
RUN npm run build

# Stage 2 — Serve
FROM nginx:1.27-alpine

# Copy custom Nginx config for SPA routing
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copy built assets into Nginx default serve directory
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
